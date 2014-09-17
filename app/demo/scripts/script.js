'use strict';

/* globals READER, $*/

// Controller for configure the Reader and init it.
angular.module('app', ['ngRoute'])
	.config(function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(false).hashPrefix('!');
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'Reader_controller'
			})
			.when('/:isbn', {
				templateUrl: 'views/main.html',
				controller: 'Reader_controller'
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.run(function($document, $rootScope){
		$document.bind('keydown', function(e) {
			$rootScope.$broadcast('keydown', e);
			$rootScope.$broadcast('keydown:' + e.which, e);
		});
	})
	.controller('Reader_controller', function ($scope, $timeout, $routeParams, $exceptionHandler, Book) {

		// keep track of the reader status
		var status = null;

		// Make parts of the status available on the scope:
		$scope.status = {};

		// Reader event handler
		function _log(e){
			var $p = $('<p>' + JSON.stringify(e) + '</p>');
			switch(e.code){
				case 0: // last page
					$scope.book.hasNext = false;
					break;
				case 4: // first page
					$scope.book.hasPrevious = false;
					break;
				case 7: // reader status update
					$('[data-test="status"]').removeAttr('data-test');
					$p.attr('data-test', 'status');
					/*jshint -W020 */
					status = e;
					if (status.call !== 'goToProgress') {
						$scope.status.progress = e.progress;
					}
					$('#progress').text(e.progress.toFixed(2) + ' %');
					break;
				case 9: // reader missing a file
				case 10: // parsing failed
				case 11: // cfi generation error
				case 12: // cfi insertion
				case 13: // invalid argument
				case 14: // cannot add bookmark
				case 15: // bookmark already exists
				case 16: // cannot remove bookmark
					$p.attr('data-test', 'error');
					break;
				case 20: // internal link clicked
					$('[data-test="status"]').removeAttr('data-test');
					break;
			}
			$('#log .panel-body').prepend($p);
		}

		// the current book loaded
		$scope.book = {
			isbn: $routeParams.isbn || '',
			url: '',
			hasNext: true,
			hasPrevious: true
		};

		$scope.$watch('status.progress', function (val) {
			if (status && val !== status.progress) {
				READER.goToProgress(Number(val));
			}
		});

		// Use '/books/' + isbn + '/' if you want to check the books in your localhost (you would need the books from the share drive  /Documents/ePubs/Test-Books-book-info-v1.2.zip
		$scope.environment = {
			options: [
				{
					label: 'QA',
					url: 'https://qa.mobcastdev.com/api/service/catalogue/books/'
				},
				{
					label: 'Prod',
					url: 'https://api.blinkboxbooks.com/service/catalogue/books/'
				},
				{
					label: 'Local',
					url: '/books/'
				}
			],
			current: null
		};
		$scope.environment.current = !isNaN($routeParams.env) ? $scope.environment.options[$routeParams.env] : $scope.environment.options[0];

		$scope.layout = {
			width: !isNaN(parseInt($routeParams.width)) ? parseInt($routeParams.width) : 400,
			height: !isNaN(parseInt($routeParams.height)) ? parseInt($routeParams.height) : 600,
			columns: !isNaN(parseInt($routeParams.columns)) ? parseInt($routeParams.columns) : 1,
			padding: !isNaN(parseInt($routeParams.padding)) ? parseInt($routeParams.padding) : 0
		};

		$scope.preferences = {
			margin: $routeParams.margin || 'medium',
			textAlign: $routeParams.textAlign || 'left',
			fontFamily: $routeParams.fontFamily || 'Helvetica',
			theme: $routeParams.theme || 'light',
			lineHeight: !isNaN(parseFloat($routeParams.width)) ? parseFloat($routeParams.lineHeight) : 1.2,
			fontSize: $routeParams.fontSize || 1
		};
		if ($routeParams.publisherStyles) {
			try {
				$scope.preferences.publisherStyles = $.parseJSON($routeParams.publisherStyles);
			} catch(ignore) {}
		}
		if ($routeParams.maxChapterElements) {
			$scope.preferences.maxChapterElements = Number($routeParams.maxChapterElements);
		}
		if ($routeParams.preloadRange) {
			$scope.preferences.preloadRange = Number($routeParams.preloadRange);
		}
		if ($routeParams.transitionDuration) {
			$scope.preferences.transitionDuration = Number($routeParams.transitionDuration);
		}
		if ($routeParams.transitionTimingFunction) {
			$scope.preferences.transitionTimingFunction = $routeParams.transitionTimingFunction;
		}

		// Line height increase/decrease
		$scope.formSettings = {
			lineHeight: {
				min: 1.1,
				max: 20,
				step: 0.01
			},
			fontSize: {
				min: 0.5,
				max: 15,
				step: 0.1
			},
			fonts: ['Helvetica', 'Times new Roman', 'Courier New', 'Arial'],
			alignment: ['left', 'justify'],
			margins: ['min', 'medium', 'max'],
			themes: ['light', 'transparent','dark', 'sepia']
		};

		$scope.initCFI = $routeParams.initCFI;
		$scope.initURL = $routeParams.initURL;

		$scope.handlers = {
			prev: function(){
				$('[data-test="status"]').removeAttr('data-test');
				READER.prev();
				$scope.book.hasNext = true;
			},
			next: function(){
				$('[data-test="status"]').removeAttr('data-test');
				READER.next();
				$scope.book.hasPrevious = true;
			},
			highlight: function(){
				$('[data-test="status"]').removeAttr('data-test');
				READER.setHighlight();
			},
			bookmark: function(){
				$('[data-test="status"]').removeAttr('data-test');
				if(status.bookmarksInPage.length){
					status.bookmarksInPage.forEach(READER.removeBookmark);
				} else {
					READER.setBookmark();
				}
			},
			preferences: function(preferences){
				$('[data-test="status"]').removeAttr('data-test');
				READER.setPreferences(preferences);
			},
			layout: function(layout){
				$('[data-test="status"]').removeAttr('data-test');
				READER.resizeContainer(layout);
			}
		};

		$scope.$watch('environment.current.url + book.isbn', function(val){
			if ($scope.book.isbn) {
				// ng-pattern will validate the input for us, we can assume the ISBN is valid (the book may not exist though)
				Book.get(val).then(function (url) {
					$scope.book.url = url;
				},
				function (error) {
					$exceptionHandler({message: error.status, stack: error.config}, error);
				});
			}
		});

		var _isWatching = false; // flag that tells us if we enabled the watches
		$scope.$watch('book.url', function(val){
			if(val){
				// Call the Reader
				READER.enableDebug();
				var promise = READER.init({
					container: '#reader_container',
					width: $scope.layout.width,
					height: $scope.layout.height,
					padding: $scope.layout.padding,
					columns: $scope.layout.columns,
					url: val,
					bookmarks: [],
					listener: function(e){ $timeout(function(){_log(e);}); },
					preferences: $scope.preferences,
					initCFI: $scope.initCFI,
					initURL: $scope.initURL
				});

				// watch for new watches
				if(!_isWatching){
					promise.then(function(){
						$scope.$watch('preferences', $scope.handlers.preferences, true);
						$scope.$watch('layout', $scope.handlers.layout, true);
					});
					_isWatching = true;
				}
			}
		});

		$scope.$on('keydown:66', function(){
			$timeout($scope.handlers.bookmark);
		});
		$scope.$on('keydown:39', function(){
			$timeout($scope.handlers.next);
		});
		$scope.$on('keydown:37', function(){
			$timeout($scope.handlers.prev);
		});
		$scope.$on('keydown:72', function(){
			$timeout($scope.handlers.highlight);
		});
	})
	// Service to access to the API of Catalogue
	.factory('Book', function($http, $q) {
		return {
			get: function(uri){
				var defer = $q.defer();
				if(uri.indexOf('/books/') === 0){
					defer.resolve(uri);
				} else {
					$http({
						url: uri,
						method: 'GET'
					}).then(function (response) {
							if (response.data.links && response.data.links.length > 0) {
								var linkIdx, l;
								for (linkIdx = 0, l = response.data.links.length; linkIdx !== l; linkIdx += 1) {
									var link = response.data.links[linkIdx];
									if (link.title === 'Sample' &&  link.href!=='') {
										// this is a slightly obscure, but simple method of extracting a path from an href
										// ref: http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
										var a = document.createElement('a');
										a.href = link.href;
										var samplePath = a.pathname.indexOf('/') === 0 ? a.pathname : '/'+a.pathname; // add leading slash if not present in pathname (IE bug)
										defer.resolve('//'+ a.hostname+'/params;v=0'+ samplePath); // prepend the mandatory matrix params
									}
								}
							} else {
								defer.reject(response);
							}
						}, defer.reject);
				}
				return defer.promise;
			}
		};
	}
);