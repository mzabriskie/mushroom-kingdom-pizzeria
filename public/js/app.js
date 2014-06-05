angular.module('app', ['ngRoute', 'pascalprecht.translate'])
	.config(function ($routeProvider, $translateProvider) {
		$routeProvider
			.when('/', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'})
			.when('/order', {templateUrl: 'partials/order.html', controller: 'OrderCtrl'})
			.when('/done', {templateUrl: 'partials/done.html', controller: 'DoneCtrl'})

		$translateProvider.translations('en', {
			BTN_START_ORDER: 'Start Order',
			BTN_SUBMIT_ORDER: 'Submit Order',
			BTN_NEW_ORDER: 'New Order',
			BTN_CANCEL: 'Cancel',
			LBL_ITEM: 'Item',
			LBL_QUANTITY: 'Quantity',
			LBL_TOTAL: 'Total',
			LBL_PLACE_ORDER: 'Place Order',
			LBL_ORDER_COMPLETE: 'Order Complete',
			LBL_MENU_ITEM_LARGE: 'Large Pizza with Mushrooms',
			LBL_MENU_ITEM_SMALL: 'Small Pizza with Cheese',
			LBL_DELIVERY_OPT_NOW: 'Deliver immediately',
			LBL_DELIVERY_OPT_LATER: 'Deliver at a future date',
			MSG_ORDER_ERROR: 'Please add at least one pizza to your order.',
			MSG_ORDER_THANKS: 'Thank you for your order!',
			MSG_ORDER_DELIVERY: 'Your pizza will be delivered {{date}}'
		});

		$translateProvider.preferredLanguage('en');
	})
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
		$scope.deliveryValues = {date: $filter('date')($scope.deliveryDate, 'short')};

		$scope.startOrder = function () {
			OrderService.clear();
			$location.path('order');
		};
	});