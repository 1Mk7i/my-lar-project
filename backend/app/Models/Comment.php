<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'book_id', 
        'content', 
        'rating', // Залишаємо рейтинг
        // 'parent_id' - ВИДАЛЕНО
    ];

    /**
     * Коментар належить користувачеві.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Коментар належить книзі.
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
    
    // ЗВ'ЯЗКИ ДЛЯ ІЄРАРХІЇ КОМЕНТАРІВ ВИДАЛЕНО
}