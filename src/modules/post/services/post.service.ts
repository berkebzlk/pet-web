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

        const response = await api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    getFeed: async (): Promise<Post[]> => {
        const response = await api.get('/posts');
        return response.data.data;
    },

    getPetPosts: async (petId: number): Promise<Post[]> => {
        const response = await api.get(`/pet/${petId}/posts`);
        return response.data.data;
    },

    like: async (id: number): Promise<void> => {
        await api.post(`/posts/${id}/like`);
    },

    unlike: async (id: number): Promise<void> => {
        await api.delete(`/posts/${id}/like`);
    },

    comment: async (id: number, content: string): Promise<Comment> => {
        const response = await api.post(`/posts/${id}/comments`, { content });
        return response.data.data;
    },

    deleteComment: async (postId: number, commentId: number): Promise<void> => {
        await api.delete(`/posts/${postId}/comments/${commentId}`);
    },

    save: async (id: number): Promise<void> => {
        await api.post(`/posts/${id}/save`);
    },

    unsave: async (id: number): Promise<void> => {
        await api.delete(`/posts/${id}/save`);
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/posts/${id}`);
    }
};
