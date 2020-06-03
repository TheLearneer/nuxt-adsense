import Vue from 'vue';

const AdsByGoogleComponent = {
	render (h) {
		return h(
			'ins',
			{
				'class': ['adsbygoogle'],
				style: this._adStyle,
				attrs: {
					'data-ad-client': this.adClient,
					'data-ad-slot': this.adSlot || null,
					'data-ad-format': this._adFormat,
					'data-ad-layout': this._adLayout || null,
					'data-ad-layout-key': this.adLayoutKey || null,
					'data-page-url': this.pageUrl ? this.pageUrl : null,
					'data-full-width-responsive': this.fullWidthResponsive,
					'data-adtest': <%= options.test ? '\'on\'' : 'null' %>
				},
				domProps: {
					innerHTML: this.render ? '' : ' '
				}
			}
		)
	},
	props: {
		adClient: {
			type: String,
			default: '<%= options.id %>'
		},
		adSlot: {
			type: String
		},
		adFormat: {
			type: String,
			default: 'auto'
		},
		adLayout: {
			type: String
		},
		adLayoutKey: {
			type: String
		},
		adStyle: {
			type: Object,
			default () {
				return {
					display: 'block'
				}
			}
		},
		pageUrl: {
			type: String
		},
		includeQuery: {
			type: Boolean,
			default: <%= options.includeQuery %>
		},		
		fullWidthResponsive: {
			type: Boolean,
			default: false
		},
		inFeed: {
			type: Boolean,
			default: false
		},
		inArticle: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			render: true
		}
	},
	computed: {
		_adFormat() {
			return (this.inFeed || this.inArticle) ? 'fluid' : this.adFormat;
		},
		_adLayout() {
			return this.inArticle ? 'in-article' : this.adLayout;
		},
		_adStyle() {
			const style = {};
			if (this.inArticle) style['text-align'] = 'center';
			return { ...style, ...this.adStyle };
		},
	},
	mounted () {
		this.showAd();
	},
	watch: {
		'$route' (to, from) {
			if (to.fullPath === from.fullPath) return;
			let changed = false;
			if (to.path !== from.path) {
				changed = true;
			} else if (this.includeQuery) {
				changed = (Object.keys(to.query).length !== Object.keys(from.query).length) || !Object.keys(to.query).every(k => to.query[k] === from.query[k]);
			}
			if (changed) this.updateAd();
		}
	},
	methods: {
		showAd() {
			this.render = true;
			this.$nextTick(() => {
				try {
					(window.adsbygoogle = window.adsbygoogle || []).push({})
				} catch(err) {
					console.error(err);
				}
			})
		},
		updateAd() {
			if (this.isServer) return;
			this.render = false;
			this.$nextTick(this.showAd);
		}
	}
}

Vue.component('<%= options.tag %>', AdsByGoogleComponent);