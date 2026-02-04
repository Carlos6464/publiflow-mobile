import api from './api';

export interface Post {
    id: number;
    titulo: string;
    descricao: string;
    visibilidade: boolean;
    caminhoImagem: string | null;
    autorID: number;
}

// Interface que espelha a resposta do seu backend
interface PaginatedResponse {
    data: Post[];
    meta: {
        totalPages: number;
        currentPage: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

interface FeedParams {
    page?: number;
    limit?: number;
    q?: string;
}

export const postService = {
    // Agora retorna o objeto completo com dados e meta
    getAll: async ({ page = 1, limit = 6, q = '' }: FeedParams) => {
        const response = await api.get<PaginatedResponse>('/posts/feed', {
            params: { page, limit, q }
        });

        // Retorna exatamente o que o componente precisa
        return {
            posts: response.data.data, // O Array de posts
            meta: response.data.meta   // Os dados de paginação
        };
    },

    getById: async (id: string) => {
        const response = await api.get<Post>(`/posts/${id}`);
        return response.data;
    }
};