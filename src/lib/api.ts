import axios from 'axios';
import { recaptchaToken } from './recaptcha';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const protectedActions: Record<string, string> = {
      '/auth/register': 'register',
      '/auth/forgot-password': 'forgot_password',
      '/contact': 'contact',
    };
    const action = protectedActions[config.url || ''];
    if (config.method?.toLowerCase() === 'post' && action) {
      const token = await recaptchaToken(action);
      if (token) config.headers['X-Recaptcha-Token'] = token;
    }
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

api.interceptors.response.use(response => response, error => {
  if (typeof window !== 'undefined' && error.response?.status === 401) {
    const token = localStorage.getItem('accessToken');
    if (token && error.config?.headers?.Authorization === `Bearer ${token}`) {
      let role = '';
      try { role = JSON.parse(localStorage.getItem('user') || '{}').roleName || ''; } catch {}
      localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('nakathata:session-expired', { detail: { role } }));
    }
  }
  return Promise.reject(error);
});
