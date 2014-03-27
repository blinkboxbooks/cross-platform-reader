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
	.controller('Reader_controller', function ($scope, $routeParams, $exceptionHandler, Book) {


		// Reader event handler
		function _log(e){
			$('#log .panel-body').prepend('<p>' + JSON.stringify(e) + '</p>');
		}

		// the current book loaded
		$scope.book = {
			isbn: $routeParams.isbn || '',
			url: ''
		};

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
			width: !isNaN(parseInt($routeParams.width)) ? parseInt($routeParams.width) : 600,
			height: !isNaN(parseInt($routeParams.height)) ? parseInt($routeParams.height) : 800,
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

		$scope.handlers = {
			prev: function(){
				READER.prev();
			},
			next: function(){
				READER.next();
			},
			cfi: function(){
				try{
					_log(decodeURIComponent(READER.getCFI()));
				} catch(e){
					_log(e);
				}
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
				READER.init({
					container: '#reader_container',
					width: $scope.layout.width,
					height: $scope.layout.height,
					padding: $scope.layout.padding,
					columns: $scope.layout.columns,
					url: val,
					bookmarks: [],
					listener: _log,
					preferences: $scope.preferences
				});

				// watch for new watches
				if(!_isWatching){
					$scope.$watch('preferences', READER.setPreferences, true);
					$scope.$watch('layout', READER.resizeContainer, true);
					_isWatching = true;
				}
			}
		});
	})
	// Service to access to the API of Catalogue
	.factory('Book', function($http, $q) {
		return {
			get: function(uri){
				var defer = $q.defer();
				if(uri.match(/\/books\/\d+/)){
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