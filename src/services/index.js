// Import all services
import apiService from './api';
import authService from './auth';
import clubService from './clubs';
import eventService from './events';
import gamificationService from './gamification';
import notificationService from './notifications';
import messagingService from './messaging';

// Export individual services
export {
  apiService,
  authService,
  clubService,
  eventService,
  gamificationService,
  notificationService,
  messagingService,
};

// Export service classes and utilities
export { APIError, RequestInterceptor } from './api';

// Create comprehensive services object
const services = {
  api: apiService,
  auth: authService,
  clubs: clubService,
  events: eventService,
  gamification: gamificationService,
  notifications: notificationService,
  messaging: messagingService,
};

// Export default services object
export default services;

// Service initialization function
export const initializeServices = () => {
  // Initialize auth state
  authService.initializeAuth();
  
  // Set up real-time features if user is logged in
  if (authService.isLoggedIn()) {
    // Setup notification polling
    notificationService.setupRealTimeNotifications();
    
    // Setup messaging polling
    messagingService.setupRealTimeMessaging();
  }
  
  console.log('Services initialized successfully');
};

// Service cleanup function
export const cleanupServices = () => {
  // Cleanup any active connections or intervals
  console.log('Services cleaned up');
};

// Service health check
export const checkServiceHealth = async () => {
  const healthChecks = {
    api: false,
    auth: false,
    timestamp: new Date().toISOString(),
  };

  try {
    // Check API health
    const apiHealth = await apiService.healthCheck();
    healthChecks.api = apiHealth.status === 'ok' || apiHealth.status === 'healthy';
    
    // Check auth status
    healthChecks.auth = authService.isLoggedIn();
    
    return {
      success: true,
      data: healthChecks,
      allHealthy: healthChecks.api,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: healthChecks,
      allHealthy: false,
    };
  }
};
