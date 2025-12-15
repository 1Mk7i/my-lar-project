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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role_id')) {
                $table->unsignedBigInteger('role_id')->default(1);
                $table->foreign('role_id')->references('id')->on('roles');
                $table->string('avatar')->nullable();
                $table->boolean('is_blocked')->default(false);
                $table->text('block_reason')->nullable(); 
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn(['role_id', 'avatar', 'is_blocked', 'block_reason']);
        });
    }
};
