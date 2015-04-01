// karma.conf.js
module.exports = function (config) {
    config.set({
        frameworks: [
            'optimizer',
            'mocha',
            'chai'
        ],
        files: [
            'spec-*.js'
        ],
        plugins: [
            'karma-chai',
            'karma-mocha',
            'karma-optimizer',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-safari-launcher',
            'karma-opera-launcher',
            'karma-ie-launcher'
        ],
        browsers: [
            'PhantomJS'
        ],
        reporters: [
            'mocha'
        ],
        optimizer: {
            plugins: [
                'optimizer-marko'
            ],
            minify: false,
            bundlingEnabled: false,
            resolveCssUrls: true,
            cacheProfile: 'development',
            tempdir: './.test'
        },
        contentStream: require('./content-stream'),
        colors: false,
        autoWatch: false,
        singleRun: true,
        client: {
            mocha: {
                // set test-case timeout in milliseconds [2000]
                timeout: 1000,
                // check for global variable leaks. FIXME
                ignoreLeaks: true,
                // specify user-interface (bdd|tdd|exports).
                ui: 'bdd',
                // "slow" test threshold in milliseconds [75].
                slow: 500
            }
        },
        customLaunchers: {
            IE9: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE9'
            },
            IE8: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE8'
            }
        },
        logLevel: 'DEBUG'
    });
};