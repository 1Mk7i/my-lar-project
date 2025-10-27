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
        'isbn',
        'publication_year',
        'price',
        'pages',
        'language',
        'cover_image',
        'is_available'
    ];

    protected $casts = [
        'publication_year' => 'integer',
        'price' => 'decimal:2',
        'pages' => 'integer',
        'is_available' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Relationship with cart items
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Users who have this book in cart
     */
    public function usersInCart()
    {
        return $this->belongsToMany(User::class, 'cart_items')
                    ->withPivot('quantity', 'id')
                    ->withTimestamps();
    }

    /**
     * Scope for available books
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Scope for searching books
     */
    public function scopeSearch($query, $searchTerm)
    {
        return $query->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('author', 'like', "%{$searchTerm}%");
    }

    /**
     * Accessor for status
     */
    public function getStatusAttribute()
    {
        return $this->is_available ? 'available' : 'out_of_stock';
    }

    /**
     * Accessor for year (alias for publication_year)
     */
    public function getYearAttribute()
    {
        return $this->publication_year;
    }
}