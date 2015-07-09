// Karma configuration
// Generated on Mon Jun 29 2015 14:45:13 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // root of the app; base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // unit test specs
     files: [
      'test/unit/*.js'
    ],

    // list of files to exclude
    exclude: [
      'test.config.js'
    ],

    // karma has its own autoWatch feature but Grunt watch can also do this
    autoWatch : false,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'PhantomJS'],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // additional plugins for testing
    plugins: [
        'karma-story-reporter',
        // 'karma-junit-reporter',
        'karma-chrome-launcher',
        'karma-jasmine',
        'karma-phantomjs-launcher'
    ]
  });
};
