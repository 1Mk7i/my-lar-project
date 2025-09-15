<?php

use Illuminate\Support\Facades\Route;

// API-only Laravel - всі роути в routes/api.php
// Next.js frontend працює на http://localhost:3000
// Laravel API працює на http://localhost:8000

Route::get('/', function () {
    return response()->json([
        'message' => 'Laravel API працює!',
        'frontend' => 'http://localhost:3000',
        'api' => 'http://localhost:8000/api',
        'docs' => 'http://localhost:8000/api/docs'
    ]);
});
