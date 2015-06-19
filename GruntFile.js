// Commands:

  // Primary commands -- use these!

    // grunt rebase
      // 1. runs the command 'git pull --rebase upstream development'
      // 2. 'grunt build'

    // grunt push
      // 1. 'grunt rebase' (see above)
      // 2. 'grunt test'
      // 3. runs the command 'git push heroku master'
      // 4. runs the command 'git push origin'
  
    // grunt serve
      // 1. 'grunt build'
      // 2. nodemon
      // 3. watch for changes. on change, 'grunt build'
        // a. on javascript file change, concat + uglify
        // b. on css file change, cssmin


  // Secondary commands -- ideally you should not have to use these directly

    // grunt build
      // 1. concat
      // 2. uglify
      // 3. cssmin

    // grunt test
      // 1. mocha
      // 2. jshint


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

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    // Watching

    watch: {
      scripts: {
        files: [
          'client/js/*.js', 
          'client/components/**/*.js'
        ],
        tasks: [
          'concat',
          'uglify',
        ]
      },
      css: {
        files: 'client/*.css',
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
    'rebase',
    'mochaTest',
    'jshint',
    'shell:herokuDeploy',
    'shell:'
  ]);

  ////////////////////////////////////////////////////
  // Secondary grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest',
    'jshint'
  ]);


  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin'
  ]);

};
