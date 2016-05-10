module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'test/**/*.js', '!lib/**/*.js', '!node_modules/**/*', '**/*.js']
        },
        express: {
            dev: {
                options: {
                    script: 'app.js',
                    port: 7000
                }
            }
        },
        watch: {
            files: ['**/*.js', '!node_modules/**/*'],
            tasks: ['express:dev'],
            options: {
                spawn: false
            }
        },
        copy: {
            build: {
                src: ['**','!node_modules/**/*','!target/**/*'],
                dest: 'src',
                expand: true
            }
        },
        compress: {
            main: {
                expand: true,
                src: ['src/**/*'],
                dest: '../',
                options: {
                    // mode: 'gzip',
                    archive: 'target/build.zip'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('server', ['express:dev', 'watch']);
    grunt.registerTask('build-project', ['copy','compress']);
};
