<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Book::class;

    private $coverImages = [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558901357-ca41e027e43a?w=400&h=600&fit=crop',
    ];

    private $languages = [
        'ukrainian',
        'english', 
        'german',
        'french',
        'spanish',
        'italian',
        'polish'
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'author' => $this->faker->name(),
            'description' => $this->faker->paragraph(),
            'isbn' => $this->faker->isbn13(),
            'publication_year' => $this->faker->numberBetween(1900, 2024),
            'cover_image' => $this->faker->randomElement($this->coverImages),
            'price' => $this->faker->randomFloat(2, 50, 500),
            'pages' => $this->faker->numberBetween(100, 800),
            'language' => $this->faker->randomElement($this->languages),
            'is_available' => $this->faker->boolean(80),
        ];
    }
}