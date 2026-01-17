import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';

export function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let tokenValid = false;
    
    // Log the full URL for debugging
    console.log("Full URL:", window.location.href);
    console.log("Hash:", window.location.hash);
    
    // Check if there's an error in the URL hash (e.g., expired token)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const errorCode = hashParams.get('error_code');
    const errorDescription = hashParams.get('error_description');
    
    if (errorCode) {
      console.log("Error in URL:", errorCode, errorDescription);
      
      if (errorCode === 'otp_expired') {
        setError('This password reset link has expired or has already been used. Please request a new one. Remember: each reset link can only be used once, and only the most recent link is valid.');
      } else {
        setError(`Error: ${errorDescription || 'Invalid reset link. Please request a new password reset.'}`);
      }
      setIsCheckingToken(false);
      return;
    }
    
    // Check if we have the access_token in the hash
    const accessToken = hashParams.get('access_token');
    console.log("Access token present:", !!accessToken);
    
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      console.log("Session:", session);
      
      if (event === 'PASSWORD_RECOVERY') {
        tokenValid = true;
        setIsValidToken(true);
        setIsCheckingToken(false);
      } else if (event === 'SIGNED_IN' && session) {
        // If there's a session, check if we're in recovery mode
        tokenValid = true;
        setIsValidToken(true);
        setIsCheckingToken(false);
      }
    });

    // Also check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);
      
      if (session) {
        tokenValid = true;
        setIsValidToken(true);
        setIsCheckingToken(false);
      }
      
      // Give it a moment for the auth state change to fire
      setTimeout(() => {
        if (!tokenValid) {
          setError('Invalid or expired reset link. Please request a new password reset.');
          setIsCheckingToken(false);
        }
      }, 2000);
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(newPassword);
    setLoading(false);

    if (error) {
      setError(error.message || 'Failed to update password');
    } else {
      alert('Password updated successfully! Please login with your new password.');
      navigate('/login');
    }
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4">
        <div className="text-black text-lg">Verifying reset link...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {isValidToken ? (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/otc.png" alt="OTC Logo" className="w-[180px] h-auto" />
            </div>

            {/* Reset Password heading */}
            <h1 className="text-4xl font-bold text-center mb-8 text-black">Reset Password</h1>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-base font-normal text-black mb-2">
                  New Password<span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none' }}
                    className="login-input w-full h-12 rounded-l-full px-5 pr-3 text-base bg-white outline-none placeholder:text-gray-400"
                    placeholder=""
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ borderColor: 'rgb(143, 181, 212)', backgroundColor: 'rgb(143, 181, 212)' }}
                    className="h-12 w-12 flex items-center justify-center rounded-r-full transition-colors border border-l-0"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-white" />
                    ) : (
                      <Eye className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-base font-normal text-black mb-2">
                  Confirm Password<span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none' }}
                    className="login-input w-full h-12 rounded-l-full px-5 pr-3 text-base bg-white outline-none placeholder:text-gray-400"
                    placeholder=""
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ borderColor: 'rgb(143, 181, 212)', backgroundColor: 'rgb(143, 181, 212)' }}
                    className="h-12 w-12 flex items-center justify-center rounded-r-full transition-colors border border-l-0"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-white" />
                    ) : (
                      <Eye className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              {/* Update Password Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 inline-flex items-center justify-center gap-2 text-base font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 bg-red-500 hover:bg-red-600 text-white rounded-full px-8"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Back to Login Link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-base text-black hover:text-gray-700"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/otc.png" alt="OTC Logo" className="w-[180px] h-auto" />
            </div>

            {/* Error heading */}
            <h1 className="text-4xl font-bold text-center mb-8 text-black">Link Expired</h1>

            {/* Error Content */}
            <div className="space-y-5">
              <div className="text-red-500 text-sm text-center mb-4">{error}</div>
              <div className="bg-white p-5 rounded-2xl text-sm text-black">
                <p className="font-semibold mb-3">Common reasons for this error:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>The link has already been clicked/used once</li>
                  <li>You requested multiple password resets (only the newest link works)</li>
                  <li>The link is older than 1 hour</li>
                </ul>
              </div>
              <p className="text-black text-sm text-center mb-4">
                Please go back to the login page and request a fresh password reset email. Make sure to use the link immediately after receiving it.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="h-12 inline-flex items-center justify-center gap-2 text-base font-semibold transition-all bg-red-500 hover:bg-red-600 text-white rounded-full px-8"
                >
                  Back to Login
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
