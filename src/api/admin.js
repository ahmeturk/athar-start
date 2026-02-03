import apiClient from './client.js';

export const adminAPI = {
  // Dashboard
  getDashboard: () => apiClient.get('/admin/dashboard'),

  // Users
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/admin/users${query ? `?${query}` : ''}`);
  },
  getUserDetail: (id) => apiClient.get(`/admin/users/${id}`),
  toggleUserActive: (id) => apiClient.put(`/admin/users/${id}/toggle-active`, {}),

  // Payments
  getPayments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/admin/payments${query ? `?${query}` : ''}`);
  },

  // Analytics
  getAnalytics: () => apiClient.get('/admin/analytics'),

  // Coupons
  getCoupons: () => apiClient.get('/admin/coupons'),
  createCoupon: (data) => apiClient.post('/admin/coupons', data),
  deleteCoupon: (id) => apiClient.delete(`/admin/coupons/${id}`),

  // Settings
  getSettings: () => apiClient.get('/admin/settings'),
  updateSettings: (data) => apiClient.put('/admin/settings', data),

  // Assessment Steps
  getSteps: () => apiClient.get('/admin/steps'),
  updateSteps: (steps) => apiClient.put('/admin/steps', { steps }),
  toggleStep: (stepId) => apiClient.put(`/admin/steps/${stepId}/toggle`, {}),
  updateStep: (stepId, data) => apiClient.put(`/admin/steps/${stepId}`, data),

  // Videos
  getVideos: () => apiClient.get('/admin/videos'),
  createVideo: (data) => apiClient.post('/admin/videos', data),
  updateVideo: (videoId, data) => apiClient.put(`/admin/videos/${videoId}`, data),
  deleteVideo: (videoId) => apiClient.delete(`/admin/videos/${videoId}`),
  reorderVideos: (videos) => apiClient.put('/admin/videos/reorder', { videos }),
};
