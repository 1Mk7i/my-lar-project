<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne; // 🚩 ВИПРАВЛЕНО: Правильний імпорт

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $fillable = [
        'name', 'email', 'password', 'role_id', 'avatar', 'is_blocked', 'block_reason'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_blocked' => 'boolean', 
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Користувач може мати один профіль автора (one-to-one).
     * 🚩 ВИПРАВЛЕНО: Тип повернення змінено на HasOne.
     */
    public function author(): HasOne 
    {
        return $this->hasOne(Author::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }
}