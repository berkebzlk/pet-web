import { api } from "../../../shared/lib/api";
import type { CreatePostDTO, Post, Comment } from "../types/post.types";

export const postService = {
    create: async (data: CreatePostDTO): Promise<any> => {
        const formData = new FormData();
        formData.append('pet_id', data.pet_id.toString());
        formData.append('image', data.image);
        if (data.description) {
            formData.append('description', data.description);
        }

        const response = await api.post('/post', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getFeed: async (petId?: number | null): Promise<Post[]> => {
        const params = petId ? { pet_id: petId } : {};
        const response = await api.get('/post', { params });
        return response.data.data;
    },

    getPost: async (id: number): Promise<Post> => {
        const response = await api.get(`/post/${id}`);
        return response.data.data;
    },

    getPetPosts: async (petId: number, viewingPetId?: number | null): Promise<Post[]> => {
        const params = viewingPetId ? { pet_id: viewingPetId } : {};
        const response = await api.get(`/pet/${petId}/post`, { params });
        return response.data.data;
    },

    getRandomPosts: async (limit = 20, viewingPetId?: number | null): Promise<Post[]> => {
        const params: any = { limit };
        if (viewingPetId) {
            params.pet_id = viewingPetId;
        }
        const response = await api.get('/post/random', { params });
        return response.data.data;
    },

    getBatch: async (ids: number[], viewingPetId?: number | null): Promise<Post[]> => {
        const response = await api.post('/post/batch', { ids, pet_id: viewingPetId });
        return response.data.data;
    },

    like: async (id: number, petId: number): Promise<void> => {
        await api.post(`/post/${id}/like`, { pet_id: petId });
    },

    unlike: async (id: number, petId: number): Promise<void> => {
        await api.delete(`/post/${id}/like`, { data: { pet_id: petId } });
    },

    comment: async (id: number, content: string, petId: number): Promise<any> => {
        const response = await api.post(`/post/${id}/comment`, { content, pet_id: petId });
        return response.data;
    },

    getComments: async (id: number, page = 1, perPage = 10): Promise<{ data: Comment[], pagination: any }> => {
        const response = await api.get(`/post/${id}/comment`, { params: { page, perPage } });
        return response.data.data;
    },

    deleteComment: async (postId: number, commentId: number): Promise<any> => {
        const response = await api.delete(`/post/${postId}/comment/${commentId}`);
        return response.data;
    },

    save: async (id: number, petId: number): Promise<any> => {
        const response = await api.post(`/post/${id}/save`, { pet_id: petId });
        return response.data;
    },

    unsave: async (id: number, petId: number): Promise<any> => {
        const response = await api.delete(`/post/${id}/save`, { data: { pet_id: petId } });
        return response.data;
    },

    delete: async (id: number): Promise<any> => {
        const response = await api.delete(`/post/${id}`);
        return response.data;
    }
};
