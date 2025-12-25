import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useMyPets } from '../hooks/usePets';
import { type Pet } from '../types/pet.types';

interface ActivePetContextType {
    activePet: Pet | null;
    setActivePet: (pet: Pet | null) => void;
    isLoading: boolean;
    pets: Pet[];
}

const ActivePetContext = createContext<ActivePetContextType | undefined>(undefined);

export function ActivePetProvider({ children }: { children: ReactNode }) {
    const { data, isLoading } = useMyPets();
    const [activePet, setActivePet] = useState<Pet | null>(null);

    const pets = data?.data?.data || [];

    useEffect(() => {
        if (!isLoading && pets.length > 0 && !activePet) {
            // Try to recover from localStorage or default to first pet
            const savedPetId = localStorage.getItem('activePetId');
            const savedPet = pets.find((p: Pet) => p.id === Number(savedPetId));

            if (savedPet) {
                setActivePet(savedPet);
            } else {
                setActivePet(pets[0]);
            }
        }
    }, [isLoading, pets, activePet]);

    const handleSetActivePet = (pet: Pet | null) => {
        setActivePet(pet);
        if (pet) {
            localStorage.setItem('activePetId', String(pet.id));
        } else {
            localStorage.removeItem('activePetId');
        }
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
