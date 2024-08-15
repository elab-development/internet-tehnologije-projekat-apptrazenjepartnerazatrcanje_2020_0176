<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserStats>
 */
class UserStatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(), // Creates a new user and assigns it to user_id
            'total_distance' => $this->faker->numberBetween(0, 1000), // Random distance between 0 and 1000
            'total_runs' => $this->faker->numberBetween(0, 100), // Random number of runs between 0 and 100
        ];
    }
}
