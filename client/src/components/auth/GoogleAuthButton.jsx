import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../../features/auth/authSlice';

export function GoogleAuthButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleGoogleSuccess = async (credentialResponse) => {
    // This is the authentic, server-signed JWT ID token string your backend wants!
    const jwtIdToken = credentialResponse.credential; 
    
    if (!jwtIdToken) return;

    // Send it directly to your existing backend endpoint via Redux
    const result = await dispatch(googleLogin(jwtIdToken));
    
    if (googleLogin.fulfilled.match(result)) {
      // Pull and clear your session storage redirects to keep memory clean
      const destination = sessionStorage.getItem('authRedirectTo') || '/dashboard';
      sessionStorage.removeItem('authRedirectTo');
      sessionStorage.removeItem('tempEmailBackup');
      
      navigate(destination, { replace: true });
    }
  };

  const handleGoogleError = () => {
    console.error('Google Native Authentication Workflow Failed');
  };

  return (
    <div className="w-full flex justify-center Google-component-wrapper">
      {/* Google's prebuilt component handles rendering and token creation out of the box.
        We pass explicit configuration tokens to keep your UI consistent:
      */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"      
        size="large"        
        shape="pill"        
        width="100%"        
        text="continue_with" 
        disabled={loading}
      />
    </div>
  );
}