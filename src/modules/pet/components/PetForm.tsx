import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { useTranslation } from 'react-i18next';
import type { Pet } from '@/modules/pet/types/pet.types';
import { Gender, PetType } from '@/modules/pet/types/pet.types';
import { useCreatePet, useUpdatePet, useDeletePet } from '@/modules/pet/hooks/usePets';

const petSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, dots and underscores'),
    type: z.nativeEnum(PetType),
    breed: z.string().optional().nullable(),
    gender: z.nativeEnum(Gender),
    birthDate: z.string().refine((date) => new Date(date) <= new Date(), {
        message: 'Birth date cannot be in the future',
    }),
    weight: z.union([z.string(), z.number(), z.null(), z.undefined()])
        .transform((val) => (val === '' || val === null || val === undefined ? null : Number(val)))
        .optional()
        .nullable(),
    isNeutered: z.boolean().optional(),
    bio: z.string().optional().nullable(),
    image: z.instanceof(FileList).optional(),
});

type PetFormOutput = z.infer<typeof petSchema>;
type PetFormInput = z.input<typeof petSchema>;


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
    } = useForm<PetFormInput, any, PetFormOutput>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            name: initialData?.name || '',
            username: initialData?.username || '',
            type: initialData?.type || PetType.DOG,
            gender: Gender.MALE,
            isNeutered: false,
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                username: initialData.username,
                type: initialData.type as PetType,
                breed: initialData.breed,
                gender: initialData.gender,
                birthDate: initialData.birthDate.split('T')[0], // Format YYYY-MM-DD
                weight: initialData.weight,
                isNeutered: Boolean(initialData.isNeutered),
                bio: initialData.bio,
            });
        } else {
            reset({
                type: PetType.DOG,
                gender: Gender.MALE,
                isNeutered: false,
                bio: '',
                image: undefined
            });
        }
    }, [initialData, reset]);

    const handleDelete = () => {
        if (initialData && confirm(t('pet.deleteConfirm'))) {
            deletePet(initialData.id, {
                onSuccess: () => {
                    onSuccess();
                },
            });
        }
    };

    const onSubmit = (data: PetFormOutput) => {
        const payload: any = {
            ...data,
            image: data.image?.[0] || undefined,
        };

        if (initialData) {
            updatePet({ id: initialData.id, data: payload }, {
                onSuccess: () => {
                    onSuccess();
                }
            });
        } else {
            createPet(payload, {
                onSuccess: () => {
                    onSuccess();
                }
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.photo')}</label>
                <input
                    type="file"
                    accept="image/*"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('image')}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('username')}
                        placeholder="rex_the_dog"
                    />
                    {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('form.name')}</label>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('name')}
                        placeholder={t('form.namePlaceholder')}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('form.type')}</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('type')}
                    >
                        {Object.values(PetType).map((type) => (
                            <option key={type} value={type}>
                                {t(`pet.types.${type}`)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('form.gender')}</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('gender')}
                    >
                        <option value={Gender.MALE}>{t('pet.genders.male')}</option>
                        <option value={Gender.FEMALE}>{t('pet.genders.female')}</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">{t('form.breed')}</label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('breed')}
                    placeholder={t('form.breedPlaceholder')}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('form.birthDate')}</label>
                    <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('birthDate')}
                    />
                    {errors.birthDate && (
                        <p className="text-sm text-destructive">{errors.birthDate.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Kilo (kg)</label>
                    <input
                        type="number"
                        step="0.1"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('weight')}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Biyografi</label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('bio')}
                />
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="isNeutered"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    {...register('isNeutered')}
                />
                <label htmlFor="isNeutered" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('form.isNeutered')}
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
                        {isDeleting ? t('form.deleting') : t('form.delete')}
                    </Button>
                )}
                <Button type="submit" className="flex-1" disabled={isPending || isDeleting}>
                    {isPending ? t('form.saving') : initialData ? t('form.update') : t('form.save')}
                </Button>
            </div>
        </form >
    );
}
