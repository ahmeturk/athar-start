import apiClient from './client.js';

export const adminAPI = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/admin/users${query ? `?${query}` : ''}`);
  },
  getUserDetail: (id) => apiClient.get(`/admin/users/${id}`),
  toggleUserActive: (id) => apiClient.put(`/admin/users/${id}/toggle-active`, {}),
  getPayments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/admin/payments${query ? `?${query}` : ''}`);
  },
  getAnalytics: () => apiClient.get('/admin/analytics'),
  getCoupons: () => apiClient.get('/admin/coupons'),
  createCoupon: (data) => apiClient.post('/admin/coupons', data),
  deleteCoupon: (id) => apiClient.delete(`/admin/coupons/${id}`),
  getSettings: () => apiClient.get('/admin/settings'),
  updateSettings: (data) => apiClient.put('/admin/settings', data),
};
