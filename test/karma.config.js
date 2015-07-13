// Karma configuration
// Generated on Mon Jun 29 2015 14:45:13 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // root of the app; base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // list of files / patterns to load in the browser
     files: [
     // angular source
      'client/bower_components/angular/angular.min.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-resource/angular-resource.min.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'client/bower_components/firebase/firebase.js',
      'client/bower_components/angularfire/dist/angularfire.min.js',
      'client/bower_components/angular-nouislider/src/nouislider.js',
      'client/bower_components/angular-summernote/dist/angular-summernote.min.js',
      'client/bower_components/angular-ui-calendar/src/calendar.js',
      'client/bower_components/angular-scroll-glue/src/scrollglue.js',
      'client/bower_components/angular-messages/angular-messages.min.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'client/bower_components/ngSticky/lib/sticky.js',
      'client/bower_components/angular-ui-sortable/sortable.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/oclazyload/dist/ocLazyLoad.js',
      'client/bower_components/ng-transloadit/lib/ng-transloadit.js',


      // our app code
      'client/js/app.js',
      'client/js/factories/*.js',
      'client/components/**/*.ctrl.js',
      'client/*.ctrl.js',
      'client/js/config.js',


      // unit test files
      'test/unit/*.js'
    ],

    // list of files to exclude
    exclude: [
        'client/components/documents/documents.compiled.js',
        'client/components/documents/documents.jq.js'
    ],

    // karma has its own autoWatch feature but Grunt watch can also do this
    autoWatch : false,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'unicorn'],

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

    singleRun: true,

    // additional plugins for testing
    plugins: [
        'karma-story-reporter',
        // 'karma-junit-reporter',
        // 'karma-chrome-launcher',
        'karma-jasmine',
        'karma-phantomjs-launcher',
        'karma-unicorn-reporter'
    ]
  });
};
