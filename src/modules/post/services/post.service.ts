import { api } from "../../../shared/lib/api";
import type { CreatePostDTO, Post, Comment } from "../types/post.types";

export const postService = {
    create: async (data: CreatePostDTO): Promise<Post> => {
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
        return response.data.data;
    },

    getFeed: async (): Promise<Post[]> => {
        const response = await api.get('/post');
        return response.data.data;
    },

    getPetPosts: async (petId: number): Promise<Post[]> => {
        const response = await api.get(`/pet/${petId}/post`);
        return response.data.data;
    },

    like: async (id: number): Promise<void> => {
        await api.post(`/post/${id}/like`);
    },

    unlike: async (id: number): Promise<void> => {
        await api.delete(`/post/${id}/like`);
    },

    comment: async (id: number, content: string, petId: number): Promise<Comment> => {
        const response = await api.post(`/post/${id}/comment`, { content, pet_id: petId });
        return response.data.data;
    },

    getComments: async (id: number, page = 1, perPage = 10): Promise<{ data: Comment[], pagination: any }> => {
        const response = await api.get(`/post/${id}/comment`, { params: { page, perPage } });
        return response.data.data;
    },

    deleteComment: async (postId: number, commentId: number): Promise<void> => {
        await api.delete(`/post/${postId}/comment/${commentId}`);
    },

    save: async (id: number): Promise<void> => {
        await api.post(`/post/${id}/save`);
    },

    unsave: async (id: number): Promise<void> => {
        await api.delete(`/post/${id}/save`);
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/post/${id}`);
    }
};
