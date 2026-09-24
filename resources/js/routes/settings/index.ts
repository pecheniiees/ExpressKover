import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import tariffs from './tariffs'
import discounts from './discounts'
import aromas from './aromas'
/**
* @see \App\Http\Controllers\Settings\CatalogController::catalog
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
export const catalog = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalog.url(options),
    method: 'get',
})

catalog.definition = {
    methods: ["get","head"],
    url: '/settings/catalog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::catalog
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
catalog.url = (options?: RouteQueryOptions) => {
    return catalog.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::catalog
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
catalog.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalog.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\CatalogController::catalog
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
catalog.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: catalog.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::catalog
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
    const catalogForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: catalog.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::catalog
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
        catalogForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalog.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\CatalogController::catalog
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
        catalogForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalog.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    catalog.form = catalogForm
const settings = {
    catalog: Object.assign(catalog, catalog),
tariffs: Object.assign(tariffs, tariffs),
discounts: Object.assign(discounts, discounts),
aromas: Object.assign(aromas, aromas),
}

export default settings