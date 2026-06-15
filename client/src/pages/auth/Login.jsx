import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, clearAuthError } from '../../features/auth/authSlice';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    dispatch(clearAuthError());
    
    // Track where the user intended to go before they were blocked by security
    const from = location.state?.from;
    const redirectTo = from ? `${from.pathname || ''}${from.search || ''}` : '/dashboard';
    if (!sessionStorage.getItem('authRedirectTo')) {
      sessionStorage.setItem('authRedirectTo', redirectTo);
    }
  }, [dispatch, location]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) return;

    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      const destination = sessionStorage.getItem('authRedirectTo') || '/dashboard';
      sessionStorage.removeItem('authRedirectTo');
      navigate(destination, { replace: true });
    }
  };

  return (
    <section className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center px-4 sm:px-6 py-12 md:py-24 font-sans selection:bg-[#171717] selection:text-[#f2f2f2] dark:selection:bg-[#ededed] dark:selection:text-[#121212] transition-colors duration-200">
      
      {/* Outer Card scales natively: expands fluidly on mobile, drops container anchors on desktop */}
      <div className="w-full max-w-[480px] bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl p-6 sm:p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.05),0px_2px_2px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_24px_rgba(0,0,0,0.4)]">
        
        <p className="font-mono text-xs uppercase tracking-normal text-[#888888] dark:text-[#a3a3a3] mb-2">
          Welcome back
        </p>
        
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#171717] dark:text-[#ededed] tracking-[-1.28px] leading-10 mb-6">
          Sign in.
        </h1>
        
        <GoogleAuthButton />
        
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-[#ebebeb] dark:border-[#232323]"></div>
          <span className="px-4 text-xs font-mono text-[#888888] dark:text-[#a3a3a3] uppercase">or</span>
          <div className="flex-grow border-t border-[#ebebeb] dark:border-[#232323]"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#f7d4d6] dark:bg-[#4c1d1f] border border-[#f5a623]/20 rounded-md">
            <p className="text-sm font-medium text-[#c50000] dark:text-[#ff8585]">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[#171717] dark:text-[#ededed] mb-1.5">Email address</label>
            <input
              type="email"
              value={form.email}
              disabled={loading}
              onChange={(e) => updateField('email', e.target.value)}
              autoComplete="email"
              required
              className="w-full h-10 bg-white dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ededed] border border-[#ebebeb] dark:border-[#232323] rounded-sm px-3 text-sm focus:outline-none focus:border-[#a1a1a1] dark:focus:border-[#888888] disabled:bg-[#fafafa] dark:disabled:bg-[#121212] transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-[#171717] dark:text-[#ededed]">Password</label>
              {/* Reference link is mounted cleanly, ready for later implementation */}
              <a href="#forgot" className="text-xs font-mono text-[#888888] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-white transition-colors">
                Forgot?
              </a>
            </div>
            <input
              type="password"
              value={form.password}
              disabled={loading}
              onChange={(e) => updateField('password', e.target.value)}
              autoComplete="current-password"
              required
              className="w-full h-10 bg-white dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ededed] border border-[#ebebeb] dark:border-[#232323] rounded-sm px-3 text-sm focus:outline-none focus:border-[#a1a1a1] dark:focus:border-[#888888] disabled:bg-[#fafafa] dark:disabled:bg-[#121212] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !form.email || !form.password}
            className="w-full h-12 bg-[#171717] dark:bg-[#ededed] text-white dark:text-[#121212] font-medium text-base rounded-[100px] transition-colors hover:bg-black dark:hover:bg-white disabled:bg-[#ebebeb] dark:disabled:bg-[#232323] disabled:text-[#888888] dark:disabled:text-[#525252] disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#4d4d4d] dark:text-[#a3a3a3] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#0070f3] dark:text-[#3b82f6] hover:underline font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </section>
  );
}