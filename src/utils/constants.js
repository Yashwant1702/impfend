// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  VERSION: process.env.REACT_APP_API_VERSION || 'v1',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/login/',
    REGISTER: '/api/v1/auth/register/',
    LOGOUT: '/api/v1/auth/logout/',
    PROFILE: '/api/v1/auth/profile/',
    REFRESH_TOKEN: '/api/v1/auth/token/refresh/',
    UPDATE_PROFILE: '/api/v1/auth/profile/update/',
    CHANGE_PASSWORD: '/api/v1/auth/password/change/',
    CHECK_EMAIL: '/api/v1/auth/check-email/',
    COLLEGES: '/api/v1/auth/colleges/',
  },
  
  // Club endpoints
  CLUBS: {
    LIST: '/api/v1/clubs/',
    CREATE: '/api/v1/clubs/create/',
    DETAIL: (slug) => `/api/v1/clubs/${slug}/`,
    UPDATE: (slug) => `/api/v1/clubs/${slug}/edit/`,
    DELETE: (slug) => `/api/v1/clubs/${slug}/delete/`,
    JOIN: (slug) => `/api/v1/clubs/${slug}/join/`,
    LEAVE: (slug) => `/api/v1/clubs/${slug}/leave/`,
    MEMBERS: (slug) => `/api/v1/clubs/${slug}/members/`,
    ANNOUNCEMENTS: (slug) => `/api/v1/clubs/${slug}/announcements/`,
    MY_CLUBS: '/api/v1/clubs/my-clubs/',
    DISCOVER: '/api/v1/clubs/discover/',
  },
  
  // Event endpoints
  EVENTS: {
    LIST: '/api/v1/events/',
    CREATE: '/api/v1/events/create/',
    DETAIL: (slug) => `/api/v1/events/${slug}/`,
    UPDATE: (slug) => `/api/v1/events/${slug}/edit/`,
    DELETE: (slug) => `/api/v1/events/${slug}/delete/`,
    REGISTER: (slug) => `/api/v1/events/${slug}/register/`,
    UNREGISTER: (slug) => `/api/v1/events/${slug}/unregister/`,
    ATTENDEES: (slug) => `/api/v1/events/${slug}/attendees/`,
    MY_EVENTS: '/api/v1/events/my-events/',
    UPCOMING: '/api/v1/events/upcoming/',
  },
  
  // Gamification endpoints
  GAMIFICATION: {
    PROFILE: '/api/v1/gamification/profile/',
    BADGES: '/api/v1/gamification/badges/',
    MY_BADGES: '/api/v1/gamification/badges/my-badges/',
    ACHIEVEMENTS: '/api/v1/gamification/achievements/',
    JOIN_ACHIEVEMENT: (id) => `/api/v1/gamification/achievements/${id}/join/`,
    LEADERBOARD: '/api/v1/gamification/leaderboards/data/',
    POINTS: '/api/v1/gamification/points/my-profile/',
  },
  
  // Notification endpoints
  NOTIFICATIONS: {
    LIST: '/api/v1/notifications/',
    MARK_READ: (id) => `/api/v1/notifications/${id}/`,
    MARK_ALL_READ: '/api/v1/notifications/mark-all-read/',
    UNREAD_COUNT: '/api/v1/notifications/unread-count/',
    SETTINGS: '/api/v1/notifications/settings/',
    TEST: '/api/v1/notifications/test/',
  },
  
  // Messaging endpoints
  MESSAGING: {
    CONVERSATIONS: '/api/v1/messaging/conversations/',
    CONVERSATION_DETAIL: (id) => `/api/v1/messaging/conversations/${id}/`,
    MESSAGES: (id) => `/api/v1/messaging/conversations/${id}/messages/`,
    SEND_MESSAGE: (id) => `/api/v1/messaging/conversations/${id}/messages/`,
    MARK_READ: (id) => `/api/v1/messaging/conversations/${id}/read/`,
  },
  
  // Analytics endpoints
  ANALYTICS: {
    DASHBOARD: '/api/v1/analytics/dashboard/',
    STATS: '/api/v1/analytics/stats/',
    EXPORT: (type) => `/api/v1/analytics/export/${type}/`,
    CHARTS: '/api/v1/analytics/charts/',
  },
  
  // Collaboration endpoints
  COLLABORATION: {
    LIST: '/api/v1/collaboration/',
    DETAIL: (slug) => `/api/v1/collaboration/${slug}/`,
    APPLY: (slug, clubSlug) => `/api/v1/collaboration/${slug}/apply/${clubSlug}/`,
    PARTICIPANTS: (slug) => `/api/v1/collaboration/${slug}/participants/`,
    DISCOVER: '/api/v1/collaboration/discover/',
  },
};

// Application constants
export const APP_CONSTANTS = {
  APP_NAME: 'Campus Club Management Suite',
  APP_VERSION: '1.0.0',
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'campus_club_access_token',
    REFRESH_TOKEN: 'campus_club_refresh_token',
    USER_DATA: 'campus_club_user_data',
    THEME: 'campus_club_theme',
  },
  USER_TYPES: {
    STUDENT: 'student',
    FACULTY: 'faculty',
    COLLEGE_ADMIN: 'college_admin',
  },
  CLUB_ROLES: {
    FOUNDER: 'founder',
    ADMIN: 'admin',
    LEADER: 'leader',
    MEMBER: 'member',
  },
  NOTIFICATION_TYPES: {
    CLUB_INVITATION: 'club_invitation',
    EVENT_REMINDER: 'event_reminder',
    EVENT_REGISTRATION: 'event_registration',
    CLUB_ANNOUNCEMENT: 'club_announcement',
    MESSAGE_RECEIVED: 'message_received',
    BADGE_EARNED: 'badge_earned',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  },
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    CLUBS: '/clubs',
    CLUB_DETAIL: '/clubs/:slug',
    EVENTS: '/events',
    EVENT_DETAIL: '/events/:slug',
    PROFILE: '/profile',
    GAMIFICATION: '/gamification',
    MESSAGES: '/messages',
    NOTIFICATIONS: '/notifications',
  },
};

// UI Constants
export const UI_CONSTANTS = {
  BREAKPOINTS: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
  ANIMATIONS: {
    FAST: '0.15s',
    NORMAL: '0.3s',
    SLOW: '0.5s',
  },
  Z_INDEX: {
    MODAL: 1000,
    DROPDOWN: 100,
    HEADER: 50,
    OVERLAY: 900,
  },
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  APP_CONSTANTS,
  UI_CONSTANTS,
};
