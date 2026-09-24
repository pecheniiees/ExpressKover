<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait PhoneValidationRules
{
    protected function prepareForValidation(): void
    {
        if (! $this->has('phone')) {
            return;
        }

        $digits = preg_replace('/\D+/', '', (string) $this->input('phone')) ?? '';

        if (strlen($digits) === 11 && str_starts_with($digits, '7')) {
            $digits = substr($digits, 1);
        }

        $this->merge(['phone' => '+7'.$digits]);
    }

    /**
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function phoneRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'regex:/^\+7\d{10}$/',
            $userId === null
                ? Rule::unique(User::class, 'phone')
                : Rule::unique(User::class, 'phone')->ignore($userId),
        ];
    }
}
