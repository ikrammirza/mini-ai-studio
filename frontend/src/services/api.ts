// frontend/src/services/api.ts
import axios from 'axios';

// Base URL of your backend server
const API_URL = 'http://localhost:3000/api'; // Adjust port if necessary

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mini_ai_studio_jwt');
  if (token) {
    // Only set the Authorization header if a token exists
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Example for Signup
export const signup = (email: string, password: string) => 
  api.post('/auth/signup', { email, password });

// Example for Login
export const login = (email: string, password: string) => 
  api.post('/auth/login', { email, password });

// Example for POST Generations (will need modification for multipart form data)
export const postGeneration = (data: FormData, signal?: AbortSignal) =>
  api.post('/generations', data, {
    // Add the signal to the axios config
    signal: signal,
    // Ensure the header is correctly set for multipart
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// Example for GET Generations
export const getGenerations = (limit: number = 5) => 
  api.get('/generations', { params: { limit } });

export default api;