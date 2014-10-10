'use strict';

/*global module:false*/
module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  var appConfig = {
    app: require('./bower.json').appPath || 'www'
  };

  // Project configuration.
  grunt.initConfig({
    yeoman: appConfig,
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        strict: true,
        globalstrict: true,
        globals: {
          jQuery: true,
          angular: true,
          console: true,
          $: true,
          _: true,
          moment: true,
          describe: true,
          beforeEach: true,
          module: true,
          inject: true,
          it: true,
          expect: true,
          browser: true,
          element: true,
          by: true,
          require: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function(connect) {
            return [
              connect().use(
                '/<%= yeoman.app %>/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9000,
          middleware: function(connect) {
            return [
              connect().use(
                '/<%= yeoman.app %>/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    protractor: {
      options: {
        configFile: 'protractor.conf.js'
      },
      chrome: {
        options: {
          args: {
            browser: 'chrome'
          }
        }
      }
    },
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: /\.\.\//
      }
    },
    replace: {
      devCordovaIndex: {
        src: [
          '<%= yeoman.app %>/index.html'
        ],
        overwrite: true,
        replacements: [{
          from: 'ngCordova/dist/ng-cordova.js',
          //TODO check me
          to: 'ng-cordova-mocks/dist/ngCordovaMocks.js'
        }]
      },
      devCordovaApp: {
        src: [
          '<%= yeoman.app %>/app/app.js'
        ],
        overwrite: true,
        replacements: [{
          from: 'ngCordova',
          to: 'ngCordovaMocks'
        }]
      },
      cleanCordovaApp: {
        src: [
          '<%= yeoman.app %>/app/app.js'
        ],
        overwrite: true,
        replacements: [{
          from: 'ngCordovaMocks',
          to: 'ngCordova'
        }]
      }
    },
    inlinelint: {
      html: ['<%= yeoman.app %>/app/**/*.html', '<%= yeoman.app %>/index.html']
    },
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: ['<%= yeoman.app %>/app/**/*.js'],
        tasks: ['newer:jshint', 'karma'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      html: {
        files: ['<%= yeoman.app %>/app/**/*.html', '<%= yeoman.app %>/index.html'],
        tasks: ['newer:inlinelint'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/**/*.{png,jpg,jpeg,gif,webp,svg,html,css}'
        ]
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'karma']);
  grunt.registerTask('serve', [
    'inlinelint',
    'jshint',
    'karma',
    'cordova:clean',
    'wiredep',
    'cordova:dev',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('test', function(target) {
    if (target === 'unit') {
      return grunt.task.run([
        'jshint',
        'karma'
      ]);
    } else if (target === 'e2e') {
      return grunt.task.run([
        'cordova:clean',
        'wiredep',
        'cordova:dev',
        'connect:test',
        'protractor'
      ]);
    } else {
      grunt.task.run([
        'test:unit',
        'test:e2e'
      ]);
    }
  });

  grunt.registerTask('cordova', function(target) {
    if (target === 'dev') {
      return grunt.task.run([
        'replace:devCordovaIndex',
        'replace:devCordovaApp'
      ]);
    } else if (target === 'clean') {
      grunt.task.run([
        'replace:cleanCordovaApp'
      ]);
    }
  });

};