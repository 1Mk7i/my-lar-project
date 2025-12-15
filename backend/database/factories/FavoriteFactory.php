<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Favorite;
use App\Models\User;
use App\Models\Book;

class FavoriteFactory extends Factory
{
    protected $model = Favorite::class;

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? 1,
            'book_id' => Book::inRandomOrder()->first()->id ?? 1,
        ];
    }
}
