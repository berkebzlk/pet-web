import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuthUser, useUpdateUser } from '@/modules/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useTranslation } from 'react-i18next';

interface PersonalDetailsForm {
    name: string;
    email: string;
}

export function PersonalDetailsPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data: user } = useAuthUser();
    const { mutate: updateUser, isPending } = useUpdateUser();

    const { register, handleSubmit, reset } = useForm<PersonalDetailsForm>({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, reset]);

    const onSubmit = (data: PersonalDetailsForm) => {
        updateUser({ name: data.name }, {
            onSuccess: () => {
                toast.success(t('personalDetails.success'));
            },
            onError: () => {
                toast.error(t('personalDetails.error'));
            }
        });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-1 -ml-2">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg">{t('personalDetails.title')}</h1>
            </header>

            <div className="p-4 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('personalDetails.name')}</Label>
                        <Input id="name" {...register('name')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('personalDetails.email')}</Label>
                        <Input id="email" {...register('email')} disabled />
                        <p className="text-xs text-muted-foreground">{t('personalDetails.emailDisabled')}</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? t('personalDetails.saving') : t('personalDetails.save')}
                    </Button>
                </form>
            </div>
        </div>
    );
}

