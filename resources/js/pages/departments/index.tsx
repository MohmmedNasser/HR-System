import { Head, Link, router } from '@inertiajs/react';
import { Building2, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { Department, Paginated, SearchFilters } from '@/types/hr';
import AddDepartment from './add';
import EditDepartment from './edit';

interface DepartmentsIndexProps {
    departments: Paginated<Department>;
    filters: SearchFilters;
}

export default function Departments({
    departments,
    filters,
}: DepartmentsIndexProps) {
    const [showCreate, setShowCreate] = useState(false);
    const [editingDepartment, setEditingDepartment] =
        useState<Department | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');
    const [showDelete, setShowDelete] = useState(false);
    const [deletingDepartment, setDeletingDepartment] =
        useState<Department | null>(null);

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/departments',
            { search },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearSearch = () => {
        setSearch('');
        router.get(
            '/departments',
            {}, //query parameters
            {
                preserveState: true,
            },
        );
    };

    const handleDeleteClick = (department: Department) => {
        setDeletingDepartment(department);
        setShowDelete(true);
    };

    const confirmDelete = () => {
        if (!deletingDepartment) {
            return;
        }

        router.delete(`/departments/${deletingDepartment.id}`, {
            onSuccess: () => {
                setShowDelete(false);
                setDeletingDepartment(null);
                toast.success('Department deleted successfully');
            },
        });
    };

    const handleClose = () => {
        setShowCreate(false);
        setEditingDepartment(null);
    };

    return (
        <>
            <Head title="Departments" />
            <div className="min-h-screen p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Departments</h1>
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Department
                    </Button>
                </div>
                <div>
                    <form
                        action=""
                        onSubmit={(e) => submitSearch(e)}
                        className="mb-4 flex gap-2"
                    >
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or code..."
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
                </div>

                {departments.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                        <Building2 className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">No departments yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create your first department to organise the
                            company.
                        </p>
                        <Button
                            className="mt-4"
                            onClick={() => setShowCreate(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Department
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/40">
                                    <tr className="">
                                        <th className="px-3 py-3 text-left font-medium">
                                            Name
                                        </th>
                                        <th className="px-3 py-3 text-left font-medium">
                                            Code
                                        </th>
                                        <th className="px-3 py-3 text-left font-medium">
                                            Positions
                                        </th>
                                        <th className="px-3 py-3 text-left font-medium">
                                            Employees
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/30">
                                    {departments.data.map((department) => (
                                        <tr key={department.id} className="">
                                            <td className="px-4 py-3 text-left font-medium">
                                                {department.name}
                                            </td>
                                            <td className="px-4 py-3 text-left text-muted-foreground">
                                                {department.code ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-left">
                                                {department.positions_count ??
                                                    0}
                                            </td>
                                            <td className="px-4 py-3">
                                                {department.employees_count ??
                                                    0}
                                            </td>
                                            <td className="px-4 py-3 text-end">
                                                <Button
                                                    variant="ghost"
                                                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                                                    onClick={() => {
                                                        setEditingDepartment(
                                                            department,
                                                        );
                                                    }}
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
                                                        handleDeleteClick(
                                                            department,
                                                        );
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

                        {departments.last_page > 1 && (
                            <div className="mt-6 flex justify-center gap-1">
                                {departments.links.map((link, i) =>
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

                {showCreate && <AddDepartment onClose={handleClose} />}
                {editingDepartment && (
                    <EditDepartment
                        onClose={handleClose}
                        department={editingDepartment}
                    />
                )}
            </div>

            <AlertDialog
                open={!!showDelete}
                onOpenChange={() => setShowDelete(false)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the department{' '}
                            <strong>{deletingDepartment?.name}</strong>?
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

Departments.layout = {
    breadcrumbs: [
        {
            title: 'Departments',
            href: '/departments',
        },
    ],
};
