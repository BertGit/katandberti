module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		forever: {
			server: {
				options: {
					index: 'app.js',
					logDir: 'logs'
				}
			}
		},
		stylus: {
			compile: {
				files: {
					'public/css/app.css': [
						'stylus/main.styl',
						'stylus/dashboard.styl'
					]
				}
			}
		},
		watch: {
			grunt: { files: ['Gruntfile.js'] },
			stylus: {
				files: 'stylus/*.styl',
				tasks: ['stylus']
			}
		},
		nodemon: {
			dev: {
				script: 'app.js'
			}
		},
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	// Load the plugin
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-forever');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	// Default task(s).
	grunt.registerTask('default', ['stylus', 'concurrent:dev']);

};
