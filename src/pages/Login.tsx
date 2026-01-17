import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message || 'Invalid email or password');
    } else {
      navigate('/form');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage('');
    setError('');
    setResetLoading(true);

    const { error } = await resetPassword(resetEmail);
    setResetLoading(false);
    
    if (error) {
      setError(error.message || 'Failed to send reset email');
    } else {
      setResetMessage('Password reset email sent! Please check your inbox and click the link within 1 hour. Note: Only the most recent reset link will work.');
      setResetEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {!showForgotPassword ? (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/otc.png" alt="OTC Logo" className="w-[180px] h-auto" />
            </div>

            {/* Welcome heading */}
            <h1 className="text-4xl font-bold text-center mb-8 text-black">Welcome!</h1>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="email" className="block text-base font-normal text-black mb-2">
                  Username<span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input w-full h-12 rounded-full px-5 text-base bg-white outline-none placeholder:text-gray-400"
                  placeholder=""
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-base font-normal text-black mb-2">
                  Password<span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none' }}
                    className="login-input w-full h-12 rounded-l-full px-5 pr-3 text-base bg-white outline-none placeholder:text-gray-400"
                    placeholder=""
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ borderColor: 'rgb(143, 181, 212)', backgroundColor: 'rgb(143, 181, 212)' }}
                    className="h-12 w-12 flex items-center justify-center rounded-r-full transition-colors border border-l-0"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
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

              {/* Login Button */}
              <div className="pt-2 flex justify-center">
                <Button
                  type="submit"
                  isLoading={loading}
                  loadingText="Logging in..."
                  variant="primary"
                  size="md"
                  className="font-semibold"
                >
                  Login
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-base text-black hover:text-gray-700"
                >
                  Forgot password?
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

            {/* Reset Password heading */}
            <h1 className="text-4xl font-bold text-center mb-8 text-black">Reset Password</h1>

            {/* Reset Password Form */}
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="resetEmail" className="block text-base font-normal text-black mb-2">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="login-input w-full h-12 rounded-full px-5 text-base bg-white outline-none placeholder:text-gray-400"
                  placeholder=""
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              {/* Success Message */}
              {resetMessage && (
                <div className="text-green-600 text-sm text-center">{resetMessage}</div>
              )}

              {/* Send Reset Button */}
              <div className="pt-2 flex justify-center">
                <Button
                  type="submit"
                  isLoading={resetLoading}
                  loadingText="Sending..."
                  variant="primary"
                  size="md"
                  className="font-semibold"
                >
                  Send Reset Email
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Back to Login Link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setResetMessage('');
                    setError('');
                  }}
                  className="text-base text-black hover:text-gray-700"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
