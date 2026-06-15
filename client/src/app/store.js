import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, // Active profile, roles, and viewMode state manager
    // Future slices like course, lecture, progress will drop in right here
  },
  devTools: process.env.NODE_ENV !== 'production', // Security measure for production
});