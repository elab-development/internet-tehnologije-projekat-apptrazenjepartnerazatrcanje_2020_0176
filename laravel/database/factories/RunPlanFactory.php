<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RunPlans>
 */
class RunPlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userIds = User::pluck('id');
        return [
            'user_id' => $this->faker->randomElement($userIds),
            'location' => $this->faker->address, // Nasumična adresa kao lokacija
            'latitude' => $this->faker->latitude, // Nasumična širina
            'longitude' => $this->faker->longitude, // Nasumična dužina
            'time' => $this->faker->dateTimeBetween('now', '+4 hours'), // Vreme trčanja unutar sledeća 4 sata
            'distance' => $this->faker->randomFloat(2, 1, 42), // Udaljenost u kilometrima
        ];
    }
}
