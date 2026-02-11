import api from './api';

export interface Post {
  id: number;
  titulo: string;
  descricao: string;
  visibilidade: boolean;
  caminhoImagem: string | null;
  autorID: number;
}

interface PaginatedResponse {
  data: Post[];
  meta: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const postService = {
  getAll: async ({ page = 1, limit = 6, q = '' }) => {
    const response = await api.get<PaginatedResponse>('/posts/feed', {
      params: { page, limit, q }
    });
    return { posts: response.data.data, meta: response.data.meta };
  },

  getById: async (id: string) => {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get<Post[]>('/posts');
    return response.data;
  },

  // No create
  create: async (data: FormData) => {
    try {
      const response = await api.post('/posts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Tente adicionar de novo AGORA (depois de resolver URL)
        },
        transformRequest: (formData) => formData,  // Impede Axios de serializar errado
        // Opcional: para arquivos maiores
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      return response.data;
    } catch (error: any) {
      console.error('CREATE ERROR:', {
        status: error.response?.status,
        serverMsg: error.response?.data,
        headersSent: error.config?.headers,
      });
      throw error;
    }
  },

  // No update faça o mesmo
  update: async (id: number, data: FormData) => {
    try {
      const response = await api.put(`/posts/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Tente adicionar de novo AGORA (depois de resolver URL)
        },
        transformRequest: (formData) => formData,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      return response.data;
    } catch (error: any) {
      console.error('UPDATE ERROR:', {
        status: error.response?.status,
        serverMsg: error.response?.data,
        headersSent: error.config?.headers,
      });
      throw error;
    }
  },

  delete: async (id: number) => {
    await api.delete(`/posts/${id}`);
  }
};