'use strict';

angular.module('seedApp', ['ngRoute'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode(true);
	});