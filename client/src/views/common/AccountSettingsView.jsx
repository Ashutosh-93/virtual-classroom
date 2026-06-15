import React from 'react';
import { useSelector } from 'react-redux';
// Ensure this path maps accurately to where your global ThemeContext engine sits!
import { useTheme } from '../../context/ThemeContext'; 

export default function AccountSettingsView() {
  const { profile } = useSelector((state) => state.user);
  const { theme, setTheme } = useTheme();

  const isStudentOnly = profile?.role === 'student';

  const handleLaunchUpgradeGateway = () => {
    // This will connect straight to your custom routing push to go to /verify-otp
    console.log("Redirecting to full-screen /verify-otp security handshake terminal...");
  };

  return (
    <div className="w-full max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Configure your workspace identity metrics and preferences.</p>
      </div>

      {/* ─── CARD SECTION 1: IDENTITY PROFILE DETAILS ─── */}
      <section className="bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Identity Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-500">Full Name</label>
            <input 
              type="text" 
              defaultValue={profile?.fullName || ''}
              className="w-full h-9 px-3 text-sm bg-neutral-50 dark:bg-[#161616] border border-[#ebebeb] dark:border-[#232323] rounded-lg focus:outline-none focus:border-indigo-500" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-500">Email Reference</label>
            <input 
              type="email" 
              disabled
              defaultValue={profile?.email || ''}
              className="w-full h-9 px-3 text-sm bg-neutral-100 dark:bg-[#1c1c1c] border border-[#ebebeb] dark:border-[#232323] rounded-lg text-neutral-400 cursor-not-allowed focus:outline-none" 
            />
          </div>
        </div>
      </section>

      {/* ─── CARD SECTION 2: SYSTEM THEME ENGINE SELECTION ─── */}
      <section className="bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl p-6 space-y-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">App Appearance</h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Customize how the platform's visual interface renders on your screen layout.</p>
        </div>
        
        {/* Segmented Controller Styling Group */}
        <div className="inline-flex p-1 bg-neutral-100 dark:bg-[#161616] border border-[#ebebeb] dark:border-[#232323] rounded-xl gap-1">
          {['light', 'dark', 'system'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTheme(mode)}
              className={`h-8 px-4 text-xs font-medium capitalize rounded-lg transition-all cursor-pointer
                ${theme === mode 
                  ? 'bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'}
              `}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      {/* ─── CARD SECTION 3: HIERARCHICAL ELEVATION GATEWAY TRIGGER ─── */}
      {isStudentOnly && (
        <section className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-500/20 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">Become an Instructor on Eduzant</h3>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Unlock our creation suites to build custom curriculum structures, process media lecture uploads, and configure monthly payment withdrawal pipelines.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLaunchUpgradeGateway}
            className="h-9 px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg whitespace-nowrap self-start sm:self-center cursor-pointer transition-colors shadow-sm"
          >
            Launch Upgrade Portal ➔
          </button>
        </section>
      )}
    </div>
  );
}