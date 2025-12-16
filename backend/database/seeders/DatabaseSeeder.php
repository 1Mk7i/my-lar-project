<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Author;
use App\Models\Publisher;
use App\Models\Genre;
use App\Models\Book;
use App\Models\Favorite;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Comment;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ролі
        $roles = ['user', 'author', 'admin'];
        foreach ($roles as $role) {
            Role::factory()->create(['name' => $role]);
        }

        // 2. Користувачі
        User::factory(20)->create();

        // 3. Publishers
        Publisher::factory(10)->create();

        // 4. Authors (для деяких користувачів)
        $users = User::all()->where('role_id', Role::where('name','author')->first()->id);
        foreach ($users as $user) {
            Author::factory()->create(['user_id' => $user->id]);
        }

        // 5. Genres
        Genre::factory(10)->create();

        // 6. Books
        $authors = Author::all();
        $publishers = Publisher::all();
        $genres = Genre::all();

        foreach ($authors as $author) {
            Book::factory(3)->create([
                'author_id' => $author->id,
                'publisher_id' => $publishers->random()->id
            ])->each(function($book) use ($genres) {
                $book->genres()->attach($genres->random(rand(1,3))->pluck('id')->toArray());
            });
        }

        // 7. Favorites
        $users = User::all();
        $books = Book::all();
        foreach ($users as $user) {
            foreach ($books->random(rand(0,5)) as $book) {
                Favorite::factory()->create([
                    'user_id' => $user->id,
                    'book_id' => $book->id
                ]);
            }
        }

        // 8. Carts і CartItems
        foreach ($users as $user) {
            $cart = Cart::factory()->create(['user_id' => $user->id]);
            foreach ($books->random(rand(0,5)) as $book) {
                CartItem::factory()->create([
                    'cart_id' => $cart->id,
                    'book_id' => $book->id,
                ]);
            }
        }

        // 9. Comments
        $allUsers = User::all();
        $allBooks = Book::all();
        $numberOfComments = rand(40, 60);

        for ($i = 0; $i < $numberOfComments; $i++) {
            Comment::factory()->create([
                'user_id' => $allUsers->random()->id,
                'book_id' => $allBooks->random()->id,
                // Фабрика сама додасть випадковий 'rating' та 'content'
            ]);
        }
        
        /* // Альтернативний (ваш попередній) спосіб, але з додаванням rating:
        foreach ($users as $user) {
            foreach ($books->random(rand(0,5)) as $book) {
                Comment::factory()->create([
                    'user_id' => $user->id,
                    'book_id' => $book->id,
                    // Додавання rating не потрібне, якщо ми використовуємо логіку фабрики.
                ]);
            }
        }
        */
    }
}