import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './features/auth/authSlice';

// Architectural Guard & Shared Frame Layout Shell Imports
import { ProtectedRoute, PublicRoute } from './components/auth/RouteGuards';
import GlobalLayoutShell from './components/layout/GlobalLayoutShell';

// Production Page Module Injections (Full-Screen Window Overrides)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';
// import LectureTheater from './pages/LectureTheater';

// Sub-Folder Modulated Component Views Allocation
import MarketplaceHome from './views/student/MarketplaceHome';
import StudentDashboardView from './views/student/StudentDashboardView';
import MyLibraryView from './views/student/MyLibraryView';
import WishlistView from './views/student/WishlistView';
import CertificatesView from './views/student/CertificatesView';
import PurchaseLogsView from './views/student/PurchaseLogsView';

import AccountSettingsView from './views/common/AccountSettingsView';

import InstructorDashboardView from './views/teacher/InstructorDashboardView';
import CourseStudioView from './views/teacher/CourseStudioView';
import StudentRosterView from './views/teacher/StudentRosterView';
import RevenueLedgerView from './views/teacher/RevenueLedgerView';

export default function App() {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  // Sync session authentication state on cold boot with safe HTTP-only verification[cite: 1]
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center font-mono text-xs text-[#888888] dark:text-[#737373]">
        Initializing runtime security layer...
      </div>
    );
  }

  return (
    <Routes>
      {/* ─── HYBRID TRACKS (Inherit Collapsible Layout & Navbar via Shell Outlet) ─── */}
      <Route element={<GlobalLayoutShell />}>
        {/* Public Discovery Component Route Catalog */}
        <Route path="/" element={<MarketplaceHome />} />
        
        {/* Guarded Student Platform Views */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboardView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/library" 
          element={
            <ProtectedRoute>
              <MyLibraryView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/wishlist" 
          element={
            <ProtectedRoute>
              <WishlistView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/certificates" 
          element={
            <ProtectedRoute>
              <CertificatesView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/purchases" 
          element={
            <ProtectedRoute>
              <PurchaseLogsView />
            </ProtectedRoute>
          } 
        />
        
        {/* Common Inter-Persona Component Preference Configuration Views */}
        <Route 
          path="/profile/settings" 
          element={
            <ProtectedRoute>
              <AccountSettingsView />
            </ProtectedRoute>
          } 
        />

        {/* Guarded Instructor/Teacher Platform Views */}
        <Route 
          path="/instructor" 
          element={
            <ProtectedRoute>
              <InstructorDashboardView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/instructor/studio" 
          element={
            <ProtectedRoute>
              <CourseStudioView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/instructor/roster" 
          element={
            <ProtectedRoute>
              <StudentRosterView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/instructor/revenue" 
          element={
            <ProtectedRoute>
              <RevenueLedgerView />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* ─── PUBLIC-ONLY GATES (Isolated minimal screens without Nav rails) ─── */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      <Route 
        path="/verify-otp" 
        element={
          <PublicRoute>
            <VerifyOtp />
          </PublicRoute>
        } 
      />

      {/* ─── ULTRA FOCUS FULL-SCREEN THEATER (No Outer Layout Overlays) ─── */}
      {/* <Route 
        path="/watch/:courseId" 
        element={
          <ProtectedRoute>
            <LectureTheater />
          </ProtectedRoute>
        } 
      /> */}

      {/* Fallback Catch-All Wildcard Exception Safe Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}