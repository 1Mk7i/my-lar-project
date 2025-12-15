<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Book;
use App\Models\Author;
use App\Models\Publisher;

class BookFactory extends Factory
{
    protected $model = Book::class;

    /**
     * Масив URL-адрес обкладинок, з яких буде братися випадковий.
     * Ви можете замінити їх на реальні або використовувати як приклади.
     */
    protected $coverUrls = [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558901357-ca41e027e43a?w=400&h=600&fit=crop',
    ];

    public function definition(): array
    {
        $author = Author::inRandomOrder()->first();
        $publisher = Publisher::inRandomOrder()->first();

        $randomCoverUrl = $this->faker->randomElement($this->coverUrls);

        return [
            'title' => $this->faker->sentence(3),
            'author_id' => $author->id ?? 1,
            'publisher_id' => $publisher->id ?? 1,
            'year' => $this->faker->year(),
            'description' => $this->faker->paragraphs(3, true),
            'cover' => $randomCoverUrl, 
            'price' => $this->faker->randomFloat(2, 50, 1000),
            'is_blocked' => false,
        ];
    }
}