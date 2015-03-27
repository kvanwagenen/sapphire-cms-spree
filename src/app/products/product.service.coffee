ProductService = [ '$http', 'SpreeUtil', ($http, SpreeUtil) ->
	service = 
		init: ->

		find: (id) ->
			$http.get(SpreeUtil.apiPath("/products/#{id}"))

	service.init()
]

angular.module('sp.spree').factory 'ProductService'