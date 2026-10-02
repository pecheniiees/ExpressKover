<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequestDetailsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('claim-service-request') ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'client_name' => ['sometimes', 'required', 'string', 'max:255'],
            'client_phone' => ['sometimes', 'required', 'string', 'regex:/^\+7\d{10}$/'],
            'address' => ['sometimes', 'required', 'string', 'max:255'],
            'carpet_count' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'area_square_meters' => ['sometimes', 'nullable', 'numeric', 'min:0.01', 'max:999999.99'],
            'tariff_id' => ['sometimes', 'nullable', 'integer', 'exists:tariffs,id'],
            'discount_id' => ['sometimes', 'nullable', 'integer', 'exists:discounts,id'],
            'comment' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
