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
			dist: 'dist'
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
			test: {
				options: {
					port: 9001,
					base: [
						'test',
						'<%= yeoman.app %>'
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
			dist: {
				files: [{
					dot: true,
					src: [
						'<%= yeoman.dist %>/*',
						'!<%= yeoman.dist %>/.git*'
					]
				}]
			},
			server: '**/.tmp'
		},
		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/scripts/**/*.js'
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
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>/styles/.tmp',
					dest: '<%= yeoman.app %>/styles/.tmp',
					src: [
						'**/*.css'
					]
				}]
			}
		},
		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				sassDir: '<%= yeoman.app %>/styles',
				cssDir: '<%= yeoman.app %>/styles/.tmp',
				relativeAssets: true
			},
			dist: {}
		},
		// Renames files for browser caching purposes
		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/**/*.{js,css}'
					]
				}
			}
		},
		// Run some tasks in parallel to speed up build process
		concurrent: {
			dist: [
				'compass'
			]
		},
		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			options: {
				dest: '<%= yeoman.dist %>'
			},
			html: '<%= yeoman.app %>/index.html'
		},
		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			options: {
				assetsDirs: ['<%= yeoman.dist %>']
			},
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
		},
		concat: {
			// concatenate all the reader files into a temporary file
			server: {
				files: {
					'<%= yeoman.app %>/scripts/.tmp/reader.js': [
						'<%= yeoman.app %>/vendor/epubcfi.min.js',
						'<%= yeoman.app %>/vendor/bugsense.js',
						'<%= yeoman.app %>/scripts/**/*.js'
					]
				}
			}
		},
		uglify:{
			options : {
				// this workaround is required to make uglifyjs ignore escaped characters from epbcfi library
				beautify : {
					ascii_only : true,
					beautify: false
				}
			}
		},
		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'**/*.html', 'vendor/jquery.min.js'
					]
				}]
			}
		},
		replace: {
			dist: {
				options: {
					patterns:[
						{
							json: {
								'readerVersion': pkg ? pkg.version : '0.0.1'
							}
						},
						{
							replacement: function(){
								return grunt.file.read('app/styles/.tmp/style.css');
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
						src: ['<%= yeoman.app %>/scripts/.tmp/*.js'],
						dest: '<%= yeoman.app %>/scripts/.tmp/'
					},
					{
						expand: true,
						flatten: true,
						src: ['.tmp/concat/**/*.js'],
						dest: '.tmp/concat/'
					}
				]
			}
		},

		// Test settings
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		}
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
		if (target !== 'watch') {
			grunt.task.run([
				'clean:server',
				'concurrent'
			]);
		}

		grunt.task.run([
			'connect:test',
			'karma'
		]);
	});

	grunt.registerTask('build', [
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
		'jshint',// js hint all JS files
		'test',
		'build'
	]);
};