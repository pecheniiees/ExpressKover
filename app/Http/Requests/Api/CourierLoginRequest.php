<?php

namespace App\Http\Requests\Api;

use App\Concerns\PhoneValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CourierLoginRequest extends FormRequest
{
    use PhoneValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'phone' => ['required', 'string', 'regex:/^\+7\d{10}$/'],
            'password' => ['required', 'string'],
        ];
    }
}
