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
            $table->unsignedBigInteger('run_plan_id');
            $table->foreign('run_plan_id')->references('id')->on('run_plans');
           // $table->foreignId('run_plan_id')->constrained()->onDelete('cascade'); // Spoljni ključ ka run_plans
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
           // $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Spoljni ključ ka users
            $table->text('comment'); // Tekst komentara
            $table->timestamps();
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
