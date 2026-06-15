import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

// ─── PRIVATE ONLY GUARD ───
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-mono text-xs text-[#888888]">
        Verifying security clearance...
      </div>
    );
  }

  // Intercept and redirect unauthenticated attempts while saving intent location state
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// ─── UNAUTHENTICATED ONLY GUARD (PUBLIC EXCLUSIVE) ───
export function PublicRoute({ children }) {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-mono text-xs text-[#888888]">
        Loading workspace profile...
      </div>
    );
  }

  // If already authenticated, do not permit viewing login/signup screens
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}