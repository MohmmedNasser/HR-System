import { Button } from '@/components/ui/button';
import { LeaveType } from '@/types/hr';
import { Head, router } from '@inertiajs/react';
import { CalendarClock, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AddLeaveType from './add';
import { toast } from 'sonner';
import EditLeaveType from './edit';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface LeaveTypesIndexProps {
    leaveTypes: (LeaveType & { leave_requests_count: number })[];
}

export default function LeaveTypes({ leaveTypes }: LeaveTypesIndexProps) {
    const [showCreate, setShowCreate] = useState(false);
    const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(
        null,
    );
    const [showDelete, setShowDelete] = useState(false);

    const [deletingLeaveType, setDeletingLeaveType] =
        useState<LeaveType | null>(null);

    const handleDeleteClick = (leaveType: LeaveType) => {
        setDeletingLeaveType(leaveType);
        setShowDelete(true);
    };

    const confirmDelete = () => {
        if (!deletingLeaveType) {
            return;
        }

        router.delete(`/leave-types/${deletingLeaveType.id}`, {
            onSuccess: () => {
                setShowDelete(false);
                setDeletingLeaveType(null);
                toast.success('Leave type deleted successfully');
            },
        });
    };

    return (
        <>
            <Head title="Leave Types" />

            <div className="min-h-screen p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Leave Types</h1>
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Leave Type
                    </Button>
                </div>

                {leaveTypes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                        <CalendarClock className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">No leave types yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Define the kinds of leave staff can request.
                        </p>
                        <Button
                            className="mt-4"
                            onClick={() => setShowCreate(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Leave Type
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-lg border border-sidebar-border/60 dark:border-sidebar-border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="px-3 py-3 text-left font-medium">
                                        Name
                                    </th>
                                    <th className="px-3 py-3 text-start font-medium">
                                        Days / Year
                                    </th>
                                    <th className="px-3 py-3 text-left font-medium">
                                        Paid
                                    </th>
                                    <th className="px-3 py-3 text-left font-medium">
                                        Requests
                                    </th>
                                    <th className="px-3 py-3 text-end font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveTypes.map((lt) => (
                                    <tr key={lt.id}>
                                        <td className="px-4 py-3 text-left font-medium">
                                            {lt.name}
                                        </td>
                                        <td className="px-4 py-3 text-left font-medium">
                                            {lt.default_days_per_year}
                                        </td>
                                        <td className="px-4 py-3 text-left font-medium">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    lt.is_paid
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {lt.is_paid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-left font-medium">
                                            {lt.leave_requests_count}
                                        </td>
                                        <td className="px-4 py-3 text-end font-medium">
                                            <Button
                                                variant="ghost"
                                                className="cursor-pointer text-muted-foreground hover:text-foreground"
                                                onClick={() =>
                                                    setEditingLeaveType(lt)
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Edit
                                                </span>
                                            </Button>
                                            <Button
                                                className="cursor-pointer text-muted-foreground hover:text-red-500"
                                                variant="ghost"
                                                onClick={() => {
                                                    handleDeleteClick(lt);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Delete
                                                </span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showCreate && (
                    <AddLeaveType onClose={() => setShowCreate(false)} />
                )}

                {editingLeaveType && (
                    <EditLeaveType
                        leaveType={editingLeaveType}
                        onClose={() => setEditingLeaveType(null)}
                    />
                )}
            </div>

            <AlertDialog
                open={!!showDelete}
                onOpenChange={() => setShowDelete(false)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Leave Type</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the Leave Type{' '}
                            <strong>{deletingLeaveType?.name}</strong>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

LeaveTypes.layout = {
    breadcrumbs: [
        {
            title: 'Leave Types',
            href: '/leave-types',
        },
    ],
};
