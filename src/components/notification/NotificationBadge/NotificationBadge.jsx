import React from 'react';
import { useNotifications } from '../../../hooks/useNotifications';
import { notificationBadgeStyles } from './NotificationBadge.styles';

const NotificationBadge = ({
  count: propCount,
  max = 99,
  showZero = false,
  size = 'medium',
  variant = 'default',
  position = 'top-right',
  className = '',
  children,
}) => {
  const { unreadCount } = useNotifications();
  
  // Use prop count if provided, otherwise use context count
  const count = propCount !== undefined ? propCount : unreadCount;

  const badgeClasses = [
    notificationBadgeStyles.base,
    notificationBadgeStyles.sizes[size] || notificationBadgeStyles.sizes.medium,
    notificationBadgeStyles.variants[variant] || notificationBadgeStyles.variants.default,
    notificationBadgeStyles.positions[position] || notificationBadgeStyles.positions['top-right'],
    className,
  ].filter(Boolean).join(' ');

  // Don't render if count is 0 and showZero is false
  if (count <= 0 && !showZero) {
    return children || null;
  }

  // Format count display
  const displayCount = count > max ? `${max}+` : count.toString();

  // If there are children, render as a wrapper
  if (children) {
    return (
      <div className="relative inline-block">
        {children}
        {(count > 0 || showZero) && (
          <span className={badgeClasses}>
            {displayCount}
          </span>
        )}
      </div>
    );
  }

  // Render standalone badge
  return (
    <span className={`${badgeClasses} relative`}>
      {displayCount}
    </span>
  );
};

// Dot variant for simple indication
export const NotificationDot = ({
  show = true,
  size = 'medium',
  color = 'red',
  position = 'top-right',
  className = '',
  children,
}) => {
  const dotClasses = [
    notificationBadgeStyles.dot.base,
    notificationBadgeStyles.dot.sizes[size] || notificationBadgeStyles.dot.sizes.medium,
    notificationBadgeStyles.dot.colors[color] || notificationBadgeStyles.dot.colors.red,
    notificationBadgeStyles.positions[position] || notificationBadgeStyles.positions['top-right'],
    className,
  ].filter(Boolean).join(' ');

  if (!show) {
    return children || null;
  }

  if (children) {
    return (
      <div className="relative inline-block">
        {children}
        <span className={dotClasses}></span>
      </div>
    );
  }

  return <span className={`${dotClasses} relative`}></span>;
};

// Pulse variant for attention-grabbing
export const NotificationPulse = ({
  count: propCount,
  show = true,
  size = 'medium',
  className = '',
  children,
}) => {
  const { unreadCount } = useNotifications();
  const count = propCount !== undefined ? propCount : unreadCount;

  const pulseClasses = [
    notificationBadgeStyles.pulse.base,
    notificationBadgeStyles.pulse.sizes[size] || notificationBadgeStyles.pulse.sizes.medium,
    className,
  ].filter(Boolean).join(' ');

  if (!show || count <= 0) {
    return children || null;
  }

  if (children) {
    return (
      <div className="relative inline-block">
        {children}
        <span className={pulseClasses}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full bg-red-500"></span>
        </span>
      </div>
    );
  }

  return (
    <span className={`${pulseClasses} relative`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full bg-red-500"></span>
    </span>
  );
};

// Bell icon with badge
export const NotificationBell = ({
  count: propCount,
  onClick,
  size = 'medium',
  className = '',
}) => {
  const { unreadCount } = useNotifications();
  const count = propCount !== undefined ? propCount : unreadCount;

  const bellSizes = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-7 h-7',
  };

  const BellIcon = () => (
    <svg 
      className={bellSizes[size] || bellSizes.medium} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v2.25l.75.75H15v4.5H6v-4.5H2.25l.75-.75V9.75a6 6 0 0 1 6-6z" 
      />
    </svg>
  );

  return (
    <NotificationBadge count={count} className={className}>
      <button
        onClick={onClick}
        className="text-gray-600 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-2"
        title={`${count} unread notifications`}
      >
        <BellIcon />
      </button>
    </NotificationBadge>
  );
};

export default NotificationBadge;
