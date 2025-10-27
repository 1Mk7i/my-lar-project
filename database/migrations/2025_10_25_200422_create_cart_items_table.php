<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->timestamps();

            // Unique constraint to prevent duplicate items
            $table->unique(['user_id', 'book_id']);

            // Indexes for performance
            $table->index('user_id');
            $table->index('book_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('cart_items');
    }
};