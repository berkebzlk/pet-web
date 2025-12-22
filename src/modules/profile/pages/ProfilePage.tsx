import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMyPets } from '@/modules/pet/hooks/usePets';
import { useLogout } from '@/modules/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Plus, Settings, LogOut, User } from 'lucide-react';
import type { Pet } from '@/modules/pet/types/pet.types';
import { Modal } from '@/shared/components/ui/modal';
import { PetForm } from '@/modules/pet/components/PetForm';

export function ProfilePage() {
    const { t } = useTranslation();
    const { data, isLoading } = useMyPets();
    const { mutate: logout } = useLogout();

    const pets = data?.data?.data || [];

    const [isAddPetOpen, setIsAddPetOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

    const handleEditPet = (pet: Pet) => {
        setSelectedPet(pet);
        setIsAddPetOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddPetOpen(false);
        setSelectedPet(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t('nav.profile')}</h1>
                <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
                    <Settings className="h-6 w-6" />
                </Button>
            </div>

            {/* User Info (Mocked for now) */}
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl border shadow-sm">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    B
                </div>
                <div>
                    <h2 className="font-semibold text-lg">Berke</h2>
                    <p className="text-sm text-muted-foreground">berke@example.com</p>
                </div>
            </div>

            {/* My Pets Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">My Pets</h3>
                    <Button size="sm" className="gap-2" onClick={() => setIsAddPetOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Add Pet
                    </Button>
                </div>

                {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading pets...</div>
                ) : pets.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                        <p className="text-muted-foreground mb-4">No pets added yet</p>
                        <Button variant="outline" onClick={() => setIsAddPetOpen(true)}>
                            Add Your First Pet
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pets.map((pet: Pet) => (
                            <div
                                key={pet.id}
                                onClick={() => handleEditPet(pet)}
                                className="flex items-center gap-4 p-3 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                    {pet.image ? (
                                        <img
                                            src={pet.image} // TODO: Add full URL prefix if needed
                                            alt={pet.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                                            {pet.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold truncate">{pet.name}</h4>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {pet.breed || pet.type} • {pet.age} y/o
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Pet Modal */}
            <Modal
                isOpen={isAddPetOpen}
                onClose={handleCloseModal}
                title={selectedPet ? 'Edit Pet' : 'Add New Pet'}
            >
                <PetForm onSuccess={handleCloseModal} initialData={selectedPet} />
            </Modal>

            {/* Settings Modal */}
            <Modal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                title="Settings"
            >
                <div className="space-y-2">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => alert('Coming Soon!')}
                    >
                        <User className="h-4 w-4" />
                        Edit Profile
                    </Button>
                    <Button
                        variant="destructive"
                        className="w-full justify-start gap-2"
                        onClick={() => logout()}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
