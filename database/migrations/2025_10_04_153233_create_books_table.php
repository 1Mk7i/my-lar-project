<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->text('description')->nullable();
            $table->string('isbn')->unique()->nullable();
            $table->integer('publication_year');
            $table->decimal('price', 8, 2)->nullable();
            $table->integer('pages')->nullable();
            $table->string('language')->default('ukrainian');
            $table->string('cover_image')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            // Indexes for performance
            $table->index(['is_available', 'publication_year']);
            $table->index('author');
            $table->index('language');
        });
    }

    public function down()
    {
        Schema::dropIfExists('books');
    }
};