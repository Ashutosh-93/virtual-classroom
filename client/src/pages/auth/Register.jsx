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
    
    // Capture and secure route-forwarding destination instantly
    const from = location.state?.from;
    const redirectTo = from ? `${from.pathname || ''}${from.search || ''}` : '/dashboard';
    sessionStorage.setItem('authRedirectTo', redirectTo);
  }, [dispatch, location]);

  // Real-time calculation loop matching Vercel's subtle visual indicator system
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
    <section className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-24 font-sans selection:bg-[#171717] selection:text-[#f2f2f2]">
      <div className="w-full max-w-[480px] bg-white border border-[#ebebeb] rounded-xl p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.05),0px_2px_2px_rgba(0,0,0,0.1)] transition-all">
        
        {/* Monospace Eyebrow Indicator */}
        <p className="font-mono text-xs uppercase tracking-normal text-[#888888] mb-2">
          Create your learner account
        </p>
        
        {/* Sentence Case Headline with Negative Tracking */}
        <h1 className="text-3xl font-semibold text-[#171717] tracking-[-1.28px] leading-10 mb-6">
          Sign up.
        </h1>
        
        {/* Integrated Google Component Module */}
        <GoogleAuthButton />
        
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-[#ebebeb]"></div>
          <span className="px-4 text-xs font-mono text-[#888888] uppercase">or</span>
          <div className="flex-grow border-t border-[#ebebeb]"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#f7d4d6] border border-[#f5a623]/20 rounded-md">
            <p className="text-sm font-medium text-[#c50000]">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[#171717] mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              disabled={loading}
              onChange={(e) => updateField('name', e.target.value)}
              autoComplete="name"
              required
              className="w-full h-10 bg-white text-[#171717] border border-[#ebebeb] rounded-sm px-3 text-sm focus:outline-none focus:border-[#a1a1a1] disabled:bg-[#fafafa] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#171717] mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              disabled={loading}
              onChange={(e) => updateField('email', e.target.value)}
              autoComplete="email"
              required
              className="w-full h-10 bg-white text-[#171717] border border-[#ebebeb] rounded-sm px-3 text-sm focus:outline-none focus:border-[#a1a1a1] disabled:bg-[#fafafa] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#171717] mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              disabled={loading}
              onChange={(e) => updateField('password', e.target.value)}
              autoComplete="new-password"
              required
              className="w-full h-10 bg-white text-[#171717] border border-[#ebebeb] rounded-sm px-3 text-sm focus:outline-none focus:border-[#a1a1a1] disabled:bg-[#fafafa] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#171717] mb-1.5">Confirm password</label>
            <input
              type="password"
              value={form.confirmPassword}
              disabled={loading}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              autoComplete="new-password"
              required
              className="w-full h-10 bg-white text-[#171717] border border-[#ebebeb] rounded-sm px-3 text-sm focus:outline-none focus:border-[#a1a1a1] disabled:bg-[#fafafa] transition-colors"
            />
          </div>

          {/* Real-time Technical Metric Checklist */}
          <div className="p-4 bg-[#fafafa] border border-[#ebebeb] rounded-sm space-y-1.5">
            <p className={`text-xs font-mono flex items-center gap-2 transition-colors ${validationMetrics.hasLength ? 'text-[#0070f3]' : 'text-[#888888]'}`}>
              {validationMetrics.hasLength ? '✓' : '•'} Minimum 8 characters
            </p>
            <p className={`text-xs font-mono flex items-center gap-2 transition-colors ${validationMetrics.hasUppercase ? 'text-[#0070f3]' : 'text-[#888888]'}`}>
              {validationMetrics.hasUppercase ? '✓' : '•'} At least 1 uppercase letter
            </p>
            <p className={`text-xs font-mono flex items-center gap-2 transition-colors ${validationMetrics.hasNumber ? 'text-[#0070f3]' : 'text-[#888888]'}`}>
              {validationMetrics.hasNumber ? '✓' : '•'} At least 1 number
            </p>
            <p className={`text-xs font-mono flex items-center gap-2 transition-colors ${validationMetrics.hasSymbol ? 'text-[#0070f3]' : 'text-[#888888]'}`}>
              {validationMetrics.hasSymbol ? '✓' : '•'} At least 1 special character
            </p>
            <p className={`text-xs font-mono flex items-center gap-2 transition-colors ${validationMetrics.matchesConfirm ? 'text-[#0070f3]' : 'text-[#888888]'}`}>
              {validationMetrics.matchesConfirm ? '✓' : '•'} Passwords match
            </p>
          </div>

          {/* Vercel Primary Black Pill Button Shape */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full h-12 bg-[#171717] text-white font-medium text-base rounded-[100px] transition-colors hover:bg-black disabled:bg-[#ebebeb] disabled:text-[#888888] disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className="text-center text-sm text-[#4d4d4d] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0070f3] hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}