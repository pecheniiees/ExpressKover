import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:75
 * @route '/settings/catalog/aromas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/catalog/aromas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:75
 * @route '/settings/catalog/aromas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:75
 * @route '/settings/catalog/aromas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:75
 * @route '/settings/catalog/aromas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:75
 * @route '/settings/catalog/aromas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:82
 * @route '/settings/catalog/aromas/{aroma}'
 */
export const update = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/catalog/aromas/{aroma}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:82
 * @route '/settings/catalog/aromas/{aroma}'
 */
update.url = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aroma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { aroma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    aroma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        aroma: typeof args.aroma === 'object'
                ? args.aroma.id
                : args.aroma,
                }

    return update.definition.url
            .replace('{aroma}', parsedArgs.aroma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:82
 * @route '/settings/catalog/aromas/{aroma}'
 */
update.patch = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:82
 * @route '/settings/catalog/aromas/{aroma}'
 */
    const updateForm = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:82
 * @route '/settings/catalog/aromas/{aroma}'
 */
        updateForm.patch = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Settings\CatalogController::destroy
 * @see app/Http/Controllers/Settings/CatalogController.php:89
 * @route '/settings/catalog/aromas/{aroma}'
 */
export const destroy = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/catalog/aromas/{aroma}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroy
 * @see app/Http/Controllers/Settings/CatalogController.php:89
 * @route '/settings/catalog/aromas/{aroma}'
 */
destroy.url = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aroma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { aroma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    aroma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        aroma: typeof args.aroma === 'object'
                ? args.aroma.id
                : args.aroma,
                }

    return destroy.definition.url
            .replace('{aroma}', parsedArgs.aroma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroy
 * @see app/Http/Controllers/Settings/CatalogController.php:89
 * @route '/settings/catalog/aromas/{aroma}'
 */
destroy.delete = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::destroy
 * @see app/Http/Controllers/Settings/CatalogController.php:89
 * @route '/settings/catalog/aromas/{aroma}'
 */
    const destroyForm = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::destroy
 * @see app/Http/Controllers/Settings/CatalogController.php:89
 * @route '/settings/catalog/aromas/{aroma}'
 */
        destroyForm.delete = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const aromas = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default aromas