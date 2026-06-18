import { useState, useEffect } from 'react';

export const useActivePet = () => {
    const [activeProfileType, setActiveProfileType] = useState<'pet' | 'veterinary'>(() => {
        return (localStorage.getItem('activeProfileType') as any) || 'pet';
    });
    const [activeProfileId, setActiveProfileId] = useState<number | null>(() => {
        const stored = localStorage.getItem('activeProfileId') || localStorage.getItem('activePetId');
        return stored ? parseInt(stored) : null;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setActiveProfileType((localStorage.getItem('activeProfileType') as any) || 'pet');
            const stored = localStorage.getItem('activeProfileId') || localStorage.getItem('activePetId');
            setActiveProfileId(stored ? parseInt(stored) : null);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('activePetChanged', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('activePetChanged', handleStorageChange);
        };
    }, []);

    const setActiveProfile = (id: number, type: 'pet' | 'veterinary') => {
        localStorage.setItem('activeProfileType', type);
        localStorage.setItem('activeProfileId', id.toString());
        if (type === 'pet') {
            localStorage.setItem('activePetId', id.toString());
        } else {
            localStorage.removeItem('activePetId');
        }
        setActiveProfileType(type);
        setActiveProfileId(id);
        window.dispatchEvent(new Event('activePetChanged'));
    };

    return {
        activeProfileType,
        activeProfileId,
        activePetId: activeProfileType === 'pet' ? activeProfileId : null,
        setActiveProfile,
        // Backward compatible setter
        setActivePet: (id: number) => setActiveProfile(id, 'pet')
    };
};
