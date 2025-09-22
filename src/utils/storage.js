import { APP_CONSTANTS } from './constants';

class StorageManager {
  constructor() {
    this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
  }

  checkLocalStorageAvailability() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  setItem(key, value) {
    if (!this.isLocalStorageAvailable) {
      console.warn('LocalStorage is not available');
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    if (!this.isLocalStorageAvailable) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    if (!this.isLocalStorageAvailable) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  clear() {
    if (!this.isLocalStorageAvailable) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // Authentication specific methods
  setAuthTokens(accessToken, refreshToken) {
    this.setItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    this.setItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  getAccessToken() {
    return this.getItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken() {
    return this.getItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
  }

  clearAuthTokens() {
    this.removeItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
    this.removeItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
  }

  setUserData(userData) {
    this.setItem(APP_CONSTANTS.STORAGE_KEYS.USER_DATA, userData);
  }

  getUserData() {
    return this.getItem(APP_CONSTANTS.STORAGE_KEYS.USER_DATA);
  }

  clearUserData() {
    this.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER_DATA);
  }

  // Theme methods
  setTheme(theme) {
    this.setItem(APP_CONSTANTS.STORAGE_KEYS.THEME, theme);
  }

  getTheme() {
    return this.getItem(APP_CONSTANTS.STORAGE_KEYS.THEME, 'light');
  }

  // Utility method to check if user is logged in
  isLoggedIn() {
    return !!this.getAccessToken();
  }

  // Clear all app data
  clearAppData() {
    Object.values(APP_CONSTANTS.STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }
}

// Create singleton instance
const storage = new StorageManager();

export default storage;

// Named exports for specific functions
export const {
  setItem,
  getItem,
  removeItem,
  clear,
  setAuthTokens,
  getAccessToken,
  getRefreshToken,
  clearAuthTokens,
  setUserData,
  getUserData,
  clearUserData,
  setTheme,
  getTheme,
  isLoggedIn,
  clearAppData,
} = storage;
