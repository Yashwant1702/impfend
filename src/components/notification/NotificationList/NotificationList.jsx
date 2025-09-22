import React, { useState } from 'react';
import { useNotifications } from '../../../hooks/useNotifications';
import NotificationCard from '../NotificationCard/NotificationCard';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import { ComponentLoading, SkeletonLoading } from '../../common/Loading';
import { notificationListStyles } from './NotificationList.styles';

const NotificationList = ({
  showFilters = true,
  showMarkAllAsRead = true,
  showClearAll = true,
  compact = false,
  maxHeight = '600px',
  className = '',
}) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasMore,
    filters,
    updateFilters,
    loadMore,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refresh,
  } = useNotifications();

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const listClasses = [
    notificationListStyles.container,
    className,
  ].filter(Boolean).join(' ');

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'read', label: 'Read', count: notifications.length - unreadCount },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'event', label: 'Events' },
    { value: 'message', label: 'Messages' },
    { value: 'system', label: 'System' },
  ];

  // Handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    updateFilters({ read_status: filter === 'all' ? null : filter });
  };

  // Handle type change
  const handleTypeChange = (type) => {
    setSelectedType(type);
    updateFilters({ type: type === 'all' ? null : type });
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Handle clear all
  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
      try {
        await clearAll();
      } catch (error) {
        console.error('Failed to clear all notifications:', error);
      }
    }
  };

  // Filter notifications locally (in addition to server filtering)
  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'unread' && notification.is_read) return false;
    if (selectedFilter === 'read' && !notification.is_read) return false;
    if (selectedType !== 'all' && notification.type !== selectedType) return false;
    return true;
  });

  // Icons
  const BellIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v2.25l.75.75H15v4.5H6v-4.5H2.25l.75-.75V9.75a6 6 0 0 1 6-6z" />
    </svg>
  );

  const RefreshIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  const CheckAllIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  return (
    <NeomorphicCard className={listClasses}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="text-blue-600">
            <BellIcon />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <NeomorphicButton
            variant="secondary"
            size="small"
            onClick={refresh}
            icon={<RefreshIcon />}
            disabled={isLoading}
            title="Refresh notifications"
          />

          {showMarkAllAsRead && unreadCount > 0 && (
            <NeomorphicButton
              variant="secondary"
              size="small"
              onClick={handleMarkAllAsRead}
              icon={<CheckAllIcon />}
              title="Mark all as read"
            />
          )}

          {showClearAll && notifications.length > 0 && (
            <NeomorphicButton
              variant="danger"
              size="small"
              onClick={handleClearAll}
              icon={<TrashIcon />}
              title="Clear all notifications"
            />
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200 space-y-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`
                    flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                    ${selectedFilter === option.value
                      ? 'bg-blue-100 text-blue-800 shadow-[inset_2px_2px_4px_#a7c7d4,inset_-2px_-2px_4px_#d3f2ff]'
                      : 'bg-gray-100 text-gray-600 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff] hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                    }
                  `}
                >
                  <span>{option.label}</span>
                  <span className="text-xs opacity-75">({option.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTypeChange(option.value)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                    ${selectedType === option.value
                      ? 'bg-green-100 text-green-800 shadow-[inset_2px_2px_4px_#a7c7a7,inset_-2px_-2px_4px_#d3f2d3]'
                      : 'bg-gray-100 text-gray-600 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff] hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className={`overflow-y-auto ${maxHeight ? `max-h-[${maxHeight}]` : ''}`}>
        {isLoading ? (
          <div className="p-4">
            <ComponentLoading text="Loading notifications..." />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <BellIcon />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {selectedFilter === 'unread' 
                ? 'No unread notifications' 
                : selectedFilter === 'read'
                ? 'No read notifications'
                : 'No notifications'}
            </h3>
            <p className="text-gray-500">
              {selectedFilter === 'unread' 
                ? "You're all caught up! Check back later for new notifications."
                : selectedFilter === 'read'
                ? 'No notifications have been read yet.'
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onMarkAsUnread={markAsUnread}
                onDelete={deleteNotification}
                compact={compact}
                className="border-none rounded-none shadow-none hover:bg-gray-50"
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="p-4 text-center border-t border-gray-200">
            <NeomorphicButton
              variant="secondary"
              size="medium"
              onClick={loadMore}
              loading={isLoadingMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Loading...' : 'Load More Notifications'}
            </NeomorphicButton>
          </div>
        )}
      </div>
    </NeomorphicCard>
  );
};

export default NotificationList;
