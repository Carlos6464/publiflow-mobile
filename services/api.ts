import axios from 'axios';

// Pega a URL base (ex: http://192.168.1.68:3333)
const url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333';

const api = axios.create({
  // Adicionamos o "/api" aqui. 
  // Assim, as chamadas viram: http://ip:3333/api/login
  baseURL: `${url}/api`,
});

export default api;