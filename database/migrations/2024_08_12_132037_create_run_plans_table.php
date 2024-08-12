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
        Schema::create('run_plans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
           // $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Spoljni ključ ka users
            $table->string('location'); // Opis ili naziv lokacije
            $table->decimal('latitude', 10, 8); // Geografska širina
            $table->decimal('longitude', 11, 8); // Geografska dužina
            $table->timestamp('time'); // Vreme trčanja
            $table->float('distance'); // Kilometraža
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('run_plans');
    }
};
