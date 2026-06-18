import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { useCreateVeterinaryProfile } from '../hooks/useVeterinary';

const veterinarySchema = z.object({
    clinicName: z.string().min(2, 'Klinik adı en az 2 karakter olmalıdır'),
    city: z.string().min(2, 'Şehir adı en az 2 karakter olmalıdır'),
    phone: z.string().optional().nullable().or(z.literal('')),
    website: z.string().optional().nullable().or(z.literal('')),
    about: z.string().optional().nullable().or(z.literal('')),
    specialties: z.array(z.string()).optional(),
    profilePhoto: z.any().optional(),
    coverPhoto: z.any().optional(),
});

type VeterinaryFormInput = z.input<typeof veterinarySchema>;
type VeterinaryFormOutput = z.infer<typeof veterinarySchema>;

interface VeterinaryFormProps {
    onSuccess: () => void;
    initialData?: {
        clinicName: string;
        city: string;
        phone?: string | null;
        website?: string | null;
        about?: string | null;
        specialties?: string[];
    };
}

const AVAILABLE_SPECIALTIES = [
    'Kedi',
    'Köpek',
    'Kuş',
    'Cerrahi',
    'Dahiliye',
    'Aşı / Parazit',
    'Diş Sağlığı',
    'Egzotik Hayvanlar',
    'Laboratuvar',
    'Göz Hastalıkları'
];

export function VeterinaryForm({ onSuccess, initialData }: VeterinaryFormProps) {
    const { mutate: createProfile, isPending } = useCreateVeterinaryProfile();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<VeterinaryFormInput, any, VeterinaryFormOutput>({
        resolver: zodResolver(veterinarySchema),
        defaultValues: {
            clinicName: initialData?.clinicName || '',
            city: initialData?.city || '',
            phone: initialData?.phone || '',
            website: initialData?.website || '',
            about: initialData?.about || '',
            specialties: initialData?.specialties || [],
        },
    });

    const selectedSpecialties = watch('specialties') || [];

    const handleSpecialtyToggle = (specialty: string) => {
        if (selectedSpecialties.includes(specialty)) {
            setValue('specialties', selectedSpecialties.filter(s => s !== specialty));
        } else {
            setValue('specialties', [...selectedSpecialties, specialty]);
        }
    };

    const onSubmit = (data: VeterinaryFormOutput) => {
        const payload = {
            clinicName: data.clinicName,
            city: data.city,
            phone: data.phone || undefined,
            website: data.website || undefined,
            about: data.about || undefined,
            specialties: data.specialties,
            profilePhoto: data.profilePhoto?.[0] || null,
            coverPhoto: data.coverPhoto?.[0] || null,
        };

        createProfile(payload, {
            onSuccess: () => {
                onSuccess();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Profil Fotoğrafı</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('profilePhoto')}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Kapak Fotoğrafı</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('coverPhoto')}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Klinik Adı *</label>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('clinicName')}
                        placeholder="Örn: Pati Veteriner Kliniği"
                    />
                    {errors.clinicName && <p className="text-sm text-destructive">{errors.clinicName.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Şehir *</label>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('city')}
                        placeholder="Örn: İstanbul"
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Telefon</label>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('phone')}
                        placeholder="Örn: 0532..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('website')}
                        placeholder="Örn: www.pativeteriner.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Hakkında</label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('about')}
                    placeholder="Kliniğiniz hakkında kısa bir açıklama yazın..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Uzmanlık Alanları</label>
                <div className="flex flex-wrap gap-2 pt-1">
                    {AVAILABLE_SPECIALTIES.map((specialty) => {
                        const isSelected = selectedSpecialties.includes(specialty);
                        return (
                            <button
                                key={specialty}
                                type="button"
                                onClick={() => handleSpecialtyToggle(specialty)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                    isSelected
                                        ? 'bg-primary border-primary text-white shadow-sm'
                                        : 'bg-card hover:bg-muted text-muted-foreground border-input'
                                }`}
                            >
                                {specialty}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Kaydediliyor...' : (initialData ? 'Profili Güncelle' : 'Veteriner Profili Oluştur')}
                </Button>
            </div>
        </form>
    );
}
