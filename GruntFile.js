// Commands:


  // Primary commands -- use these!

    // grunt rebase
      // 1. runs the command 'git pull --rebase upstream master'
      // 2. 'grunt build'
  
    // grunt push
      // 1. 'grunt build'
      // 2. 'grunt test'
      // 3. runs the command 'git push origin master'
  
    // grunt serve
      // 1. 'grunt build'
      // 2. nodemon 
      // 3. watch for changes. on change, 'grunt build'


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
      files: ['client/built/<%= pkg.name %>.js'],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'client/bower_components/*.js',
          'client/dist/**/*.js'
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
          'client/dist/*.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'client/*.css',
        tasks: ['cssmin']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
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
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-postcss');


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
    'build',
    'test',
    'shell:herokuDeploy',
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
