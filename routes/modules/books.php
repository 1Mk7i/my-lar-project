<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookController;

Route::get('/modules/books', [BookController::class, 'index']);
