import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Crucial for your HTTP-only cookie authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Production-grade error interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized API error handling (e.g., logging out user if cookie expires)
    const message = error.response?.data?.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;