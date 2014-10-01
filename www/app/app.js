'use strict';

angular.module('seedApp', ['ngRoute', 'ngCordovaMocks'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode(true);
	});