import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:68
 * @route '/order-history'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/order-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:68
 * @route '/order-history'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:68
 * @route '/order-history'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:68
 * @route '/order-history'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:68
 * @route '/order-history'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:68
 * @route '/order-history'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:68
 * @route '/order-history'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const orderHistory = {
    index: Object.assign(index, index),
}

export default orderHistory