ProductDetailControllerConfig = ['$spRouteProvider', ($spRouteProvider) ->
	$spRouteProvider.addControllerDependencies 'ProductDetailController',
		product: ['$spRoute', 'ProductService', ($spRoute, ProductService) ->
			ProductService.find($spRoute.nextRoute.params["id"])
		]
]

ProductDetailController = ['$scope', 'product', ($scope, product) ->
	$scope.product = product
]

angular.module('sp.spree')
	.config ProductDetailControllerConfig
	.controller 'ProductDetailController', ProductDetailController 