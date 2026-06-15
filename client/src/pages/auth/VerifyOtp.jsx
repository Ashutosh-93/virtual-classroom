import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyOtp, sendOtp, clearAuthError, setTempEmail } from '../../features/auth/authSlice';
import { OtpInput } from '../../components/auth/OtpInput';

const RESEND_SECONDS = 300; 

export default function VerifyOtp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let { loading, error, tempEmail } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [resendLoading, setResendLoading] = useState(false);

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

  useEffect(() => {
    if (!timer) return undefined;
    const interval = window.setInterval(() => {
      setTimer((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timer]);

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
    <section className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center px-4 sm:px-6 py-12 md:py-24 font-sans selection:bg-[#171717] selection:text-[#f2f2f2] dark:selection:bg-[#ededed] dark:selection:text-[#121212] transition-colors duration-200">
      <div className="w-full max-w-[480px] bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl p-6 sm:p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.05),0px_2px_2px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_24px_rgba(0,0,0,0.4)]">
        
        <p className="font-mono text-xs uppercase tracking-normal text-[#888888] dark:text-[#a3a3a3] mb-2">
          Security Verification
        </p>
        
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#171717] dark:text-[#ededed] tracking-[-1.28px] leading-10 mb-2">
          Verify email.
        </h1>
        
        <p className="text-sm text-[#4d4d4d] dark:text-[#a3a3a3] mb-6">
          We have dropped a security pin to <span className="font-medium text-[#171717] dark:text-[#ededed]">{tempEmail}</span>
        </p>

        {error && (
          <div className="mb-6 p-4 bg-[#f7d4d6] dark:bg-[#4c1d1f] border border-[#ee0000]/10 rounded-sm">
            <p className="text-sm font-medium text-[#c50000] dark:text-[#ff8585]">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleVerifySubmit}>
          <div className="flex justify-center">
            <OtpInput value={otp} onChange={setOtp} disabled={loading} />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full h-12 bg-[#171717] dark:bg-[#ededed] text-white dark:text-[#121212] font-medium text-base rounded-[100px] transition-colors hover:bg-black dark:hover:bg-white disabled:bg-[#ebebeb] dark:disabled:bg-[#232323] disabled:text-[#888888] dark:disabled:text-[#525252] disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Submit OTP'}
            </button>

            <button
              type="button"
              disabled={timer > 0 || resendLoading}
              onClick={handleResendOtp}
              className="w-full h-12 bg-white dark:bg-[#1a1a1a] text-[#4d4d4d] dark:text-[#a3a3a3] border border-[#ebebeb] dark:border-[#232323] font-medium text-sm rounded-[100px] transition-colors hover:bg-[#fafafa] dark:hover:bg-[#262626] hover:text-[#171717] dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {timer > 0 ? `Resend OTP (${formattedTimer})` : resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}