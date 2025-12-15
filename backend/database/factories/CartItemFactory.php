<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CartItem;
use App\Models\Cart;
use App\Models\Book;

class CartItemFactory extends Factory
{
    protected $model = CartItem::class;

    public function definition(): array
    {
        return [
            'cart_id' => Cart::inRandomOrder()->first()->id ?? 1,
            'book_id' => Book::inRandomOrder()->first()->id ?? 1,
            'quantity' => $this->faker->numberBetween(1, 5),
        ];
    }
}
