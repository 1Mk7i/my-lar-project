<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\GenreApiController;
use App\Http\Controllers\BookApiController;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;

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
Route::get('/books/{book}', [BookApiController::class, 'show']); 

Route::get('/genres', [GenreApiController::class, 'index']);
Route::get('/publishers', [PublisherController::class, 'index']);
Route::get('/authors', [AuthorController::class, 'index']);

Route::get('/books/{book}/comments', [CommentController::class, 'index']); 


// --- МАРШРУТИ, ЩО ВИМАГАЮТЬ АВТЕНТИФІКАЦІЇ (auth:sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Вихід
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // РЕЄСТРАЦІЯ ЗАХИЩЕНИХ RESTful МАРШРУТІВ ДЛЯ КНИГ
    // Всі методи, крім index і show. Параметр тут буде {book}.
    Route::apiResource('books', BookApiController::class)->except(['index', 'show']);
    
    
    // POST /books/{book}/comments - Створення
    Route::post('/books/{book}/comments', [CommentController::class, 'store']); 
    
    // PUT /books/{book}/comments/{comment} - Оновлення 
    Route::put('/books/{book}/comments/{comment}', [CommentController::class, 'update']); 
    
    // DELETE /books/{book}/comments/{comment} - Видалення
    Route::delete('/books/{book}/comments/{comment}', [CommentController::class, 'destroy']); 
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::delete('/cart/items/{itemId}', [CartController::class, 'removeItem']);
    Route::patch('/cart/items/{itemId}', [CartController::class, 'updateQuantity']);
    
    // User profile routes
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);
    Route::delete('/user', [UserController::class, 'destroy']);
    
    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::get('/roles', [AdminController::class, 'getRoles']);
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::put('/users/{user}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    });
});