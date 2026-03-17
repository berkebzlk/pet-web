import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, MessageCircle } from 'lucide-react';

import { useActivePet } from '@/shared/hooks/useActivePet';
import { useBreedingConnections } from '../hooks/useBreeding';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

export function BreedingConnectionsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { activePetId } = useActivePet();

    // The backend uses a slightly different format (paginated, returning raw pet data or connection with relations)
    // Assuming backend discover returns pets directly, let's just render the list
    const { data: connectionsData, isLoading } = useBreedingConnections(activePetId || 0);
    const pets = connectionsData || [];

    if (!activePetId) {
        return <div className="p-8 text-center text-muted-foreground">{t('breeding.requireActivePet')}</div>;
    }

    return (
        <div className="max-w-xl mx-auto pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
                <div className="flex items-center p-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/app/breeding')} className="mr-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-bold flex-1 text-center pr-10">{t('breeding.connections')}</h1>
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : pets.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                        <p className="text-muted-foreground">{t('common.noResults')}</p>
                    </div>
                ) : (
                    pets.map((pet: any) => (
                        <div key={pet.id} className="bg-card border rounded-xl p-4 flex items-center justify-between">
                            <div
                                className="flex items-center space-x-4 flex-1 cursor-pointer"
                                onClick={() => navigate(`/app/profile/${pet.username}`)}
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={pet.image} alt={pet.name} className="object-cover" />
                                    <AvatarFallback>{pet.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-sm">{pet.name}</h3>
                                    <p className="text-xs text-muted-foreground">{pet.breed || pet.type}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-primary/20 hover:border-primary text-primary"
                                onClick={() => navigate(`/app/messages/${pet.id}`)}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                {t('common.message', 'Message')}
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
