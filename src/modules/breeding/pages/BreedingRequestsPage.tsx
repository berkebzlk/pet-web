import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, X, Loader2 } from 'lucide-react';

import { useActivePet } from '@/shared/hooks/useActivePet';
import {
    usePendingBreedingRequests,
    useAcceptBreedingRequest,
    useRejectBreedingRequest,
    useCancelBreedingRequest,
} from '../hooks/useBreeding';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import type { BreedingConnection } from '../types';

export function BreedingRequestsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'received';

    const { activePetId } = useActivePet();
    const { data: requests, isLoading } = usePendingBreedingRequests(activePetId || 0);

    const { mutate: acceptRequest, isPending: isAccepting } = useAcceptBreedingRequest();
    const { mutate: rejectRequest, isPending: isRejecting } = useRejectBreedingRequest();
    const { mutate: cancelRequest, isPending: isCanceling } = useCancelBreedingRequest();

    const receivedRequests = requests?.filter((r: any) => Number(r.target_pet_id) === Number(activePetId)) || [];
    const sentRequests = requests?.filter((r: any) => Number(r.initiator_pet_id) === Number(activePetId)) || [];

    const activeRequests = activeTab === 'received' ? receivedRequests : sentRequests;

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
                    <h1 className="text-xl font-bold flex-1 text-center pr-10">
                        {activeTab === 'received' ? t('breeding.receivedRequests') : t('breeding.sentRequests')}
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex px-4 pb-2 space-x-4">
                    <button
                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'received' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        onClick={() => setSearchParams({ tab: 'received' })}
                    >
                        {t('breeding.receivedRequests')} ({receivedRequests.length})
                    </button>
                    <button
                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sent' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        onClick={() => setSearchParams({ tab: 'sent' })}
                    >
                        {t('breeding.sentRequests')} ({sentRequests.length})
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : activeRequests.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                        <p className="text-muted-foreground">{t('common.noResults')}</p>
                    </div>
                ) : (
                    activeRequests.map((request: any) => {
                        const otherPet = activeTab === 'received' ? (request.initiator_pet || request.initiatorPet) : (request.target_pet || request.targetPet);
                        if (!otherPet) return null;

                        return (
                            <div key={request.id} className="bg-card border rounded-xl p-4 flex items-center justify-between">
                                <div
                                    className="flex items-center space-x-4 flex-1 cursor-pointer"
                                    onClick={() => navigate(`/app/breeding/${otherPet.id}`)}
                                >
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={otherPet.image} alt={otherPet.name} className="object-cover" />
                                        <AvatarFallback>{otherPet.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-sm">{otherPet.name}</h3>
                                        <p className="text-xs text-muted-foreground">{otherPet.breed || otherPet.type}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {activeTab === 'received' ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-10 w-10 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => rejectRequest(request.id)}
                                                disabled={isRejecting || isAccepting}
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                className="h-10 w-10 bg-green-500 hover:bg-green-600 text-white"
                                                onClick={() => acceptRequest(request.id)}
                                                disabled={isRejecting || isAccepting}
                                            >
                                                <Check className="h-5 w-5" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => cancelRequest(request.id)}
                                            disabled={isCanceling}
                                        >
                                            {t('breeding.cancelRequest', 'Cancel')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
