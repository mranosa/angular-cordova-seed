'use strict';

angular.module('seedApp')
	.controller('MainCtrl', function($scope) {
		$scope.awesomeThings = [{
			name: 'TODO: Development Tools',
			info: 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
		}, {
			name: 'TODO: Smart Build System',
			info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
		}, {
			name: 'Modular Structure',
			info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
		}, {
			name: 'TODO: Optimized Build',
			info: 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
		}, {
			name: 'TODO: Deployment Ready',
			info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
		}]
	});