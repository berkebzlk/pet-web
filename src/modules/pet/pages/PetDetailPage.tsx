import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Edit2 } from 'lucide-react';
import { usePet } from '@/modules/pet/hooks/usePets';
import { Button } from '@/shared/components/ui/button';
import { useTranslation } from 'react-i18next';

export function PetDetailPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const { data: petResponse, isLoading } = usePet(Number(id));
    const pet = petResponse?.data;

    if (isLoading) return <div>{t('pet.loading')}</div>;
    if (!pet) return <div>{t('pet.notFound')}</div>;

    return (
        <div className="h-full bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-1 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-bold text-lg">{pet.name}</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={() => navigate(`/app/settings/accounts-center/pets/${id}/edit`)}>
                    <Edit2 className="w-5 h-5" />
                </Button>
            </header>

            <div className="p-4 space-y-6 flex flex-col items-center">
                {/* Image */}
                <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
                        {pet.image ? (
                            <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
                                {pet.name[0]}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                {/* Details */}
                <div className="space-y-4 w-full max-w-md">
                    {/* Username & Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-muted-foreground">{t('pet.username')}</label>
                            <div className="font-medium">{pet.username}</div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">{t('form.name')}</label>
                            <div className="font-medium">{pet.name}</div>
                        </div>
                    </div>

                    {/* Type & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-muted-foreground">{t('form.type')}</label>
                            <div className="font-medium">{t(`pet.types.${pet.type}`)}</div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">{t('form.gender')}</label>
                            <div className="font-medium capitalize">{t(`pet.genders.${pet.gender}`)}</div>
                        </div>
                    </div>

                    {/* Breed */}
                    <div>
                        <label className="text-xs text-muted-foreground">{t('form.breed')}</label>
                        <div className="font-medium">{pet.breed || '-'}</div>
                    </div>

                    {/* BirthDate & Weight */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-muted-foreground">{t('form.birthDate')}</label>
                            <div className="font-medium">{pet.birthDate}</div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">{t('pet.weight')}</label>
                            <div className="font-medium">{pet.weight ? `${pet.weight} kg` : '-'}</div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="text-xs text-muted-foreground">{t('pet.bio')}</label>
                        <div className="font-medium whitespace-pre-wrap">{pet.bio || '-'}</div>
                    </div>

                    {/* Neutered */}
                    <div>
                        <label className="text-xs text-muted-foreground">{t('pet.neutered')}</label>
                        <div className="font-medium">{pet.isNeutered ? t('pet.yes') : t('pet.no')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
