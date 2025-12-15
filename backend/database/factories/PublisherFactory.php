<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Publisher;

class PublisherFactory extends Factory
{
    protected $model = Publisher::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
        ];
    }
}
