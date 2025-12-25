import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PetForm } from '../components/PetForm';
import { PageHeader } from '@/shared/components/layout/PageHeader';

export function AddPetPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <PageHeader title={t('profile.addNewPet')} showBack />
            <div className="bg-card p-6 rounded-xl border shadow-sm">
                <PetForm onSuccess={() => navigate('/app/profile')} />
            </div>
        </div>
    );
}
