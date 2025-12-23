import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePets } from '@/modules/pet/hooks/usePets';
import type { Pet } from '@/modules/pet/types/pet.types';
import { Gender } from '@/modules/pet/types/pet.types';
import { Button } from '@/shared/components/ui/button';
import { MatchFilters } from '../components/MatchFilters';
import { useTranslation } from 'react-i18next';

export function MatchPage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<{ type?: string; gender?: string }>({});
    const { t } = useTranslation();

    // Prepare params for the API
    const queryParams = {
        filters: JSON.stringify(filters),
    };

    const { data, isLoading } = usePets(queryParams);
    const pets = data?.data?.data || [];

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    const hasFilters = Object.keys(filters).length > 0;

    return (
        <div className="space-y-6">
            <MatchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
            />

            {/* Pet Grid */}
            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">{t('match.loading')}</div>
            ) : pets.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">{t('match.noPetsFound')}</p>
                    {hasFilters && (
                        <Button variant="link" onClick={clearFilters} className="mt-2">
                            {t('match.clearAllFilters')}
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pets.map((pet: Pet) => (
                        <div
                            key={pet.id}
                            onClick={() => navigate(`/app/match/${pet.id}`)}
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                    <p className="text-white text-xs font-medium truncate">
                                        {pet.bio || t('match.noBio')}
                                    </p>
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold truncate">{pet.name}</h3>
                                    {pet.gender === Gender.MALE ? (
                                        <span className="text-blue-500 text-xs font-bold">♂</span>
                                    ) : (
                                        <span className="text-pink-500 text-xs font-bold">♀</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                    {pet.breed || pet.type} • {pet.age} y/o
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
