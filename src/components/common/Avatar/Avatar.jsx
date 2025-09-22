import React, { useState } from 'react';
import { avatarStyles } from './Avatar.styles';

const Avatar = ({
  src,
  alt = '',
  name = '',
  size = 'medium',
  variant = 'circular',
  fallback = null,
  online = null,
  className = '',
  onClick,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const avatarClasses = [
    avatarStyles.base,
    avatarStyles.sizes[size] || avatarStyles.sizes.medium,
    avatarStyles.variants[variant] || avatarStyles.variants.circular,
    onClick ? avatarStyles.clickable : '',
    !src || imageError ? getBackgroundColor(name) : '',
    className,
  ].filter(Boolean).join(' ');

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getBackgroundColor = (fullName) => {
    if (!fullName) return 'bg-gray-300';
    
    const colors = [
      'bg-red-400',
      'bg-orange-400',
      'bg-amber-400',
      'bg-yellow-400',
      'bg-lime-400',
      'bg-green-400',
      'bg-emerald-400',
      'bg-teal-400',
      'bg-cyan-400',
      'bg-sky-400',
      'bg-blue-400',
      'bg-indigo-400',
      'bg-violet-400',
      'bg-purple-400',
      'bg-fuchsia-400',
      'bg-pink-400',
      'bg-rose-400',
    ];
    
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const getOnlineIndicatorClasses = () => {
    const sizes = {
      xsmall: 'w-1.5 h-1.5',
      small: 'w-2 h-2',
      medium: 'w-2.5 h-2.5',
      large: 'w-3 h-3',
      xlarge: 'w-3.5 h-3.5',
      xxlarge: 'w-4 h-4',
    };
    return sizes[size] || sizes.medium;
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className={avatarClasses}
        onClick={handleClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
            onError={handleImageError}
            draggable={false}
          />
        ) : fallback ? (
          fallback
        ) : (
          <span className="text-white font-semibold">
            {getInitials(name)}
          </span>
        )}
      </div>
      
      {online !== null && (
        <div
          className={`
            absolute bottom-0 right-0 rounded-full border-2 border-white
            ${getOnlineIndicatorClasses()}
            ${online ? 'bg-green-400' : 'bg-gray-400'}
          `}
          aria-label={online ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};

export default Avatar;
