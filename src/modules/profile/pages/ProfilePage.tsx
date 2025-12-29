import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMyPets } from '@/modules/pet/hooks/usePets';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Plus, Settings, User, ChevronDown } from 'lucide-react';
import type { Pet } from '@/modules/pet/types/pet.types';
import { Modal } from '@/shared/components/ui/modal';
import { PetForm } from '@/modules/pet/components/PetForm';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data, isLoading } = useMyPets();
    const { data: user } = useAuthUser();

    const pets = data?.data?.data || [];

    const [isAddPetOpen, setIsAddPetOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [activePetId, setActivePetId] = useState<number | null>(null);

    const handleEditPet = (pet: Pet) => {
        setSelectedPet(pet);
        setIsAddPetOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddPetOpen(false);
        setSelectedPet(null);
    };

    const currentPet = pets.find(p => p.id === activePetId) || pets[0];

    return (
        <div className="pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 h-14 flex items-center justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                        <span className="font-bold text-lg">{currentPet?.username || user?.name}</span>
                        <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        {pets.map((pet: Pet) => (
                            <DropdownMenuItem key={pet.id} onClick={() => setActivePetId(pet.id)}>
                                <div className="flex items-center gap-2 w-full">
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                                        {pet.image ? (
                                            <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-[10px]">
                                                {pet.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <span className="flex-1 truncate">{pet.username}</span>
                                    {currentPet?.id === pet.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem onClick={() => setIsAddPetOpen(true)} className="text-primary cursor-pointer">
                            <Plus className="w-4 h-4 mr-2" />
                            {t('pet.add')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setIsAddPetOpen(true)}>
                        <Plus className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/app/settings')}>
                        <Settings className="h-6 w-6" />
                    </Button>
                </div>
            </header>

            <div className="p-4 space-y-6">
                {/* Profile Info */}
                <div className="flex items-center gap-8">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-2 border-primary p-1">
                            <img
                                src={currentPet?.image || "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop"}
                                alt={currentPet?.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex justify-around text-center">
                        <div>
                            <div className="font-bold text-lg">{currentPet?.postsCount || 0}</div>
                            <div className="text-xs text-muted-foreground">Posts</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg">{currentPet?.matchCount || 0}</div>
                            <div className="text-xs text-muted-foreground">Matches</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg">0</div>
                            <div className="text-xs text-muted-foreground">Likes</div>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="space-y-1">
                    <h2 className="font-bold text-sm">{currentPet?.name}</h2>
                    <p className="text-sm whitespace-pre-wrap">{currentPet?.bio || "No bio yet."}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" size="sm" onClick={() => currentPet && handleEditPet(currentPet)}>
                        Edit Profile
                    </Button>
                    <Button className="flex-1" variant="outline" size="sm">
                        Share Profile
                    </Button>
                </div>

                {/* Content Tabs */}
                <div className="flex border-t pt-2">
                    <button className="flex-1 flex justify-center pb-2 border-b-2 border-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                    </button>
                    <button className="flex-1 flex justify-center pb-2 text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.28 3.6-1.28 5.14 0 .34.29.56.7.56 1.15 0 1.63-1.56 2.75-3.5 2.87-1.31.08-2.07.81-2.2 1.98-.13 1.17.64 2.15 1.79 2.28 2.01.23 3.09 2.02 1.48 3.63-1.61 1.61-3.4 2.53-5.27 2.09-1.17-.28-2.15.49-2.28 1.66-.12 1.17.61 1.93 1.78 2.01 1.94.12 3.06 1.75 1.43 3.38-.29.29-.7.51-1.15.51-1.45 0-1.45-2.11-.17-3.6" /></svg>
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div key={i} className="aspect-square bg-muted relative group cursor-pointer overflow-hidden">
                            <img
                                src={`https://images.unsplash.com/photo-${1550000000000 + i}?w=400&h=400&fit=crop`}
                                alt="Post"
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isAddPetOpen}
                onClose={handleCloseModal}
                title={selectedPet ? t('pet.edit') : t('pet.add')}
            >
                <PetForm
                    initialData={selectedPet || undefined}
                    onSuccess={handleCloseModal}
                    onCancel={handleCloseModal}
                />
            </Modal>


        </div>
    );
}
