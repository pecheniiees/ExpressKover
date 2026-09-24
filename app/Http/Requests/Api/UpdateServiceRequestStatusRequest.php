<?php

namespace App\Http\Requests\Api;

use App\Models\ServiceRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequestStatusRequest extends FormRequest
{
    /**
     * Status transitions a courier is allowed to perform through this
     * endpoint, keyed by the order's current status.
     *
     * @var array<string, list<string>>
     */
    private const ALLOWED_TRANSITIONS = [
        'assigned' => ['accepted', 'cancelled'],
        'accepted' => ['in_progress', 'cancelled'],
        'in_progress' => ['delivered', 'cancelled'],
    ];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $order = $this->route('order');

        return $order instanceof ServiceRequest
            && ($this->user()?->can('update-own-service-request-status', $order) ?? false);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:accepted,in_progress,delivered,cancelled'],
        ];
    }

    /**
     * Reject status changes that skip steps in the delivery workflow (e.g.
     * jumping straight from "assigned" to "delivered").
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var ServiceRequest $order */
            $order = $this->route('order');
            $targetStatus = $this->string('status')->toString();

            $allowedTargets = self::ALLOWED_TRANSITIONS[$order->status] ?? [];

            if ($targetStatus !== '' && ! in_array($targetStatus, $allowedTargets, true)) {
                $validator->errors()->add(
                    'status',
                    "Заявку нельзя перевести из статуса «{$order->status}» в «{$targetStatus}».",
                );
            }
        });
    }
}
