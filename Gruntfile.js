module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			src: ['routes/*.js', 'Gruntfile.js', 'tasks/*.js'],
			options: {
				node: true,
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					require: true,
					define: true,
					requirejs: true,
					describe: true,
					expect: true,
					it: true
				}
			}
		}
	});

	// Load JSHint task
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mongoimport');
	// Default task.
	grunt.registerTask('default', 'jshint');

	grunt.loadTasks('tasks');
};
