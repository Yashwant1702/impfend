import { useState, useEffect, useCallback } from 'react';
import authService from '../services/auth';
import storage from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (authService.isLoggedIn()) {
          const currentUser = authService.getCurrentUser();
          
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
            
            // Refresh profile data from server
            const profileResult = await authService.getProfile();
            if (profileResult.success) {
              setUser(profileResult.data);
            }
          } else {
            // Token exists but no user data, fetch profile
            const profileResult = await authService.getProfile();
            if (profileResult.success) {
              setUser(profileResult.data);
              setIsAuthenticated(true);
            } else {
              // Invalid token, clear auth
              await authService.logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication');
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (email, password, rememberMe = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.login(email, password, rememberMe);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.register(userData);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (profileData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        setUser(result.data);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Change password function
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.changePassword(oldPassword, newPassword);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to change password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Upload avatar function
  const uploadAvatar = useCallback(async (file, onProgress = null) => {
    setError(null);

    try {
      const result = await authService.uploadAvatar(file, onProgress);
      
      if (result.success) {
        setUser(prev => ({ ...prev, avatar: result.data.avatar }));
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to upload avatar';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Check permissions
  const hasPermission = useCallback((permission) => {
    return authService.hasPermission(permission);
  }, []);

  // Check if user can perform action
  const canPerformAction = useCallback((action, resource = null) => {
    return authService.canPerformAction(action, resource);
  }, []);

  // Get user permissions
  const getUserPermissions = useCallback(() => {
    return authService.getUserPermissions();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const result = await authService.getProfile();
      if (result.success) {
        setUser(result.data);
      }
      return result;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [isAuthenticated]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    uploadAvatar,
    clearError,
    refreshUser,
    
    // Permission helpers
    hasPermission,
    canPerformAction,
    getUserPermissions,
    
    // Computed values
    isStudent: user?.user_type === 'student',
    isFaculty: user?.user_type === 'faculty',
    isCollegeAdmin: user?.user_type === 'college_admin',
    userId: user?.id,
    userEmail: user?.email,
    userName: user?.full_name,
    userAvatar: user?.avatar,
  };
};

export default useAuth;
