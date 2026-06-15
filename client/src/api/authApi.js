import axiosInstance from './axiosInstance';

export const authApi = {
  sendOtp: (data) => axiosInstance.post('/auth/send-otp', data),
  verifyOtp: (data) => axiosInstance.post('/auth/verify-otp', data),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  googleLogin: (idToken) => axiosInstance.post('/auth/google-login', { idToken }),
  logout: () => axiosInstance.post('/auth/logout'),
  getCurrentUser: () => axiosInstance.get('/user/me'),
};

