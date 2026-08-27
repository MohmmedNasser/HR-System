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
        Schema::create('positions', function (Blueprint $table) { //المسميات الوظيفية
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete(); //القسم
            $table->string('title'); //المسمى الوظيفي
            $table->text('description')->nullable(); //الوصف
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};
