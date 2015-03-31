SpreeUtil = ['SpreeConfig', (SpreeConfig) ->
	factory =
		apiPath: (path) ->
			"#{SpreeConfig.apiPathPrefix}#{path}"
	factory
]

angular.module('sp.spree').factory 'SpreeUtil', SpreeUtil