import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { toggleWorkspaceMode, toggleSidebar } from '../../features/user/userSlice';

export default function Sidebar({ mobileOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef(null);
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  // Linked to global slice parameters
  const { profile, viewMode, isSidebarCollapsed } = useSelector((state) => state.user);
  
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isTeacher = profile?.role === 'teacher';

  // Automatically snap the mobile slide-out drawer shut when a user changes pages
  useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  // Click outside listener to drop the profile options popup menu box container safely
  useEffect(() => {
    function clickListener(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', clickListener);
    return () => document.removeEventListener('mousedown', clickListener);
  }, []);

  const handleWorkspaceChange = () => {
    dispatch(toggleWorkspaceMode());
    setShowRoleDropdown(false);
    if (viewMode === 'student') {
      navigate('/instructor/studio');
    } else {
      navigate('/');
    }
  };

  const handleSignOutClick = async () => {
    setShowProfileMenu(false);
    await dispatch(logout());
    navigate('/', { replace: true });
  };

  const studentLinks = [
    { name: 'My Learning Hub', path: '/dashboard', icon: '📊' },
    { name: 'My Library', path: '/dashboard/library', icon: '📚' },
    { name: 'Wishlist', path: '/dashboard/wishlist', icon: '🔖' },
    { name: 'Certificates', path: '/dashboard/certificates', icon: '🏅' },
    { name: 'Purchase Logs', path: '/dashboard/purchases', icon: '🧾' },
  ];

  const instructorLinks = [
    { name: 'Instructor Dashboard', path: '/instructor', icon: '📈' },
    { name: 'Course Studio', path: '/instructor/studio', icon: '🛠️' },
    { name: 'Student Roster', path: '/instructor/roster', icon: '👥' }, 
    { name: 'Revenue Ledger', path: '/instructor/revenue', icon: '💰' },
  ];

  const activeLinks = viewMode === 'student' ? studentLinks : instructorLinks;

  return (
    <>
      {/* 🌫️ FIXED BACKDROP OVERLAY LAYER: Placed strictly at z-40 */}
      {mobileOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 top-0 bg-black/40 backdrop-blur-xs z-40 block md:hidden transition-opacity duration-300"
        />
      )}

      {/* 📐 SIDEBAR DRAWER CONSOLE: Elevated to z-50 to completely escape the blur filter container */}
      <aside 
        className={`h-[calc(100vh-64px)] fixed bottom-0 bg-white dark:bg-[#0a0a0a] border-r border-[#ebebeb] dark:border-[#232323] flex flex-col justify-between z-50 transition-all duration-300
          ${mobileOpen ? 'left-0 w-64' : '-translate-x-full md:translate-x-0 left-0'} 
          ${isSidebarCollapsed ? 'md:w-16' : 'md:w-64'}
        `}
      >
        {/* Desktop Edge Width Chevron Button */}
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="hidden md:flex absolute -right-3 top-4 w-6 h-6 bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-full items-center justify-center shadow-sm text-neutral-400 hover:text-neutral-900 dark:hover:text-white z-50 cursor-pointer transition-transform duration-200"
        >
          <span className={`text-[10px] font-bold transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`}>
            ◀
          </span>
        </button>

        {/* ─── UPPER VIEWPORT NAVIGATION LINKS TRACK ─── */}
        <div className="p-3 w-full overflow-hidden">
          
          {/* Workspace Switcher Component Block */}
          {isTeacher && (!isSidebarCollapsed || mobileOpen) ? (
            <div className="relative mb-4">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="w-full h-10 px-3 bg-neutral-50 dark:bg-[#141414] border border-[#ebebeb] dark:border-[#232323] rounded-lg flex items-center justify-between text-left cursor-pointer hover:border-indigo-500/50 transition-colors"
              >
                <span className="text-sm font-medium tracking-tight">
                  {viewMode === 'student' ? '🎓 Learner Track' : '⚡ Creator Studio'}
                </span>
                <span className="text-[10px] text-neutral-400">▼</span>
              </button>

              {showRoleDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={handleWorkspaceChange}
                    className="w-full h-9 px-3 text-left text-xs font-medium hover:bg-neutral-50 dark:hover:bg-[#181818] text-neutral-700 dark:text-neutral-300 flex items-center justify-between cursor-pointer"
                  >
                    <span>Switch Workspace</span>
                    <span>⇄</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            isTeacher && isSidebarCollapsed && !mobileOpen && (
              <button 
                onClick={handleWorkspaceChange}
                title="Switch Workspace"
                className="w-10 h-10 mx-auto mb-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              >
                🔄
              </button>
            )
          )}

          <nav className="space-y-1 w-full">
            {activeLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/instructor' || link.path === '/dashboard'}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 h-10 rounded-lg transition-all duration-150 relative group
                  ${(isSidebarCollapsed && !mobileOpen) ? 'justify-center px-0' : 'px-3'}
                  ${isActive 
                    ? 'bg-neutral-100 dark:bg-[#161616] text-indigo-600 dark:text-indigo-400 font-medium' 
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#121212] hover:text-neutral-900 dark:hover:text-neutral-200'}
                `}
              >
                <span className="text-base shrink-0">{link.icon}</span>
                {(!isSidebarCollapsed || mobileOpen) && <span className="text-sm tracking-tight truncate">{link.name}</span>}
                
                {isSidebarCollapsed && !mobileOpen && (
                  <div className="absolute left-14 bg-neutral-900 text-white text-xs py-1 px-2 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                    {link.name}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ─── LOWER UTILITY FOOTER CONSOLE SUITE ─── */}
        <div className="p-2 border-t border-[#ebebeb] dark:border-[#232323] w-full bg-neutral-50/50 dark:bg-[#0c0c0c]/30 flex flex-col gap-1 relative" ref={profileMenuRef}>
          
          {isAuthenticated && (
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`w-full flex items-center gap-3 h-12 rounded-lg transition-all text-left focus:outline-none cursor-pointer hover:bg-neutral-100 dark:hover:bg-[#161616] group
                  ${(isSidebarCollapsed && !mobileOpen) ? 'justify-center px-0' : 'px-2'}
                `}
              >
                <div className="w-8 h-8 rounded-full border border-[#ebebeb] dark:border-[#232323] overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-neutral-500">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {(!isSidebarCollapsed || mobileOpen) && (
                  <div className="truncate flex-1 min-w-0 pr-1">
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate leading-tight">
                      {user?.fullName}
                    </p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono truncate mt-0.5 uppercase tracking-wider">
                      {user?.role || 'student'}
                    </p>
                  </div>
                )}
              </button>

              {showProfileMenu && (
                <div 
                  className={`absolute bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl shadow-xl p-1 z-50 flex flex-col gap-0.5 w-48 animate-in fade-in slide-in-from-bottom-2 duration-150
                    ${(isSidebarCollapsed && !mobileOpen) 
                      ? 'left-16 bottom-0' 
                      : 'left-1 right-1 bottom-[calc(100%+6px)]' 
                    }
                  `}
                >
                  <div className="px-2 py-1.5 border-b border-[#ebebeb] dark:border-[#232323] text-left select-none">
                    <p className="text-[9px] font-mono font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOutClick}
                    className="w-full flex items-center h-8 px-2 text-[11px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg font-medium transition-colors cursor-pointer text-left"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          <NavLink
            to="/profile/settings"
            className={({ isActive }) => `
              w-full flex items-center gap-3 h-10 rounded-lg transition-all relative group
              ${(isSidebarCollapsed && !mobileOpen) ? 'justify-center px-0' : 'px-2'}
              ${isActive 
                ? 'bg-neutral-100 dark:bg-[#161616] text-indigo-600 dark:text-indigo-400 font-medium' 
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#121212] hover:text-neutral-900 dark:hover:text-neutral-200'}
            `}
          >
            <span className="text-base shrink-0">⚙️</span>
            {(!isSidebarCollapsed || mobileOpen) && <span className="text-sm tracking-tight truncate">Profile & Settings</span>}
          </NavLink>
        </div>
      </aside>
    </>
  );
}