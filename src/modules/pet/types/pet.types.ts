export const PetType = {
    DOG: 'dog',
    CAT: 'cat',
    BIRD: 'bird',
    FISH: 'fish',
    RODENT: 'rodent',
    REPTILE: 'reptile',
    OTHER: 'other',
} as const;

export type PetType = typeof PetType[keyof typeof PetType];

export const Gender = {
    MALE: 'male',
    FEMALE: 'female',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export interface Pet {
    id: number;
    name: string;
    type: PetType;
    breed: string | null;
    gender: Gender;
    birthDate: string;
    age: number;
    weight: number | null;
    isNeutered: boolean;
    bio: string | null;
    image: string | null;
    username: string;
    postsCount: number;
    matchCount: number;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreatePetDTO {
    name: string;
    username: string;
    type: PetType;
    breed?: string;
    gender: Gender;
    birthDate: string;
    weight?: number;
    isNeutered?: boolean;
    bio?: string;
    image?: File;
}

export interface UpdatePetDTO extends Partial<CreatePetDTO> {
    _method?: 'PUT';
}
