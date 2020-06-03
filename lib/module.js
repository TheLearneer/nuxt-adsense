const { resolve } = require('path');

const OPTIONS_DEFAULT = {
	tag: 'adsbygoogle',
	id: null,
	pageLevelAds: false,
	includeQuery: false,
	test: false	
};

const TEST_ID = 'ca-google';
const ADSENSE_URL = //pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

module.exports = function nuxtAdsense (moduleOptions = {}) {
	const _options = { ...OPTIONS_DEFAULT, ...this.options['google-adsense'], ...moduleOptions };
	const options = normalizeOptions(_options);

	const isDevMode = this.options.dev || process.env.NODE_ENV !== 'production';
	// https://www.thedev.blog/3087/test-adsense-ads-safely-without-violating-adsense-tos/
	if (isDevMode) options.test = true;
	if (options.test) options.id = TEST_ID;

	this.addPlugin({
		src: resolve(__dirname, './plugin.template.js'),
		fileName: 'adsbygoogle.js',
		options
	});

	this.options.head.script.push({
		async: true,
		src: ADSENSE_URL
	});

	if (options.pageLevelAds) {
		this.options.head.__dangerouslyDisableSanitizers = this.options.head.__dangerouslyDisableSanitizers || [];
		this.options.head.__dangerouslyDisableSanitizers.push('script');
		this.options.head.script.push({
			innerHTML: `
			(adsbygoogle = window.adsbygoogle || []).push({
				google_ad_client: "${options.id}",
				enable_page_level_ads: true
			});
			`
		});
	}

	if (options.test) {
		// If in test mode, add robots meta first to comply with Adsense policies. To prevent MediaPartenrs from scraping the site
		this.options.head.meta.unshift({
			name: 'robots',
			content: 'noindex,noarchive,nofollow'
		});
	}
}

function normalizeOptions(options) {
	options.test = Boolean(options.test);
	options.pageLevelAds = Boolean(options.pageLevelAds);
	options.includeQuery = Boolean(options.includeQuery);
	return options;
}

module.exports.meta = require('./../package.json');