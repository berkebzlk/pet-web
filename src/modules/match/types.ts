import type { Pet } from "../pet/types/pet.types";

export const MatchStatus = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
} as const;

export type MatchStatus = typeof MatchStatus[keyof typeof MatchStatus];

export interface Match {
    id: number;
    initiator_pet_id: number;
    target_pet_id: number;
    status: MatchStatus;
    created_at: string;
    updated_at: string;
    initiator_pet?: Pet;
    target_pet?: Pet;
}
