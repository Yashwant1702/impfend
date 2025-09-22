import React from 'react';
import { buttonStyles } from './NeomorphicButton.styles';

const NeomorphicButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  icon = null,
  iconPosition = 'left',
  ...props
}) => {
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const buttonClasses = [
    buttonStyles.base,
    buttonStyles.variants[variant] || buttonStyles.variants.primary,
    buttonStyles.sizes[size] || buttonStyles.sizes.medium,
    fullWidth ? buttonStyles.fullWidth : '',
    disabled ? buttonStyles.disabled : '',
    loading ? buttonStyles.loading : '',
    className,
  ].filter(Boolean).join(' ');

  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && <LoadingSpinner />}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default NeomorphicButton;
