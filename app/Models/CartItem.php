<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
        'quantity'
    ];

    protected $casts = [
        'quantity' => 'integer'
    ];

    /**
     * Relationship with user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship with book
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Accessor for total price
     */
    public function getTotalPriceAttribute()
    {
        return $this->quantity * $this->book->price;
    }

    /**
     * Increment quantity
     */
    public function incrementQuantity($amount = 1)
    {
        $this->quantity += $amount;
        return $this->save();
    }

    /**
     * Decrement quantity
     */
    public function decrementQuantity($amount = 1)
    {
        $this->quantity = max(0, $this->quantity - $amount);
        return $this->save();
    }
}