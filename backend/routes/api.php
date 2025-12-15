<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\GenreApiController;
use App\Http\Controllers\BookApiController;
use App\Http\Controllers\AuthController; 

// --- МАРШРУТИ АВТЕНТИФІКАЦІЇ (ПУБЛІЧНІ) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- ПУБЛІЧНІ МАРШРУТИ ДАНИХ (GET-запити) ---
Route::get('/books', [BookApiController::class, 'index']);
Route::get('/books/{id}', [BookApiController::class, 'show']);

Route::get('/genres', [GenreApiController::class, 'index']);
Route::get('/publishers', [PublisherController::class, 'index']);
Route::get('/authors', [AuthorController::class, 'index']);


// --- МАРШРУТИ, ЩО ВИМАГАЮТЬ АВТЕНТИФІКАЦІЇ (auth:sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Вихід
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // РЕЄСТРАЦІЯ ЗАХИЩЕНИХ RESTful МАРШРУТІВ ДЛЯ КНИГ
    Route::apiResource('books', BookApiController::class)->except(['index', 'show']);
});