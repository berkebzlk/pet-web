import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { X } from 'lucide-react';
import { PetType, Gender } from '@/modules/pet/types/pet.types';
import { PageHeader } from '@/shared/components/layout/PageHeader';

interface MatchFiltersProps {
    filters: { type?: string; gender?: string };
    onFilterChange: (key: string, value: string) => void;
    onClearFilters: () => void;
}

export function MatchFilters({ filters, onFilterChange, onClearFilters }: MatchFiltersProps) {
    const { t } = useTranslation();
    const hasFilters = Object.keys(filters).length > 0;

    return (
        <div className="space-y-4">
            <PageHeader
                title={t('nav.match')}
                action={
                    hasFilters && (
                        <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground">
                            <X className="mr-2 h-4 w-4" />
                            {t('match.clearFilters')}
                        </Button>
                    )
                }
            />

            <div className="flex gap-2 overflow-x-auto pb-2">
                {/* Type Filter */}
                <select
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={filters.type || ''}
                    onChange={(e) => onFilterChange('type', e.target.value)}
                >
                    <option value="">{t('match.allTypes')}</option>
                    {Object.values(PetType).map((type) => (
                        <option key={type} value={type}>
                            {t(`pet.types.${type}`)}
                        </option>
                    ))}
                </select>

                {/* Gender Filter */}
                <select
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={filters.gender || ''}
                    onChange={(e) => onFilterChange('gender', e.target.value)}
                >
                    <option value="">{t('match.allGenders')}</option>
                    <option value={Gender.MALE}>{t('pet.genders.male')}</option>
                    <option value={Gender.FEMALE}>{t('pet.genders.female')}</option>
                </select>
            </div>
        </div>
    );
}
