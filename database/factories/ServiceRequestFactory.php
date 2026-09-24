<?php

namespace Database\Factories;

use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceRequest>
 */
class ServiceRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_name' => fake()->name(),
            'client_phone' => fake()->unique()->numerify('+7##########'),
            'address' => fake()->address(),
            'comment' => fake()->sentence(),
            'status' => 'new',
            'created_by' => User::factory(),
        ];
    }
}
