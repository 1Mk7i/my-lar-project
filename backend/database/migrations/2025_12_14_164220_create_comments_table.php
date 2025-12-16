<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->text('content');
            
            // 🚩 ДОДАНО: Поле для рейтингу (1-5 зірок), може бути NULL
            $table->unsignedTinyInteger('rating')->nullable();
            
            $table->boolean('is_blocked')->default(false);
            $table->timestamps();
            
            // 🚩 ВИДАЛЕНО: 'parent_id' згідно з вашим запитом
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};