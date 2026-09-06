import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    DialogFooter,
    DialogHeader,
    DialogClose,
    DialogContent,
    DialogTitle,
    Dialog,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Employee, LeaveType } from '@/types/hr';
import { useForm } from '@inertiajs/react';

import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Props {
    employees: Employee[];
    leaveTypes: LeaveType[];
    onClose: () => void;
}

export default function addLeaveRequest({
    employees,
    leaveTypes,
    onClose,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/leave-requests', {
            onSuccess: () => {
                onClose();
                toast.success('Leave request created successfully.');
                reset();
            },
        });
    };

    return (
        <div className="p-4">
            <Dialog open onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Leave Request</DialogTitle>
                    </DialogHeader>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Employee</Label>

                            <Select
                                value={data.employee_id}
                                onValueChange={(value) =>
                                    setData('employee_id', value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Employee..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {employees.map((employee) => (
                                            <SelectItem
                                                key={employee.id}
                                                value={employee.id.toString()}
                                            >
                                                {employee.first_name}{' '}
                                                {employee.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <InputError message={errors.employee_id} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Select
                                value={data.leave_type_id}
                                onValueChange={(value) =>
                                    setData('leave_type_id', value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Leave Type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {leaveTypes.map((leaveType) => (
                                            <SelectItem
                                                key={leaveType.id}
                                                value={leaveType.id.toString()}
                                            >
                                                {leaveType.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.leave_type_id} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    type="date"
                                    id="start_date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData('start_date', e.target.value)
                                    }
                                />
                                <InputError message={errors.start_date} />
                            </div>
                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    type="date"
                                    id="end_date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                />
                                <InputError message={errors.end_date} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Textarea
                                id="reason"
                                placeholder="Optional Description"
                                value={data.reason}
                                onChange={(e) =>
                                    setData('reason', e.target.value)
                                }
                            />
                            <InputError message={errors.reason} />
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Submitting...' : 'Submit'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
