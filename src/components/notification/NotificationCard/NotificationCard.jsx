import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import Avatar from '../../common/Avatar';
import { notificationCardStyles } from './NotificationCard.styles';

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onClick,
  showActions = true,
  compact = false,
  className = '',
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const cardClasses = [
    notificationCardStyles.container,
    compact ? notificationCardStyles.compact : notificationCardStyles.full,
    notification.is_read ? notificationCardStyles.read : notificationCardStyles.unread,
    className,
  ].filter(Boolean).join(' ');

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get notification type styling
  const getNotificationTypeStyle = (type) => {
    const styles = {
      info: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: 'text-blue-600',
      },
      success: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: 'text-green-600',
      },
      warning: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: 'text-yellow-600',
      },
      error: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: 'text-red-600',
      },
      event: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: 'text-purple-600',
      },
      message: {
        bg: 'bg-pink-100',
        text: 'text-pink-800',
        icon: 'text-pink-600',
      },
      system: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: 'text-gray-600',
      },
    };
    return styles[type] || styles.info;
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'event':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'message':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v2.25l.75.75H15v4.5H6v-4.5H2.25l.75-.75V9.75a6 6 0 0 1 6-6z" />
          </svg>
        );
    }
  };

  // Handle mark as read/unread
  const handleToggleRead = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      if (notification.is_read) {
        await onMarkAsUnread?.(notification);
      } else {
        await onMarkAsRead?.(notification);
      }
    } catch (error) {
      console.error('Failed to toggle read status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      await onDelete?.(notification);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
    // Auto-mark as read when clicked
    if (!notification.is_read && onMarkAsRead) {
      onMarkAsRead(notification);
    }
  };

  const typeStyle = getNotificationTypeStyle(notification.type);

  return (
    <NeomorphicCard
      className={cardClasses}
      clickable={!!onClick}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Notification Icon */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${typeStyle.bg} ${typeStyle.icon}
        `}>
          {notification.sender?.avatar ? (
            <Avatar
              src={notification.sender.avatar}
              name={notification.sender.full_name || notification.sender.username}
              size="small"
            />
          ) : (
            getNotificationIcon(notification.type)
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Title */}
              <h4 className={`
                font-medium text-sm leading-5
                ${notification.is_read ? 'text-gray-700' : 'text-gray-900 font-semibold'}
              `}>
                {notification.title}
              </h4>
              
              {/* Message */}
              <p className={`
                mt-1 text-sm
                ${notification.is_read ? 'text-gray-500' : 'text-gray-700'}
                ${compact ? 'line-clamp-1' : 'line-clamp-2'}
              `}>
                {notification.message}
              </p>

              {/* Metadata */}
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
                <span>{formatTimeAgo(notification.created_at)}</span>
                
                {notification.category && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{notification.category}</span>
                  </>
                )}
                
                {notification.priority && notification.priority !== 'normal' && (
                  <>
                    <span>•</span>
                    <span className={`
                      capitalize font-medium
                      ${notification.priority === 'high' ? 'text-red-500' : 
                        notification.priority === 'urgent' ? 'text-red-600' : 'text-orange-500'}
                    `}>
                      {notification.priority}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex-shrink-0 ml-4">
                <div className="flex items-center space-x-2">
                  {/* Read/Unread Toggle */}
                  <button
                    onClick={handleToggleRead}
                    disabled={isLoading}
                    className={`
                      p-1 rounded-full transition-colors duration-200
                      ${notification.is_read 
                        ? 'text-gray-400 hover:text-blue-600' 
                        : 'text-blue-600 hover:text-blue-700'
                      }
                    `}
                    title={notification.is_read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {notification.is_read ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    )}
                  </button>

                  {/* Delete */}
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="p-1 rounded-full text-gray-400 hover:text-red-600 transition-colors duration-200"
                      title="Delete notification"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Unread Indicator */}
        {!notification.is_read && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Action Buttons (for complex notifications) */}
      {notification.actions && notification.actions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 flex space-x-2">
          {notification.actions.map((action, index) => (
            <NeomorphicButton
              key={index}
              variant={action.type === 'primary' ? 'primary' : 'secondary'}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick?.(notification);
              }}
            >
              {action.label}
            </NeomorphicButton>
          ))}
        </div>
      )}

      {/* Related Content */}
      {notification.related_object && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            {notification.related_object.image && (
              <img
                src={notification.related_object.image}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {notification.related_object.title}
              </p>
              {notification.related_object.subtitle && (
                <p className="text-xs text-gray-500">
                  {notification.related_object.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </NeomorphicCard>
  );
};

export default NotificationCard;
