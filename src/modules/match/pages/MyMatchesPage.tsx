import { useActivePet } from '@/modules/pet/context/ActivePetContext';
import { usePendingMatches, useAcceptMatch, useRejectMatch } from '../hooks/useMatches';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Check, X } from 'lucide-react';

export const MyMatchesPage = () => {
    const { t } = useTranslation();
    const { activePet } = useActivePet();
    const { data: matches, isLoading } = usePendingMatches(activePet?.id);
    const acceptMatch = useAcceptMatch();
    const rejectMatch = useRejectMatch();

    if (!activePet) {
        return (
            <div className="p-4 text-center">
                <p>{t('match.selectPetFirst')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 pb-20 md:pb-4">
            <PageHeader title={t('match.myMatches')} />

            {isLoading ? (
                <div>{t('common.loading')}</div>
            ) : matches?.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                    {t('match.noPendingRequests')}
                </div>
            ) : (
                <div className="grid gap-4">
                    {matches?.map((match) => (
                        <Card key={match.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                <Avatar className="h-12 w-12 border shrink-0">
                                    <AvatarImage src={match.initiator_pet?.image || undefined} className="object-cover" />
                                    <AvatarFallback>{match.initiator_pet?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 truncate">
                                    <h3 className="font-semibold truncate">{match.initiator_pet?.name}</h3>
                                    <p className="text-sm text-muted-foreground truncate">{match.initiator_pet?.breed}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => rejectMatch.mutate(match.id)}
                                    disabled={rejectMatch.isPending}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                                <Button
                                    size="icon"
                                    className="h-10 w-10 bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => acceptMatch.mutate(match.id)}
                                    disabled={acceptMatch.isPending}
                                >
                                    <Check className="h-5 w-5" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
