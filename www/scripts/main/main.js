'use strict';

angular.module('discountAsciiWarehouseApp')
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'app/main/main.html',
				controller: 'MainCtrl'
			});
	});