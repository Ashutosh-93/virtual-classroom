import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,       // Stores backend profile payloads: { name, email, avatar, role }
  viewMode: 'student', // Operating mindset toggle track: 'student' or 'instructor'
  loading: false,
  error: null,
  isSidebarCollapsed: false, // ◄── New Global UI State Parameter added cleanly
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      // Initialize viewMode safely based on their starting profile role
      state.viewMode = action.payload?.role === 'teacher' ? 'instructor' : 'student';
    },
    toggleWorkspaceMode: (state) => {
      // Prevent unauthorized role switches if they aren't a teacher yet
      if (state.profile?.role === 'teacher') {
        state.viewMode = state.viewMode === 'student' ? 'instructor' : 'student';
      }
    },
    upgradeToTeacherSuccess: (state, action) => {
      // action.payload maps the freshly updated user record array from the backend
      if (state.profile) {
        state.profile.role = 'teacher';
        state.viewMode = 'instructor'; // Instantly flip their environment into creator mode!
      }
    },
    updateProfileDetails: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.viewMode = 'student';
    },
    // ◄── New Global UI Synchronization Reducer Action added cleanly without changing anything else
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    }
  },
});

export const { 
  setUserProfile, 
  toggleWorkspaceMode, 
  upgradeToTeacherSuccess, 
  updateProfileDetails, 
  clearUserProfile,
  toggleSidebar // ◄── Exported cleanly right here
} = userSlice.actions;

export default userSlice.reducer;