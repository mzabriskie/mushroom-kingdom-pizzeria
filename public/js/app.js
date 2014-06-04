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
	.factory('DeliveryService', function () {
		var options = [{
			label: 'Deliver immediately',
			value: 1
		}, {
			label: 'Deliver at a future date',
			value: 2
		}];

		return {
			getOptions: function () {
				return options;
			}
		};
	})
	.factory('OrderService', function (MenuService, DeliveryService) {
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
			getTotal: function () {
				var total = 0,
					menuItems = MenuService.getItems(),
					orderItems = this.getItems();

				for (var i=0, l=menuItems.length; i<l; i++) {
					total += menuItems[i].price * orderItems[i];
				}
				return total;
			},
			getDeliveryOption: function () {
				return sessionStorage.getItem('deliveryOption') || DeliveryService.getOptions()[0].value;
			},
			setDeliveryOption: function (option) {
				sessionStorage.setItem('deliveryOption', option);
			},
			getDeliveryDate: function () {
				return sessionStorage.getItem('deliveryDate') || Date.now();
			},
			setDeliveryDate: function (millis) {
				sessionStorage.setItem('deliveryDate', millis);
			},
			clear: function () {
				sessionStorage.clear();
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
			OrderService.clear();
			$location.path('order');
		};
	})
	.controller('OrderCtrl', function ($scope, $location, $filter, MenuService, DeliveryService, OrderService) {
		$scope.menuItems = MenuService.getItems();
		$scope.orderItems = OrderService.getItems();
		$scope.orderTotal = OrderService.getTotal();
		$scope.deliveryOptions = DeliveryService.getOptions();
		$scope.deliveryOption = OrderService.getDeliveryOption();
		$scope.deliveryDate = $filter('date')(OrderService.getDeliveryDate(), 'yyyy-MM-dd');

		$scope.$watchCollection('orderItems', function () {
			OrderService.setItems($scope.orderItems);
			$scope.orderTotal = OrderService.getTotal();
		});

		$scope.$watch('deliveryDate', function (newVal) {
			var parsed = Date.parse(newVal);
			if (parsed) {
				OrderService.setDeliveryDate(parsed);
			}
		});

		$scope.updateDeliveryOption = function (option) {
			OrderService.setDeliveryOption(option);
			$scope.deliveryOption = option;
		};

		$scope.submitOrder = function () {
			$location.path('done');
		};
		$scope.cancelOrder = function () {
			OrderService.clear();
			$location.path('/');
		};
	})
	.controller('DoneCtrl', function ($scope, $location, MenuService, OrderService) {
		$scope.menuItems = MenuService.getItems();
		$scope.orderItems = OrderService.getItems();
		$scope.orderTotal = OrderService.getTotal();
		$scope.deliveryDate = OrderService.getDeliveryDate();

		$scope.startOrder = function () {
			OrderService.clear();
			$location.path('order');
		};
	});