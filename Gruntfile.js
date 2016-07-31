module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        conf: {
            src: {
                lessDir: 'less',
                cssDir: 'css',
                jsDir: 'js',
                bowerDir: './bower_components',
            },
            build: {
                cssDir: 'css',
                jsDir: 'js',
            },
        },
        // Less
        less: {
            build: {
                options: {
                    compress: true
                },
                files: {
                    "<%= conf.build.cssDir %>/ampersand.css": ["<%= conf.src.lessDir %>/ampersand.less"]
                }
            }
        },
        watch: {
            files: ['less/**/*'],
            tasks: ['less:build']
        }
    });

    /* ----------------------------------------------------------------------
     * 						Grunt-Task-Bibliotheken
     * ---------------------------------------------------------------------- */
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');


    /* ----------------------------------------------------------------------
     * 						Grunt-Tasks
     * ---------------------------------------------------------------------- */
    grunt.registerTask('build:css', ['less:build']);
    grunt.registerTask('default', ['watch']);

};