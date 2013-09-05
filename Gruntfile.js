'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('mentions-kinder.jquery.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            files: ['dist', 'tmp', 'test/*.js']
        },
        coffee: {
            dev:{
                options: {
                    bare: true
                },
                expand: true,
                cwd: 'src',
                src: ['**/*.coffee'],
                dest: 'tmp/src',
                ext: '.js'
            },
            test:{
                files:{
                    'tmp/tests.js':'test/**/*.coffee'
                }
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>' +
                    "(function($){\n",
                footer: "\n})(jQuery);",
                stripBanners: true
            },
            dev: {
                src: [
                    'tmp/src/autocompleter.js',
                    'tmp/src/mentions-kinder.js',
                    'tmp/src/jquery-plugin.js',
                    'tmp/src/autocompleter/dummy-autocompleter.js',
                    'tmp/src/autocompleter/typeahead-autocompleter.js'
                ],
                dest: 'tmp/<%= pkg.name %>.js',
                nonull: true
            },
            dist: {
                src: ['tmp/src/mentions-kinder.js', 'tmp/src/jquery-plugin.js'],
                dest: 'dist/<%= pkg.name %>.js',
                nonull: true
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        qunit: {
            files: ['test/**/*-test.html']
        },
        watch: {
            all:{
                files:['src/**/*.coffee', 'test/**/*.coffee'],
                tasks:['test']
            }
        },
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('precompile', ['coffee:dev', 'coffee:test', 'concat:dev']);
    grunt.registerTask('dist', ['coffee:dev', 'coffee:test', 'concat:dist', 'uglify:dist']);
    grunt.registerTask('test', ['precompile', 'qunit']);
    grunt.registerTask('default', 'test');

};