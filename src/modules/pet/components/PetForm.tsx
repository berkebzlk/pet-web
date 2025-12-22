import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Gender, PetType, Pet } from '../types/pet.types';
import { useCreatePet, useUpdatePet, useDeletePet } from '../hooks/usePets';

const petSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    type: z.nativeEnum(PetType),
    breed: z.string().optional().nullable(),
    gender: z.nativeEnum(Gender),
    birthDate: z.string().refine((date) => new Date(date) <= new Date(), {
        message: 'Birth date cannot be in the future',
    }),
    weight: z.string().transform((val) => (val ? parseFloat(val) : undefined)).optional().nullable(),
    isNeutered: z.boolean().optional(),
    bio: z.string().optional().nullable(),
    image: z.instanceof(FileList).optional(),
});

type PetFormData = z.infer<typeof petSchema>;

interface PetFormProps {
    onSuccess: () => void;
    initialData?: Pet | null;
}

export function PetForm({ onSuccess, initialData }: PetFormProps) {
    const { t } = useTranslation();
    const { mutate: createPet, isPending: isCreating } = useCreatePet();
    const { mutate: updatePet, isPending: isUpdating } = useUpdatePet();
    const { mutate: deletePet, isPending: isDeleting } = useDeletePet();

    const isPending = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PetFormData>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            type: PetType.DOG,
            gender: Gender.MALE,
            isNeutered: false,
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                type: initialData.type as PetType,
                breed: initialData.breed,
                gender: initialData.gender,
                birthDate: initialData.birthDate.split('T')[0], // Format YYYY-MM-DD
                weight: initialData.weight ? String(initialData.weight) : undefined,
                isNeutered: Boolean(initialData.isNeutered),
                bio: initialData.bio,
            });
        } else {
            reset({
                type: PetType.DOG,
                gender: Gender.MALE,
                isNeutered: false,
            });
        }
    }, [initialData, reset]);

    const handleDelete = () => {
        if (initialData && confirm(t('Are you sure you want to delete this pet?'))) {
            deletePet(initialData.id, {
                onSuccess: () => {
                    onSuccess();
                },
            });
        }
    };

    const onSubmit = (data: PetFormData) => {
        const payload: any = { ...data };
        if (data.image && data.image.length > 0) {
            payload.image = data.image[0];
        } else {
            delete payload.image;
        }

        if (initialData) {
            updatePet(
                { id: initialData.id, data: payload },
                {
                    onSuccess: () => {
                        onSuccess();
                    },
                }
            );
        } else {
            createPet(payload, {
                onSuccess: () => {
                    onSuccess();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ... existing fields ... */}

            {/* Image Upload (Simple) */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Photo</label>
                <input
                    type="file"
                    accept="image/*"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('image')}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('name')}
                    placeholder="Pet's Name"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('type')}
                    >
                        {Object.values(PetType).map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Gender</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('gender')}
                    >
                        <option value={Gender.MALE}>Male</option>
                        <option value={Gender.FEMALE}>Female</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Breed</label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('breed')}
                    placeholder="Golden Retriever, etc."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Birth Date</label>
                <input
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('birthDate')}
                />
                {errors.birthDate && (
                    <p className="text-sm text-destructive">{errors.birthDate.message}</p>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="isNeutered"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    {...register('isNeutered')}
                />
                <label htmlFor="isNeutered" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Neutered / Spayed
                </label>
            </div>

            <div className="flex gap-2">
                {initialData && (
                    <Button
                        type="button"
                        variant="destructive"
                        className="flex-1"
                        onClick={handleDelete}
                        disabled={isDeleting || isPending}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                )}
                <Button type="submit" className="flex-1" disabled={isPending || isDeleting}>
                    {isPending ? 'Saving...' : initialData ? 'Update Pet' : 'Save Pet'}
                </Button>
            </div>
        </form>
    );
}
