'use strict';

angular.module('discountAsciiWarehouseApp', ['ngRoute'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode(true);
	});