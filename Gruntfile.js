module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'test/**/*.js', '!public/css/lib/**/*','!public/js/lib/**/*','!node_modules/**/*', '**/*.js']
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
                src: ['bin/**/*','config/**/*','models/**/*','public/**/*','routes/**/*','views/**/*','app.js','passport-init.js','package.json'],
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
                    archive: 'build.zip'
                }
            }
        },
        cssmin: {
          target: {
            files: [{
              expand: true,
              cwd: 'src/public/css',
              src: ['*.css', '!*.min.css'],
              dest: 'src/public/css',
              ext: '.css'
            }]
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('server', ['express:dev', 'watch']);
    grunt.registerTask('build-project', ['copy','cssmin','compress']);
};
