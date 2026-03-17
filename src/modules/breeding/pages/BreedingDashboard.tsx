import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Inbox, Send, Loader2 } from 'lucide-react';

import { useActivePet } from '@/shared/hooks/useActivePet';
import { usePet } from '@/modules/pet/hooks/usePets';
import {
    useBreedingDiscovery,
    usePendingBreedingRequests,
    useBreedingConnections,
} from '../hooks/useBreeding';
import type { Pet } from '@/modules/pet/types/pet.types';
import { Gender } from '@/modules/pet/types/pet.types';

export function BreedingDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { activePetId } = useActivePet();
    const { data: activePetData } = usePet(activePetId || 0);
    const activePet = activePetData?.data;
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = {
        gender: searchParams.get('gender') || undefined,
        exclude_connected: searchParams.get('exclude_connected') === 'true',
    };

    const updateFilter = (key: string, value: string | boolean | undefined) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === undefined || value === false || value === '') {
            newParams.delete(key);
        } else {
            newParams.set(key, String(value));
        }
        setSearchParams(newParams, { replace: true });
    };

    const { data: discoverData, isLoading: isDiscoverLoading } = useBreedingDiscovery(
        activePetId || 0,
        filters
    );
    const { data: pendingRequests } = usePendingBreedingRequests(activePetId || 0);
    const { data: connectionsData } = useBreedingConnections(activePetId || 0);

    const pets = discoverData?.data || [];
    const receivedCount = pendingRequests?.filter((r: any) => Number(r.target_pet_id) === Number(activePetId)).length || 0;
    const sentCount = pendingRequests?.filter((r: any) => Number(r.initiator_pet_id) === Number(activePetId)).length || 0;
    const connectionsCount = connectionsData?.length || 0;

    if (!activePet) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-xl border">
                <p className="text-muted-foreground">{t('breeding.requireActivePet')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top Section: Dashboard Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Active Pet Card */}
                <div className="flex items-center space-x-4 bg-primary/10 p-4 rounded-xl border border-primary/20">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-background">
                        {activePet.image ? (
                            <img src={activePet.image} alt={activePet.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/20 text-primary font-bold">
                                {activePet.name[0]}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-primary">{activePet.name}</p>
                        <p className="text-xs text-muted-foreground">{t('breeding.activeProfile')}</p>
                    </div>
                </div>

                {/* Received Requests */}
                <div
                    onClick={() => navigate('/app/breeding/requests?tab=received')}
                    className="bg-card p-4 rounded-xl border flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
                >
                    <div>
                        <p className="text-sm text-muted-foreground">{t('breeding.receivedRequests')}</p>
                        <p className="text-2xl font-bold">{receivedCount}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Inbox className="w-5 h-5" />
                    </div>
                </div>

                {/* Sent Requests */}
                <div
                    onClick={() => navigate('/app/breeding/requests?tab=sent')}
                    className="bg-card p-4 rounded-xl border flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
                >
                    <div>
                        <p className="text-sm text-muted-foreground">{t('breeding.sentRequests')}</p>
                        <p className="text-2xl font-bold">{sentCount}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Send className="w-5 h-5" />
                    </div>
                </div>

                {/* Connections */}
                <div
                    onClick={() => navigate('/app/breeding/connections')}
                    className="bg-card p-4 rounded-xl border flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
                >
                    <div>
                        <p className="text-sm text-muted-foreground">{t('breeding.connections')}</p>
                        <p className="text-2xl font-bold">{connectionsCount}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500">
                        <Heart className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Middle Section: Filters */}
            <div className="bg-card p-4 rounded-xl border flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('breeding.discoverMates')}</h2>
                <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 text-sm cursor-pointer mr-2">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                            checked={filters.exclude_connected}
                            onChange={(e) => updateFilter('exclude_connected', e.target.checked)}
                        />
                        <span className="text-muted-foreground">{t('breeding.excludeConnected', 'Hide Requested/Connected')}</span>
                    </label>

                    {/* Simple filter for gender for now, can be expanded */}
                    <select
                        className="text-sm rounded-md border-gray-300 bg-background px-3 py-1.5 focus:ring-primary focus:border-primary"
                        value={filters.gender || ''}
                        onChange={(e) => updateFilter('gender', e.target.value)}
                    >
                        <option value="">{t('common.allGenders')}</option>
                        <option value={Gender.MALE}>{t('common.male')}</option>
                        <option value={Gender.FEMALE}>{t('common.female')}</option>
                    </select>
                </div>
            </div>

            {/* Bottom Section: Pet Grid */}
            {isDiscoverLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : pets.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">{t('breeding.noPetsFound')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pets.data.map((pet: Pet) => (
                        <div
                            key={pet.id}
                            onClick={() => navigate(`/app/breeding/${pet.id}`)}
                            className="group relative overflow-hidden rounded-xl bg-card border shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="aspect-square bg-muted relative overflow-hidden">
                                {pet.image ? (
                                    <img
                                        src={pet.image}
                                        alt={pet.name}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                                        {pet.name[0]}
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                                    {pet.gender === Gender.MALE ? (
                                        <span className="text-blue-500 text-xs font-bold">♂</span>
                                    ) : (
                                        <span className="text-pink-500 text-xs font-bold">♀</span>
                                    )}
                                    <span className="text-xs font-medium">{pet.age}y</span>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-12">
                                    <h3 className="font-semibold text-white truncate">{pet.name}</h3>
                                    <p className="text-xs text-white/80 truncate">
                                        {pet.breed || pet.type} {pet.isNeutered ? '' : `• ${t('breeding.notNeutered')}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
