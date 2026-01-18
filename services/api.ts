// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  // Substitua pelo IP da sua máquina se estiver testando em dispositivo físico
  baseURL: 'http://localhost:3333',
});

export default api;