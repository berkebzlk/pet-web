import type { Pet } from '@/modules/pet/types/pet.types';

export interface VeterinaryProfile {
    id: number;
    userId: number;
    clinicName: string;
    city: string;
    phone?: string;
    website?: string;
    about?: string;
    specialties: string[];
    profilePhoto?: string | null;
    coverPhoto?: string | null;
    averageRating?: number;
    reviewsCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface VeterinaryReview {
    id: number;
    rating: number;
    comment?: string;
    createdAt: string;
    pet?: Pet;
}

export interface CreateVeterinaryProfileDTO {
    clinicName: string;
    city: string;
    phone?: string;
    website?: string;
    about?: string;
    specialties?: string[];
    profilePhoto?: File | null;
    coverPhoto?: File | null;
}
