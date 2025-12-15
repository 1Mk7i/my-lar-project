<?php

namespace App\Http\Controllers;

use App\Models\Genre;

class GenreController extends Controller
{
    /**
     * GET /api/genres
     */
    public function index()
    {
        return response()->json(
            Genre::all()
        );
    }
}
