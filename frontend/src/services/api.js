import axios from 'axios';
import { mockApi } from './mockApi';

// Use mock API for development when backend is not available
const USE_MOCK_API = true;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    if (USE_MOCK_API) {
      return mockApi.login(credentials);
    }
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    if (USE_MOCK_API) {
      return mockApi.register(userData);
    }
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getMe: async () => {
    if (USE_MOCK_API) {
      return mockApi.getMe();
    }
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Interview API
export const interviewAPI = {
  getInterviews: async (params) => {
    if (USE_MOCK_API) {
      return mockApi.getInterviews(params);
    }
    const response = await api.get('/interviews', { params });
    return response.data;
  },
  getInterview: async (id) => {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
  },
  createInterview: async (data) => {
    if (USE_MOCK_API) {
      return mockApi.createInterview(data);
    }
    const response = await api.post('/interviews', data);
    return response.data;
  },
  updateInterview: async (id, data) => {
    if (USE_MOCK_API) {
      return mockApi.updateInterview(id, data);
    }
    const response = await api.put(`/interviews/${id}`, data);
    return response.data;
  },
  deleteInterview: async (id) => {
    if (USE_MOCK_API) {
      return mockApi.deleteInterview(id);
    }
    const response = await api.delete(`/interviews/${id}`);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: async () => {
    if (USE_MOCK_API) {
      return mockApi.getAnalytics();
    }
    const response = await api.get('/analytics');
    return response.data;
  },
};

// Activity API
export const activityAPI = {
  getActivity: async (params) => {
    if (USE_MOCK_API) {
      return mockApi.getActivity(params);
    }
    const response = await api.get('/activity', { params });
    return response.data;
  },
};

export default api;
