import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMyPets } from '@/modules/pet/hooks/usePets';
import type { Pet } from '@/modules/pet/types/pet.types';

export function PetsListPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data: petsData } = useMyPets();
    const pets = petsData?.data?.data || [];

    const PetItem = ({ image, name, subtext, onClick }: { image?: string, name: string, subtext?: string, onClick?: () => void }) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors bg-card border-b border-border last:border-0 cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                            {name[0]}
                        </div>
                    )}
                </div>
                <div className="text-left">
                    <div className="font-medium text-sm">{name}</div>
                    {subtext && <div className="text-xs text-muted-foreground">{subtext}</div>}
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
    );

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-1 -ml-2">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg">{t('accountsCenter.pets')}</h1>
            </header>

            <div className="py-6">
                <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-muted-foreground px-4 uppercase tracking-wider mb-2">{t('pet.yourPets')}</h3>
                    <div className="border-y border-border">
                        {pets.map((pet: Pet) => (
                            <PetItem
                                key={pet.id}
                                image={pet.image}
                                name={pet.name}
                                subtext={pet.username || undefined}
                                onClick={() => navigate(`/app/settings/accounts-center/pets/${pet.id}`)}
                            />
                        ))}
                        {pets.length === 0 && (
                            <div className="p-4 text-center text-muted-foreground text-sm bg-card">
                                {t('accountsCenter.noPets')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
