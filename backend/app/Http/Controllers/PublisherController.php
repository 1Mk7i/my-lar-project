<?php

namespace App\Http\Controllers;

use App\Models\Publisher;

class PublisherController extends Controller
{
    public function index()
    {
        return response()->json(
            Publisher::all()
        );
    }
}
