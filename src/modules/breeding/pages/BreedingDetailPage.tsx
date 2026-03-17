import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Heart } from 'lucide-react';

import { usePet } from '@/modules/pet/hooks/usePets';
import { useActivePet } from '@/shared/hooks/useActivePet';
import { useCreateBreedingRequest, usePendingBreedingRequests, useAcceptBreedingRequest } from '../hooks/useBreeding';
import { Button } from '@/shared/components/ui/button';
import { Gender } from '@/modules/pet/types/pet.types';

export function BreedingDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { activePetId } = useActivePet();

    const { data: petData, isLoading } = usePet(Number(id));
    const pet = petData?.data;

    const { mutate: createRequest, isPending: isRequesting } = useCreateBreedingRequest();
    const { data: pendingRequests } = usePendingBreedingRequests(activePetId || 0);

    const { mutate: acceptRequest, isPending: isAccepting } = useAcceptBreedingRequest();

    const sentRequest = pendingRequests?.find(
        (r: any) => Number(r.initiator_pet_id) === Number(activePetId) && Number(r.target_pet_id) === Number(id)
    );

    const receivedRequest = pendingRequests?.find(
        (r: any) => Number(r.initiator_pet_id) === Number(id) && Number(r.target_pet_id) === Number(activePetId)
    );

    const handleRequest = () => {
        if (!activePetId || !id) return;
        createRequest({
            initiator_pet_id: activePetId,
            target_pet_id: Number(id),
        });
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">{t('common.loading', 'Loading...')}</div>;
    }

    if (!pet) {
        return <div className="p-8 text-center text-muted-foreground">{t('pet.notFound')}</div>;
    }

    return (
        <div className="max-w-xl mx-auto pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
                <div className="flex items-center p-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-bold flex-1 text-center pr-10">{pet.name}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
                {/* Pet Image */}
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-muted relative">
                    {pet.image ? (
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl text-primary/50 font-bold bg-primary/5">
                            {pet.name[0]}
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center shadow-lg">
                        {pet.gender === Gender.MALE ? (
                            <span className="text-blue-500 font-bold flex items-center gap-1">♂ {t('common.male', 'Male')}</span>
                        ) : (
                            <span className="text-pink-500 font-bold flex items-center gap-1">♀ {t('common.female', 'Female')}</span>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4 relative">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {pet.name}, {pet.age}
                        </h2>
                        <p className="text-lg text-muted-foreground">{pet.breed || pet.type}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-xl border">
                            <p className="text-xs text-muted-foreground mb-1">{t('pet.weight')}</p>
                            <p className="font-semibold">{pet.weight} kg</p>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-xl border">
                            <p className="text-xs text-muted-foreground mb-1">{t('pet.neutered')}</p>
                            <p className="font-semibold">{pet.isNeutered ? t('common.yes', 'Yes') : t('common.no', 'No')}</p>
                        </div>
                    </div>

                    {pet.bio && (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">{t('pet.about', { name: pet.name })}</h3>
                            <div className="bg-muted/30 p-4 rounded-xl border">
                                <p className="text-sm leading-relaxed">{pet.bio}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                    {receivedRequest ? (
                        <Button
                            className="w-full h-14 text-lg rounded-xl shadow-lg border-2 border-primary/20 hover:border-primary/50"
                            size="lg"
                            disabled={isAccepting}
                            onClick={() => acceptRequest(receivedRequest.id)}
                        >
                            <Heart className="w-5 h-5 mr-2" />
                            {isAccepting ? t('common.loading', 'Loading...') : t('breeding.acceptRequest', 'Accept Request')}
                        </Button>
                    ) : (
                        <Button
                            className="w-full h-14 text-lg rounded-xl shadow-lg border-2 border-primary/20 hover:border-primary/50"
                            size="lg"
                            disabled={!!sentRequest || isRequesting || !activePetId}
                            onClick={handleRequest}
                        >
                            <Heart className="w-5 h-5 mr-2" />
                            {sentRequest ? t('breeding.requestSent', 'Request Sent') : t('breeding.sendRequest')}
                        </Button>
                    )}

                    <Button
                        variant="secondary"
                        className="w-full h-12 rounded-xl"
                        onClick={() => navigate(`/app/profile/${pet.username}`)}
                    >
                        <User className="w-4 h-4 mr-2" />
                        {t('breeding.viewSocialProfile')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
