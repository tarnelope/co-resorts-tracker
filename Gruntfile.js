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
		},
	    shell: {
           options: {
               stderr: true,
			   stout: true,
			   failOnError: true
           },
           add_keystone_data: {
			   command: 'mongoimport --db trailstatus --collection keystonestatus  --type json --file data/keystone.json --jsonArray'
           },
           add_bc_data: {
			   command: 'mongoimport --db trailstatus --collection bcstatus  --type json --file data/beaverCreek.json --jsonArray'
           }
       }
		   
	});

	// Load JSHint task
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mongoimport');
	grunt.loadNpmTasks('grunt-shell');
	
	grunt.registerTask('loadScrapedData', ['scrape', 'shell:add_keystone_data', 'shell:add_bc_data']);
	// Default task.
	grunt.registerTask('default', 'jshint');

	grunt.loadTasks('tasks');
};
