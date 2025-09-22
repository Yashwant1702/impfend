import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { NotificationProvider } from './NotificationContext';

// Initial state for app-wide data
const initialState = {
  isOnline: navigator.onLine || true,
  connectionType: 'unknown',
  appVersion: '1.0.0',
  lastUpdated: null,
  showUpdateNotification: false,
  
  // Performance tracking
  performanceMetrics: {
    pageLoadTime: 0,
    apiResponseTimes: [],
    renderTimes: [],
  },
  
  // Feature flags
  features: {
    gamificationEnabled: true,
    messagingEnabled: true,
    notificationsEnabled: true,
    darkModeEnabled: true,
    offlineModeEnabled: false,
  },
  
  // Global loading states
  globalOperations: {
    isInitializing: true,
    isSyncing: false,
    isUpdating: false,
  },
  
  // Error tracking
  errors: [],
  
  // Cache status
  cacheStatus: {
    lastClearTime: null,
    size: 0,
    isClearing: false,
  },
};

// Action types
const APP_ACTIONS = {
  SET_ONLINE_STATUS: 'SET_ONLINE_STATUS',
  SET_CONNECTION_TYPE: 'SET_CONNECTION_TYPE',
  SET_PERFORMANCE_METRIC: 'SET_PERFORMANCE_METRIC',
  ADD_ERROR: 'ADD_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  SET_FEATURE_FLAG: 'SET_FEATURE_FLAG',
  SET_GLOBAL_OPERATION: 'SET_GLOBAL_OPERATION',
  SET_INITIALIZATION_COMPLETE: 'SET_INITIALIZATION_COMPLETE',
  SET_CACHE_STATUS: 'SET_CACHE_STATUS',
  SET_UPDATE_AVAILABLE: 'SET_UPDATE_AVAILABLE',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_ONLINE_STATUS:
      return {
        ...state,
        isOnline: action.payload,
      };
      
    case APP_ACTIONS.SET_CONNECTION_TYPE:
      return {
        ...state,
        connectionType: action.payload,
      };
      
    case APP_ACTIONS.SET_PERFORMANCE_METRIC:
      const { type, value } = action.payload;
      return {
        ...state,
        performanceMetrics: {
          ...state.performanceMetrics,
          [type]: type === 'pageLoadTime' ? value : [...state.performanceMetrics[type], value],
        },
      };
      
    case APP_ACTIONS.ADD_ERROR:
      return {
        ...state,
        errors: [...state.errors.slice(-9), action.payload], // Keep last 10 errors
      };
      
    case APP_ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        errors: [],
      };
      
    case APP_ACTIONS.SET_FEATURE_FLAG:
      const { feature, enabled } = action.payload;
      return {
        ...state,
        features: {
          ...state.features,
          [feature]: enabled,
        },
      };
      
    case APP_ACTIONS.SET_GLOBAL_OPERATION:
      const { operation, status } = action.payload;
      return {
        ...state,
        globalOperations: {
          ...state.globalOperations,
          [operation]: status,
        },
      };
      
    case APP_ACTIONS.SET_INITIALIZATION_COMPLETE:
      return {
        ...state,
        globalOperations: {
          ...state.globalOperations,
          isInitializing: false,
        },
        lastUpdated: new Date().toISOString(),
      };
      
    case APP_ACTIONS.SET_CACHE_STATUS:
      return {
        ...state,
        cacheStatus: {
          ...state.cacheStatus,
          ...action.payload,
        },
      };
      
    case APP_ACTIONS.SET_UPDATE_AVAILABLE:
      return {
        ...state,
        showUpdateNotification: action.payload,
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// AppProvider component (inner - without other providers)
const AppProviderInner = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Track online status
  useEffect(() => {
    const handleOnline = () => {
      dispatch({ type: APP_ACTIONS.SET_ONLINE_STATUS, payload: true });
    };

    const handleOffline = () => {
      dispatch({ type: APP_ACTIONS.SET_ONLINE_STATUS, payload: false });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection type if available
    if (navigator.connection) {
      const updateConnectionInfo = () => {
        dispatch({
          type: APP_ACTIONS.SET_CONNECTION_TYPE,
          payload: navigator.connection.effectiveType || 'unknown',
        });
      };

      updateConnectionInfo();
      navigator.connection.addEventListener('change', updateConnectionInfo);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        navigator.connection.removeEventListener('change', updateConnectionInfo);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track page load performance
  useEffect(() => {
    const measurePerformance = () => {
      if (window.performance && window.performance.timing) {
        const navigationTiming = window.performance.timing;
        const pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
        
        dispatch({
          type: APP_ACTIONS.SET_PERFORMANCE_METRIC,
          payload: { type: 'pageLoadTime', value: pageLoadTime },
        });
      }
    };

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate initialization tasks
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mark initialization as complete
        dispatch({ type: APP_ACTIONS.SET_INITIALIZATION_COMPLETE });
      } catch (error) {
        dispatch({
          type: APP_ACTIONS.ADD_ERROR,
          payload: {
            id: Date.now(),
            message: 'Failed to initialize app',
            timestamp: new Date().toISOString(),
            stack: error.stack,
          },
        });
      }
    };

    initializeApp();
  }, []);

  // Add error function
  const addError = useCallback((error) => {
    dispatch({
      type: APP_ACTIONS.ADD_ERROR,
      payload: {
        id: Date.now(),
        message: error.message || 'An error occurred',
        timestamp: new Date().toISOString(),
        stack: error.stack,
      },
    });
  }, []);

  // Clear errors function
  const clearErrors = useCallback(() => {
    dispatch({ type: APP_ACTIONS.CLEAR_ERRORS });
  }, []);

  // Set feature flag function
  const setFeatureFlag = useCallback((feature, enabled) => {
    dispatch({
      type: APP_ACTIONS.SET_FEATURE_FLAG,
      payload: { feature, enabled },
    });
  }, []);

  // Set global operation function
  const setGlobalOperation = useCallback((operation, status) => {
    dispatch({
      type: APP_ACTIONS.SET_GLOBAL_OPERATION,
      payload: { operation, status },
    });
  }, []);

  // Track API response time
  const trackAPIResponseTime = useCallback((responseTime) => {
    dispatch({
      type: APP_ACTIONS.SET_PERFORMANCE_METRIC,
      payload: { type: 'apiResponseTimes', value: responseTime },
    });
  }, []);

  // Track render time
  const trackRenderTime = useCallback((renderTime) => {
    dispatch({
      type: APP_ACTIONS.SET_PERFORMANCE_METRIC,
      payload: { type: 'renderTimes', value: renderTime },
    });
  }, []);

  // Clear cache function
  const clearCache = useCallback(async () => {
    dispatch({
      type: APP_ACTIONS.SET_CACHE_STATUS,
      payload: { isClearing: true },
    });

    try {
      // Clear localStorage
      const keysToKeep = ['campus_club_theme', 'campus_club_user_preferences'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage
      sessionStorage.clear();

      // Update cache status
      dispatch({
        type: APP_ACTIONS.SET_CACHE_STATUS,
        payload: {
          isClearing: false,
          lastClearTime: new Date().toISOString(),
          size: 0,
        },
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: APP_ACTIONS.SET_CACHE_STATUS,
        payload: { isClearing: false },
      });
      
      addError(error);
      return { success: false, error: error.message };
    }
  }, [addError]);

  // Context value
  const value = {
    // State
    isOnline: state.isOnline,
    connectionType: state.connectionType,
    appVersion: state.appVersion,
    lastUpdated: state.lastUpdated,
    showUpdateNotification: state.showUpdateNotification,
    performanceMetrics: state.performanceMetrics,
    features: state.features,
    globalOperations: state.globalOperations,
    errors: state.errors,
    cacheStatus: state.cacheStatus,
    
    // Actions
    addError,
    clearErrors,
    setFeatureFlag,
    setGlobalOperation,
    trackAPIResponseTime,
    trackRenderTime,
    clearCache,
    
    // Computed values
    isInitialized: !state.globalOperations.isInitializing,
    hasErrors: state.errors.length > 0,
    isSlowConnection: ['slow-2g', '2g'].includes(state.connectionType),
    avgAPIResponseTime: state.performanceMetrics.apiResponseTimes.length > 0
      ? state.performanceMetrics.apiResponseTimes.reduce((a, b) => a + b, 0) / state.performanceMetrics.apiResponseTimes.length
      : 0,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Main AppProvider that combines all providers
export const AppProvider = ({ children }) => {
  return (
    <AppProviderInner>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppProviderInner>
  );
};

export default AppContext;
