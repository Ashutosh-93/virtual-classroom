import React, { useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './features/auth/authSlice';

// Page Imports
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';

// Placeholder Pages for Integration & Testing
function HomePlaceholder() {
  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-6 text-center select-none">
      <div className="relative mb-8">
        {/* Subtle mesh background atmospheric shape representation */}
        <div className="absolute -inset-10 bg-gradient-to-r from-[#007cf0] via-[#7928ca] to-[#ff4d4d] opacity-10 blur-xl rounded-full"></div>
        <h1 className="relative text-5xl md:text-6xl font-semibold text-[#171717] tracking-[-2.4px] leading-none mb-4">
          Virtual Classroom.
        </h1>
      </div>
      <p className="text-lg md:text-xl text-[#4d4d4d] max-w-[600px] mb-8 tracking-tight">
        An production-grade learning system designed for developers and engineers.
      </p>
      <div className="flex items-center gap-4">
        <Link to="/signup" className="h-12 px-8 bg-[#171717] text-white text-base font-medium flex items-center justify-center rounded-[100px] hover:bg-black transition-colors shadow-[0px_2px_4px_rgba(0,0,0,0.05)]">
          Get Started
        </Link>
        <Link to="/login" className="h-12 px-8 bg-white text-[#171717] border border-[#ebebeb] text-base font-medium flex items-center justify-center rounded-[100px] hover:bg-[#fafafa] transition-colors shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          Log in
        </Link>
      </div>
    </main>
  );
}

function DashboardPlaceholder() {
  return (
    <main className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-6xl mx-auto border border-[#ebebeb] rounded-xl p-8 bg-[#fafafa]">
        <p className="font-mono text-xs text-[#888888] uppercase tracking-wider mb-2">Workspace</p>
        <h1 className="text-3xl font-semibold text-[#171717] tracking-tight mb-4">Student Dashboard.</h1>
        <div className="h-32 border border-dashed border-[#a1a1a1]/30 rounded-md flex items-center justify-center text-sm text-[#888888] font-mono">
          Course inventory stream mapping placeholder
        </div>
      </div>
    </main>
  );
}

function LoginPlaceholder() {
  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="w-full max-w-[480px] bg-white border border-[#ebebeb] rounded-xl p-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[#171717] mb-4">Sign in.</h1>
        <p className="text-sm text-[#4d4d4d] mb-6">Login page placeholder frame.</p>
        <Link to="/signup" className="text-[#0070f3] hover:underline text-sm font-medium">Create an account instead</Link>
      </div>
    </main>
  );
}

// Global App Assembly Layout
export default function App() {
  const dispatch = useDispatch();
  const { isInitialized, isAuthenticated } = useSelector((state) => state.auth);

  // Read active cookies on application boot to authorize authenticated user states
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Block execution window to resolve initialization checks cleanly and avoid visual flickering
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-mono text-xs text-[#888888]">
        Initializing session...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePlaceholder />} />
      <Route path="/login" element={<LoginPlaceholder />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* Basic Workspace Tree Layout Route (Guarded Manually For Testing Now) */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <DashboardPlaceholder /> : <Navigate to="/login" replace />} 
      />

      {/* Catch-all Wildcard Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}