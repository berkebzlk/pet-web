import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useMyPets } from '../hooks/usePets';
import { type Pet } from '../types/pet.types';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';

interface ActivePetContextType {
    activePet: any; // Pet | VeterinaryProfile | null
    setActivePet: (profile: any) => void;
    isLoading: boolean;
    pets: Pet[];
}

const ActivePetContext = createContext<ActivePetContextType | undefined>(undefined);

export function ActivePetProvider({ children }: { children: ReactNode }) {
    const { data: petsData, isLoading: isPetsLoading } = useMyPets();
    const { data: user, isLoading: isUserLoading } = useAuthUser();
    const [activePet, setActivePet] = useState<any>(null);

    const pets = petsData?.data?.data || [];
    const isLoading = isPetsLoading || isUserLoading;

    useEffect(() => {
        if (!isLoading && !activePet) {
            // Try to recover from localStorage
            const savedProfileType = localStorage.getItem('activeProfileType') || 'pet';
            const savedProfileId = localStorage.getItem('activeProfileId') || localStorage.getItem('activePetId');

            if (savedProfileType === 'veterinary' && user?.veterinaryProfile && String(user.veterinaryProfile.id) === savedProfileId) {
                setActivePet(user.veterinaryProfile);
            } else if (pets.length > 0) {
                const savedPet = pets.find((p: Pet) => p.id === Number(savedProfileId));
                if (savedPet) {
                    setActivePet(savedPet);
                } else {
                    // Auto-select first pet
                    const firstPet = pets[0];
                    setActivePet(firstPet);
                    localStorage.setItem('activeProfileType', 'pet');
                    localStorage.setItem('activeProfileId', String(firstPet.id));
                    localStorage.setItem('activePetId', String(firstPet.id));
                }
            } else if (user?.veterinaryProfile) {
                // If user has no pets but has a clinic, auto-select clinic
                setActivePet(user.veterinaryProfile);
                localStorage.setItem('activeProfileType', 'veterinary');
                localStorage.setItem('activeProfileId', String(user.veterinaryProfile.id));
            }
        }
    }, [isLoading, pets, user, activePet]);

    const handleSetActivePet = (profile: any) => {
        setActivePet(profile);
        if (profile) {
            if ('clinicName' in profile) {
                localStorage.setItem('activeProfileType', 'veterinary');
                localStorage.setItem('activeProfileId', String(profile.id));
                localStorage.removeItem('activePetId'); // Clear old pet key to avoid confusion
            } else {
                localStorage.setItem('activeProfileType', 'pet');
                localStorage.setItem('activeProfileId', String(profile.id));
                localStorage.setItem('activePetId', String(profile.id)); // Maintain backward compatibility
            }
        } else {
            localStorage.removeItem('activeProfileType');
            localStorage.removeItem('activeProfileId');
            localStorage.removeItem('activePetId');
        }
        window.dispatchEvent(new Event('activePetChanged'));
    };

    return (
        <ActivePetContext.Provider value={{
            activePet,
            setActivePet: handleSetActivePet,
            isLoading,
            pets
        }}>
            {children}
        </ActivePetContext.Provider>
    );
}

export function useActivePet() {
    const context = useContext(ActivePetContext);
    if (context === undefined) {
        throw new Error('useActivePet must be used within an ActivePetProvider');
    }
    return context;
}
