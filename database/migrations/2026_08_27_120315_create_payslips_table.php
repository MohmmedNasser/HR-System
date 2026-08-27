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
        Schema::create('payslips', function (Blueprint $table) { //الرواتب
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete(); //الموظف
            $table->date('period_start'); //بداية الفترة
            $table->date('period_end'); //نهاية الفترة
            $table->decimal('gross_pay', 12, 2); //إجمالي الأجر
            $table->decimal('deductions', 12, 2)->default(0); //الخصومات
            $table->decimal('net_pay', 12, 2); //صافي الدفع
            $table->timestamp('issued_at')->nullable(); //تاريخ الإصدار
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payslips');
    }
};
