import { Input } from '@/components/ui/input';
import { Head, router } from '@inertiajs/react';
import { CalendarCheck } from 'lucide-react';
import { useState } from 'react';

interface TimesheetRecord {
    id: number;
    employee: string | null;
    department: string | null;
    clock_in: string | null;
    clock_out: string | null;
    status: string;
    hours: number | null;
}

interface TimesheetSummary {
    present: number;
    late: number;
    total_hours: number;
}

interface TimesheetsProps {
    date: string;
    record: TimesheetRecord[];
    summary: TimesheetSummary;
}

export default function Timesheets({ date, record, summary }: TimesheetsProps) {
    const changeDate = (value: string) => {
        router.get(
            '/attendance/timesheets',
            { date: value },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const statusStyles: Record<string, string> = {
        present: 'bg-green-100 text-green-800',
        absent: 'bg-red-100 text-red-800',
        late: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <>
            <Head title="Timesheets" />

            <div className="min-h-screen p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold capitalize">
                        Timesheets
                    </h1>

                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="ts-date"
                            className="text-sm text-muted-foreground"
                        >
                            Date
                        </label>
                        <Input
                            id="ts-date"
                            type="date"
                            value={date}
                            onChange={(e) => changeDate(e.target.value)}
                            className="w-auto"
                        />
                    </div>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <SummaryCard label="Present" value={summary.present} />
                    <SummaryCard label="Late" value={summary.late} />
                    <SummaryCard
                        label="Total hours"
                        value={summary.total_hours}
                    />
                </div>

                {record.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                        <CalendarCheck className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">
                            No attendance for this day
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pick another date to see recorded hours.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Employee
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Department
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Clock in
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Clock out
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Hours
                                    </th>
                                    <th className="px-4 py-3 text-end font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {record.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-muted/20"
                                    >
                                        <td className="px-4 py-3">
                                            {row.employee ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {row.department ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {row.clock_in ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {row.clock_out ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {row.hours ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-end capitalize">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[row.status]}`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-md border bg-card p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}

Timesheets.layout = {
    breadcrumbs: [
        {
            title: 'Timesheets',
            href: '/attendance/timesheets',
        },
    ],
};
