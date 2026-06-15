import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Navbar({ onMenuToggle }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-[#ebebeb] dark:border-[#232323] transition-colors duration-200">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left Track: Mobile Trigger & Branding Node */}
        <div className="flex items-center gap-3 flex-1 sm:flex-initial">
          
          {/* ☰ 3-Line Hamburger Menu Icon: Only visible on mobile viewports (< 768px) */}
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
            className="block md:hidden p-1.5 rounded-lg border border-[#ebebeb] dark:border-[#232323] hover:bg-[#fafafa] dark:hover:bg-[#161616] text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Explicitly branded logo - Snapped to far left on PC, slides next to burger on mobile */}
          <Link to="/" className="text-xl font-bold tracking-[-1.5px] text-[#171717] dark:text-[#ededed] select-none">
            Eduzant<span className="text-indigo-600 font-black">.</span>
          </Link>

          {/* Search Box: PC Desktop Window Explorer */}
          <div className="hidden sm:block relative w-full max-w-[280px]">
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full h-9 bg-[#fafafa] dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-md pl-8 pr-3 text-xs focus:outline-none focus:border-[#a1a1a1] dark:focus:border-[#888888] text-[#171717] dark:text-[#ededed] transition-colors placeholder:text-[#888888]"
            />
            <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Right Track: Clean Single Action Input Indicator */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <Link to="/signup" className="h-9 px-4 bg-[#171717] dark:bg-[#ededed] text-white dark:text-[#121212] text-sm font-medium flex items-center justify-center rounded-[100px] hover:bg-black dark:hover:bg-white transition-colors">
              Sign up
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-full border border-[#ebebeb] dark:border-[#232323] overflow-hidden bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-700 select-none pointer-events-none">
              {user?.profilePic ? (
                <img 
                  src={user.profilePic} 
                  alt="Session Avatar Indicator" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-semibold font-mono text-[#4d4d4d] dark:text-[#a3a3a3]">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}