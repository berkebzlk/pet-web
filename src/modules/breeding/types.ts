export type BreedingConnectionStatus = 'pending' | 'accepted' | 'rejected';

export interface BreedingConnection {
    id: number;
    initiator_pet_id: number;
    target_pet_id: number;
    status: BreedingConnectionStatus;
    created_at: string;
    updated_at: string;

    // Added via relations in backend
    initiator_pet?: any;
    target_pet?: any;
}

export interface CreateBreedingConnectionDto {
    initiator_pet_id: number;
    target_pet_id: number;
}
