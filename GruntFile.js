module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Building

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['./client/js/*.js'],
        dest: './client/built/<%= pkg.name %>.js'
      }
    },

    uglify: {
      dist: {
        files: {
          './client/built/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>']
        }
      }
    },

    cssmin: {
      target: {
        files: {
          './client/built/styles.min.css' : ['./client/css/*.css']
        }
      }
    },

    browserify: {
      main: {
        src: './client/components/documents/documents.jq.js',
        dest: './client/components/documents/documents.compiled.js'
      }
    },

    // Testing

    jshint: {
      files: ['client/js/*.js', 'client/components/**/*.js'],
      options: {
        force: 'false',
        jshintrc: 'test/.jshintrc',
        ignores: [
          'client/bower_components/*.js',
          'client/built/**/*.js',
          'client/js/jquery/**/*.js',
          'client/js/plugins/**/*.js',
          'client/js/angular-nouislider.js',
          'client/js/icheck.min.js'

        ]
      }
    },

    casperjs: {
      files: ['test/e2e/appSpec.js']
    },

    karma: {
      options: {
        configFile: 'test/karma.config.js'
      },
      unit: {
      // run tests once instead of continuously
        singleRun: true
      },
      continuous: {
        // keep karma running in the background
        background: true
      }
    },

    // Watching
    watch: {
      karma: {
        // run these tasks when these files change
        files: [
          'test/unit/*.js'
        ],
        tasks: ['karma']
      },
      scripts: {
        files: [
          'client/js/*.js',
          'client/components/**/*.js'
        ],
        tasks: [
          'concat',
          'uglify',
          'karma'
        ]
      },
      css: {
        files: 'client/css/*.css',
        tasks: ['cssmin']
      }
    },
    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },
    // Deploying
    shell: {
      rebase: {
        command: 'git pull --rebase upstream development',
        options: {
            stdout: true,
            stderr: true
        }
      },
      herokuDeploy: {
        command: 'git push heroku master',
        options: {
            stdout: true,
            stderr: true
        }
      },
      push: {
        command: 'git push origin',
        options: {
          stdout: true,
          stderr: true
        }
      }
    },
  });

  // Loads all grunt tasks
  require('load-grunt-tasks')(grunt);

  ////////////////////////////////////////////////////
  // Primary grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('serve', function (target) {

    grunt.task.run([ 'build' ]);

    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);

  });


  grunt.registerTask('rebase', [
    'shell:rebase',
    'build'
  ]);


  grunt.registerTask('push', [
    'shell:rebase',
    'build',
    'shell:herokuDeploy',
    'shell:push'
  ]);

  ////////////////////////////////////////////////////
  // Secondary grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('unit-test', [
    //'jshint',
    'karma'
    // 'casperjs'
  ]);


  grunt.registerTask('build', [
    'browserify',
    'concat',
    'uglify',
    'cssmin'
  ]);

};
