import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useActivePet } from '@/modules/pet/context/ActivePetContext';
import { useCheckMatchStatus, useAcceptMatch, useRejectMatch, usePendingMatches } from '@/modules/match/hooks/useMatch';

export function MatchRequestsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { activePet } = useActivePet();
    const { mutate: acceptMatch } = useAcceptMatch();
    const { mutate: rejectMatch } = useRejectMatch();

    const { data: pendingMatches, isLoading } = usePendingMatches(activePet?.id);

    if (!activePet) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-muted-foreground">{t('match.selectPetFirst')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-2xl font-bold">{t('notifications.matchRequests')}</h1>
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
            ) : pendingMatches?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">{t('match.noPendingRequests')}</div>
            ) : (
                <div className="grid gap-4">
                    {pendingMatches?.map((match: any) => (
                        <div key={match.id} className="flex items-center justify-between p-4 bg-card rounded-lg border shadow-sm">
                            <div
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => navigate(`/app/profile/${match.initiator_pet.username}`)}
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={match.initiator_pet.image} />
                                    <AvatarFallback>{match.initiator_pet.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{match.initiator_pet.name}</h3>
                                    <p className="text-sm text-muted-foreground">@{match.initiator_pet.username}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => rejectMatch(match.id)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                                <Button
                                    size="icon"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => acceptMatch(match.id)}
                                >
                                    <Check className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
