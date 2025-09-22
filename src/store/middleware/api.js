import { createListenerMiddleware } from '@reduxjs/toolkit';

// Create API middleware for handling side effects
const apiMiddleware = createListenerMiddleware();

// API request logging middleware
const apiLoggingMiddleware = (store) => (next) => (action) => {
  // Log API requests in development
  if (process.env.NODE_ENV === 'development') {
    if (action.type?.includes('/pending')) {
      console.log('🔄 API Request Started:', action.type);
    } else if (action.type?.includes('/fulfilled')) {
      console.log('✅ API Request Success:', action.type);
    } else if (action.type?.includes('/rejected')) {
      console.error('❌ API Request Failed:', action.type, action.payload);
    }
  }
  
  return next(action);
};

// Error handling middleware
const errorHandlingMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux middleware error:', error);
    
    // Dispatch error to UI slice
    store.dispatch({
      type: 'ui/setError',
      payload: {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
    
    return action;
  }
};

// Network status middleware
const networkStatusMiddleware = (store) => (next) => (action) => {
  // Handle network-related actions
  if (action.type?.includes('/rejected')) {
    const payload = action.payload;
    
    // Check if it's a network error
    if (typeof payload === 'string' && (
      payload.includes('Network error') ||
      payload.includes('Failed to fetch') ||
      payload.includes('Connection failed')
    )) {
      // Update connection status
      store.dispatch({
        type: 'ui/setIsOnline',
        payload: false,
      });
    }
  } else if (action.type?.includes('/fulfilled')) {
    // On successful API call, ensure online status is true
    const currentState = store.getState();
    if (!currentState.ui.isOnline) {
      store.dispatch({
        type: 'ui/setIsOnline',
        payload: true,
      });
    }
  }
  
  return next(action);
};

// Token refresh middleware
const tokenRefreshMiddleware = (store) => (next) => (action) => {
  // Handle 401 unauthorized responses
  if (action.type?.includes('/rejected') && action.payload === 'Authentication required') {
    // Clear auth state and redirect to login
    store.dispatch({ type: 'auth/clearAuthData' });
    store.dispatch({ type: 'ui/showModal', payload: { modalName: 'loginModal' } });
    
    // Add toast notification
    store.dispatch({
      type: 'ui/addToast',
      payload: {
        type: 'warning',
        title: 'Session Expired',
        message: 'Please log in again to continue.',
      },
    });
  }
  
  return next(action);
};

// Real-time data sync middleware
const realTimeMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Handle real-time updates
  if (action.type === 'notifications/addNewNotification') {
    // Add toast for new notification
    const notification = action.payload;
    store.dispatch({
      type: 'ui/addToast',
      payload: {
        type: 'info',
        title: 'New Notification',
        message: notification.title || notification.message,
        duration: 4000,
      },
    });
  }
  
  if (action.type === 'messaging/addNewMessage') {
    // Add toast for new message if not in active conversation
    const { conversationId, message } = action.payload;
    const state = store.getState();
    
    if (state.messaging.activeConversationId !== conversationId) {
      store.dispatch({
        type: 'ui/addToast',
        payload: {
          type: 'info',
          title: 'New Message',
          message: `From ${message.sender?.full_name || 'Someone'}`,
          duration: 3000,
        },
      });
    }
  }
  
  if (action.type === 'gamification/addNewBadge') {
    // Add toast for new badge earned
    const badge = action.payload;
    store.dispatch({
      type: 'ui/addToast',
      payload: {
        type: 'success',
        title: 'Badge Earned!',
        message: `You earned the "${badge.name}" badge!`,
        duration: 5000,
      },
    });
  }
  
  return result;
};

// Performance monitoring middleware
const performanceMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    const result = next(action);
    const end = performance.now();
    
    // Log slow actions
    if (end - start > 50) {
      console.warn(`Slow Redux action: ${action.type} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }
  
  return next(action);
};

// Local storage sync middleware
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Sync certain state to localStorage
  if (action.type?.startsWith('auth/')) {
    const state = store.getState();
    if (state.auth.user) {
      localStorage.setItem('campus_club_user_data', JSON.stringify(state.auth.user));
    }
  }
  
  if (action.type?.startsWith('ui/')) {
    const state = store.getState();
    
    // Save theme preference
    if (action.type === 'ui/setTheme') {
      localStorage.setItem('campus_club_theme', state.ui.theme);
    }
    
    // Save preferences
    if (action.type.includes('Preference')) {
      localStorage.setItem('campus_club_preferences', JSON.stringify(state.ui.preferences));
    }
  }
  
  return result;
};

// Combine all middleware
export default [
  apiLoggingMiddleware,
  errorHandlingMiddleware,
  networkStatusMiddleware,
  tokenRefreshMiddleware,
  realTimeMiddleware,
  performanceMiddleware,
  localStorageMiddleware,
];
