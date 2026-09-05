import { FormEvent, useState } from 'react';
import type { Department, Employee, Paginated, Position } from '@/types/hr';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AddEmployee from './add';
import EditEmployee from './edit';
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

interface Filters {
    search: string;
    department: string;
    status: string;
}

interface Props {
    employees: Paginated<Employee>;
    departments: Pick<Department, 'id' | 'name'>[];
    positions: Pick<Position, 'id' | 'title' | 'department_id'>[];
    managers: {
        id: number;
        first_name: string;
        last_name: string;
    }[];
    filters: Filters;
}

const statusStyles: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    on_leave: 'bg-amber-100 text-amber-700',
    terminated: 'bg-red-100 text-red-700',
};

export default function Employees({
    employees,
    departments,
    positions,
    managers,
    filters,
}: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(
        null,
    );

    const [showDelete, setShowDelete] = useState(false);
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
        null,
    );

    const [search, setSearch] = useState(filters.search ?? '');

    const employeeStatuses = [
        {
            id: 'active',
            name: 'Active',
        },
        {
            id: 'on_leave',
            name: 'On Leave',
        },
        {
            id: 'terminated',
            name: 'Terminated',
        },
    ];

    function openEdit(employee: Employee) {
        setEditingEmployee(employee);
    }

    const handleDeleteClick = (employee: Employee) => {
        setDeletingEmployee(employee);
        setShowDelete(true);
    };

    function confirmDelete() {
        if (!deletingEmployee) {
            return;
        }
        router.delete(`/employees/${deletingEmployee.id}`, {
            onSuccess: () => {
                toast.success(
                    `Employee ${deletingEmployee.first_name} ${deletingEmployee.last_name} deleted.`,
                );
            },
        });
    }

    function applyFilters(next: Filters) {
        router.get(
            '/employees',
            {
                search: next.search || undefined,
                department: next.department || undefined,
                status: next.status || undefined,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    const clearSearch = () => {
        setSearch('');
        router.get(
            '/employees',
            {
                search: '',
                department: filters.department,
                status: filters.status,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleClose = () => {
        setShowCreate(false);
        setEditingEmployee(null);
    };

    return (
        <>
            <Head title="Employees" />
            <div className="min-h-screen p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Employees</h1>
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                    </Button>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                    <form
                        action=""
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilters({ ...filters, search });
                        }}
                        className="mb-4 flex gap-2"
                    >
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name or email…"
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                        {filters.search && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={clearSearch}
                            >
                                <X className="mr-1 h-4 w-4" /> Clear
                            </Button>
                        )}
                    </form>

                    <Select
                        value={filters.department ?? ''}
                        onValueChange={(value) =>
                            applyFilters({ ...filters, department: value })
                        }
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All Departments..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="">
                                    All Departments
                                </SelectItem>
                                {departments.map((department) => (
                                    <SelectItem
                                        key={department.id}
                                        value={department.id.toString()}
                                    >
                                        {department.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.status ?? ''}
                        onValueChange={(value) =>
                            applyFilters({ ...filters, status: value })
                        }
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Any Status..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="">Any Status</SelectItem>
                                {employeeStatuses.map((status) => (
                                    <SelectItem
                                        key={status.id}
                                        value={status.id}
                                    >
                                        {status.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {employees.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                        <Users className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">No employees found</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Add your first team member to get started.
                        </p>
                        <Button
                            className="mt-4"
                            onClick={() => setShowCreate(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Employee
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {employees.data.map((employee) => (
                                <div
                                    key={employee.id}
                                    className="flex flex-col rounded-xl border p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <Avatar employee={employee} />
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/employees/${employee.id}`}
                                                className="font-semibold hover:underline"
                                            >
                                                {employee.full_name}
                                            </Link>
                                            <p className="truncate text-sm text-muted-foreground">
                                                {employee.position?.title ??
                                                    'No position'}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {employee.department?.name ??
                                                    '—'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[employee.employment_status]}`}
                                        >
                                            {employee.employment_status.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    openEdit(employee)
                                                }
                                                className="text-muted-foreground hover:text-foreground"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteClick(employee)
                                                }
                                                className="text-muted-foreground hover:text-destructive"
                                                title="Remove"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {showCreate && (
                    <AddEmployee
                        onClose={handleClose}
                        departments={departments}
                        positions={positions}
                        managers={managers}
                        employeeStatuses={employeeStatuses}
                    />
                )}

                {editingEmployee && (
                    <EditEmployee
                        onClose={handleClose}
                        departments={departments}
                        positions={positions}
                        managers={managers}
                        employeeStatuses={employeeStatuses}
                        employee={editingEmployee}
                    />
                )}
            </div>

            <AlertDialog
                open={!!showDelete}
                onOpenChange={() => setShowDelete(false)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the employee{' '}
                            <strong>{deletingEmployee?.full_name}</strong>?
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

Employees.layout = {
    breadcrumbs: [
        {
            title: 'Employees',
            href: '/employees',
        },
    ],
};

function Avatar({ employee }: { employee: Employee }) {
    const initials =
        `${employee.first_name[0] ?? ''}${employee.last_name[0] ?? ''}`.toUpperCase();

    if (employee.avatar_url) {
        return (
            <img
                src={employee.avatar_url}
                alt={employee.full_name}
                className="h-12 w-12 rounded-full object-cover"
            />
        );
    }

    return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            {initials}
        </div>
    );
}
