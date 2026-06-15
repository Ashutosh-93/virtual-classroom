import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';

// Async Thunk for sending registration OTP
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (signupData, { rejectWithValue }) => {
    try {
      const response = await authApi.sendOtp(signupData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

// Async Thunk for verifying registration OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOtp(verificationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Invalid OTP');
    }
  }
);

// Async Thunk for Google Login Integration
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await authApi.googleLogin(idToken);
      return response.data.user; // Extract user payload: { id, fullName, email, role, profilePic }
    } catch (error) {
      return rejectWithValue(error.message || 'Google authentication failed');
    }
  }
);

// Async Thunk to fetch logged-in profile on refresh (prevents route flickering)
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      return response.data.user;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
  tempEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setTempEmail: (state, action) => {
      state.tempEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP Lifecycle
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Verify OTP Lifecycle
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.tempEmail = null; 
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Google Login Lifecycle
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Auth Status Lifecycle
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      });
  },
});

export const { clearAuthError, setTempEmail } = authSlice.actions;
export default authSlice.reducer;