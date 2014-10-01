'use strict';

angular.module('seedApp', ['ngRoute', 'ngCordovaMocks'])
	.config(function($routeProvider) {
		$routeProvider
			.otherwise({
				redirectTo: '/'
			});
			
	});