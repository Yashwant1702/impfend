import React, { createContext, useContext, useEffect, useReducer } from 'react';
import authService from '../services/auth';
import storage from '../utils/storage';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  permissions: [],
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT',
  UPDATE_PERMISSIONS: 'UPDATE_PERMISSIONS',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
      
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
        permissions: action.payload ? authService.getUserPermissions() : [],
      };
      
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        permissions: [],
      };
      
    case AUTH_ACTIONS.UPDATE_PERMISSIONS:
      return {
        ...state,
        permissions: authService.getUserPermissions(),
      };
      
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      try {
        if (authService.isLoggedIn()) {
          const currentUser = authService.getCurrentUser();
          
          if (currentUser) {
            dispatch({ type: AUTH_ACTIONS.SET_USER, payload: currentUser });
            
            // Refresh profile data from server
            try {
              const profileResult = await authService.getProfile();
              if (profileResult.success) {
                dispatch({ type: AUTH_ACTIONS.SET_USER, payload: profileResult.data });
              }
            } catch (error) {
              console.warn('Failed to refresh profile:', error);
            }
          } else {
            // Token exists but no user data, fetch profile
            try {
              const profileResult = await authService.getProfile();
              if (profileResult.success) {
                dispatch({ type: AUTH_ACTIONS.SET_USER, payload: profileResult.data });
              } else {
                // Invalid token, clear auth
                await authService.logout();
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
              }
            } catch (error) {
              console.error('Auth initialization error:', error);
              await authService.logout();
              dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: 'Failed to initialize authentication' });
        await authService.logout();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const result = await authService.login(email, password, rememberMe);
      
      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: result.user });
        return { success: true, user: result.user };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const result = await authService.register(userData);
      
      if (!result.success) {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.error });
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Registration failed. Please try again.';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Logout function
  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: result.data });
        return { success: true, data: result.data };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to update profile';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!state.isAuthenticated) return;

    try {
      const result = await authService.getProfile();
      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: result.data });
        return result;
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  // Check permissions
  const hasPermission = (permission) => {
    return state.permissions.includes(permission);
  };

  // Check if user can perform action
  const canPerformAction = (action, resource = null) => {
    return authService.canPerformAction(action, resource);
  };

  // Context value
  const value = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    permissions: state.permissions,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    clearError,
    refreshUser,
    
    // Permission helpers
    hasPermission,
    canPerformAction,
    
    // Computed values
    isStudent: state.user?.user_type === 'student',
    isFaculty: state.user?.user_type === 'faculty',
    isCollegeAdmin: state.user?.user_type === 'college_admin',
    userId: state.user?.id,
    userEmail: state.user?.email,
    userName: state.user?.full_name,
    userAvatar: state.user?.avatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
