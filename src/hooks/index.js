// Import all hooks
import useAuth from './useAuth';
import useClubs from './useClubs';
import useEvents from './useEvents';
import useNotifications from './useNotifications';
import useGamification from './useGamification';
import useMessaging from './useMessaging';
import useDebounce, { useDebouncedCallback, useDebounceWithStatus } from './useDebounce';
import useLocalStorage, {
  useAuthTokenStorage,
  useThemeStorage,
  useUserPreferences,
  useRecentSearches,
  useFormStorage,
} from './useLocalStorage';

// Export individual hooks
export {
  useAuth,
  useClubs,
  useEvents,
  useNotifications,
  useGamification,
  useMessaging,
  useDebounce,
  useDebouncedCallback,
  useDebounceWithStatus,
  useLocalStorage,
  useAuthTokenStorage,
  useThemeStorage,
  useUserPreferences,
  useRecentSearches,
  useFormStorage,
};

// Create comprehensive hooks object
const hooks = {
  // Core feature hooks
  auth: useAuth,
  clubs: useClubs,
  events: useEvents,
  notifications: useNotifications,
  gamification: useGamification,
  messaging: useMessaging,
  
  // Utility hooks
  debounce: useDebounce,
  debouncedCallback: useDebouncedCallback,
  debounceWithStatus: useDebounceWithStatus,
  localStorage: useLocalStorage,
  authTokenStorage: useAuthTokenStorage,
  themeStorage: useThemeStorage,
  userPreferences: useUserPreferences,
  recentSearches: useRecentSearches,
  formStorage: useFormStorage,
};

// Export default hooks object
export default hooks;

// Hook initialization function
export const initializeHooks = () => {
  console.log('Hooks initialized successfully');
};

// Custom hook for combining multiple hooks
export const useAppState = () => {
  const auth = useAuth();
  const notifications = useNotifications();
  const messaging = useMessaging();
  const theme = useThemeStorage();
  
  return {
    auth,
    notifications,
    messaging,
    theme,
    
    // Combined computed values
    isFullyLoaded: !auth.isLoading && !notifications.isLoading && !messaging.isLoading,
    hasUnreadItems: notifications.hasUnread || messaging.hasUnreadMessages,
    unreadCount: notifications.unreadCount + messaging.unreadCount,
  };
};

// Hook for managing global app state
export const useGlobalState = () => {
  const appState = useAppState();
  const preferences = useUserPreferences();
  
  return {
    ...appState,
    preferences,
    
    // Global actions
    refreshAll: async () => {
      await Promise.all([
        appState.auth.refreshUser(),
        appState.notifications.refresh(),
        appState.messaging.fetchConversations(),
      ]);
    },
    
    signOut: async () => {
      await appState.auth.logout();
      preferences.resetPreferences();
    },
  };
};
