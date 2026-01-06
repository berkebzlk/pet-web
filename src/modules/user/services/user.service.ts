import { api } from "../../../shared/lib/api";

export interface User {
    id: number;
    name: string;
    username: string;
    image?: string;
}

export const userService = {
    searchUsers: async (query: string, limit = 5): Promise<User[]> => {
        const response = await api.get('/user/search', { params: { q: query, limit } });
        return response.data.data;
    }
};
