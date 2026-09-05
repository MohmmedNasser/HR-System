import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Department, Employee, Position } from '@/types/hr';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { toast } from 'sonner';

interface EmployeeFormProps {
    onClose: () => void;
    departments: Pick<Department, 'id' | 'name'>[];
    positions: Pick<Position, 'id' | 'title'>[];
    managers: { id: number; first_name: string; last_name: string }[];
    employeeStatuses: {
        id: string;
        name: string;
    }[];
    employee: Employee;
}

interface EmployeeFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    department_id: string;
    position_id: string;
    manager_id: string;
    hire_date: string;
    employment_status: string;
    salary: string;
    address: string;
    avatar: File | null;
}

export default function EditEmployee({
    onClose,
    departments,
    positions,
    managers,
    employeeStatuses,
    employee,
}: EmployeeFormProps) {
    const { data, setData, post, transform, processing, errors, reset } =
        useForm<EmployeeFormData>({
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            phone: employee.phone ?? '',
            department_id: employee.department_id
                ? String(employee.department_id)
                : '',
            position_id: employee.position_id
                ? String(employee.position_id)
                : '',
            manager_id: employee.manager_id ? String(employee.manager_id) : '',
            hire_date: employee.hire_date?.slice(0, 10) ?? '',
            employment_status: employee.employment_status,
            salary: String(employee.salary),
            address: employee.address ?? '',
            avatar: null,
        });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        transform((data) => ({ ...data, _method: 'patch' }));
        post(`/employees/${employee.id}`, {
            forceFormData: true,
            onSuccess: () => {
                onClose();
                toast.success('Employee updated.');
                reset();
            },
        });
    };
    return (
        <div className="p-4">
            <Dialog open onOpenChange={onClose}>
                <DialogContent className="min-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                    </DialogHeader>
                    <div className="no-scrollbar -mx-4 max-h-[80vh] overflow-y-auto px-4">
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={handleSubmit}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="a-first">First name</Label>
                                    <Input
                                        id="a-first"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                        autoFocus
                                        placeholder="Enter first name..."
                                    />
                                    <InputError message={errors.first_name} />
                                </div>
                                <div>
                                    <Label htmlFor="a-last">Last name</Label>
                                    <Input
                                        id="a-last"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                        placeholder="Enter last name..."
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="a-email">Email</Label>
                                    <Input
                                        id="a-email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="Enter email..."
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div>
                                    <Label htmlFor="a-phone">Phone</Label>
                                    <Input
                                        id="a-phone"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        placeholder="Enter phone..."
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="Department">
                                        Department
                                    </Label>

                                    <Select
                                        value={data.department_id}
                                        onValueChange={(value) =>
                                            setData('department_id', value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Department..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="">
                                                    Unassigned
                                                </SelectItem>
                                                {departments.map(
                                                    (department) => (
                                                        <SelectItem
                                                            key={department.id}
                                                            value={department.id.toString()}
                                                        >
                                                            {department.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <InputError
                                        message={errors.department_id}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="Position">Position</Label>

                                    <Select
                                        value={data.position_id}
                                        onValueChange={(value) =>
                                            setData('position_id', value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Position..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="">
                                                    Unassigned
                                                </SelectItem>
                                                {positions.map((position) => (
                                                    <SelectItem
                                                        key={position.id}
                                                        value={position.id.toString()}
                                                    >
                                                        {position.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.position_id} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="Manager">Manager</Label>

                                    <Select
                                        value={data.manager_id}
                                        onValueChange={(value) =>
                                            setData('manager_id', value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Manager..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="">
                                                    None
                                                </SelectItem>
                                                {managers.map((manager) => (
                                                    <SelectItem
                                                        key={manager.id}
                                                        value={manager.id.toString()}
                                                    >
                                                        {manager.first_name}{' '}
                                                        {manager.last_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.manager_id} />
                                </div>
                                <div>
                                    <Label htmlFor="status">Status</Label>

                                    <Select
                                        value={data.employment_status}
                                        onValueChange={(value) =>
                                            setData('employment_status', value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Status..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {employeeStatuses.map(
                                                    (status) => (
                                                        <SelectItem
                                                            key={status.id}
                                                            value={status.id.toString()}
                                                        >
                                                            {status.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <InputError
                                        message={errors.employment_status}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="hireDate">Hire Date</Label>
                                    <Input
                                        type="date"
                                        id="hireDate"
                                        value={data.hire_date}
                                        onChange={(e) =>
                                            setData('hire_date', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.hire_date} />
                                </div>
                                <div>
                                    <Label htmlFor="annualSalary">
                                        Annual Salary
                                    </Label>
                                    <Input
                                        type="number"
                                        id="annualSalary"
                                        value={data.salary}
                                        onChange={(e) =>
                                            setData('salary', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.salary} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div>
                                <Label htmlFor="photo">Photo</Label>
                                <div>
                                    <Input
                                        type="file"
                                        id="photo"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] ?? null;
                                            setData(
                                                'avatar',
                                                file as File | null,
                                            );
                                        }}
                                    />
                                </div>

                                {processing && data.avatar && (
                                    <progress
                                        value={
                                            (data.avatar as any).progress ?? 0
                                        }
                                        max="100"
                                        className="mt-1 w-full"
                                    >
                                        {(data.avatar as any).progress ?? 0}%
                                    </progress>
                                )}

                                <InputError message={(errors as any).avatar} />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="default"
                                    disabled={processing}
                                >
                                    Update
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
