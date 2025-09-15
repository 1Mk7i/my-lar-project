<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/home', [HomeController::class, 'index']);

// API документація
Route::get('/docs', function () {
    return response()->json([
        'message' => 'Laravel API Documentation',
        'version' => '1.0.0',
        'endpoints' => [
            'GET /api/home' => 'Головна сторінка даних',
            'GET /api/modules/users' => 'Список користувачів',
            'POST /api/modules/users' => 'Створити користувача',
            'GET /api/modules/users/{id}' => 'Отримати користувача',
            'PUT /api/modules/users/{id}' => 'Оновити користувача',
            'DELETE /api/modules/users/{id}' => 'Видалити користувача',
        ],
        'frontend' => 'http://localhost:3000',
        'backend' => 'http://localhost:8000'
    ]);
});

Route::get('/test-message', function () {
    return response()->json(['message' => 'Привіт з бекенду!']);
});

// Підключення роутів модулів
require __DIR__.'/modules/users.php';