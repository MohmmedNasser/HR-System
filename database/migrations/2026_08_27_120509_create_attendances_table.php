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
        Schema::create('attendances', function (Blueprint $table) { //الحضور
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete(); //الموظف
            $table->date('work_date'); //تاريخ العمل
            $table->time('clock_in')->nullable(); //وقت الحضور
            $table->time('clock_out')->nullable(); //وقت الانصراف
            $table->string('status')->default('present'); //present, late, absent //الحالة
            $table->timestamps(); //تاريخ إنشاء الحضور

            $table->unique(['employee_id', 'work_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
