import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { sendOtp, setTempEmail, clearAuthError } from '../../features/auth/authSlice';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationMetrics, setValidationMetrics] = useState({
    hasLength: false,
    hasNumber: false,
    hasSymbol: false,
    hasUppercase: false,
    matchesConfirm: false,
  });

  useEffect(() => {
    dispatch(clearAuthError());
    const from = location.state?.from;
    const redirectTo = from ? `${from.pathname || ''}${from.search || ''}` : '/dashboard';
    sessionStorage.setItem('authRedirectTo', redirectTo);
  }, [dispatch, location]);

  useEffect(() => {
    const { password, confirmPassword } = form;
    setValidationMetrics({
      hasLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSymbol: /[@$!%*?&]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      matchesConfirm: password === confirmPassword && confirmPassword.length > 0,
    });
  }, [form.password, form.confirmPassword]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const isFormValid = Object.values(validationMetrics).every(Boolean) && form.name && form.email;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    const result = await dispatch(sendOtp(form));
    if (sendOtp.fulfilled.match(result)) {
      dispatch(setTempEmail(form.email));
      sessionStorage.setItem('tempEmailBackup', form.email);
      navigate('/verify-otp'); 
    }
  };

  return (
    <section className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center px-4 sm:px-6 py-12 md:py-24 font-sans selection:bg-[#171717] selection:text-[#f2f2f2] dark:selection:bg-[#ededed] dark:selection:text-[#121212] transition-colors duration-200">
      <div className="w-full max-w-[480px] bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl p-6 sm:p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.05),0px_2px_2px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_24px_rgba(0,0,0,0.4)] transition-all">
        
        <p className="font-mono text-xs uppercase tracking-normal text-[#888888] dark:text-[#a3a3a3] mb-2">
          Create your learner account
        </p>
        
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#171717] dark:text-[#ededed] tracking-[-1.28px] leading-10 mb-6">
          Sign up.
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
            <label className="block text-sm font-medium text-[#171717] dark:text-[#ededed] mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              disabled={loading}
              onChange={(e) => updateField('name', e.target.value)}
              autoComplete="name"
              required
              className="w-full h-10 bg-white dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ededed] border border-[#ebebeb] dark:border-[#232323] rounded-sm px-3 text-sm focus:outline-none focus:border-[#a1a1a1] dark:focus:border-[#888888] disabled:bg-[#fafafa] dark:disabled:bg-[#121212] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#171717] dark:text-[#ededed] mb-1.5">Email</label>
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
            <label className="block text-sm font-medium text-[#171717] dark:text-[#ededed] mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              disabled={loading}
              onChange={(e) => updateField('password', e.target.value)}
              autoComplete="new-password"
              required
              className="w-full h-10 bg-white dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ededed] border border-[#ebebeb] dark:border-[#232323] rounded-sm px-3 text-sm focus:outline-none focus:border-[#a1a1a1] dark:focus:border-[#888888] disabled:bg-[#fafafa] dark:disabled:bg-[#121212] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#171717] dark:text-[#ededed] mb-1.5">Confirm password</label>
            <input
              type="password"
              value={form.confirmPassword}
              disabled={loading}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              autoComplete="new-password"
              required
              className="w-full h-10 bg-white dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ededed] border border-[#ebebeb] dark:border-[#232323] rounded-sm px-3 text-sm focus:outline-none focus:border-[#a1a1a1] dark:focus:border-[#888888] disabled:bg-[#fafafa] dark:disabled:bg-[#121212] transition-colors"
            />
          </div>

          <div className="p-4 bg-[#fafafa] dark:bg-[#161616] border border-[#ebebeb] dark:border-[#232323] rounded-sm space-y-1.5">
            <p className={`text-xs font-mono flex items-center gap-2 transition-colors ${validationMetrics.hasLength ? 'text-[#0070f3] dark:text-[#3b82f6]' : 'text-[#888888] dark:text-[#737373]'}`}>
              {validationMetrics.hasLength ? '✓' : '•'} Minimum 8 characters
            </p>
            <p className={`text-xs font-mono flex items-center gap-2 transition-colors ${validationMetrics.hasUppercase ? 'text-[#0070f3] dark:text-[#3b82f6]' : 'text-[#888888] dark:text-[#737373]'}`}>
              {validationMetrics.hasUppercase ? '✓' : '•'} At least 1 uppercase letter
            </p>
            <p className={`text-xs font-mono flex items-center gap-2 transition-colors ${validationMetrics.hasNumber ? 'text-[#0070f3] dark:text-[#3b82f6]' : 'text-[#888888] dark:text-[#737373]'}`}>
              {validationMetrics.hasNumber ? '✓' : '•'} At least 1 number
            </p>
            <p className={`text-xs font-mono flex items-center gap-2 transition-colors ${validationMetrics.hasSymbol ? 'text-[#0070f3] dark:text-[#3b82f6]' : 'text-[#888888] dark:text-[#737373]'}`}>
              {validationMetrics.hasSymbol ? '✓' : '•'} At least 1 special character
            </p>
            <p className={`text-xs font-mono flex items-center gap-2 transition-colors ${validationMetrics.matchesConfirm ? 'text-[#0070f3] dark:text-[#3b82f6]' : 'text-[#888888] dark:text-[#737373]'}`}>
              {validationMetrics.matchesConfirm ? '✓' : '•'} Passwords match
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full h-12 bg-[#171717] dark:bg-[#ededed] text-white dark:text-[#121212] font-medium text-base rounded-[100px] transition-colors hover:bg-black dark:hover:bg-white disabled:bg-[#ebebeb] dark:disabled:bg-[#232323] disabled:text-[#888888] dark:disabled:text-[#525252] disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className="text-center text-sm text-[#4d4d4d] dark:text-[#a3a3a3] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0070f3] dark:text-[#3b82f6] hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}