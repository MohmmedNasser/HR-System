import { Head } from '@inertiajs/react';
import { DollarSign, Download, Users } from 'lucide-react';

interface ReportCard {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
}

export default function Reports() {
    const reports: ReportCard[] = [
        {
            title: 'Employees',
            description: 'All employees, active and inactive.',
            href: '/reports/employees',
            icon: <Users className="h-5 w-5" />,
        },
        {
            title: 'Payroll',
            description:
                'Complete payroll history including salaries, deductions, and net pay.',
            href: '/reports/payroll',
            icon: <DollarSign className="h-5 w-5" />,
        },
    ];
    return (
        <>
            <Head title="Reports" />
            <div className="min-h-screen p-6">
                <div className="mb-4 flex flex-col items-start">
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <p className="text-muted-foreground">
                        Download HR data as CSV for spreadsheets and audits.
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {reports.map((report) => (
                        <div
                            key={report.href}
                            className="flex flex-col rounded-xl border p-5"
                        >
                            <div className="flex items-center gap-2 text-muted-foreground">
                                {report.icon}
                                <span className="font-semibold text-foreground">
                                    {report.title}
                                </span>
                            </div>
                            <p className="mt-2 flex-1 text-sm text-muted-foreground">
                                {report.description}
                            </p>
                            <a
                                href={report.href}
                                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                <Download className="mr-2 h-4 w-4" /> Download
                                CSV
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

Reports.layout = {
    breadcrumbs: [
        {
            title: 'Reports',
            href: '/reports',
        },
    ],
};
