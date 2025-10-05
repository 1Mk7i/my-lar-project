<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'description',
        'publication_year',
        'isbn',
        'price',
        'pages',
        'cover_image',
        'is_available'
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'price' => 'decimal:2',
        'publication_year' => 'integer',
        'pages' => 'integer'
    ];
}