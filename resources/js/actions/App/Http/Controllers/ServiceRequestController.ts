import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:24
 * @route '/service-requests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/service-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:24
 * @route '/service-requests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:24
 * @route '/service-requests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:24
 * @route '/service-requests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:24
 * @route '/service-requests'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:24
 * @route '/service-requests'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ServiceRequestController::index
 * @see app/Http/Controllers/ServiceRequestController.php:24
 * @route '/service-requests'
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
/**
* @see \App\Http\Controllers\ServiceRequestController::store
 * @see app/Http/Controllers/ServiceRequestController.php:53
 * @route '/service-requests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/service-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ServiceRequestController::store
 * @see app/Http/Controllers/ServiceRequestController.php:53
 * @route '/service-requests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServiceRequestController::store
 * @see app/Http/Controllers/ServiceRequestController.php:53
 * @route '/service-requests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ServiceRequestController::store
 * @see app/Http/Controllers/ServiceRequestController.php:53
 * @route '/service-requests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ServiceRequestController::store
 * @see app/Http/Controllers/ServiceRequestController.php:53
 * @route '/service-requests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ServiceRequestController::update
 * @see app/Http/Controllers/ServiceRequestController.php:73
 * @route '/service-requests/{service_request}'
 */
export const update = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/service-requests/{service_request}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ServiceRequestController::update
 * @see app/Http/Controllers/ServiceRequestController.php:73
 * @route '/service-requests/{service_request}'
 */
update.url = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { service_request: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { service_request: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    service_request: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        service_request: typeof args.service_request === 'object'
                ? args.service_request.id
                : args.service_request,
                }

    return update.definition.url
            .replace('{service_request}', parsedArgs.service_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServiceRequestController::update
 * @see app/Http/Controllers/ServiceRequestController.php:73
 * @route '/service-requests/{service_request}'
 */
update.put = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ServiceRequestController::update
 * @see app/Http/Controllers/ServiceRequestController.php:73
 * @route '/service-requests/{service_request}'
 */
update.patch = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ServiceRequestController::update
 * @see app/Http/Controllers/ServiceRequestController.php:73
 * @route '/service-requests/{service_request}'
 */
    const updateForm = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ServiceRequestController::update
 * @see app/Http/Controllers/ServiceRequestController.php:73
 * @route '/service-requests/{service_request}'
 */
        updateForm.put = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ServiceRequestController::update
 * @see app/Http/Controllers/ServiceRequestController.php:73
 * @route '/service-requests/{service_request}'
 */
        updateForm.patch = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ServiceRequestController::destroy
 * @see app/Http/Controllers/ServiceRequestController.php:127
 * @route '/service-requests/{service_request}'
 */
export const destroy = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/service-requests/{service_request}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ServiceRequestController::destroy
 * @see app/Http/Controllers/ServiceRequestController.php:127
 * @route '/service-requests/{service_request}'
 */
destroy.url = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { service_request: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { service_request: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    service_request: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        service_request: typeof args.service_request === 'object'
                ? args.service_request.id
                : args.service_request,
                }

    return destroy.definition.url
            .replace('{service_request}', parsedArgs.service_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ServiceRequestController::destroy
 * @see app/Http/Controllers/ServiceRequestController.php:127
 * @route '/service-requests/{service_request}'
 */
destroy.delete = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ServiceRequestController::destroy
 * @see app/Http/Controllers/ServiceRequestController.php:127
 * @route '/service-requests/{service_request}'
 */
    const destroyForm = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ServiceRequestController::destroy
 * @see app/Http/Controllers/ServiceRequestController.php:127
 * @route '/service-requests/{service_request}'
 */
        destroyForm.delete = (args: { service_request: number | { id: number } } | [service_request: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ServiceRequestController = { index, store, update, destroy }

export default ServiceRequestController