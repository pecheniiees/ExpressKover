<?php

namespace App\Http\Requests;

use App\Concerns\PhoneValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequestRequest extends FormRequest
{
    use PhoneValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create-service-requests') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^\+7\d{10}$/'],
            'address' => ['required', 'string', 'max:255'],
            'area_square_meters' => ['required', 'numeric', 'min:0.01'],
            'tariff_id' => ['required', 'integer', 'exists:tariffs,id'],
            'discount_id' => ['nullable', 'integer', 'exists:discounts,id'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'comment' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', 'string', 'in:new,in_progress,ready,delivery,completed,cancelled'],
        ];
    }

    /**
     * @return array{client_name: string, client_phone: string, address: string, area_square_meters: float, tariff_id: int, discount_id?: int|null, latitude?: float|null, longitude?: float|null, comment?: string|null, status: string}
     */
    public function serviceRequestData(): array
    {
        $validated = $this->validated();

        return [
            'client_name' => $validated['client_name'],
            'client_phone' => $validated['phone'],
            'address' => $validated['address'],
            'area_square_meters' => (float) $validated['area_square_meters'],
            'tariff_id' => (int) $validated['tariff_id'],
            'discount_id' => isset($validated['discount_id']) ? (int) $validated['discount_id'] : null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'comment' => $validated['comment'] ?? null,
            'status' => $validated['status'],
        ];
    }
}
