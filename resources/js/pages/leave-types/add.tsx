import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AddLeaveType({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        default_days_per_year: 0,
        is_paid: true,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/leave-types', {
            onSuccess: () => {
                onClose();
                toast.success('Leave type created.');
                reset();
            },
        });
    };

    return (
        <div className="p-4">
            <Dialog open onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Leave Type</DialogTitle>
                    </DialogHeader>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Annual Leave"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="default_days_per_year">
                                Default days per year
                            </Label>
                            <Input
                                id="default_days_per_year"
                                placeholder="eg. 20"
                                type="number"
                                value={data.default_days_per_year}
                                min={0}
                                max={365}
                                onChange={(e) =>
                                    setData(
                                        'default_days_per_year',
                                        Number(e.target.value),
                                    )
                                }
                            />
                            {errors.default_days_per_year && (
                                <p className="text-sm text-red-500">
                                    {errors.default_days_per_year}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_paid"
                                    checked={data.is_paid}
                                    onChange={(e) =>
                                        setData('is_paid', e.target.checked)
                                    }
                                />
                                <Label htmlFor="is_paid">Is Paid</Label>
                            </div>
                            {errors.is_paid && (
                                <p className="text-sm text-red-500">
                                    {errors.is_paid}
                                </p>
                            )}
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
                                {processing ? 'Creating...' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
