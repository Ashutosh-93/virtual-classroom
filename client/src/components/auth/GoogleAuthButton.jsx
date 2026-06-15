import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../../features/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';

export function GoogleAuthButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  
  // Pull our resolved execution string ('light' or 'dark') from the theme engine
  const { resolvedMode } = useTheme();

  const handleGoogleSuccess = async (credentialResponse) => {
    const jwtIdToken = credentialResponse.credential; 
    if (!jwtIdToken) return;

    const result = await dispatch(googleLogin(jwtIdToken));
    if (googleLogin.fulfilled.match(result)) {
      const destination = sessionStorage.getItem('authRedirectTo') || '/dashboard';
      sessionStorage.removeItem('authRedirectTo');
      sessionStorage.removeItem('tempEmailBackup');
      navigate(destination, { replace: true });
    }
  };

  return (
    <div className="w-full flex justify-center Google-component-wrapper">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.error('Google Auth Failed')}
        
        // CRITICAL FIX: Google's iframe reads this property directly to switch styles
        theme={resolvedMode === 'dark' ? 'filled_black' : 'outline'}
        
        size="large"
        shape="pill"
        width="100%"
        text="continue_with"
        disabled={loading}
      />
    </div>
  );
}