'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true
                },
                src: ['test/**/*.js']
            }
        },
        watch: {
            js: {
                options: {
                    nospawn: true
                },
                files: [
                    'test/**/*.js',
                    'lib/**/*.js'],
                tasks: ['default']
            }
        },
    });

    // On watch events, if the changed file is a test file then configure mochaTest to only
    // run the tests from that file. Otherwise run all the tests
    var defaultTestSrc = grunt.config('mochaTest.test.src');
    grunt.event.on('watch', function (action, filepath) {
        grunt.config.set('mochaTest.test.src', defaultTestSrc);
        if (filepath.match(/test/ig)) {
            grunt.config.set('mochaTest.test.src', filepath);
        }
    });

    grunt.registerTask('default', ['mochaTest:test']);
    grunt.registerTask('test', ['mochaTest:test']);
};
