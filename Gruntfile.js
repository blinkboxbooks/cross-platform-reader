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
			reader: 'app/reader',
			tmp: '.tmp'
		},
		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= yeoman.demo %>/scripts/*.js', '<%= yeoman.reader %>/scripts/*.js'],
				tasks: ['jshint:demo'],
				options: {
					livereload: true
				}
			},
			reader: {
				files: ['<%= yeoman.reader %>/styles/*.scss'],
				tasks: ['reader:watch']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			compass: {
				files: ['<%= yeoman.demo %>/styles/**/*.{scss,sass}'],
				tasks: ['compass:demo']
			},
			styles: {
				files: ['<%= yeoman.tmp %>/styles/**/*.css']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= yeoman.app %>/index.html',
					'<%= yeoman.demo %>/**/*.html',
					'.tmp/styles/*.css'
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
						'.tmp',
						'<%= yeoman.app %>'
					]
				}
			},
			test: {
				options: {
					port: 9001,
					base: [
						'.tmp',
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
			reader: {
				files: [{
					dot: true,
					src: [
						'<%= yeoman.dist %>/reader',
						'<%= yeoman.tmp %>/concat/reader.js',
						'<%= yeoman.tmp %>/styles/reader.css'
					]
				}]
			},
			demo: {
				files: [{
					dot: true,
					src: [
						'<%= yeoman.demo %>/**/.tmp',
						'<%= yeoman.dist %>/demo',
						'.tmp'
					]
				}]
			},
			all: {
				files: [{
					dot: true,
					src: [
						'<%= yeoman.dist %>',
						'**/.tmp'
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
						'test/**/*.js'
					]
				}]
			}
		},
		cssmin: {
			reader: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.tmp %>/styles',
					dest: '<%= yeoman.tmp %>/styles',
					src: [
						'reader.css'
					]
				}]
			}
		},
    ngmin: {
      dist: {
        files: [
          {
            src: ['.tmp/concat/scripts/script.min.js'],
            dest: '.tmp/concat/scripts/script.min.js'
          }
        ]
      }
    },
		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			demo: {
				options: {
					sassDir: '<%= yeoman.demo %>/styles',
					cssDir: '<%= yeoman.tmp %>/styles/',
					relativeAssets: true
				}
			},
			reader: {
				options: {
					sassDir: '<%= yeoman.reader %>/styles',
					cssDir: '<%= yeoman.tmp %>/styles',
					importPath: '<%= yeoman.app %>/components/',
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
				'compass:reader'
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
				dest: '<%= yeoman.dist %>/demo'
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
					'<%= yeoman.tmp %>/concat/reader.js': [
						'<%= yeoman.app %>/lib/epubcfi.min.js',
						'<%= yeoman.app %>/lib/bugsense.js',
						'<%= yeoman.app %>/components/FilterJS/FilterJS.js',
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
					},
					banner: '/*! Cross Platform Reader - <%= grunt.config.get("readerVersion") %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
				},
				files: {
					'<%= yeoman.dist %>/reader/reader.min.js': [
						'<%= yeoman.tmp %>/concat/reader.js'
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
			},
			github: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'*.html'
					]
				}]
			},
			reader: {
				files: [{
					dest: '<%= yeoman.dist %>/reader/reader.js',
					src: [
						'<%= yeoman.tmp %>/concat/reader.js'
					]
				},{
					dest: '<%= yeoman.dist %>/reader/jquery.min.js',
					src: [
						'<%= yeoman.app %>/components/jquery/jquery.min.js'
					]
				}]
			}
		},
		replace: {
			reader: {
				options: {
					patterns:[
						{
							replacement: function(){
								return 'var styles = \'' + grunt.file.read('.tmp/styles/reader.css') + '\';';
							},
							match: /var styles = '.*';/g
						}
					]
				},
				files:  [
					{
						expand: true,
						flatten: true,
						src: ['<%= yeoman.reader %>/scripts/*.js'],
						dest: '<%= yeoman.reader %>/scripts'
					}
				]
			},
			dist: {
				options: {
					variables: {
						'readerVersion': '<%= grunt.config.get("readerVersion") %>'
					}
				},
				prefix: '@@',
				files: [
					{
						expand: true,
						flatten: false,
						src: ['<%= yeoman.dist %>/**/*.{js,html}'],
						dest: ''
					}
				]
			}
		},
		// Test settings
		karma: {
			options:{
				configFile: 'karma.conf.js'
			},
			unit: {}
		},
		// this grunt task generates documentation for the reader and saves the files in the docs/ folder
		// Note: Docco requires a different comment formatting style. Only single line comments ( // ) work and the text is processed using the markdown formatting. This allows for greater control over styling directly in the comments.
		docco: {
			reader: {
				src: ['<%= yeoman.reader %>/scripts/*.js'],
				options: {
					output: '<%= yeoman.dist %>/docs/'
				}
			}
		},
		// this task is used to manage the package.json version
		bump: {
			options: {
				files: ['package.json'],
				updateConfigs: [],
				commit: false,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json'], // '-a' for all files
				createTag: false,
				push: false,
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		},
		protractor: {
			e2e: {
				options: {
					configFile: 'protractor.conf.js',
				}
			},
			cucumber: {
				options: {
					configFile: 'cucumber.conf.js',
				}
			}
		}
	});

	grunt.registerTask('test', ['jshint', 'karma:unit', 'connect:test', 'protractor']);

	grunt.registerTask('reader', function (target) {
		grunt.task.run([
			'jshint:reader',
			'clean:reader', // clean all .tmp folders and the dist/reader folder
			'concurrent:reader', // concatenate js files and compile sass styles
			'cssmin:reader', // cssmin styles of the reader
			'replace:reader' // add styles as JS variable and add version number
		]);

		if(target !== 'watch'){
			grunt.task.run([
				'concat:reader',
				'uglify:reader', // move and minify the reader
				'copy:reader', // copy jquery, necessary for reader
				'rev:reader' // cache buster
			]);
		}
	});

	// NOTE Reader must be generated and available at reader/scripts/.tmp/reader.js
	grunt.registerTask('demo', function () {
		grunt.task.run([
			'jshint:demo',// js hint all JS files
			// 'test:demo', // test the application
			'clean:demo', // delete dist directory and all its contents
			'concurrent:demo', // compile demo sass files
			'useminPrepare', // prepare configuration for concat and uglify
			'concat:generated', // concatenate JS files in one, move result in .tmp
			'cssmin:generated', // minify and copy styles
      'ngmin',
			'uglify:generated', // uglify JS files from .tmp
			'copy:demo', // copy html files from app to dist
			'rev:demo', // enables revision of reader
			'usemin'// process html files from dist and replace build blocks
		]);
	});

	grunt.registerTask('serve', function () {
		grunt.task.run([
			'clean:all',
			'reader', // necessary to generate the reader.js library
			'concurrent:demo',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('server', function () {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run('serve');
	});

	grunt.registerTask('build', [
		'clean:all', // start fresh
		'jshint:test', // jshint the tests
		'reader', // build the reader
		'demo', // build the demo
		// 'test', // run all tests
		'copy:github', // copy github static pages
		'replace:dist', // add reader version
		'docco' // generates technical documentation
	]);

	grunt.registerTask('ci-build', [
		'build'
	]);

	grunt.config.set('readerVersion', pkg ? pkg.version : '0.0.0');

	grunt.registerTask('ci-init', function() {
		var fullVersion = pkg.version+'-'+process.env.BUILD_NUMBER; // append Jenkins build number
		var buildNumber = parseInt(process.env.BUILD_NUMBER, 10);   // use build number to avoid conflicting test ports when multiple jobs are running

		grunt.config.set('readerVersion', fullVersion);
		grunt.config.set('testPort', 7000+buildNumber);         // port used by Karma test framework
		grunt.config.set('testRunnerPort', 8000+buildNumber);   // port used by Karma test runner which launches PhantomJS
		grunt.config.set('testConnectPort', 9000+buildNumber);  // port used by the nodejs test server
	});

	grunt.registerTask('default', [
		'build'
	]);
};