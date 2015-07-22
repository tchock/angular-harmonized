/**
@toc
1. setup - whitelist, appPath, html5Mode
*/

'use strict';

angular.module('myApp', ['ngRoute', 'angular-harmonized']).
config(['$routeProvider', '$locationProvider', '$compileProvider', function($routeProvider, $locationProvider, $compileProvider) {
	/**
	setup - whitelist, appPath, html5Mode
	@toc 1.
	*/
	$locationProvider.html5Mode(false);		//can't use this with github pages / if don't have access to the server

	// var staticPath ='/';
	var staticPath;
	// staticPath ='/angular-services/angular-harmonized/';		//local
	staticPath ='/demo/';		//nodejs (local)
	// staticPath ='/angular-harmonized/';		//gh-pages
	var appPathRoute ='/demo/';
	var pagesPath =staticPath+'pages/';


	$routeProvider.when(appPathRoute+'home', {templateUrl: pagesPath+'home/home.html'});

	$routeProvider.otherwise({redirectTo: appPathRoute+'home'});

}])
.config(['harmonizedProvider', function(harmonizedProvider) {

	harmonizedProvider.setConfig({
		dbName: 'testDb',
		baseUrl: 'http://localhost:2403',
		sendLastModified: false,
		fetchAtStart: true
	});

	harmonizedProvider.setModelSchema({
		people: {}
	});

}]);
