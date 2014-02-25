// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	var pkg = grunt.file.readJSON('package.json');

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		yeoman: {
			// Configurable paths
			app: 'app',
			dist: 'dist',
			demo: 'app/demo',
			reader: 'app/reader'
		},
		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= yeoman.app %>/scripts/*.js'],
				tasks: ['jshint', 'concat:server', 'replace']
			},
			reader: {
				files: ['<%= yeoman.app %>/scripts/.tmp/*.js'],
				options: {
					livereload: true
				}
			},
			jstest: {
				files: ['test/spec/**/*.js'],
				tasks: ['test:watch']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			compass: {
				files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
				tasks: ['compass']
			},
			styles: {
				files: ['<%= yeoman.app %>/styles/.tmp/**/*.css']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= yeoman.app %>/**/*.html',
					'<%= yeoman.app %>/**/*.css'
				]
			}
		},
		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				// Change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost'
			},
			livereload: {
				options: {
					open: true,
					base: [
						'<%= yeoman.app %>'
					]
				}
			},
			reader: {
				options: {
					port: 9001,
					base: [
						'test',
						'<%= yeoman.app %>/reader'
					]
				}
			},
			dist: {
				options: {
					open: true,
					base: '<%= yeoman.dist %>',
					livereload: false
				}
			}
		},
		// Empties folders to start fresh
		clean: {
			reader: {
				files: [{
					dot: true,
					src: [
						'<%= yeoman.reader %>/**/.tmp',
						'<%= yeoman.dist %>/reader'
					]
				}]
			},
			demo: {
				files: [{
					dot: true,
					src: [
						'<%= yeoman.demo %>/**/.tmp',
						'<%= yeoman.dist %>/demo'
					]
				}]
			}
		},
		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/**/*.js'
			],
			reader: [
				'<%= yeoman.reader %>/**/*.js'
			],
			demo: [
				'<%= yeoman.demo %>/**/*.js'
			],
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				files: [{
					src: [
						'test/spec/**/*.js'
					]
				}]
			}
		},
		cssmin: {
			demo: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.demo %>/styles/.tmp',
					dest: '<%= yeoman.demo %>/styles/.tmp',
					src: [
						'**/*.css'
					]
				}]
			},
			reader: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.reader %>/styles/.tmp',
					dest: '<%= yeoman.reader %>/styles/.tmp',
					src: [
						'**/*.css'
					]
				}]
			}
		},
		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			demo: {
				options: {
					sassDir: '<%= yeoman.demo %>/styles',
					cssDir: '<%= yeoman.demo %>/styles/.tmp',
					relativeAssets: true
				}
			},
			reader: {
				options: {
					sassDir: '<%= yeoman.reader %>/styles',
					cssDir: '<%= yeoman.reader %>/styles/.tmp',
					relativeAssets: true
				}
			}
		},
		// Renames files for browser caching purposes
		rev: {
			reader: {
				files: {
					src: [
						'<%= yeoman.dist %>/reader/**/*.{js,css}'
					]
				}
			},
			demo: {
				files: {
					src: [
						'<%= yeoman.dist %>/demo/**/*.{js,css}'
					]
				}
			}
		},
		// Run some tasks in parallel to speed up build process
		concurrent: {
			reader: [
				'compass:reader',
				'concat:reader'
			],
			demo: [
				'compass:demo'
			]
		},
		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			options: {
				dest: '<%= yeoman.dist %>'
			},
			html: '<%= yeoman.demo %>/index.html'
		},
		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			options: {
				assetsDirs: ['<%= yeoman.dist %>/demo']
			},
			html: ['<%= yeoman.dist %>/demo/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/demo/styles/{,*/}*.css']
		},
		concat: {
			// concatenate all the reader files into a temporary file
			reader: {
				files: {
					'<%= yeoman.reader %>/scripts/.tmp/reader.js': [
						'<%= yeoman.app %>/lib/epubcfi.min.js',
						'<%= yeoman.app %>/components/bugsense/bugsense.js',
						'<%= yeoman.reader %>/scripts/*.js'
					]
				}
			}
		},
		uglify:{
			reader: {
				options : {
					// this workaround is required to make uglifyjs ignore escaped characters from epbcfi library
					beautify : {
						ascii_only : true,
						beautify: false
					}
				},
				files: {
					'<%= yeoman.dist %>/reader/reader.min.js': [
						'<%= yeoman.reader %>/scripts/.tmp/reader.js'
					]
				}
			}
		},
		// Copies remaining files to places other tasks can use
		copy: {
			demo: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.demo %>',
					dest: '<%= yeoman.dist %>/demo',
					src: [
						'**/*.html', 'components/jquery/jquery.min.js'
					]
				}]
			}
		},
		replace: {
			reader: {
				options: {
					patterns:[
						{
							json: {
								'readerVersion': pkg ? pkg.version : '0.0.1'
							}
						},
						{
							replacement: function(){
								return grunt.file.read('app/reader/styles/.tmp/style.css');
							},
							match: 'readerStyles',
							expression: false
						}
					]
				},
				prefix: '@@',
				files:  [
					{
						expand: true,
						flatten: true,
						src: ['<%= yeoman.reader %>/scripts/.tmp/*.js'],
						dest: '<%= yeoman.reader %>/scripts/.tmp/'
					}
				]
			}
		},

		// Test settings
		karma: {
			options:{
				configFile: 'karma.conf.js'
			},
			reader: {
				options:{
					files: [
						// libraries
						'<%= yeoman.app %>/components/jquery/jquery.js',
						'<%= yeoman.app %>/lib/epubcfi.min.js',
						'<%= yeoman.app %>/components/bugsense/bugsense.js',

						// the reader
						'<%= yeoman.app %>/reader/scripts/*.js',

						// the tests
						'test/reader/spec/**/*.js'
					]
				}
			}
		}
	});

	grunt.registerTask('reader', function () {
		grunt.task.run([
			'jshint:reader',
			'test:reader',
			'clean:reader',
			'concurrent:reader',
			'cssmin:reader',
			'replace:reader',
			'uglify:reader',
			'rev:reader'
		]);
	});

	grunt.registerTask('serve', function () {
		grunt.task.run([
			'clean:server',
			'concurrent',
			'concat:server',
			'cssmin',
			'replace',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('server', function () {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run('serve');
	});

	grunt.registerTask('test', function (target) {
		grunt.task.run([
			'connect:' + target,
			'karma:' + target
		]);
	});

	grunt.registerTask('build', [
		'jshint',// js hint all JS files
		'test', // test the application, also transforms sass files
		'clean:dist', // delete dist directory and all its contents
		'useminPrepare', // prepare configuration for concat and uglify
		'concat', // concatenate JS files in one, move result in .tmp
		'cssmin', // minify and copy styles
		'replace', // repace the current version of the reader (note: must be before uglify)
		'uglify', // uglify JS files from .tmp
		'copy:dist', // copy html files from app to dist
		'rev', // enables revision of reader
		'usemin'// process html files from dist and replace build blocks
	]);

	grunt.registerTask('default', [
		'build'
	]);
};