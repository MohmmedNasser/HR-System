import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { money } from '@/lib/utils';
import { Paginated, Payslip } from '@/types/hr';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FileText, Receipt } from 'lucide-react';
import { toast } from 'sonner';

interface PayslipIndex {
    payslips: Paginated<Payslip>;
    employees: { id: number; first_name: string; last_name: string }[];
    filters: { employee?: string };
}

export default function PayslipIndex({
    payslips,
    employees,
    filters,
}: PayslipIndex) {
    const runForm = useForm({
        month: new Date().toISOString().slice(0, 7),
    });

    function runPayroll(e: React.FormEvent) {
        e.preventDefault();
        runForm.post('/payslips', {
            onSuccess: () => {
                runForm.reset();
                toast.success('Payroll run complete');
            },
        });
    }

    function filterEmployee(employee: string) {
        router.get(
            '/payslips',
            { employee: employee || undefined },
            { preserveScroll: true, preserveState: true },
        );
    }
    return (
        <>
            <Head title="Payslips" />
            <div className="min-h-screen p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Payslips</h1>
                </div>

                <div className="mb-4 rounded-xl border p-4">
                    <form
                        onSubmit={runPayroll}
                        className="mb-4 flex flex-wrap items-end gap-3"
                    >
                        <div>
                            <Label htmlFor="ps-month">Pay period (month)</Label>
                            <Input
                                id="ps-month"
                                type="month"
                                value={runForm.data.month}
                                onChange={(e) =>
                                    runForm.setData('month', e.target.value)
                                }
                                className="w-auto"
                            />
                        </div>
                        <Button type="submit" disabled={runForm.processing}>
                            <Receipt className="mr-2 h-4 w-4" />
                            {runForm.processing ? 'Running…' : 'Run Payroll'}
                        </Button>
                    </form>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Generates a payslip for every active employee (skips
                        ones already run).
                    </p>
                </div>

                <div className="mb-4">
                    <Select
                        value={filters.employee ?? ''}
                        onValueChange={(value) => filterEmployee(value)}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All employees</SelectItem>
                            {employees.map((emp) => (
                                <SelectItem
                                    key={emp.id}
                                    value={emp.id.toString()}
                                >
                                    {emp.first_name} {emp.last_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {payslips.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                        <Receipt className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">No payslips yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Run payroll above to generate this month&apos;s
                            payslips.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/40">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Employee
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Period
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Gross
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Deductions
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Net
                                        </th>
                                        <th className="px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {payslips.data.map((payslip) => (
                                        <tr
                                            key={payslip.id}
                                            className="hover:bg-muted/20"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {payslip.employee?.full_name ??
                                                    '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {payslip.period_start.slice(
                                                    0,
                                                    10,
                                                )}{' '}
                                                →{' '}
                                                {payslip.period_end.slice(
                                                    0,
                                                    10,
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {money(payslip.gross_pay)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">
                                                −{money(payslip.deductions)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold">
                                                {money(payslip.net_pay)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <a
                                                    href={`/payslips/${payslip.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center text-sm text-primary hover:underline"
                                                >
                                                    <FileText className="mr-1 h-4 w-4" />{' '}
                                                    View / Print
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {payslips.last_page > 1 && (
                            <div className="mt-6 flex justify-center gap-1">
                                {payslips.links.map((link, i) =>
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`rounded px-3 py-1.5 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="rounded px-3 py-1.5 text-sm opacity-40"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

PayslipIndex.layout = {
    breadcrumbs: [
        {
            title: 'Payslips',
            href: '/payslips',
        },
    ],
};
