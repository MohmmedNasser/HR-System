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
        Schema::create('leave_balances', function (Blueprint $table) { //رصيد الإجازات
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete(); //الموظف
            $table->foreignId('leave_type_id')->constrained()->cascadeOnDelete(); //نوع الإجازة
            $table->unsignedSmallInteger('year'); //السنة
            $table->unsignedSmallInteger('entitled_days')->default(0); //عدد الأيام المستحقة
            $table->unsignedSmallInteger('used_days')->default(0); //عدد الأيام المستهلكة
            $table->timestamps();

            $table->unique(['employee_id', 'leave_type_id', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_balances');
    }
};
