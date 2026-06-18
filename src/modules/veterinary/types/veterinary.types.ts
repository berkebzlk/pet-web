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
    createdAt: string;
    updatedAt: string;
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
