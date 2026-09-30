import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\WarehouseExpenseController::index
 * @see app/Http/Controllers/WarehouseExpenseController.php:16
 * @route '/warehouse'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/warehouse',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WarehouseExpenseController::index
 * @see app/Http/Controllers/WarehouseExpenseController.php:16
 * @route '/warehouse'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseExpenseController::index
 * @see app/Http/Controllers/WarehouseExpenseController.php:16
 * @route '/warehouse'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WarehouseExpenseController::index
 * @see app/Http/Controllers/WarehouseExpenseController.php:16
 * @route '/warehouse'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WarehouseExpenseController::index
 * @see app/Http/Controllers/WarehouseExpenseController.php:16
 * @route '/warehouse'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WarehouseExpenseController::index
 * @see app/Http/Controllers/WarehouseExpenseController.php:16
 * @route '/warehouse'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WarehouseExpenseController::index
 * @see app/Http/Controllers/WarehouseExpenseController.php:16
 * @route '/warehouse'
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
* @see \App\Http\Controllers\WarehouseExpenseController::store
 * @see app/Http/Controllers/WarehouseExpenseController.php:59
 * @route '/warehouse/expenses'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/warehouse/expenses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WarehouseExpenseController::store
 * @see app/Http/Controllers/WarehouseExpenseController.php:59
 * @route '/warehouse/expenses'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseExpenseController::store
 * @see app/Http/Controllers/WarehouseExpenseController.php:59
 * @route '/warehouse/expenses'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WarehouseExpenseController::store
 * @see app/Http/Controllers/WarehouseExpenseController.php:59
 * @route '/warehouse/expenses'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarehouseExpenseController::store
 * @see app/Http/Controllers/WarehouseExpenseController.php:59
 * @route '/warehouse/expenses'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\WarehouseExpenseController::destroy
 * @see app/Http/Controllers/WarehouseExpenseController.php:72
 * @route '/warehouse/expenses/{warehouseExpense}'
 */
export const destroy = (args: { warehouseExpense: string | number | { id: string | number } } | [warehouseExpense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/warehouse/expenses/{warehouseExpense}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WarehouseExpenseController::destroy
 * @see app/Http/Controllers/WarehouseExpenseController.php:72
 * @route '/warehouse/expenses/{warehouseExpense}'
 */
destroy.url = (args: { warehouseExpense: string | number | { id: string | number } } | [warehouseExpense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warehouseExpense: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { warehouseExpense: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    warehouseExpense: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warehouseExpense: typeof args.warehouseExpense === 'object'
                ? args.warehouseExpense.id
                : args.warehouseExpense,
                }

    return destroy.definition.url
            .replace('{warehouseExpense}', parsedArgs.warehouseExpense.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarehouseExpenseController::destroy
 * @see app/Http/Controllers/WarehouseExpenseController.php:72
 * @route '/warehouse/expenses/{warehouseExpense}'
 */
destroy.delete = (args: { warehouseExpense: string | number | { id: string | number } } | [warehouseExpense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\WarehouseExpenseController::destroy
 * @see app/Http/Controllers/WarehouseExpenseController.php:72
 * @route '/warehouse/expenses/{warehouseExpense}'
 */
    const destroyForm = (args: { warehouseExpense: string | number | { id: string | number } } | [warehouseExpense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarehouseExpenseController::destroy
 * @see app/Http/Controllers/WarehouseExpenseController.php:72
 * @route '/warehouse/expenses/{warehouseExpense}'
 */
        destroyForm.delete = (args: { warehouseExpense: string | number | { id: string | number } } | [warehouseExpense: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const expenses = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default expenses