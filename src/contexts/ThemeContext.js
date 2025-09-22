import React, { createContext, useContext, useEffect, useState } from 'react';
import { theme as defaultTheme } from '../styles/theme';
import storage from '../utils/storage';

// Create context
const ThemeContext = createContext();

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [customTheme, setCustomTheme] = useState(defaultTheme);

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = storage.getItem('campus_club_theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Apply CSS custom properties
    const root = document.documentElement;
    
    if (currentTheme === 'dark') {
      // Apply dark theme colors
      root.style.setProperty('--primary-color', '#4ade80');
      root.style.setProperty('--background-color', '#0f172a');
      root.style.setProperty('--surface-color', '#1e293b');
      root.style.setProperty('--text-color', '#f1f5f9');
      root.style.setProperty('--text-secondary', '#cbd5e1');
    } else {
      // Apply light theme colors
      root.style.setProperty('--primary-color', '#52d4a0');
      root.style.setProperty('--background-color', '#ffffff');
      root.style.setProperty('--surface-color', '#f8fffe');
      root.style.setProperty('--text-color', '#2d3748');
      root.style.setProperty('--text-secondary', '#4a5568');
    }
  }, [currentTheme]);

  // Save theme to storage
  useEffect(() => {
    storage.setItem('campus_club_theme', currentTheme);
  }, [currentTheme]);

  // Set theme function
  const setTheme = (theme) => {
    setCurrentTheme(theme);
  };

  // Toggle theme function
  const toggleTheme = () => {
    setCurrentTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Get theme colors
  const getColors = () => {
    return currentTheme === 'dark' ? {
      primary: '#4ade80',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#334155',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    } : {
      primary: '#52d4a0',
      background: '#ffffff',
      surface: '#f8fffe',
      text: '#2d3748',
      textSecondary: '#4a5568',
      border: '#e2e8f0',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    };
  };

  // Get spacing values
  const getSpacing = () => {
    return defaultTheme.spacing;
  };

  // Get typography values
  const getTypography = () => {
    return defaultTheme.typography;
  };

  // Get breakpoints
  const getBreakpoints = () => {
    return defaultTheme.breakpoints;
  };

  // Get shadows based on theme
  const getShadows = () => {
    if (currentTheme === 'dark') {
      return {
        small: '0 1px 3px rgba(0, 0, 0, 0.5)',
        medium: '0 4px 6px rgba(0, 0, 0, 0.4)',
        large: '0 10px 15px rgba(0, 0, 0, 0.3)',
        neomorphic: '4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)',
      };
    }
    return defaultTheme.shadows.raised;
  };

  // Check if system prefers dark mode
  const systemPrefersDark = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a theme
      const savedTheme = storage.getItem('campus_club_theme');
      if (!savedTheme) {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Update custom theme
  const updateCustomTheme = (themeUpdates) => {
    setCustomTheme(prevTheme => ({
      ...prevTheme,
      ...themeUpdates,
    }));
  };

  // Reset to default theme
  const resetTheme = () => {
    setCustomTheme(defaultTheme);
    storage.removeItem('campus_club_custom_theme');
  };

  // Context value
  const value = {
    // Current theme state
    currentTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
    
    // Theme object
    theme: customTheme,
    
    // Theme actions
    setTheme,
    toggleTheme,
    updateCustomTheme,
    resetTheme,
    
    // Theme utilities
    getColors,
    getSpacing,
    getTypography,
    getBreakpoints,
    getShadows,
    systemPrefersDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
