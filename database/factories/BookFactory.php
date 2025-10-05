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
            'publication_year' => $this->faker->year(),
            'cover_image' => $this->faker->imageUrl(),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'pages' => $this->faker->numberBetween(50, 1000),
            'language' => $this->faker->languageCode(),
            'is_available' => $this->faker->boolean(),
        ];
    }
}
