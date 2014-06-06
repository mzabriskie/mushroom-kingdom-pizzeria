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
				MSG_ORDER_ERROR: 'Please add at least one pizza to your order',
				MSG_ORDER_THANKS: 'Thank you for your order!',
				MSG_ORDER_DELIVERY: 'Your pizza will be delivered {{date}}'
			})
		.translations('de', {
				BTN_START_ORDER: 'Start Bestell',
				BTN_SUBMIT_ORDER: 'Bestellung absenden',
				BTN_NEW_ORDER: 'Neu bestellen',
				BTN_CANCEL: 'Stornieren',
				LBL_ITEM: 'Artikel',
				LBL_QUANTITY: 'Menge',
				LBL_TOTAL: 'Gesamt',
				LBL_PLACE_ORDER: 'Bestellung aufgeben',
				LBL_ORDER_COMPLETE: 'Sortieren Komplett',
				LBL_MENU_ITEM_LARGE: 'Große Pizza mit Pilzen',
				LBL_MENU_ITEM_SMALL: 'Kleine Pizza mit Käse',
				LBL_DELIVERY_OPT_NOW: 'liefern Sie sofort',
				LBL_DELIVERY_OPT_LATER: 'Liefern Sie zu einem späteren Zeitpunkt',
				MSG_ORDER_ERROR: 'Bitte fügen Sie mindestens eine Pizza, um Ihre Bestellung',
				MSG_ORDER_THANKS: 'Vielen Dank für Ihre Bestellung',
				MSG_ORDER_DELIVERY: 'Ihre Pizza wird geliefert {{date}}'
			})
		.translations('fr', {
				BTN_START_ORDER: 'Ordre de départ',
				BTN_SUBMIT_ORDER: 'Soumettre la commande',
				BTN_NEW_ORDER: 'Nouveau commande',
				BTN_CANCEL: 'Annuler',
				LBL_ITEM: 'Article',
				LBL_QUANTITY: 'Quantité',
				LBL_TOTAL: 'Total',
				LBL_PLACE_ORDER: 'Passer une commande',
				LBL_ORDER_COMPLETE: 'Classement complet',
				LBL_MENU_ITEM_LARGE: 'Grande pizza aux champignons',
				LBL_MENU_ITEM_SMALL: 'Petite pizza avec du fromage',
				LBL_DELIVERY_OPT_NOW: 'Fournir immédiatement',
				LBL_DELIVERY_OPT_LATER: 'Livrer à une date ultérieure',
				MSG_ORDER_ERROR: 'S\'il vous plaît ajoutez au moins un des pizzas à votre commande',
				MSG_ORDER_THANKS: 'Merci pour votre commande!',
				MSG_ORDER_DELIVERY: 'Votre pizza sera livrée {{date}}'
			})
		.translations('es', {
				BTN_START_ORDER: 'Comience Orden',
				BTN_SUBMIT_ORDER: 'Enviar Pedido',
				BTN_NEW_ORDER: 'Nuevo Orden',
				BTN_CANCEL: 'Cancelar',
				LBL_ITEM: 'Artículo',
				LBL_QUANTITY: 'Cantidad',
				LBL_TOTAL: 'Total',
				LBL_PLACE_ORDER: 'Ponga la orden',
				LBL_ORDER_COMPLETE: 'Completar Orden',
				LBL_MENU_ITEM_LARGE: 'Gran pizza con champiñones',
				LBL_MENU_ITEM_SMALL: 'Pequeña pizza con queso',
				LBL_DELIVERY_OPT_NOW: 'Entregar inmediatamente',
				LBL_DELIVERY_OPT_LATER: 'Entregar en una fecha futura',
				MSG_ORDER_ERROR: 'Por favor añada al menos una pizza a su pedido',
				MSG_ORDER_THANKS: 'Gracias por su pedido',
				MSG_ORDER_DELIVERY: 'Su pizza será entregado {{date}}'
			})
			.translations('it', {
				BTN_START_ORDER: 'Inizia ordine',
				BTN_SUBMIT_ORDER: 'Invia ordine',
				BTN_NEW_ORDER: 'Nuovo ordine',
				BTN_CANCEL: 'Cancellare',
				LBL_ITEM: 'Articolo',
				LBL_QUANTITY: 'Quantità',
				LBL_TOTAL: 'Totale',
				LBL_PLACE_ORDER: 'Ordina',
				LBL_ORDER_COMPLETE: 'Completo ordine',
				LBL_MENU_ITEM_LARGE: 'Grande Pizza con funghi',
				LBL_MENU_ITEM_SMALL: 'Piccola pizza con formaggio',
				LBL_DELIVERY_OPT_NOW: 'Invia subito',
				LBL_DELIVERY_OPT_LATER: 'Consegnare a una data futura',
				MSG_ORDER_ERROR: 'Si prega di aggiungere almeno una pizza al vostro ordine',
				MSG_ORDER_THANKS: 'Grazie per il vostro ordine',
				MSG_ORDER_DELIVERY: 'Sarà consegnata la pizza {{date}}'
			})
		.registerAvailableLanguageKeys(['en', 'de', 'fr', 'es', 'it'], {
			'en-US': 'en',
			'en-UK': 'en',
			'de-DE': 'de',
			'fr-FR': 'fr',
			'es-ES': 'es',
			'it-IT': 'it'
		})
		.determinePreferredLanguage(function () { return document.documentElement.getAttribute('lang'); })
		.fallbackLanguage('en');
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
		$scope.deliveryValues = {date: $filter('date')($scope.deliveryDate, 'short')};

		$scope.startOrder = function () {
			OrderService.clear();
			$location.path('order');
		};
	});