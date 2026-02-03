import apiClient from './client.js';

export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  googleAuth: (credential) => apiClient.post('/auth/google', { credential }),
  getMe: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout', {}),
};
