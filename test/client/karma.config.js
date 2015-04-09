// The karma config file.
module.exports = function (config) {
    config.set({
        frameworks: [
            'optimizer',
            'mocha',
            'chai',
            'marko-html-content'
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
            'karma-ie-launcher',
            require('./marko-html-content')
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
            tempdir: './.test',
            watch: {
                defaultIgnore: false,
                ignore: '../node_modules/marko-widgets/node_modules/**/*.js',
                files: '../node_modules/marko-widgets/**/*'
            }
        },
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
        logLevel: config.LOG_DISABLE
    });
};