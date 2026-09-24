import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:33
 * @route '/settings/catalog/tariffs'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/catalog/tariffs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:33
 * @route '/settings/catalog/tariffs'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:33
 * @route '/settings/catalog/tariffs'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:33
 * @route '/settings/catalog/tariffs'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:33
 * @route '/settings/catalog/tariffs'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:40
 * @route '/settings/catalog/tariffs/{tariff}'
 */
export const update = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/catalog/tariffs/{tariff}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:40
 * @route '/settings/catalog/tariffs/{tariff}'
 */
update.url = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tariff: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tariff: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tariff: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tariff: typeof args.tariff === 'object'
                ? args.tariff.id
                : args.tariff,
                }

    return update.definition.url
            .replace('{tariff}', parsedArgs.tariff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:40
 * @route '/settings/catalog/tariffs/{tariff}'
 */
update.patch = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:40
 * @route '/settings/catalog/tariffs/{tariff}'
 */
    const updateForm = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Settings/CatalogController.php:40
 * @route '/settings/catalog/tariffs/{tariff}'
 */
        updateForm.patch = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Settings/CatalogController.php:47
 * @route '/settings/catalog/tariffs/{tariff}'
 */
export const destroy = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/catalog/tariffs/{tariff}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroy
 * @see app/Http/Controllers/Settings/CatalogController.php:47
 * @route '/settings/catalog/tariffs/{tariff}'
 */
destroy.url = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tariff: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tariff: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tariff: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tariff: typeof args.tariff === 'object'
                ? args.tariff.id
                : args.tariff,
                }

    return destroy.definition.url
            .replace('{tariff}', parsedArgs.tariff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroy
 * @see app/Http/Controllers/Settings/CatalogController.php:47
 * @route '/settings/catalog/tariffs/{tariff}'
 */
destroy.delete = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::destroy
 * @see app/Http/Controllers/Settings/CatalogController.php:47
 * @route '/settings/catalog/tariffs/{tariff}'
 */
    const destroyForm = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Settings/CatalogController.php:47
 * @route '/settings/catalog/tariffs/{tariff}'
 */
        destroyForm.delete = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const tariffs = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default tariffs