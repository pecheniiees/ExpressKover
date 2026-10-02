<?php

namespace App\Http\Requests;

use App\Concerns\PhoneValidationRules;
use App\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequestRequest extends FormRequest
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
            'phone' => $this->phoneRules(),
            'address' => ['required', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'area_square_meters' => ['nullable', 'numeric', 'min:0.01', 'max:999999.99'],
            'carpet_count' => ['nullable', 'integer', 'min:1'],
            'tariff_id' => ['nullable', 'integer', 'exists:tariffs,id'],
            'discount_id' => ['nullable', 'integer', 'exists:discounts,id'],
            'comment' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', 'string', 'in:new,pending,in_progress,ready,delivery,completed,cancelled,assigned,accepted,delivered'],
            'courier_id' => ['nullable', 'integer', Rule::exists('users', 'id')->where('role', UserRole::Courier->value)],
        ];
    }

    /**
    * @return array{client_name: string, client_phone: string, address: string, comment?: string|null, status: string, courier_id?: int|null, latitude?: float|null, longitude?: float|null, area_square_meters?: float|null, carpet_count?: int|null, tariff_id?: int|null, discount_id?: int|null}
     */
    public function serviceRequestData(): array
    {
        $validated = $this->validated();

        $data = [
            'client_name' => $validated['client_name'],
            'client_phone' => $validated['phone'],
            'address' => $validated['address'],
            'comment' => $validated['comment'] ?? null,
            'status' => $validated['status'],
        ];

        if ($this->has('courier_id')) {
            $data['courier_id'] = $validated['courier_id'] ?? null;
        }

        if ($this->has('latitude')) {
            $data['latitude'] = $validated['latitude'] ?? null;
        }

        if ($this->has('longitude')) {
            $data['longitude'] = $validated['longitude'] ?? null;
        }

        if ($this->has('area_square_meters')) {
            $data['area_square_meters'] = isset($validated['area_square_meters'])
                ? (float) $validated['area_square_meters']
                : null;
        }

        if ($this->has('carpet_count')) {
            $data['carpet_count'] = isset($validated['carpet_count'])
                ? (int) $validated['carpet_count']
                : null;
        }

        if ($this->has('tariff_id')) {
            $data['tariff_id'] = isset($validated['tariff_id'])
                ? (int) $validated['tariff_id']
                : null;
        }

        if ($this->has('discount_id')) {
            $data['discount_id'] = isset($validated['discount_id'])
                ? (int) $validated['discount_id']
                : null;
        }

        return $data;
    }
}
