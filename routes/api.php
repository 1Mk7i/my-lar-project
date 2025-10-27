<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Прості тестові маршрути для перевірки роботи API
Route::get('/test', function () {
    return response()->json([
        'message' => 'API працює коректно!',
        'status' => 'success',
        'timestamp' => now()->toDateTimeString()
    ]);
});

Route::get('/test-books', function () {
    return response()->json([
        'message' => 'Books API endpoint is working',
        'status' => 'success'
    ]);
});

// Books API routes
Route::prefix('modules')->group(function () {
    Route::get('/books', [BookController::class, 'apiIndex']);
    Route::get('/books/{id}', [BookController::class, 'apiShow']);
});

// Cart API routes (для майбутнього використання)
Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/add', [CartController::class, 'add']);
    Route::put('/update/{id}', [CartController::class, 'update']);
    Route::delete('/remove/{id}', [CartController::class, 'remove']);
    Route::delete('/clear', [CartController::class, 'clear']);
});

// API документація
Route::get('/docs', function () {
    return response()->json([
        'message' => 'Laravel API Documentation',
        'version' => '1.0.0',
        'endpoints' => [
            'GET /api/test' => 'Тестовий маршрут',
            'GET /api/test-books' => 'Тест книг',
            'GET /api/modules/books' => 'Список всіх книг',
            'GET /api/modules/books/{id}' => 'Отримати книгу по ID',
            'GET /api/cart' => 'Отримати кошик (protected)',
            'POST /api/cart/add' => 'Додати до кошика (protected)',
            'PUT /api/cart/update/{id}' => 'Оновити кількість (protected)',
            'DELETE /api/cart/remove/{id}' => 'Видалити з кошика (protected)',
            'DELETE /api/cart/clear' => 'Очистити кошик (protected)',
        ],
        'public_endpoints' => [
            'GET /api/test',
            'GET /api/test-books',
            'GET /api/modules/books',
            'GET /api/modules/books/{id}',
        ],
        'protected_endpoints' => [
            'GET /api/user',
            'GET /api/cart',
            'POST /api/cart/add',
            'PUT /api/cart/update/{id}',
            'DELETE /api/cart/remove/{id}',
            'DELETE /api/cart/clear',
        ]
    ]);
});

Route::get('/test-message', function () {
    return response()->json([
        'message' => 'Привіт з бекенду! 🚀',
        'data' => [
            'framework' => 'Laravel',
            'version' => app()->version(),
            'time' => now()->toDateTimeString()
        ]
    ]);
});

// Health check маршрут
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'environment' => app()->environment(),
        'debug' => config('app.debug')
    ]);
});
