import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\CatalogController::index
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/catalog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::index
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::index
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\CatalogController::index
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::index
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::index
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\CatalogController::index
 * @see app/Http/Controllers/Settings/CatalogController.php:22
 * @route '/settings/catalog'
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
* @see \App\Http\Controllers\Settings\CatalogController::storeTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:33
 * @route '/settings/catalog/tariffs'
 */
export const storeTariff = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTariff.url(options),
    method: 'post',
})

storeTariff.definition = {
    methods: ["post"],
    url: '/settings/catalog/tariffs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::storeTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:33
 * @route '/settings/catalog/tariffs'
 */
storeTariff.url = (options?: RouteQueryOptions) => {
    return storeTariff.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::storeTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:33
 * @route '/settings/catalog/tariffs'
 */
storeTariff.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTariff.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::storeTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:33
 * @route '/settings/catalog/tariffs'
 */
    const storeTariffForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeTariff.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::storeTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:33
 * @route '/settings/catalog/tariffs'
 */
        storeTariffForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeTariff.url(options),
            method: 'post',
        })
    
    storeTariff.form = storeTariffForm
/**
* @see \App\Http\Controllers\Settings\CatalogController::updateTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:40
 * @route '/settings/catalog/tariffs/{tariff}'
 */
export const updateTariff = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateTariff.url(args, options),
    method: 'patch',
})

updateTariff.definition = {
    methods: ["patch"],
    url: '/settings/catalog/tariffs/{tariff}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::updateTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:40
 * @route '/settings/catalog/tariffs/{tariff}'
 */
updateTariff.url = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateTariff.definition.url
            .replace('{tariff}', parsedArgs.tariff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::updateTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:40
 * @route '/settings/catalog/tariffs/{tariff}'
 */
updateTariff.patch = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateTariff.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::updateTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:40
 * @route '/settings/catalog/tariffs/{tariff}'
 */
    const updateTariffForm = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateTariff.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::updateTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:40
 * @route '/settings/catalog/tariffs/{tariff}'
 */
        updateTariffForm.patch = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateTariff.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateTariff.form = updateTariffForm
/**
* @see \App\Http\Controllers\Settings\CatalogController::destroyTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:47
 * @route '/settings/catalog/tariffs/{tariff}'
 */
export const destroyTariff = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyTariff.url(args, options),
    method: 'delete',
})

destroyTariff.definition = {
    methods: ["delete"],
    url: '/settings/catalog/tariffs/{tariff}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroyTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:47
 * @route '/settings/catalog/tariffs/{tariff}'
 */
destroyTariff.url = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroyTariff.definition.url
            .replace('{tariff}', parsedArgs.tariff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroyTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:47
 * @route '/settings/catalog/tariffs/{tariff}'
 */
destroyTariff.delete = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyTariff.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::destroyTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:47
 * @route '/settings/catalog/tariffs/{tariff}'
 */
    const destroyTariffForm = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyTariff.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::destroyTariff
 * @see app/Http/Controllers/Settings/CatalogController.php:47
 * @route '/settings/catalog/tariffs/{tariff}'
 */
        destroyTariffForm.delete = (args: { tariff: number | { id: number } } | [tariff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyTariff.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyTariff.form = destroyTariffForm
/**
* @see \App\Http\Controllers\Settings\CatalogController::storeDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:54
 * @route '/settings/catalog/discounts'
 */
export const storeDiscount = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDiscount.url(options),
    method: 'post',
})

storeDiscount.definition = {
    methods: ["post"],
    url: '/settings/catalog/discounts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::storeDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:54
 * @route '/settings/catalog/discounts'
 */
storeDiscount.url = (options?: RouteQueryOptions) => {
    return storeDiscount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::storeDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:54
 * @route '/settings/catalog/discounts'
 */
storeDiscount.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDiscount.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::storeDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:54
 * @route '/settings/catalog/discounts'
 */
    const storeDiscountForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeDiscount.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::storeDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:54
 * @route '/settings/catalog/discounts'
 */
        storeDiscountForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeDiscount.url(options),
            method: 'post',
        })
    
    storeDiscount.form = storeDiscountForm
/**
* @see \App\Http\Controllers\Settings\CatalogController::updateDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:61
 * @route '/settings/catalog/discounts/{discount}'
 */
export const updateDiscount = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateDiscount.url(args, options),
    method: 'patch',
})

updateDiscount.definition = {
    methods: ["patch"],
    url: '/settings/catalog/discounts/{discount}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::updateDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:61
 * @route '/settings/catalog/discounts/{discount}'
 */
updateDiscount.url = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateDiscount.definition.url
            .replace('{discount}', parsedArgs.discount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::updateDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:61
 * @route '/settings/catalog/discounts/{discount}'
 */
updateDiscount.patch = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateDiscount.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::updateDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:61
 * @route '/settings/catalog/discounts/{discount}'
 */
    const updateDiscountForm = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateDiscount.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::updateDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:61
 * @route '/settings/catalog/discounts/{discount}'
 */
        updateDiscountForm.patch = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateDiscount.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateDiscount.form = updateDiscountForm
/**
* @see \App\Http\Controllers\Settings\CatalogController::destroyDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:68
 * @route '/settings/catalog/discounts/{discount}'
 */
export const destroyDiscount = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDiscount.url(args, options),
    method: 'delete',
})

destroyDiscount.definition = {
    methods: ["delete"],
    url: '/settings/catalog/discounts/{discount}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroyDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:68
 * @route '/settings/catalog/discounts/{discount}'
 */
destroyDiscount.url = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroyDiscount.definition.url
            .replace('{discount}', parsedArgs.discount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroyDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:68
 * @route '/settings/catalog/discounts/{discount}'
 */
destroyDiscount.delete = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDiscount.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::destroyDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:68
 * @route '/settings/catalog/discounts/{discount}'
 */
    const destroyDiscountForm = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyDiscount.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::destroyDiscount
 * @see app/Http/Controllers/Settings/CatalogController.php:68
 * @route '/settings/catalog/discounts/{discount}'
 */
        destroyDiscountForm.delete = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyDiscount.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyDiscount.form = destroyDiscountForm
/**
* @see \App\Http\Controllers\Settings\CatalogController::storeAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:75
 * @route '/settings/catalog/aromas'
 */
export const storeAroma = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAroma.url(options),
    method: 'post',
})

storeAroma.definition = {
    methods: ["post"],
    url: '/settings/catalog/aromas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::storeAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:75
 * @route '/settings/catalog/aromas'
 */
storeAroma.url = (options?: RouteQueryOptions) => {
    return storeAroma.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::storeAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:75
 * @route '/settings/catalog/aromas'
 */
storeAroma.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAroma.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::storeAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:75
 * @route '/settings/catalog/aromas'
 */
    const storeAromaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeAroma.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::storeAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:75
 * @route '/settings/catalog/aromas'
 */
        storeAromaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeAroma.url(options),
            method: 'post',
        })
    
    storeAroma.form = storeAromaForm
/**
* @see \App\Http\Controllers\Settings\CatalogController::updateAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:82
 * @route '/settings/catalog/aromas/{aroma}'
 */
export const updateAroma = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateAroma.url(args, options),
    method: 'patch',
})

updateAroma.definition = {
    methods: ["patch"],
    url: '/settings/catalog/aromas/{aroma}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::updateAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:82
 * @route '/settings/catalog/aromas/{aroma}'
 */
updateAroma.url = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateAroma.definition.url
            .replace('{aroma}', parsedArgs.aroma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::updateAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:82
 * @route '/settings/catalog/aromas/{aroma}'
 */
updateAroma.patch = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateAroma.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::updateAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:82
 * @route '/settings/catalog/aromas/{aroma}'
 */
    const updateAromaForm = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateAroma.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::updateAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:82
 * @route '/settings/catalog/aromas/{aroma}'
 */
        updateAromaForm.patch = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateAroma.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateAroma.form = updateAromaForm
/**
* @see \App\Http\Controllers\Settings\CatalogController::destroyAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:89
 * @route '/settings/catalog/aromas/{aroma}'
 */
export const destroyAroma = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAroma.url(args, options),
    method: 'delete',
})

destroyAroma.definition = {
    methods: ["delete"],
    url: '/settings/catalog/aromas/{aroma}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroyAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:89
 * @route '/settings/catalog/aromas/{aroma}'
 */
destroyAroma.url = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroyAroma.definition.url
            .replace('{aroma}', parsedArgs.aroma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CatalogController::destroyAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:89
 * @route '/settings/catalog/aromas/{aroma}'
 */
destroyAroma.delete = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAroma.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\CatalogController::destroyAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:89
 * @route '/settings/catalog/aromas/{aroma}'
 */
    const destroyAromaForm = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyAroma.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CatalogController::destroyAroma
 * @see app/Http/Controllers/Settings/CatalogController.php:89
 * @route '/settings/catalog/aromas/{aroma}'
 */
        destroyAromaForm.delete = (args: { aroma: number | { id: number } } | [aroma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyAroma.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyAroma.form = destroyAromaForm
const CatalogController = { index, storeTariff, updateTariff, destroyTariff, storeDiscount, updateDiscount, destroyDiscount, storeAroma, updateAroma, destroyAroma }

export default CatalogController