import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';
import { registerStyles } from './Register.styles';

const Register = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const pageClasses = [
    registerStyles.container,
  ].filter(Boolean).join(' ');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Handle successful registration
  const handleRegistrationSuccess = () => {
    setSuccess(true);
    // Auto redirect to login after 3 seconds
    setTimeout(() => {
      navigate('/auth/login', {
        state: {
          message: 'Registration successful! Please sign in to your account.',
          ...location.state
        }
      });
    }, 3000);
  };

  // Handle registration form submission
  const handleRegister = async (userData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await register(userData);
      
      if (result.success) {
        return result;
      } else {
        setError(result.error || 'Registration failed. Please try again.');
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

  // Handle switch to login
  const handleSwitchToLogin = () => {
    navigate('/auth/login', { 
      state: location.state // Pass along any redirect state
    });
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  if (success) {
    return (
      <AuthLayout showBranding={true}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Registration Successful!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Welcome to Campus Club Suite! You will be redirected to the login page shortly.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Redirecting...</span>
            </div>
            
            <Link
              to="/auth/login"
              className="inline-block text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Or click here to go to login page
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showBranding={true}>
      <div className={pageClasses}>
        <RegisterForm
          onSubmit={handleRegister}
          onSuccess={handleRegistrationSuccess}
          onSwitchToLogin={handleSwitchToLogin}
          isLoading={isLoading}
          error={error}
        />

        {/* Additional Links */}
        <div className="mt-6 text-center space-y-3">
          <div className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Sign in here
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
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

export default Register;
