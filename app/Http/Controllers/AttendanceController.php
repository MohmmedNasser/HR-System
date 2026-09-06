<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {

        $employee = $request->user()->employee;
        $today = $employee->attendances()->whereDate('work_date', today())->first();

        $recent = $employee->attendances()
            ->latest('work_date')
            ->take(10)
            ->get() ?? collect();

        return inertia('attendance/index', [
            'hasEmployee' => (bool) $employee,
            'today' => $today,
            'recent' => $recent,
        ]);
    }

    public function clockIn(Request $request)
    {
        $employee = $this->currentEmployee($request);

        $attendance = Attendance::firstOrNew([
            'employee_id' => $employee->id,
            'work_date' => today()->toDateString(),
        ]);

        if ($attendance->clock_in) {
            return back()->withErrors(['clock' => 'You have already clocked in for the day.']);
        }


        $now = now()->timezone('Africa/Cairo');
        $attendance->clock_in = $now;
        $attendance->status = (int) $now->format('H') >= 9 ? 'late' : 'present';
        $attendance->save();

        return back();
    }

    public function clockOut(Request $request)
    {
        $employee = $this->currentEmployee($request);

        $attendance = $employee->attendances()->whereDate('work_date', today())->first();

        if (!$attendance || !$attendance->clock_in) {
            return back()->withErrors(['clock' => 'You need to clock in first.']);
        }

        if ($attendance->clock_out) {
            return back()->withErrors(['clock' => 'You have already clocked out for the day.']);
        }

        $attendance->update(['clock_out' => now()->timezone('Africa/Cairo')]);

        return back();
    }



    protected function currentEmployee(Request $request)
    {
        $employee = $request->user()->employee;

        abort_unless($employee, 403, 'Your account is not linked to an employee record.');

        return $employee;
    }
}
