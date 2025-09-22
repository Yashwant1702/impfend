import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import notificationService from '../services/notifications';

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  settings: null,
  realTimeConnected: false,
};

// Action types
const NOTIFICATION_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_REAL_TIME_STATUS: 'SET_REAL_TIME_STATUS',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
};

// Reducer function
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
      
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        isLoading: false,
        error: null,
      };
      
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: action.payload.is_read ? state.unreadCount : state.unreadCount + 1,
      };
      
    case NOTIFICATION_ACTIONS.UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id ? action.payload : notification
        ),
      };
      
    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      const notificationToRemove = state.notifications.find(n => n.id === action.payload);
      const wasUnread = notificationToRemove && !notificationToRemove.is_read;
      
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
      
    case NOTIFICATION_ACTIONS.SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload,
      };
      
    case NOTIFICATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
      
    case NOTIFICATION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
      
    case NOTIFICATION_ACTIONS.SET_SETTINGS:
      return {
        ...state,
        settings: action.payload,
      };
      
    case NOTIFICATION_ACTIONS.SET_REAL_TIME_STATUS:
      return {
        ...state,
        realTimeConnected: action.payload,
      };
      
    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
      
    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          is_read: true,
          read_at: new Date().toISOString()
        })),
        unreadCount: 0,
      };
      
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// NotificationProvider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Fetch notifications
  const fetchNotifications = useCallback(async (filters = {}) => {
    dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ERROR });

    try {
      const result = await notificationService.getNotifications(filters);
      
      if (result.success) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS, payload: result.data });
        return { success: true, data: result.data };
      } else {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to fetch notifications';
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await notificationService.getUnreadCount();
      if (result.success) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT, payload: result.count });
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      // Optimistic update
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: notificationId });
      
      const result = await notificationService.markAsRead(notificationId);
      
      if (!result.success) {
        // Revert optimistic update on failure
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: result.error });
        await fetchNotifications(); // Refresh to revert changes
      }
      
      return result;
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Failed to mark notification as read' });
      await fetchNotifications(); // Refresh to revert changes
    }
  }, [fetchNotifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Optimistic update
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
      
      const result = await notificationService.markAllAsRead();
      
      if (!result.success) {
        // Revert optimistic update on failure
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: result.error });
        await fetchNotifications(); // Refresh to revert changes
      }
      
      return result;
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Failed to mark all notifications as read' });
      await fetchNotifications(); // Refresh to revert changes
    }
  }, [fetchNotifications]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      // Optimistic update
      dispatch({ type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION, payload: notificationId });
      
      const result = await notificationService.deleteNotification(notificationId);
      
      if (!result.success) {
        // Revert optimistic update on failure
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: result.error });
        await fetchNotifications(); // Refresh to revert changes
      }
      
      return result;
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Failed to delete notification' });
      await fetchNotifications(); // Refresh to revert changes
    }
  }, [fetchNotifications]);

  // Get notification settings
  const getSettings = useCallback(async () => {
    try {
      const result = await notificationService.getNotificationSettings();
      
      if (result.success) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_SETTINGS, payload: result.data });
      }
      
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to fetch notification settings' };
    }
  }, []);

  // Update notification settings
  const updateSettings = useCallback(async (settings) => {
    try {
      const result = await notificationService.updateNotificationSettings(settings);
      
      if (result.success) {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_SETTINGS, payload: settings });
      } else {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: result.error });
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to update notification settings';
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ERROR });
  }, []);

  // Add new notification (for real-time updates)
  const addNotification = useCallback((notification) => {
    dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: notification });
  }, []);

  // Initialize notifications and real-time connection
  useEffect(() => {
    const initialize = async () => {
      await fetchNotifications();
      await fetchUnreadCount();
      await getSettings();
    };

    initialize();

    // Set up real-time notifications
    const connection = notificationService.setupRealTimeNotifications((data) => {
      if (data.type === 'unread_count_update') {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT, payload: data.count });
      } else if (data.type === 'new_notification') {
        dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: data.notification });
      }
    });

    if (connection) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_REAL_TIME_STATUS, payload: connection.isRunning() });
    }

    return () => {
      if (connection) {
        connection.stop();
        dispatch({ type: NOTIFICATION_ACTIONS.SET_REAL_TIME_STATUS, payload: false });
      }
    };
  }, [fetchNotifications, fetchUnreadCount, getSettings]);

  // Context value
  const value = {
    // State
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    isLoading: state.isLoading,
    error: state.error,
    settings: state.settings,
    realTimeConnected: state.realTimeConnected,
    
    // Actions
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getSettings,
    updateSettings,
    clearError,
    addNotification,
    
    // Computed values
    hasUnread: state.unreadCount > 0,
    isEmpty: state.notifications.length === 0 && !state.isLoading,
    unreadNotifications: state.notifications.filter(n => !n.is_read),
    readNotifications: state.notifications.filter(n => n.is_read),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
