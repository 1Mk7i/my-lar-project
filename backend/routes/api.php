<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\GenreApiController;
use App\Http\Controllers\BookApiController;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\CommentController; // Переконайтеся, що це правильний контролер

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- МАРШРУТИ АВТЕНТИФІКАЦІЇ (ПУБЛІЧНІ) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- ПУБЛІЧНІ МАРШРУТИ ДАНИХ (GET-запити) ---

// Книги та суміжні ресурси
Route::get('/books', [BookApiController::class, 'index']);
// 🚩 ВИПРАВЛЕНО: Змінено {id} на {book} для Route Model Binding
Route::get('/books/{book}', [BookApiController::class, 'show']); 

Route::get('/genres', [GenreApiController::class, 'index']);
Route::get('/publishers', [PublisherController::class, 'index']);
Route::get('/authors', [AuthorController::class, 'index']);

// 🚩 ВИПРАВЛЕНО: Змінено параметр {bookId} на {book}. ЧИТАННЯ коментарів є публічним.
Route::get('/books/{book}/comments', [CommentController::class, 'index']); 


// --- МАРШРУТИ, ЩО ВИМАГАЮТЬ АВТЕНТИФІКАЦІЇ (auth:sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Вихід
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // РЕЄСТРАЦІЯ ЗАХИЩЕНИХ RESTful МАРШРУТІВ ДЛЯ КНИГ
    // Всі методи, крім index і show. Параметр тут буде {book}.
    Route::apiResource('books', BookApiController::class)->except(['index', 'show']);
    
    // 🚩 СТВОРЕННЯ, ОНОВЛЕННЯ ТА ВИДАЛЕННЯ КОМЕНТАРІВ (ЗАХИЩЕНО)
    
    // POST /books/{book}/comments - Створення
    Route::post('/books/{book}/comments', [CommentController::class, 'store']); 
    
    // PUT /books/{book}/comments/{comment} - Оновлення 
    // 🚩 Змінено {bookId} -> {book} та {commentId} -> {comment}
    Route::put('/books/{book}/comments/{comment}', [CommentController::class, 'update']); 
    
    // DELETE /books/{book}/comments/{comment} - Видалення
    Route::delete('/books/{book}/comments/{comment}', [CommentController::class, 'destroy']); 
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::delete('/cart/items/{itemId}', [CartController::class, 'removeItem']);
    Route::patch('/cart/items/{itemId}', [CartController::class, 'updateQuantity']);
});