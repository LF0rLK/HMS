import axios from 'axios';

// NEXT_PUBLIC_API_URL should be set to your backend base URL (no trailing slash).
// Examples:
//   Local:      http://localhost:5000/api
//   Production: https://hospital-backend-gold.vercel.app/api
//
// If the variable is set WITHOUT the /api suffix, we append it automatically
// so the app works regardless of how the env var is configured on Vercel.
const rawURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
const baseURL = rawURL.endsWith('/api') ? rawURL : `${rawURL.replace(/\/$/, '')}/api`;

if (!process.env.NEXT_PUBLIC_API_URL && typeof window === 'undefined') {
  console.warn('[axios] NEXT_PUBLIC_API_URL is not set — falling back to localhost. Set this in Vercel environment variables.');
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
