// Import all contexts
import AppContext, { AppProvider, useApp } from './AppContext';
import AuthContext, { AuthProvider, useAuth } from './AuthContext';
import ThemeContext, { ThemeProvider, useTheme } from './ThemeContext';
import NotificationContext, { NotificationProvider, useNotifications } from './NotificationContext';

// Export contexts
export {
  AppContext,
  AuthContext,
  ThemeContext,
  NotificationContext,
};

// Export providers
export {
  AppProvider,
  AuthProvider,
  ThemeProvider,
  NotificationProvider,
};

// Export hooks
export {
  useApp,
  useAuth,
  useTheme,
  useNotifications,
};

// Export combined provider component
export const CombinedProvider = ({ children }) => {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
};

// Default export
export default {
  AppContext,
  AuthContext,
  ThemeContext,
  NotificationContext,
  AppProvider,
  AuthProvider,
  ThemeProvider,
  NotificationProvider,
  useApp,
  useAuth,
  useTheme,
  useNotifications,
  CombinedProvider,
};
