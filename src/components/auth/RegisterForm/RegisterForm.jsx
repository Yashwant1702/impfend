import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import NeomorphicInput from '../../common/NeomorphicInput';
import { registerFormStyles } from './RegisterForm.styles';

const RegisterForm = ({ onSuccess, onSwitchToLogin, className = '' }) => {
  const { register, isRegistering, registrationError, validationErrors } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    college: '',
    studentId: '',
    department: '',
    agreeToTerms: false,
  });
  const [localValidationErrors, setLocalValidationErrors] = useState({});

  const formClasses = [
    registerFormStyles.container,
    className,
  ].filter(Boolean).join(' ');

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear validation error when user starts typing
    if (localValidationErrors[field]) {
      setLocalValidationErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.college.trim()) {
      errors.college = 'College is required';
    }
    
    if (formData.userType === 'student' && !formData.studentId.trim()) {
      errors.studentId = 'Student ID is required';
    }
    
    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setLocalValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const registrationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        user_type: formData.userType,
        college: formData.college,
        student_id: formData.userType === 'student' ? formData.studentId : null,
        department: formData.department,
      };

      const result = await register(registrationData);
      
      if (result.success) {
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  // Get all validation errors (local + server)
  const getAllErrors = () => {
    return { ...localValidationErrors, ...validationErrors };
  };

  const allErrors = getAllErrors();

  // Icons
  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
  );

  const PasswordIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const SchoolIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const IdIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>
  );

  return (
    <div className={formClasses}>
      <NeomorphicCard size="large" className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600">Join our campus community today</p>
        </div>

        {/* Error Message */}
        {registrationError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-[inset_2px_2px_4px_#d4a7a7,inset_-2px_-2px_4px_#fdd3d3]">
            <p className="text-red-600 text-sm">{registrationError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NeomorphicInput
              type="text"
              label="First Name"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={allErrors.firstName}
              required
              fullWidth
              icon={<UserIcon />}
              iconPosition="left"
            />

            <NeomorphicInput
              type="text"
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={allErrors.lastName}
              required
              fullWidth
              icon={<UserIcon />}
              iconPosition="left"
            />
          </div>

          {/* Email Field */}
          <NeomorphicInput
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={allErrors.email}
            required
            fullWidth
            icon={<EmailIcon />}
            iconPosition="left"
          />

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NeomorphicInput
              type="password"
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={allErrors.password}
              required
              fullWidth
              icon={<PasswordIcon />}
              iconPosition="left"
              helperText="Must be at least 8 characters with uppercase, lowercase, and number"
            />

            <NeomorphicInput
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={allErrors.confirmPassword}
              required
              fullWidth
              icon={<PasswordIcon />}
              iconPosition="left"
            />
          </div>

          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['student', 'faculty', 'college_admin'].map((type) => (
                <label key={type} className="relative">
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={formData.userType === type}
                    onChange={(e) => handleInputChange('userType', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`
                    p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${formData.userType === type
                      ? 'bg-blue-50 border-blue-300 shadow-[inset_4px_4px_8px_#a7c7d4,inset_-4px_-4px_8px_#d3f2ff]'
                      : 'bg-gray-100 border-gray-300 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]'
                    }
                  `}>
                    <div className="text-center">
                      <h4 className="font-medium capitalize text-gray-800">{type.replace('_', ' ')}</h4>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {allErrors.userType && (
              <p className="mt-1 text-sm text-red-600">{allErrors.userType}</p>
            )}
          </div>

          {/* College and Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NeomorphicInput
              type="text"
              label="College"
              placeholder="Enter your college name"
              value={formData.college}
              onChange={(e) => handleInputChange('college', e.target.value)}
              error={allErrors.college}
              required
              fullWidth
              icon={<SchoolIcon />}
              iconPosition="left"
            />

            <NeomorphicInput
              type="text"
              label="Department"
              placeholder="Enter your department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              error={allErrors.department}
              required
              fullWidth
              icon={<SchoolIcon />}
              iconPosition="left"
            />
          </div>

          {/* Student ID (only for students) */}
          {formData.userType === 'student' && (
            <NeomorphicInput
              type="text"
              label="Student ID"
              placeholder="Enter your student ID"
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              error={allErrors.studentId}
              required
              fullWidth
              icon={<IdIcon />}
              iconPosition="left"
            />
          )}

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]"
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
              </span>
            </label>
            {allErrors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-600">{allErrors.agreeToTerms}</p>
            )}
          </div>

          {/* Submit Button */}
          <NeomorphicButton
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isRegistering}
            disabled={isRegistering}
          >
            {isRegistering ? 'Creating Account...' : 'Create Account'}
          </NeomorphicButton>
        </form>

        {/* Switch to Login */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Sign in here
            </button>
          </p>
        </div>
      </NeomorphicCard>
    </div>
  );
};

export default RegisterForm;
