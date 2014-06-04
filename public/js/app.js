angular.module('app', ['ngRoute'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'})
			.when('/order', {templateUrl: 'partials/order.html', controller: 'OrderCtrl'})
			.when('/done', {templateUrl: 'partials/done.html', controller: 'DoneCtrl'})
	}])
	.factory('LocaleService', function () {
		var currentLocale = defaultLocale = document.documentElement.getAttribute('lang');
		return {
			getLocales: function () {
				return ['en', 'es', 'fr', 'de'];
			},
			getDefaultLocale: function () {
				return defaultLocale;
			},
			getCurrentLocale: function () {
				return currentLocale;
			},
			setCurrentLocale: function (locale) {
				currentLocale = locale;
			}
		};
	})
	.factory('MenuService', function () {
		var items = [{
			name: 'Large Pizza with Mushrooms',
			price: 12.99
		}, {
			name: 'Small Pizza with Cheese',
			price: 8.99
		}];

		return {
			getItems: function() {
				return items;
			}
		};
	})
	.factory('OrderService', function (MenuService) {
		return {
			getItems: function () {
				var items = angular.fromJson(sessionStorage.getItem('orderItems'));
				if (!items) {
					items = [];
					for (var i=0, l=MenuService.getItems().length; i<l; i++) {
						items[i] = 0;
					}
				}
				return items;
			},
			setItems: function (items) {
				sessionStorage.setItem('orderItems', angular.toJson(items));
			},
			clearItems: function () {
				this.setItems(null);
			},
			getTotal: function () {
				var total = 0,
					menuItems = MenuService.getItems(),
					orderItems = this.getItems();

				for (var i=0, l=menuItems.length; i<l; i++) {
					total += menuItems[i].price * orderItems[i];
				}
				return total;
			}
		};
	})
	.controller('HeaderCtrl', function ($rootScope, $scope, LocaleService) {
		$scope.locales = LocaleService.getLocales();
		$scope.currentLocale = LocaleService.getCurrentLocale();

		$scope.updateLocale = function (locale) {
			LocaleService.setCurrentLocale(locale);
			$scope.currentLocale = LocaleService.getCurrentLocale();
			$rootScope.emit('localeChange');
		};
	})
	.controller('HomeCtrl', function ($scope, $location, OrderService) {
		$scope.startOrder = function () {
			OrderService.clearItems();
			$location.path('order');
		};
	})
	.controller('OrderCtrl', function ($scope, $location, MenuService, OrderService) {
		$scope.menuItems = MenuService.getItems();
		$scope.orderItems = OrderService.getItems();
		$scope.orderTotal = OrderService.getTotal();

		$scope.$watchCollection('orderItems', function () {
			OrderService.setItems($scope.orderItems);
			$scope.orderTotal = OrderService.getTotal();
		});

		$scope.submitOrder = function () {
			$location.path('done');
		};
		$scope.cancelOrder = function () {
			OrderService.clearItems();
			$location.path('/');
		};
	})
	.controller('DoneCtrl', function ($scope, MenuService, OrderService) {
		$scope.menuItems = MenuService.getItems();
		$scope.orderItems = OrderService.getItems();
		$scope.orderTotal = OrderService.getTotal();
	});