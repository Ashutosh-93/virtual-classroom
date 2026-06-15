// src/pages/dashboard/Dashboard.jsx
import React from 'react';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <main className="max-w-6xl mx-auto p-6 sm:p-8 font-sans">
      <div className="border border-[#ebebeb] dark:border-[#232323] rounded-xl p-6 sm:p-8 bg-white dark:bg-[#121212] shadow-[0px_1px_2px_rgba(0,0,0,0.02)] transition-colors">
        <p className="font-mono text-xs text-[#888888] dark:text-[#a3a3a3] uppercase tracking-wider mb-1">
          Secure Workspace Environment
        </p>
        <h1 className="text-3xl font-semibold text-[#171717] dark:text-[#ededed] tracking-tight">
          Welcome back, {user?.fullName || 'Learner'}.
        </h1>
        
        <div className="mt-8 h-48 border border-dashed border-[#a1a1a1]/30 rounded-lg flex items-center justify-center text-sm text-[#888888] dark:text-[#525252] font-mono p-4 text-center">
          Active premium course streams and interactive terminal labs are syncing live.
        </div>
      </div>
    </main>
  );
}