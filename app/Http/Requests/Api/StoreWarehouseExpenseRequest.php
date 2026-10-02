<?php

namespace App\Http\Requests\Api;

use App\Http\Requests\StoreWarehouseExpenseRequest as BaseStoreWarehouseExpenseRequest;

class StoreWarehouseExpenseRequest extends BaseStoreWarehouseExpenseRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('claim-service-request') ?? false;
    }
}
