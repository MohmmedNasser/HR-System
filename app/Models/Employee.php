<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute as CastsAttribute;

#[Fillable(['user_id', 'first_name', 'last_name', 'email', 'phone','position_id', 'department_id', 'manager_id', 'hire_date', 'employment_status', 'salary', 'avatar_path', 'address'])]
class Employee extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory;


    protected function casts(): array
    {
        return [
            'hire_date' => 'date',
            'salary' => 'decimal:2',
        ];
    }

    protected function fullName(): CastsAttribute
    {
        return CastsAttribute::make(
            get: fn() => "{$this->first_name} {$this->last_name}",
        );
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }


    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function reports()
    {
        return $this->hasMany(Employee::class, 'manager_id');
    }


    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }


    public function leaveBalances()
    {
        return $this->hasMany(LeaveBalance::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }


    public function payslips()
    {
        return $this->hasMany(Payslip::class);
    }

}
