angular.module('app', ['ngRoute'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'})
	}])
	.controller('HomeCtrl', function ($scope) {
	});