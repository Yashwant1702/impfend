import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import { loginStyles } from './Login.styles';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const pageClasses = [
    loginStyles.container,
  ].filter(Boolean).join(' ');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  // Handle login form submission
  const handleLogin = async (email, password, rememberMe) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password, rememberMe);
      
      if (result.success) {
        return result;
      } else {
        setError(result.error || 'Login failed. Please try again.');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle switch to register
  const handleSwitchToRegister = () => {
    navigate('/auth/register', { 
      state: location.state // Pass along any redirect state
    });
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <AuthLayout showBranding={true}>
      <div className={pageClasses}>
        <LoginForm
          onSubmit={handleLogin}
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
          isLoading={isLoading}
          error={error}
        />

        {/* Additional Links */}
        <div className="mt-6 text-center space-y-3">
          <div>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Sign up here
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
