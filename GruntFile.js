module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-open');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        dir: {
            deploy: {
                root: 'deploy/',
                js: 'deploy/js',
                assets: 'deploy/assets',
                css: 'deploy/css'
            },
            src: {
                js: 'src/js/**/*.js',
                assets: 'src/assets/',
                maps: 'src/assets/maps/**/*.json',
                template: 'src/template/'
            },
            assets: {
                gfx: 'assets/gfx/**/*.png'
            },
            lib: {
                js: 'lib/js/'
            }
        },

        clean: [
            '<%= dir.deploy.js %>',
            '<%= dir.deploy.assets %>',
            '<%= dir.deploy.css %>'
        ],

        copy: {
            lib: {
                files: [{
                    cwd: '<%= dir.lib.js %>',
                    src: ['**'],
                    dest: '<%= dir.deploy.js %>',
                    expand: true
                }]
            },
            assets: {
                files: [{
                    cwd: '<%= dir.src.assets %>',
                    src: ['**'],
                    dest: '<%= dir.deploy.assets %>',
                    expand: true
                }]
            },
            template: {
                files: [{
                    cwd: '<%= dir.src.template %>',
                    src: ['**'],
                    dest: '<%= dir.deploy.root %>',
                    expand: true
                }]
            }
        },

        concat: {
            game: {
                options: {
                    process: {
                        data: {
                            version: '<%= pkg.version %>',
                            buildDate: '<%= grunt.template.today() %>'
                        }
                    }
                },
                src: ['<%= dir.src.js %>'],
                dest: '<%= dir.deploy.js %>/<%= pkg.name %>.js'
            }
        },

        uglify: {
            game: {
                options: {
                    banner: '/*! Slot Car Racer <%= pkg.version %> | ' +
                            '(c) 2013 Mandarin */ \n'
                },
                src: ['<%= concat.game.dest %>'],
                dest: '<%= dir.deploy.js %>/<%= pkg.name %>.min.js'
            }
        },

        exec: {
            entities: {
                cmd: 'TexturePacker assets/gfx/entities assets/gfx/atlas_entities.tps',
                stdout: true,
                stderr: true
            },
            tileset: {
                cmd: 'TexturePacker assets/gfx/tileset assets/gfx/atlas_tileset.tps',
                stdout: true,
                stderr: true
            }
        },

        watch: {
            source: {
                files: '<%= dir.src.js %>',
                tasks: ['build'],
                options: {
                    livereload: true
                }
            },
            maps: {
                files: '<%= dir.src.maps %>',
                tasks: ['copy'],
                options: {
                    livereload: true
                }
            },
            atlas: {
                files: '<%= dir.assets.gfx %>',
                tasks: ['exec'],
                options: {
                    livereload: true
                }
            },
            template: {
                files: '<%= dir.src.template %>**',
                tasks: ['build'],
                options: {
                    livereload: true
                }
            }
        },

        connect: {
            root: {
                options: {
                    // keepalive: true,
                    port: 80,
                    base: './deploy',
                    livereload: true
                }
            }
        },

        open: {
            dev: {
                path: 'http://localhost/index.html'
            }
        }
    });

    grunt.registerTask('build', ['clean', 'concat', 'uglify', 'copy']);
    grunt.registerTask('default', ['exec', 'build', 'connect', 'watch']);

}
