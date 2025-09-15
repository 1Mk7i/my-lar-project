<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    /**
     * Головна сторінка API
     */
    public function index()
    {
        return response()->json([
            'message' => 'Laravel + React Додаток',
            'links' => [
                ['title' => 'Документація', 'url' => 'https://laravel.com/docs'],
                ['title' => 'Laracasts', 'url' => 'https://laracasts.com'],
                ['title' => 'Новини', 'url' => 'https://laravel-news.com'],
                ['title' => 'Блог', 'url' => 'https://blog.laravel.com'],
            ]
        ]);
    }
}
