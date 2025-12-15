<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Comment;
use App\Models\User;
use App\Models\Book;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? 1,
            'book_id' => Book::inRandomOrder()->first()->id ?? 1,
            'content' => $this->faker->paragraph(),
        ];
    }
}
