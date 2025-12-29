import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { usePet } from '@/modules/pet/hooks/usePets';
import { PetForm } from '@/modules/pet/components/PetForm';
import { useTranslation } from 'react-i18next';

export function EditPetPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: petResponse, isLoading } = usePet(Number(id));
    const pet = petResponse?.data;

    if (isLoading) return <div>{t('pet.loading')}</div>;
    if (!pet) return <div>{t('pet.notFound')}</div>;

    const handleSuccess = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-1 -ml-2">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg">{t('pet.editTitle')}</h1>
            </header>

            <div className="p-4">
                <PetForm
                    initialData={pet}
                    onSuccess={handleSuccess}
                // We might need to adjust PetForm to handle "onCancel" if we want a cancel button there,
                // or just rely on the back button in header.
                />
            </div>
        </div>
    );
}
