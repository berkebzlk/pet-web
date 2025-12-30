import type { Pet } from "../../pet/types/pet.types";

export interface Post {
    id: number;
    pet_id: number;
    image_url: string;
    description: string | null;
    created_at: string;
    pet?: Pet;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    is_saved: boolean;
}

export interface Comment {
    id: number;
    user_id: number;
    post_id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        image?: string;
    };
}

export interface CreatePostDTO {
    pet_id: number;
    image: File;
    description?: string;
}
