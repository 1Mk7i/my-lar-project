<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function index()
    {
        $authors = Author::with('user')->get(); // Додайте with('user')
        
        return response()->json($authors);
    }
}