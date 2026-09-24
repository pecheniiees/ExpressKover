import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:54
 * @route '/settings/catalog/discounts'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/catalog/discounts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:54
 * @route '/settings/catalog/discounts'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:54
 * @route '/settings/catalog/discounts'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:54
 * @route '/settings/catalog/discounts'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::store
 * @see app/Http/Controllers/Settings/CatalogController.php:54
 * @route '/settings/catalog/discounts'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:61
 * @route '/settings/catalog/discounts/{discount}'
 */
export const update = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/catalog/discounts/{discount}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:61
 * @route '/settings/catalog/discounts/{discount}'
 */
update.url = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { discount: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { discount: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    discount: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        discount: typeof args.discount === 'object'
                ? args.discount.id
                : args.discount,
                }

    return update.definition.url
            .replace('{discount}', parsedArgs.discount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:61
 * @route '/settings/catalog/discounts/{discount}'
 */
update.patch = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::update
 * @see app/Http/Controllers/Settings/CatalogController.php:61
 * @route '/settings/catalog/discounts/{discount}'
 */
    const updateForm = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Settings/CatalogController.php:61
 * @route '/settings/catalog/discounts/{discount}'
 */
        updateForm.patch = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Settings/CatalogController.php:68
 * @route '/settings/catalog/discounts/{discount}'
 */
export const destroy = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/catalog/discounts/{discount}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroy
 * @see app/Http/Controllers/Settings/CatalogController.php:68
 * @route '/settings/catalog/discounts/{discount}'
 */
destroy.url = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { discount: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { discount: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    discount: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        discount: typeof args.discount === 'object'
                ? args.discount.id
                : args.discount,
                }

    return destroy.definition.url
            .replace('{discount}', parsedArgs.discount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroy
 * @see app/Http/Controllers/Settings/CatalogController.php:68
 * @route '/settings/catalog/discounts/{discount}'
 */
destroy.delete = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::destroy
 * @see app/Http/Controllers/Settings/CatalogController.php:68
 * @route '/settings/catalog/discounts/{discount}'
 */
    const destroyForm = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Settings/CatalogController.php:68
 * @route '/settings/catalog/discounts/{discount}'
 */
        destroyForm.delete = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const discounts = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default discounts