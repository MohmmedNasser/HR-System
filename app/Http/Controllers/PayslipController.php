<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Payslip;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\View\View;

class PayslipController extends Controller
{
    public function index(Request $request)
    {
        $query = Payslip::with('employee')->latest('period_end');

        if ($request->filled('employee')) {
            $query->where('employee_id', $request->integer('employee'));
        }

        return Inertia::render('payslips/index', [
            'payslips' => $query->paginate(15)->withQueryString(),
            'employees' => Employee::orderBy('first_name')->get(['id', 'first_name', 'last_name']),
            'filters' => $request->only(['employee']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'month' => ['required', 'date_format:Y-m'],
        ]);

        $period = Carbon::createFromFormat('Y-m', $data['month']);
        $start = $period->copy()->startOfMonth();
        $end = $period->copy()->endOfMonth();

        $created = 0;

        Employee::where('employment_status', 'active')->each(function ($employee) use ($start, $end, &$created) {

            $exists = $employee->payslips()->whereDate('period_start', $start->toDateString())->exists();

            if ($exists) {
                return;
            }

            $gross = round((float) $employee->salary / 12, 2);
            $deductions = round($gross * 0.2, 2);

            $employee->payslips()->create([
                'period_start' => $start,
                'period_end' => $end,
                'gross_pay' => $gross,
                'deductions' => $deductions,
                'net_pay' => $gross - $deductions,
                'issued_at' => now(),
            ]);

            $created++;
        });

        return back()->with('flash', 'Generated ' .  $created . ' payslip(s).');
    }

    public function show(Payslip $payslip): View
    {
        $payslip->load('employee.department', 'employee.position');
        return view('payslips.show', [
            'payslip' => $payslip,
        ]);
    }
}
