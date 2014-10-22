'use strict';

var _ = require('lodash');
var path = require('path');
var cordovaCli = require('cordova');
var spawn = require('child_process').spawn;

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
    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['<%= yeoman.app %>/assets/**/*.css']
      }
    },
    htmlangular: {
      options: {
        reportPath: null,
        customattrs: ['*'],
        relaxerror: [
          'Element head is missing a required instance of child element title.',
          'Element comma not allowed as child of element span in this context.',
          'A select element with a required attribute and without a multiple attribute, and whose size is 1, must have a child option element.',
          'Element img is missing required attribute src.',
          'The datetime-local input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
          'The date input type is not supported in all browsers. Please be sure to test, and consider using a polyfill',
          'An img element must have an alt attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.',
          'Bad value custom-date for attribute type on element input.'
        ]
      },
      files: {
        src: ['<%= yeoman.app %>/app/**/*.html']
      }
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

  // Register tasks for all Cordova commands
  _.functions(cordovaCli).forEach(function(name) {
    grunt.registerTask(name, function() {
      this.args.unshift(name.replace('cordova:', ''));
      // Handle URL's being split up by Grunt because of `:` characters
      if (_.contains(this.args, 'http') || _.contains(this.args, 'https')) {
        this.args = this.args.slice(0, -2).concat(_.last(this.args, 2).join(':'));
      }
      var done = this.async();
      var exec = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
      var cmd = path.resolve('./node_modules/cordova/bin', exec);
      var flags = process.argv.splice(3);
      var child = spawn(cmd, this.args.concat(flags));
      child.stdout.on('data', function(data) {
        grunt.log.writeln(data);
      });
      child.stderr.on('data', function(data) {
        grunt.log.error(data);
      });
      child.on('close', function(code) {
        code = code ? false : true;
        done(code);
      });
    });
  });

  // Since Apache Ripple serves assets directly out of their respective platform
  // directories, we watch all registered files and then copy all un-built assets
  // over to www/. Last step is running cordova prepare so we can refresh the ripple
  // browser tab to see the changes. Technically ripple runs `cordova prepare` on browser
  // refreshes, but at this time you would need to re-run the emulator to see changes.
  grunt.registerTask('ripple', ['wiredep', 'newer:copy:app', 'ripple-emulator']);
  grunt.registerTask('ripple-emulator', function() {
    grunt.config.set('watch', {
      all: {
        files: _.flatten(_.pluck(grunt.config.get('watch'), 'files')),
        tasks: ['newer:copy:app', 'prepare']
      }
    });

    var cmd = path.resolve('./node_modules/ripple-emulator/bin', 'ripple');
    var child = spawn(cmd, ['emulate']);
    child.stdout.on('data', function(data) {
      grunt.log.writeln(data);
    });
    child.stderr.on('data', function(data) {
      grunt.log.error(data);
    });
    process.on('exit', function(code) {
      child.kill('SIGINT');
      process.exit(code);
    });

    return grunt.task.run(['watch']);
  });
  // Default task.
  grunt.registerTask('default', ['jshint', 'karma']);
  grunt.registerTask('serve', [
    'inlinelint',
    'csslint',
    'jshint',
    'karma',
    'htmlangular',
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