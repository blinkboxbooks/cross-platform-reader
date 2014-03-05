'use strict';

/* jshint devel:true */
/* globals $, READER */

var app = angular.module('app', []);

// Controller for configure the Reader and init it.

app.controller('Reader_controller', function ($scope, $exceptionHandler, Book) {

      // Use '/books/' + isbn + '/' if you want to check the books in your localhost (you would need the books from the share drive  /Documents/ePubs/Test-Books-book-info-v1.2.zip
      var PRODUCTION_API = 'https://api.blinkboxbooks.com/service/catalogue/books/';

      // Reader event handler
      function eventHandler(e){
        console.log(e);
        $('#log div').prepend('<p>' + JSON.stringify(e) + '</p>');
      }

      // ISBN
      $scope.$watch('isbn.value', function(val){
        if (val) {
          Book.get(PRODUCTION_API + val).then(function (url) {
                // Call the Reader
                READER.init({container: '#reader_container', width: 400, height: 400, padding: 0, url: url, bookmarks: [], listener: eventHandler, preferences: { margin: [9.800000,11.000000,6.500000,11.000000], textAlign: 'left', fontFamily: 'Helvetica', theme: 'light'}});

                $scope.$watch('lineHeight.value', READER.setLineHeight);
                $scope.$watch('fontSize.value', READER.setFontSize);
                $scope.$watch('font', function(val){
                  READER.setFontFamily(val);
                });

              },
          function (error) {
            $exceptionHandler({message: error.status, stack: error.config}, error);
          }
          );
        }
      });

      $scope.dimensions = angular.extend({
        width: '500',
        height: '600',
        columns: 1,
        padding: 0
      }, $scope.dimensions);

      // Width and height
      $scope.$watch('width.value', function(val){
        if (val >= 0) {
          $scope.dimensions.width = val;
          READER.resizeContainer($scope.dimensions);
        }
      });
      $scope.$watch('height.value', function(val){
        if (val >= 0) {
          $scope.dimensions.height = val;
          READER.resizeContainer($scope.dimensions);
        }
      });

      // Line height increase/decrease
      $scope.lineHeight = {
        min: 1.1,
        max: 20,
        step: 0.01,
        value: 1.2
      };

      // Font-size increase/decrease
      $scope.fontSize = {
        min: 0.5,
        max: 15,
        step: 0.1,
        value: 1
      };


      // font family
      $scope.fonts = ['Helvetica', 'Times new Roman', 'Courier New', 'Arial'];
      $scope.font = $scope.fonts[0];


      $scope.alignment = ['left', 'justify'];
      $scope.align = $scope.alignment[0];
      $scope.$watch('align', function(val){
        READER.setTextAlign(val);
      });

      $scope.setTheme = READER.setTheme;

      // Margins
      $scope.setMargin = READER.setMargin;

      // CFI
      $scope.getCFI = function(){
        console.log('Current CFI', decodeURIComponent(READER.getCFI()));
      };

      // Next/previous chapter navigation.
      $scope.next = function () {
        READER.next();
      };

      $scope.previous = function () {
        READER.prev();
      };
    });

// Service to access to the API of Catalogue
app.factory('Book', function($http) {
      return {
        get: function(uri){
          var _defaults = {
            url: uri,
            method: 'GET'
          };
          return $http(_defaults).then(function (response) {
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
                      return '//'+ a.hostname+'/params;v=0'+ samplePath;     // prepend the mandatory matrix params
                    }
                  }
                }
              }
          );
        }
      };
    }
);