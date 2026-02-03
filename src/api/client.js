/**
 * API Client - centralized HTTP client for all API calls
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
    this.token = localStorage.getItem('athar_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('athar_token', token);
    } else {
      localStorage.removeItem('athar_token');
    }
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('athar_token');
    }
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // If unauthorized, clear token
        if (response.status === 401) {
          this.setToken(null);
          localStorage.removeItem('athar_auth');
        }
        throw new ApiError(data.message || 'حدث خطأ', response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('لا يمكن الاتصال بالخادم', 0, null);
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Singleton instance
const apiClient = new ApiClient();
export default apiClient;
export { ApiError };
