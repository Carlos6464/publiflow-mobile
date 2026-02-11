import api from './api';

export interface User {
  id: number;
  nomeCompleto: string;
  email: string;
  telefone: string;
  papelUsuarioID: number;
  // A senha não retorna no GET por segurança
}

export const userService = {
  // Busca lista por tipo (Professor = 2)
  getByType: async (typeId: number) => {
    // Atenção: Se o endpoint for estritamente /users/{type} e type for numero,
    // pode conflitar com /users/{id}. 
    // Vou assumir que o backend diferencia ou usa /users/type/{id}
    // Ajuste a URL abaixo conforme sua rota exata no backend.
    const response = await api.get<User[]>(`/users/type/${typeId}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/users/${id}`);
  }
};