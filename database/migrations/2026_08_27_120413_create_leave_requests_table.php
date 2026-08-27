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
        Schema::create('leave_requests', function (Blueprint $table) { //طلبات الإجازات
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete(); //الموظف
            $table->foreignId('leave_type_id')->constrained()->cascadeOnDelete(); //نوع الإجازة
            $table->date('start_date'); //تاريخ بداية الإجازة
            $table->date('end_date'); //تاريخ نهاية الإجازة
            $table->unsignedSmallInteger('days'); //عدد أيام الإجازة
            $table->text('reason')->nullable(); //سبب الإجازة
            $table->string('status')->default('pending'); //pending, approved, rejected //الحالة
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete(); //تمت المراجعة بواسطة
            $table->timestamp('reviewed_at')->nullable(); //تمت المراجعة في
            $table->text('review_note')->nullable(); //ملاحظات المراجعة
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
