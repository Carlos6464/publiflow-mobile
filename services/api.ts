// services/api.ts
import axios from 'axios';

const api = axios.create({
  // Mudamos de localhost para o IP da sua máquina (baseado no seu log)
  baseURL: 'http://192.168.1.68:3333/api',
});

export default api;