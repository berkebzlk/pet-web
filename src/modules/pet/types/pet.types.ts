export enum PetType {
    DOG = 'dog',
    CAT = 'cat',
    BIRD = 'bird',
    FISH = 'fish',
    RODENT = 'rodent',
    REPTILE = 'reptile',
    OTHER = 'other',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export interface Pet {
    id: number;
    name: string;
    type: string;
    breed: string | null;
    gender: Gender;
    birthDate: string;
    age: number;
    weight: number | null;
    isNeutered: boolean;
    bio: string | null;
    image: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePetDTO {
    name: string;
    type: string;
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
