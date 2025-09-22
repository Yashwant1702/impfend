import React, { useState, forwardRef } from 'react';
import { inputStyles } from './NeomorphicInput.styles';

const NeomorphicInput = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  size = 'medium',
  icon = null,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const getCurrentState = () => {
    if (disabled) return 'disabled';
    if (error) return 'error';
    if (isFocused) return 'focused';
    return 'default';
  };

  const inputClasses = [
    inputStyles.base,
    inputStyles.states[getCurrentState()],
    inputStyles.sizes[size] || inputStyles.sizes.medium,
    fullWidth ? inputStyles.fullWidth : '',
    icon ? (iconPosition === 'left' ? inputStyles.iconLeft : inputStyles.iconRight) : '',
    className,
  ].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const inputId = `neomorphic-input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500">{icon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-gray-500">{icon}</span>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

NeomorphicInput.displayName = 'NeomorphicInput';

export default NeomorphicInput;
