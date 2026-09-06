import { Button } from '@/components/ui/button';
import { Auth } from '@/types';
import type { Paginated } from '@/types/hr';
import type { Employee, LeaveRequest, LeaveType } from '@/types/hr';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarClock, Check, Plus, X } from 'lucide-react';
import { useState } from 'react';
import AddLeaveRequest from './add';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface LeaveRequestsProps {
    leaveRequests: Paginated<LeaveRequest>;
    employees: Employee[];
    leaveTypes: LeaveType[];
    filters: Record<string, string>;
}

export default function LeaveRequests({
    leaveRequests,
    employees,
    leaveTypes,
    filters,
}: LeaveRequestsProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const canReview = ['admin', 'hr', 'manager'].includes(
        auth.user?.role as string,
    );

    const [showCreate, setShowCreate] = useState(false);
    const [showNoteDialog, setShowNoteDialog] = useState(false);

    const [rejectingRequestId, setRejectingRequestId] = useState<number | null>(
        null,
    );
    const [rejectNote, setRejectNote] = useState('');

    const statusStyles: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
    };

    const approve = (request: LeaveRequest) => {
        router.patch(
            `/leave-requests/${request.id}/approve`,
            {},
            {
                onSuccess: () => {
                    toast.success('Leave request approved.');
                },
            },
        );
    };

    const openRejectDialog = (request: LeaveRequest) => {
        setRejectingRequestId(request.id);
        setShowNoteDialog(true);
    };

    const handleCloseNoteDialog = () => {
        setRejectNote('');
        setRejectingRequestId(null);
        setShowNoteDialog(false);
    };

    const reject = () => {
        router.patch(
            `/leave-requests/${rejectingRequestId}/reject`,
            {
                note: rejectNote,
            },

            {
                onSuccess: () => {
                    toast.success('Leave request rejected.');
                    setShowNoteDialog(false);
                    setRejectingRequestId(null);
                    setRejectNote('');
                },
            },
        );
    };

    const filterStatus = (status: string) => {
        router.get(
            '/leave-requests',
            {
                status: status || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Leave Requests" />
            <div className="min-h-screen p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Leave Requests</h1>
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                </div>

                <div className="mb-4 flex gap-2">
                    {['', 'pending', 'approved', 'rejected'].map((status) => (
                        <Button
                            key={status || 'all'}
                            className="rounded-full capitalize"
                            variant={
                                (!status && !filters.status) ||
                                filters.status === status
                                    ? 'default'
                                    : 'secondary'
                            }
                            onClick={() => filterStatus(status)}
                        >
                            {status || 'all'}
                        </Button>
                    ))}
                </div>

                {leaveRequests.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                        <CalendarClock className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">No leave requests</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Requests submitted by staff will show up here.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-xl border">
                            <div className="rounded-xl border">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/40">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Employee
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Type
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Dates
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Days
                                            </th>
                                            <th className="px-4 py-3 text-center font-medium">
                                                Status
                                            </th>
                                            <th className="px-4 py-3" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {leaveRequests.data.map((request) => (
                                            <tr
                                                key={request.id}
                                                className="hover:bg-muted/20"
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    {request.employee ? (
                                                        <Link
                                                            href={`/employees/${request.employee.id}`}
                                                            className="hover:underline"
                                                        >
                                                            {
                                                                request.employee
                                                                    .full_name
                                                            }
                                                        </Link>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {request.leave_type?.name ??
                                                        '—'}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {request.start_date.slice(
                                                        0,
                                                        10,
                                                    )}{' '}
                                                    →{' '}
                                                    {request.end_date.slice(
                                                        0,
                                                        10,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {request.days}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[request.status]}`}
                                                    >
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {canReview &&
                                                        request.status ===
                                                            'pending' && (
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        approve(
                                                                            request,
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                                                                >
                                                                    <Check className="mr-1 h-3 w-3" />{' '}
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        openRejectDialog(
                                                                            request,
                                                                        );
                                                                    }}
                                                                    className="inline-flex items-center rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                                                                >
                                                                    <X className="mr-1 h-3 w-3" />{' '}
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {leaveRequests.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-1">
                                {leaveRequests.links.map((link, i) =>
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

                {showCreate && (
                    <AddLeaveRequest
                        employees={employees}
                        leaveTypes={leaveTypes}
                        onClose={() => setShowCreate(false)}
                    />
                )}

                {showNoteDialog && (
                    <Dialog
                        open={showNoteDialog}
                        onOpenChange={() => {
                            handleCloseNoteDialog();
                        }}
                    >
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                reject();
                            }}
                        >
                            <DialogContent className="sm:max-w-sm">
                                <DialogHeader>
                                    <DialogTitle>
                                        Reason for rejection
                                    </DialogTitle>
                                    <DialogDescription>
                                        Please provide a reason for rejecting
                                        this leave request.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mb-3">
                                    <Label htmlFor="note">
                                        Note{' '}
                                        <span className="text-muted-foreground">
                                            (optional)
                                        </span>
                                    </Label>
                                    <Textarea
                                        value={rejectNote}
                                        onChange={(e) =>
                                            setRejectNote(e.target.value)
                                        }
                                        id="note"
                                        name="note"
                                        className="mt-1 min-h-20 w-full"
                                    />
                                </div>
                                <DialogFooter className="gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCloseNoteDialog}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Reject
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                )}
            </div>
        </>
    );
}

LeaveRequests.layout = {
    breadcrumbs: [
        {
            title: 'Leave Requests',
            href: '/leave-requests',
        },
    ],
};
