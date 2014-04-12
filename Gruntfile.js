module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),

        'banner': {
            'full': [
                '/*!',
                ' * gkaptcha.js v<%= pkg.version %>',
                ' * http://gesturekit.com/',
                ' *',
                ' * Copyright (c) <%= grunt.template.today("yyyy") %>, RoamTouch',
                ' * Released under the Apache v2 License.',
                ' * http://gesturekit.com/',
                ' */\n'
            ].join('\n'),
            'min': '/*! gkaptcha.js v<%= pkg.version %> http://gesturekit.com/ | Released under the Apache v2 License. */'
        },

        'concat': {
            'options': {
                'stripBanners': {
                    'options': {
                        'block': true,
                        'line': true
                    }
                }
            },

            'js': {
                'options': {
                    'banner': '<%= banner.full %>'
                },
                'src': ['./gkaptcha.js'],
                'dest': './dist/gkaptcha.js'
            },

            'css': {
                'options': {
                    'banner': '<%= banner.full %>'
                },
                'src': ['./gkaptcha.css'],
                'dest': './dist/gkaptcha.css'
            }
        },

        'uglify': {
            'options': {
                'mangle': true,
                'banner': '<%= banner.min %>'
            },

            'js': {
                'src': ['<%= concat.js.src %>'],
                'dest': './dist/gkaptcha.min.js'
            }

        },

        'cssmin': {
            'options': {
                'banner': '<%= banner.min %>',
                'keepSpecialComments': 0
            },

            'css': {
                'src': ['<%= concat.css.dest %>'],
                'dest': './dist/gkaptcha.min.css'
            }
        },

        'jslint': { // configure the task
            'files': ['<%= concat.js.dest %>'],
            'directives': {
                'browser': true,
                'nomen': true,
                'todo': true
            },
            'options': {
                'errorsOnly': true, // only display errors
                'failOnError': false, // defaults to true
                'shebang': true, // ignore shebang lines
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-jslint');

    // Resgister task(s).
    grunt.registerTask('default', []);
    grunt.registerTask('dev', ['concat']);
    grunt.registerTask('lint', ['dev', 'jslint']);
    grunt.registerTask('dist', ['dev', 'uglify', 'cssmin']);
};