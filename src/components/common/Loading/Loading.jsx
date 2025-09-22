import React from 'react';
import { loadingStyles } from './Loading.styles';

const Loading = ({
  size = 'medium',
  variant = 'spinner',
  color = 'primary',
  fullScreen = false,
  overlay = false,
  text = '',
  className = '',
}) => {
  const loadingClasses = [
    loadingStyles.base,
    fullScreen ? loadingStyles.fullScreen : '',
    overlay ? loadingStyles.overlay : '',
    className,
  ].filter(Boolean).join(' ');

  // Spinner Component
  const Spinner = () => (
    <div className={`${loadingStyles.spinner} ${loadingStyles.sizes[size]} ${loadingStyles.colors[color]}`}>
      <svg className="animate-spin h-full w-full" fill="none" viewBox="0 0 24 24">
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
    </div>
  );

  // Pulse Component
  const Pulse = () => (
    <div className={`${loadingStyles.pulse} ${loadingStyles.sizes[size]}`}>
      <div className={`${loadingStyles.pulseCircle} ${loadingStyles.colors[color]} animate-pulse`}></div>
      <div className={`${loadingStyles.pulseCircle} ${loadingStyles.colors[color]} animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
      <div className={`${loadingStyles.pulseCircle} ${loadingStyles.colors[color]} animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
    </div>
  );

  // Neomorphic Loader
  const NeomorphicLoader = () => (
    <div className={`${loadingStyles.neomorphic} ${loadingStyles.sizes[size]}`}>
      <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]"></div>
    </div>
  );

  // Skeleton Component
  const Skeleton = () => (
    <div className={loadingStyles.skeleton}>
      <div className="animate-pulse space-y-4">
        <div className="bg-gray-200 rounded-xl h-4 w-3/4 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]"></div>
        <div className="bg-gray-200 rounded-xl h-4 w-1/2 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]"></div>
        <div className="bg-gray-200 rounded-xl h-4 w-2/3 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]"></div>
      </div>
    </div>
  );

  // Bouncing Dots
  const BouncingDots = () => (
    <div className={`${loadingStyles.bouncingDots} ${loadingStyles.sizes[size]}`}>
      <div className={`${loadingStyles.dot} ${loadingStyles.colors[color]} animate-bounce`}></div>
      <div className={`${loadingStyles.dot} ${loadingStyles.colors[color]} animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`${loadingStyles.dot} ${loadingStyles.colors[color]} animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <Spinner />;
      case 'pulse':
        return <Pulse />;
      case 'neomorphic':
        return <NeomorphicLoader />;
      case 'skeleton':
        return <Skeleton />;
      case 'dots':
        return <BouncingDots />;
      default:
        return <Spinner />;
    }
  };

  return (
    <div className={loadingClasses}>
      <div className="flex flex-col items-center justify-center space-y-4">
        {renderLoader()}
        
        {text && (
          <p className={`text-center ${loadingStyles.text} ${loadingStyles.colors[color]}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Specific loading components
export const PageLoading = ({ text = 'Loading...' }) => (
  <Loading
    variant="neomorphic"
    size="large"
    fullScreen={true}
    text={text}
    color="primary"
  />
);

export const ComponentLoading = ({ text = '' }) => (
  <Loading
    variant="spinner"
    size="medium"
    text={text}
    color="primary"
    className="py-8"
  />
);

export const ButtonLoading = () => (
  <Loading
    variant="spinner"
    size="small"
    color="white"
  />
);

export const SkeletonLoading = () => (
  <Loading
    variant="skeleton"
    className="w-full"
  />
);

export default Loading;
