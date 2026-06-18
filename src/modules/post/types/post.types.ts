import type { Pet } from "../../pet/types/pet.types";

export interface Post {
    id: number;
    pet_id: number;
    veterinary_profile_id?: number | null;
    image_url: string;
    description: string | null;
    created_at: string;
    pet?: Pet;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    is_saved: boolean;
    comments?: Comment[];
}

export interface Comment {
    id: number;
    pet_id: number;
    post_id: number;
    content: string;
    created_at: string;
    pet: {
        id: number;
        name: string;
        username: string;
        image?: string;
    };
}

export interface CreatePostDTO {
    pet_id?: number;
    veterinary_profile_id?: number;
    image: File;
    description?: string;
}
