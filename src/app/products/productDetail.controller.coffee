ProductDetailController = ['$scope', '$spRoute', 'ProductService', ($scope, $spRoute, ProductService) ->
	
	ProductService.find($spRoute.current.params["id"])
		.then (product) ->
			if product?
				$scope.product = product
]

angular.module('sp.spree')
	.controller 'ProductDetailController', ProductDetailController 