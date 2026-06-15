import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function GlobalLayoutShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Hook into the central user slice to monitor layout footprint parameters
  const { isSidebarCollapsed } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0d0d0d] text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200">
      
      {/* Pinned Roof Header Panel */}
      <Navbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <div className="flex flex-1">
        {/* Pinned Left Rail Variable Sidebar Panel */}
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Dynamic Outlet Component View Replacement Zone */}
        <main className={`flex-1 min-w-0 transition-all duration-300 ease-in-out pt-16
          /* 📱 Responsive Grid Matrix: 
             - Drop left-padding to 0 on mobile ports (< 768px)
             - Electronically switch spacing widths on PC desktop view ports seamlessly
          */
          pl-0 ${isSidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}
        `}>
          <div className="p-6 h-full w-full max-w-7xl mx-auto animate-in fade-in duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}