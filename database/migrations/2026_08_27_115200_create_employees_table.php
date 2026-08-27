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
        Schema::create('employees', function (Blueprint $table) { //الموظفين
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); //المستخدم
            $table->string('first_name'); //الاسم الأول
            $table->string('last_name'); //الاسم الأخير
            $table->string('email')->unique(); //البريد الإلكتروني
            $table->string('phone')->nullable(); //رقم الهاتف
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete(); //القسم
            $table->foreignId('position_id')->nullable()->constrained()->nullOnDelete(); //المسمى الوظيفي
            $table->foreignId('manager_id')->nullable()->constrained('employees')->nullOnDelete(); //المدير
            $table->date('hire_date'); //تاريخ التعيين
            $table->string('employment_status')->default('active'); //active, on_leave, terminated //الحالة الوظيفية
            $table->decimal('salary', 12, 2)->default(0); //الراتب
            $table->string('avatar_path')->nullable(); //مسار الصورة
            $table->text('address')->nullable(); //العنوان
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
