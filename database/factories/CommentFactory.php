<?php

namespace Database\Factories;

use App\Models\RunPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comments>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $runPlanIds = RunPlan::pluck('id');
        $userIds = User::pluck('id');
        return [
            'run_plan_id' => $this->faker->randomElement($runPlanIds),
            'user_id' => $this->faker->randomElement($userIds),
            'comment' => $this->faker->text(255),
        ];
    }
}
