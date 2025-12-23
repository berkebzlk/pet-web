import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePet } from '@/modules/pet/hooks/usePets';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Heart, User, Calendar, Ruler, Info } from 'lucide-react';
import { Gender } from '@/modules/pet/types/pet.types';
import { PageHeader } from '@/shared/components/layout/PageHeader';

export function PetDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data, isLoading } = usePet(Number(id));

    const pet = data?.data;

    if (isLoading) {
        return <div className="flex justify-center p-8">{t('pet.loading')}</div>;
    }

    if (!pet) {
        return <div className="flex justify-center p-8">{t('pet.notFound')}</div>;
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <PageHeader title={pet.name} showBack />

            {/* Image */}
            <div className="aspect-square w-full relative rounded-2xl overflow-hidden bg-muted shadow-sm">
                {pet.image ? (
                    <img
                        src={pet.image}
                        alt={pet.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-6xl font-bold">
                        {pet.name[0]}
                    </div>
                )}
            </div>

            {/* Main Info */}
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {pet.name}
                            {pet.gender === Gender.MALE ? (
                                <span className="text-blue-500 text-lg">♂</span>
                            ) : (
                                <span className="text-pink-500 text-lg">♀</span>
                            )}
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            {pet.breed || t(`pet.types.${pet.type}`)}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold text-lg">{pet.age} {t('pet.years')}</div>
                        <div className="text-sm text-muted-foreground">{t('pet.age')}</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-card p-3 rounded-xl border text-center space-y-1">
                        <div className="flex justify-center text-primary mb-1">
                            <Ruler className="h-5 w-5" />
                        </div>
                        <div className="font-semibold">{pet.weight || '-'} kg</div>
                        <div className="text-xs text-muted-foreground">{t('pet.weight')}</div>
                    </div>
                    <div className="bg-card p-3 rounded-xl border text-center space-y-1">
                        <div className="flex justify-center text-primary mb-1">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div className="font-semibold">{pet.birthDate.split('-')[0]}</div>
                        <div className="text-xs text-muted-foreground">{t('pet.born')}</div>
                    </div>
                    <div className="bg-card p-3 rounded-xl border text-center space-y-1">
                        <div className="flex justify-center text-primary mb-1">
                            <Info className="h-5 w-5" />
                        </div>
                        <div className="font-semibold">{pet.isNeutered ? t('pet.yes') : t('pet.no')}</div>
                        <div className="text-xs text-muted-foreground">{t('pet.neutered')}</div>
                    </div>
                </div>

                {/* Bio */}
                {pet.bio && (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{t('pet.about', { name: pet.name })}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {pet.bio}
                        </p>
                    </div>
                )}

                {/* Owner Info */}
                {pet.user && (
                    <div className="bg-card p-4 rounded-xl border space-y-3">
                        <h3 className="font-semibold">{t('pet.owner')}</h3>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                {pet.user.name[0]}
                            </div>
                            <div>
                                <div className="font-medium">{pet.user.name}</div>
                                <div className="text-sm text-muted-foreground">{t('pet.petOwner')}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <Button className="w-full h-12 text-lg gap-2 shadow-lg shadow-primary/20">
                    <Heart className="h-5 w-5 fill-current" />
                    {t('match.request')}
                </Button>
            </div>
        </div>
    );
}
