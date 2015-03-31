ProductService = [ '$http', '$q', '_', 'SpreeUtil',  ($http, $q, _, SpreeUtil) ->
  service =
    pageSize: 30

    products: (search=null, page=1, options) ->
      options ||= {}
      options.search = search
      @getPaged(page, options)

    productsByTaxon: (path, page=1) ->
      @getPaged(page, taxon: path)

    taxonomies: ->
      $http.get(SpreeUtil.apiPath("/taxonomies"), {cache: true})
        .then (response) ->
          response.data

    taxonsByName: (name) ->
      @taxonomies().then (response)->
        result = null
        if name
          _.each response, (taxon)->
            if taxon.name is name
              result = taxon.root.taxons
        else
          result = response.data
        return result

    taxon: (path) ->
      $http.get(SpreeUtil.apiPath("/taxons/#{path}"))
        .then (response) ->
          response.data

    find: (id) ->
      $http.get(SpreeUtil.apiPath("/products/#{id}"), {cache: true})
        .then (response) ->
        	response.data

    getPaged: (page=1, params={}) ->
      $http.get(SpreeUtil.apiPath("/products"), ignoreLoadingIndicator: params.ignoreLoadingIndicator, params: {per_page: @pageSize, page: page, "q[name_or_description_cont]": params.search, "q[taxons_permalink_eq]": params.taxon})
        .then (response) ->
          data = response.data
          list = data.products || []
          list.isLastPage = (data.count < service.pageSize) || (page == data.pages)
          list.totalCount = data.total_count
          list.totalPages = data.pages
          list.page = data.current_page
          list

  service
]

angular.module('sp.spree').factory 'ProductService', ProductService