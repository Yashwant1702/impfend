import { useState, useEffect, useCallback } from 'react';
import storage from '../utils/storage';

/**
 * Hook for managing data in localStorage with React state synchronization
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if key doesn't exist
 * @returns {Array} - [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue = null) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storage.getItem(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      storage.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from localStorage and reset state
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for managing authentication tokens in localStorage
 * @returns {Object} - Token management functions and state
 */
export const useAuthTokenStorage = () => {
  const [accessToken, setAccessToken] = useState(() => storage.getAccessToken());
  const [refreshToken, setRefreshToken] = useState(() => storage.getRefreshToken());
  const [userData, setUserData] = useState(() => storage.getUserData());

  // Update tokens
  const updateTokens = useCallback((newAccessToken, newRefreshToken) => {
    storage.setAuthTokens(newAccessToken, newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
  }, []);

  // Clear tokens
  const clearTokens = useCallback(() => {
    storage.clearAuthTokens();
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  // Update user data
  const updateUserData = useCallback((newUserData) => {
    storage.setUserData(newUserData);
    setUserData(newUserData);
  }, []);

  // Clear user data
  const clearUserData = useCallback(() => {
    storage.clearUserData();
    setUserData(null);
  }, []);

  // Clear all auth data
  const clearAllAuthData = useCallback(() => {
    storage.clearAppData();
    setAccessToken(null);
    setRefreshToken(null);
    setUserData(null);
  }, []);

  // Check if user is logged in
  const isLoggedIn = useCallback(() => {
    return !!accessToken && !!refreshToken;
  }, [accessToken, refreshToken]);

  return {
    // State
    accessToken,
    refreshToken,
    userData,
    
    // Actions
    updateTokens,
    clearTokens,
    updateUserData,
    clearUserData,
    clearAllAuthData,
    
    // Computed
    isLoggedIn: isLoggedIn(),
  };
};

/**
 * Hook for managing theme preference in localStorage
 * @returns {Object} - Theme state and management functions
 */
export const useThemeStorage = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const setLightTheme = useCallback(() => {
    setTheme('light');
  }, [setTheme]);

  const setDarkTheme = useCallback(() => {
    setTheme('dark');
  }, [setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark',
  };
};

/**
 * Hook for managing user preferences in localStorage
 * @returns {Object} - Preferences state and management functions
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('user_preferences', {
    language: 'en',
    notifications: true,
    autoPlayVideos: true,
    compactMode: false,
    showTutorial: true,
  });

  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, [setPreferences]);

  const updatePreferences = useCallback((newPreferences) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences,
    }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences({
      language: 'en',
      notifications: true,
      autoPlayVideos: true,
      compactMode: false,
      showTutorial: true,
    });
  }, [setPreferences]);

  return {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
    
    // Individual preferences for easy access
    language: preferences.language,
    notificationsEnabled: preferences.notifications,
    autoPlayVideos: preferences.autoPlayVideos,
    compactMode: preferences.compactMode,
    showTutorial: preferences.showTutorial,
  };
};

/**
 * Hook for managing recent searches in localStorage
 * @param {string} key - The storage key for searches
 * @param {number} maxItems - Maximum number of recent searches to keep
 * @returns {Object} - Recent searches state and management functions
 */
export const useRecentSearches = (key = 'recent_searches', maxItems = 10) => {
  const [recentSearches, setRecentSearches] = useLocalStorage(key, []);

  const addSearch = useCallback((searchTerm) => {
    if (!searchTerm || typeof searchTerm !== 'string') return;
    
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm === '') return;

    setRecentSearches(prev => {
      // Remove existing occurrence if present
      const filtered = prev.filter(term => term !== trimmedTerm);
      
      // Add to beginning and limit to maxItems
      const updated = [trimmedTerm, ...filtered].slice(0, maxItems);
      
      return updated;
    });
  }, [setRecentSearches, maxItems]);

  const removeSearch = useCallback((searchTerm) => {
    setRecentSearches(prev => prev.filter(term => term !== searchTerm));
  }, [setRecentSearches]);

  const clearSearches = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches,
    hasSearches: recentSearches.length > 0,
  };
};

/**
 * Hook for managing form data persistence in localStorage
 * @param {string} key - The storage key for form data
 * @param {Object} initialData - Initial form data
 * @returns {Object} - Form data state and management functions
 */
export const useFormStorage = (key, initialData = {}) => {
  const [formData, setFormData] = useLocalStorage(key, initialData);

  const updateField = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  }, [setFormData]);

  const updateFields = useCallback((fields) => {
    setFormData(prev => ({
      ...prev,
      ...fields,
    }));
  }, [setFormData]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
  }, [setFormData, initialData]);

  const clearForm = useCallback(() => {
    setFormData({});
  }, [setFormData]);

  return {
    formData,
    setFormData,
    updateField,
    updateFields,
    resetForm,
    clearForm,
    isEmpty: Object.keys(formData).length === 0,
  };
};

export default useLocalStorage;
