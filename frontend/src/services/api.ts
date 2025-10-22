// frontend/src/services/api.ts
import axios from 'axios';

// Base URL of your backend server
const API_URL = 'http://localhost:4000/api'; // Adjust port if needed

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json', // default, overridden when using multipart
  },
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mini_ai_studio_jwt');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
}, (error) => Promise.reject(error));

// Signup
export const signup = (email: string, password: string) =>
  api.post('/auth/signup', { email, password });

// Login
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

// Generate Image (multipart/form-data)
export const postGeneration = (data: FormData, signal?: AbortSignal) =>
  api.post('/generations', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    signal, // for aborting requests
  });

// Get last N generations
export const getGenerations = (limit: number = 5) =>
  api.get('/generations', { params: { limit } });

// Logout helper
export const logout = () => localStorage.removeItem('mini_ai_studio_jwt');

export default api;
