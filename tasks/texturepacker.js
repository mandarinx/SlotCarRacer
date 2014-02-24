module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-exec');

    grunt.config('exec', {
        task: {
            cmd: '',
            stdout: true,
            stderr: true
        }
    });

    grunt.registerMultiTask('texturepacker',
                            'Pack directories as separate atlases',
                            function() {

        var dirs = this.data.dirs;
        if (dirs == undefined) {
            grunt.log.writeln('Missing dirs');
            return false;
        }

        var targetdir = this.data.targetdir;
        if (targetdir == undefined) {
            grunt.log.writeln('Missing targetdir');
            return false;
        } else {
            if (targetdir[targetdir.length-1] != '/') {
                targetdir += '/';
            }
        }

        var tps = this.data.tps;
        if (tps == undefined) {
            tps = false;
        }

        this.data.dirs.forEach(function(dir) {

            grunt.log.writeln('dir: '+dir);
            if (dir[dir.length-1] != '/') {
                dir += '/';
            }

            var dir_list = dir.split('/');
            var file_name = dir_list[dir_list.length-2];

            var cmd = 'TexturePacker ';
            if (!tps) {
                cmd += '--data ' + targetdir + file_name + '{n}.json ' +
                       '--format json '+
                       '--sheet ' + targetdir + file_name + '{n}.png ' +
                       '--trim-sprite-names ' +
                       '--disable-rotation ' +
                       '--multipack ' +
                       '--padding 0 ' +
                       dir + '*.png ';
            } else {
                cmd += dir + ' ' + tps;
            }

            grunt.config.set('exec.task.cmd', cmd);
            grunt.task.run('exec');
        });
    });

};
