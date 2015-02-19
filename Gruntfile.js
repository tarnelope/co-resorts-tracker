module.exports = function(grunt) {
	
	// load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns 
    require('load-grunt-tasks')(grunt);
	
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
           add_keystone_data: {
			   command: 'mongoimport --db trailstatus --collection keystonestatus --drop --type json --file public/data/keystone.json --jsonArray'
           },
           add_bc_data: {
			   command: 'mongoimport --db trailstatus --collection bcstatus --drop --type json --file public/data/beaverCreek.json --jsonArray'
           }
       }
	});
	grunt.registerTask('default', ['scrape', 'shell']);

	grunt.loadTasks('tasks');
};
