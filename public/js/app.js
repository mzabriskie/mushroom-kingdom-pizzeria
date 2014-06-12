angular.module('app', ['ngRoute', 'pascalprecht.translate'])
	.config(function ($routeProvider, $translateProvider) {
		$routeProvider
			.when('/', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'})
			.when('/order', {templateUrl: 'partials/order.html', controller: 'OrderCtrl'})
			.when('/done', {templateUrl: 'partials/done.html', controller: 'DoneCtrl'});

		$translateProvider
			.useStaticFilesLoader({
				prefix: 'js/locales/locale-',
				suffix: '.json'
			})
			.registerAvailableLanguageKeys(['en', 'de', 'fr', 'es', 'it'], {
				'en-*': 'en',
				'de-*': 'de',
				'fr-*': 'fr',
				'es-*': 'es',
				'it-*': 'it'
			})
			.preferredLanguage(document.documentElement.getAttribute('lang'));
			//.fallbackLanguage('en');
	})
	.factory('MenuService', function ($filter) {
		var items = [{
			name: $filter('translate')('LBL_MENU_ITEM_LARGE'),
			price: 12.99
		}, {
			name: $filter('translate')('LBL_MENU_ITEM_SMALL'),
			price: 8.99
		}];

		return {
			getItems: function() {
				return items;
			}
		};
	})
	.factory('DeliveryService', function ($filter) {
		var options = [{
			label: $filter('translate')('LBL_DELIVERY_OPT_NOW'),
			value: 1
		}, {
			label: $filter('translate')('LBL_DELIVERY_OPT_LATER'),
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

			if ($scope.hasError) {
				$scope.hasError = OrderService.getTotal() === 0;
			}
		});

		$scope.$watch('deliveryDate', function (value) {
			var parsed = Date.parse(value);
			if (parsed) {
				parsed += (new Date().getTimezoneOffset() * 60 * 1000);
				OrderService.setDeliveryDate(parsed);
			}
		});

		$scope.updateDeliveryOption = function (option) {
			OrderService.setDeliveryOption(option);
			$scope.deliveryOption = option;
		};

		$scope.submitOrder = function () {
			$scope.hasError = OrderService.getTotal() === 0;
			if (!$scope.hasError) {
				$location.path('done');
			}
		};
		$scope.cancelOrder = function () {
			OrderService.clear();
			$location.path('/');
		};
	})
	.controller('DoneCtrl', function ($scope, $location, $filter, MenuService, OrderService) {
		$scope.menuItems = MenuService.getItems();
		$scope.orderItems = OrderService.getItems();
		$scope.orderTotal = OrderService.getTotal();
		$scope.deliveryDate = OrderService.getDeliveryDate();
		$scope.deliveryValues = {date: $filter('date')($scope.deliveryDate, 'fullDate')};

		$scope.startOrder = function () {
			OrderService.clear();
			$location.path('order');
		};
	});