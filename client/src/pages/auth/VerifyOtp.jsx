import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyOtp, sendOtp, clearAuthError, setTempEmail } from '../../features/auth/authSlice';
import { OtpInput } from '../../components/auth/OtpInput';

const RESEND_SECONDS = 300; // 5-minute Vercel-style technical lockout cooldown[cite: 2]

export default function VerifyOtp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let { loading, error, tempEmail } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [resendLoading, setResendLoading] = useState(false);

  // Recovery Pipeline: Hard refresh protection reading from fallback storage[cite: 1]
  if (!tempEmail) {
    tempEmail = sessionStorage.getItem('tempEmailBackup');
  }

  useEffect(() => {
    if (!tempEmail) {
      navigate('/signup', { replace: true });
    } else {
      dispatch(setTempEmail(tempEmail));
    }
    dispatch(clearAuthError());
  }, [tempEmail, navigate, dispatch]);

  // Cooldown counter loop
  useEffect(() => {
    if (!timer) return undefined;
    const interval = window.setInterval(() => {
      setTimer((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timer]);

  // Geometric layout monospace layout generator
  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = String(timer % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [timer]);

  const handleVerifySubmit = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) return;

    const result = await dispatch(verifyOtp({ email: tempEmail, otp }));
    if (verifyOtp.fulfilled.match(result)) {
      const destination = sessionStorage.getItem('authRedirectTo') || '/dashboard';
      
      sessionStorage.removeItem('authRedirectTo');
      sessionStorage.removeItem('tempEmailBackup');

      navigate(destination, { replace: true });
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || resendLoading) return;
    setResendLoading(true);
    const result = await dispatch(sendOtp({ email: tempEmail }));
    setResendLoading(false);
    if (sendOtp.fulfilled.match(result)) {
      setTimer(RESEND_SECONDS);
    }
  };

  return (
    <section className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-24 font-sans selection:bg-[#171717] selection:text-[#f2f2f2]">
      <div className="w-full max-w-[480px] bg-white border border-[#ebebeb] rounded-xl p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.05),0px_2px_2px_rgba(0,0,0,0.1)]">
        
        <p className="font-mono text-xs uppercase tracking-normal text-[#888888] mb-2">
          Security Verification
        </p>
        
        <h1 className="text-3xl font-semibold text-[#171717] tracking-[-1.28px] leading-10 mb-2">
          Verify email.
        </h1>
        
        <p className="text-sm text-[#4d4d4d] mb-6">
          We have dropped a security pin to <span className="font-medium text-[#171717]">{tempEmail}</span>
        </p>

        {error && (
          <div className="mb-6 p-4 bg-[#f7d4d6] border border-[#ee0000]/10 rounded-sm">
            <p className="text-sm font-medium text-[#c50000]">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleVerifySubmit}>
          {/* Custom entry interface module container */}
          <div className="flex justify-center">
            <OtpInput value={otp} onChange={setOtp} disabled={loading} />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full h-12 bg-[#171717] text-white font-medium text-base rounded-[100px] transition-colors hover:bg-black disabled:bg-[#ebebeb] disabled:text-[#888888] disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Submit OTP'}
            </button>

            <button
              type="button"
              disabled={timer > 0 || resendLoading}
              onClick={handleResendOtp}
              className="w-full h-12 bg-white text-[#4d4d4d] border border-[#ebebeb] font-medium text-sm rounded-[100px] transition-colors hover:bg-[#fafafa] hover:text-[#171717] disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {timer > 0 ? `Resend OTP (${formattedTimer})` : resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}