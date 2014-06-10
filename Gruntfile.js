module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.initConfig({
		jshint: {
			all: ['public/js/**/*.js']
		}
	});

	grunt.registerTask('test', ['jshint']);
};
