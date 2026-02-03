import apiClient from './client.js';

export const paymentsAPI = {
  create: (data) => apiClient.post('/payments/create', data),
  verify: (paymentId) => apiClient.post(`/payments/verify/${paymentId}`, {}),
  verifyCoupon: (code) => apiClient.post('/payments/verify-coupon', { code }),
  getMyPayments: () => apiClient.get('/payments/my-payments'),
};
