ProductDetailController = ['$spRoute', 'ProductService', ($spRoute, ProductService) ->
	ProductService.findById($spRoute.current.params["id"])
		.then (product) ->
			@product = product
]

angular.module('sp.spree')
	.controller 'ProductDetailController', ProductDetailController 