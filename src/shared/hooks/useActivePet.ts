import { useState, useEffect } from 'react';

export const useActivePet = () => {
    const [activePetId, setActivePetId] = useState<number | null>(() => {
        const stored = localStorage.getItem('activePetId');
        return stored ? parseInt(stored) : null;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const stored = localStorage.getItem('activePetId');
            setActivePetId(stored ? parseInt(stored) : null);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('activePetChanged', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('activePetChanged', handleStorageChange);
        };
    }, []);

    const setActivePet = (id: number) => {
        localStorage.setItem('activePetId', id.toString());
        setActivePetId(id);
        window.dispatchEvent(new Event('activePetChanged'));
    };

    return { activePetId, setActivePet };
};
