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

import type {
    Position,
    Paginated,
    SearchFilters,
    Department,
} from '@/types/hr';
import AddPosition from './add';
import EditPosition from './edit';

interface DepartmentsIndexProps {
    positions: Paginated<Position>;
    departments: Pick<Department, 'id' | 'name'>[];
    filters: SearchFilters;
}

export default function Positions({
    positions,
    departments,
    filters,
}: DepartmentsIndexProps) {
    const [showCreate, setShowCreate] = useState(false);
    const [editingPosition, setEditingPosition] = useState<Position | null>(
        null,
    );
    const [search, setSearch] = useState(filters.search ?? '');
    const [showDelete, setShowDelete] = useState(false);
    const [deletingPosition, setDeletingPosition] = useState<Position | null>(
        null,
    );

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/positions',
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
            '/positions',
            {}, //query parameters
            {
                preserveState: true,
            },
        );
    };

    const handleDeleteClick = (position: Position) => {
        setDeletingPosition(position);
        setShowDelete(true);
    };

    const confirmDelete = () => {
        if (!deletingPosition) {
            return;
        }

        router.delete(`/positions/${deletingPosition.id}`, {
            onSuccess: () => {
                setShowDelete(false);
                setDeletingPosition(null);
                toast.success('Department deleted successfully');
            },
        });
    };

    const handleClose = () => {
        setShowCreate(false);
        setEditingPosition(null);
    };

    return (
        <>
            <Head title="Positions" />
            <div className="min-h-screen p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Positions</h1>
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Position
                    </Button>
                </div>
                <div>
                    <form
                        action=""
                        onSubmit={(e) => submitSearch(e)}
                        className="mb-4 flex gap-2"
                    >
                        <div className="relative max-w-xs flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title"
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

                {positions.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                        <Building2 className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">No positions yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create your first position to organise the company.
                        </p>
                        <Button
                            className="mt-4"
                            onClick={() => setShowCreate(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Position
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/40">
                                    <tr className="">
                                        <th className="px-3 py-3 text-left font-medium">
                                            Title
                                        </th>
                                        <th className="px-3 py-3 text-left font-medium">
                                            Department
                                        </th>
                                        <th className="px-3 py-3 text-left font-medium">
                                            Employee
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/30">
                                    {positions.data.map((position) => (
                                        <tr key={position.id} className="">
                                            <td className="px-4 py-3 text-left font-medium">
                                                {position.title}
                                            </td>
                                            <td className="px-4 py-3 text-left text-muted-foreground">
                                                {position.department?.name ??
                                                    '-'}
                                            </td>
                                            <td className="px-4 py-3 text-left">
                                                {position.employees_count ?? 0}
                                            </td>
                                            <td className="px-4 py-3 text-end">
                                                <Button
                                                    variant="ghost"
                                                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                                                    onClick={() => {
                                                        setEditingPosition(
                                                            position,
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
                                                            position,
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

                        {positions.last_page > 1 && (
                            <div className="mt-6 flex justify-center gap-1">
                                {positions.links.map((link, i) =>
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
                    <AddPosition
                        onClose={handleClose}
                        departments={departments}
                    />
                )}
                {editingPosition && (
                    <EditPosition
                        onClose={handleClose}
                        position={editingPosition}
                        departments={departments}
                    />
                )}
            </div>

            <AlertDialog
                open={!!showDelete}
                onOpenChange={() => setShowDelete(false)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Position</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the position{' '}
                            <strong>{deletingPosition?.title}</strong>?
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

Positions.layout = {
    breadcrumbs: [
        {
            title: 'Positions',
            href: '/positions',
        },
    ],
};
