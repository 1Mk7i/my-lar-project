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
        // 50% шанс отримати null (без оцінки) або випадкове число від 1 до 5
        $rating = $this->faker->randomFloat(0, 0, 1) < 0.5 
            ? null 
            : $this->faker->numberBetween(1, 5);

        return [
            // Якщо user_id/book_id не передано, обираємо випадково
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(), 
            'book_id' => Book::inRandomOrder()->first()->id ?? Book::factory(),
            'content' => $this->faker->paragraph(),
            'rating' => $rating, 
        ];
    }
}