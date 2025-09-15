<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Modules\UsersController;

// Роути для модуля Users
Route::prefix('modules/users')->group(function () {
    Route::get('/', [UsersController::class, 'index']);
    Route::get('/{id}', [UsersController::class, 'show']);
    Route::post('/', [UsersController::class, 'store']);
    Route::put('/{id}', [UsersController::class, 'update']);
    Route::delete('/{id}', [UsersController::class, 'destroy']);
});