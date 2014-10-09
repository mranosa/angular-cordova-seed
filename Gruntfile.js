'use strict';

/*global module:false*/
module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
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
      },
      lib_test: {
        src: ['www/app/**/*.js']
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          hostname: 'localhost',
          base: 'www',
          keepalive: true
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'nodeunit']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('serve', ['jshint', 'connect']);

};