import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [realTimeConnection, setRealTimeConnection] = useState(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async (filters = {}, append = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await notificationService.getNotifications(filters);
      
      if (result.success) {
        setNotifications(prevNotifications => 
          append ? [...prevNotifications, ...result.data] : result.data
        );
        setPagination(result.pagination);
      } else {
        setError(result.error);
        if (!append) {
          setNotifications([]);
          setPagination(null);
        }
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to fetch notifications';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await notificationService.getUnreadCount();
      if (result.success) {
        setUnreadCount(result.count);
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Set up real-time notifications
  useEffect(() => {
    const connection = notificationService.setupRealTimeNotifications((data) => {
      if (data.type === 'unread_count_update') {
        setUnreadCount(data.count);
      } else if (data.type === 'new_notification') {
        setNotifications(prev => [data.notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    });

    setRealTimeConnection(connection);

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    setError(null);
    
    try {
      const result = await notificationService.markAsRead(notificationId);
      
      if (result.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, is_read: true, read_at: new Date().toISOString() }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to mark notification as read';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Mark notification as unread
  const markAsUnread = useCallback(async (notificationId) => {
    setError(null);
    
    try {
      const result = await notificationService.markAsUnread(notificationId);
      
      if (result.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, is_read: false, read_at: null }
              : notification
          )
        );
        setUnreadCount(prev => prev + 1);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to mark notification as unread';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    setError(null);
    
    try {
      const result = await notificationService.markAllAsRead();
      
      if (result.success) {
        setNotifications(prev =>
          prev.map(notification => ({
            ...notification,
            is_read: true,
            read_at: new Date().toISOString()
          }))
        );
        setUnreadCount(0);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to mark all notifications as read';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    setError(null);
    
    try {
      const result = await notificationService.deleteNotification(notificationId);
      
      if (result.success) {
        const wasUnread = notifications.find(n => n.id === notificationId)?.is_read === false;
        
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to delete notification';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [notifications]);

  // Load more notifications
  const loadMore = useCallback(async () => {
    if (!pagination?.hasNext || isLoading) return;

    const nextPageFilters = { page: pagination.currentPage + 1 };
    return await fetchNotifications(nextPageFilters, true);
  }, [pagination, isLoading, fetchNotifications]);

  // Refresh notifications
  const refresh = useCallback(() => {
    return Promise.all([
      fetchNotifications(),
      fetchUnreadCount()
    ]);
  }, [fetchNotifications, fetchUnreadCount]);

  // Get notification settings
  const getSettings = useCallback(async () => {
    try {
      const result = await notificationService.getNotificationSettings();
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to fetch notification settings' };
    }
  }, []);

  // Update notification settings
  const updateSettings = useCallback(async (settings) => {
    setError(null);
    
    try {
      const result = await notificationService.updateNotificationSettings(settings);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to update notification settings';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Bulk operations
  const bulkOperation = useCallback(async (operation, notificationIds) => {
    setError(null);
    
    try {
      const result = await notificationService.bulkOperation(operation, notificationIds);
      
      if (result.success) {
        switch (operation) {
          case 'mark_read':
            setNotifications(prev =>
              prev.map(notification =>
                notificationIds.includes(notification.id)
                  ? { ...notification, is_read: true, read_at: new Date().toISOString() }
                  : notification
              )
            );
            setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
            break;
          
          case 'mark_unread':
            setNotifications(prev =>
              prev.map(notification =>
                notificationIds.includes(notification.id)
                  ? { ...notification, is_read: false, read_at: null }
                  : notification
              )
            );
            setUnreadCount(prev => prev + notificationIds.length);
            break;
          
          case 'delete':
            setNotifications(prev => 
              prev.filter(n => !notificationIds.includes(n.id))
            );
            const unreadDeleted = notifications.filter(n => 
              notificationIds.includes(n.id) && !n.is_read
            ).length;
            setUnreadCount(prev => Math.max(0, prev - unreadDeleted));
            break;
        }
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = `Failed to perform bulk ${operation}`;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [notifications]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Filter helpers
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.is_read);
  }, [notifications]);

  const getReadNotifications = useCallback(() => {
    return notifications.filter(n => n.is_read);
  }, [notifications]);

  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(n => n.notification_type?.name === type);
  }, [notifications]);

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    pagination,
    
    // Actions
    fetchNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    loadMore,
    refresh,
    clearError,
    
    // Settings
    getSettings,
    updateSettings,
    
    // Bulk operations
    bulkOperation,
    
    // Helpers
    getUnreadNotifications,
    getReadNotifications,
    getNotificationsByType,
    
    // Computed values
    hasUnread: unreadCount > 0,
    hasMore: pagination?.hasNext || false,
    totalNotifications: pagination?.count || 0,
    isEmpty: notifications.length === 0 && !isLoading,
    
    // Real-time connection status
    isRealTimeConnected: realTimeConnection?.isRunning() || false,
  };
};

export default useNotifications;
