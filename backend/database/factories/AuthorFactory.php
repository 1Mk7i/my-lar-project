<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Author;
use App\Models\User;

class AuthorFactory extends Factory
{
    protected $model = Author::class;

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
        ];
    }
}
