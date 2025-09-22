import { createSlice } from '@reduxjs/toolkit';

// Initial state for global UI management
const initialState = {
  // Theme
  theme: 'light', // light, dark
  
  // Layout
  sidebarCollapsed: false,
  sidebarVisible: true,
  headerVisible: true,
  
  // Mobile responsive
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  screenWidth: 1920,
  screenHeight: 1080,
  
  // Loading states
  globalLoading: false,
  loadingMessage: '',
  
  // Modals and overlays
  modals: {
    loginModal: false,
    registerModal: false,
    profileModal: false,
    settingsModal: false,
    confirmModal: false,
    imagePreviewModal: false,
    videoPreviewModal: false,
  },
  
  // Modal data
  confirmModalData: {
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
    isDestructive: false,
  },
  
  imagePreviewData: {
    src: '',
    alt: '',
    title: '',
  },
  
  videoPreviewData: {
    src: '',
    title: '',
    poster: '',
  },
  
  // Toast notifications (different from app notifications)
  toasts: [],
  
  // Page states
  pageTitle: 'Campus Club Management Suite',
  breadcrumbs: [],
  
  // Search
  globalSearchVisible: false,
  globalSearchQuery: '',
  globalSearchResults: [],
  isGlobalSearching: false,
  
  // Navigation
  activeNavItem: '',
  navigationHistory: [],
  
  // Scroll positions (for maintaining scroll on navigation)
  scrollPositions: {},
  
  // Form states
  formStates: {},
  
  // Keyboard shortcuts
  keyboardShortcutsEnabled: true,
  keyboardShortcutsVisible: false,
  
  // Accessibility
  highContrast: false,
  reducedMotion: false,
  fontSize: 'normal', // small, normal, large
  
  // Performance
  enableAnimations: true,
  enableTransitions: true,
  enableParticles: true,
  
  // Developer tools
  showGridOverlay: false,
  showComponentBoundaries: false,
  debugMode: false,
  
  // Connection status
  isOnline: true,
  connectionType: 'unknown', // slow-2g, 2g, 3g, 4g, unknown
  
  // Tutorial/onboarding
  showTutorial: false,
  currentTutorialStep: 0,
  completedTutorialSteps: [],
  
  // Preferences
  preferences: {
    autoSave: true,
    confirmBeforeLeaving: true,
    showNotificationPreviews: true,
    playNotificationSounds: true,
    enableKeyboardNavigation: true,
    compactMode: false,
    showTimestamps: true,
    use24HourFormat: false,
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
  },
  
  // Error boundary
  hasError: false,
  errorInfo: null,
  
  // Update available
  updateAvailable: false,
  updateVersion: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // Layout actions
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    
    setSidebarVisible: (state, action) => {
      state.sidebarVisible = action.payload;
    },
    
    setHeaderVisible: (state, action) => {
      state.headerVisible = action.payload;
    },
    
    // Responsive actions
    setScreenSize: (state, action) => {
      const { width, height } = action.payload;
      state.screenWidth = width;
      state.screenHeight = height;
      
      // Update responsive flags
      state.isMobile = width < 768;
      state.isTablet = width >= 768 && width < 1024;
      state.isDesktop = width >= 1024;
      
      // Auto-collapse sidebar on mobile
      if (state.isMobile) {
        state.sidebarCollapsed = true;
      }
    },
    
    // Loading actions
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    
    setLoadingMessage: (state, action) => {
      state.loadingMessage = action.payload;
    },
    
    // Modal actions
    showModal: (state, action) => {
      const { modalName, data } = action.payload;
      state.modals[modalName] = true;
      
      // Set modal-specific data
      if (modalName === 'confirmModal' && data) {
        state.confirmModalData = { ...state.confirmModalData, ...data };
      } else if (modalName === 'imagePreviewModal' && data) {
        state.imagePreviewData = { ...state.imagePreviewData, ...data };
      } else if (modalName === 'videoPreviewModal' && data) {
        state.videoPreviewData = { ...state.videoPreviewData, ...data };
      }
    },
    
    hideModal: (state, action) => {
      const modalName = action.payload;
      state.modals[modalName] = false;
      
      // Clear modal-specific data
      if (modalName === 'confirmModal') {
        state.confirmModalData = {
          title: '',
          message: '',
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          onConfirm: null,
          onCancel: null,
          isDestructive: false,
        };
      } else if (modalName === 'imagePreviewModal') {
        state.imagePreviewData = { src: '', alt: '', title: '' };
      } else if (modalName === 'videoPreviewModal') {
        state.videoPreviewData = { src: '', title: '', poster: '' };
      }
    },
    
    hideAllModals: (state) => {
      Object.keys(state.modals).forEach(modalName => {
        state.modals[modalName] = false;
      });
    },
    
    // Toast actions
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: 'info',
        duration: 5000,
        ...action.payload,
        createdAt: Date.now(),
      };
      state.toasts.push(toast);
    },
    
    removeToast: (state, action) => {
      const toastId = action.payload;
      state.toasts = state.toasts.filter(toast => toast.id !== toastId);
    },
    
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    
    // Page actions
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload;
    },
    
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    
    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload);
    },
    
    // Search actions
    toggleGlobalSearch: (state) => {
      state.globalSearchVisible = !state.globalSearchVisible;
    },
    
    setGlobalSearchVisible: (state, action) => {
      state.globalSearchVisible = action.payload;
    },
    
    setGlobalSearchQuery: (state, action) => {
      state.globalSearchQuery = action.payload;
    },
    
    setGlobalSearchResults: (state, action) => {
      state.globalSearchResults = action.payload;
    },
    
    setIsGlobalSearching: (state, action) => {
      state.isGlobalSearching = action.payload;
    },
    
    clearGlobalSearch: (state) => {
      state.globalSearchQuery = '';
      state.globalSearchResults = [];
      state.globalSearchVisible = false;
    },
    
    // Navigation actions
    setActiveNavItem: (state, action) => {
      state.activeNavItem = action.payload;
    },
    
    addToNavigationHistory: (state, action) => {
      const path = action.payload;
      state.navigationHistory = [path, ...state.navigationHistory.slice(0, 9)]; // Keep last 10
    },
    
    // Scroll position actions
    setScrollPosition: (state, action) => {
      const { key, position } = action.payload;
      state.scrollPositions[key] = position;
    },
    
    getScrollPosition: (state, action) => {
      const key = action.payload;
      return state.scrollPositions[key] || 0;
    },
    
    clearScrollPositions: (state) => {
      state.scrollPositions = {};
    },
    
    // Form state actions
    setFormState: (state, action) => {
      const { formId, formState } = action.payload;
      state.formStates[formId] = formState;
    },
    
    clearFormState: (state, action) => {
      const formId = action.payload;
      delete state.formStates[formId];
    },
    
    clearAllFormStates: (state) => {
      state.formStates = {};
    },
    
    // Keyboard shortcuts actions
    setKeyboardShortcutsEnabled: (state, action) => {
      state.keyboardShortcutsEnabled = action.payload;
    },
    
    toggleKeyboardShortcutsVisible: (state) => {
      state.keyboardShortcutsVisible = !state.keyboardShortcutsVisible;
    },
    
    // Accessibility actions
    setHighContrast: (state, action) => {
      state.highContrast = action.payload;
    },
    
    setReducedMotion: (state, action) => {
      state.reducedMotion = action.payload;
      // Disable animations if reduced motion is enabled
      if (action.payload) {
        state.enableAnimations = false;
        state.enableTransitions = false;
      }
    },
    
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    
    // Performance actions
    setEnableAnimations: (state, action) => {
      state.enableAnimations = action.payload;
    },
    
    setEnableTransitions: (state, action) => {
      state.enableTransitions = action.payload;
    },
    
    setEnableParticles: (state, action) => {
      state.enableParticles = action.payload;
    },
    
    // Developer tools actions
    toggleGridOverlay: (state) => {
      state.showGridOverlay = !state.showGridOverlay;
    },
    
    toggleComponentBoundaries: (state) => {
      state.showComponentBoundaries = !state.showComponentBoundaries;
    },
    
    setDebugMode: (state, action) => {
      state.debugMode = action.payload;
    },
    
    // Connection status actions
    setIsOnline: (state, action) => {
      state.isOnline = action.payload;
    },
    
    setConnectionType: (state, action) => {
      state.connectionType = action.payload;
    },
    
    // Tutorial actions
    setShowTutorial: (state, action) => {
      state.showTutorial = action.payload;
    },
    
    setCurrentTutorialStep: (state, action) => {
      state.currentTutorialStep = action.payload;
    },
    
    addCompletedTutorialStep: (state, action) => {
      const step = action.payload;
      if (!state.completedTutorialSteps.includes(step)) {
        state.completedTutorialSteps.push(step);
      }
    },
    
    resetTutorial: (state) => {
      state.currentTutorialStep = 0;
      state.completedTutorialSteps = [];
      state.showTutorial = false;
    },
    
    // Preferences actions
    updatePreference: (state, action) => {
      const { key, value } = action.payload;
      state.preferences[key] = value;
    },
    
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    resetPreferences: (state) => {
      state.preferences = initialState.preferences;
    },
    
    // Error boundary actions
    setError: (state, action) => {
      state.hasError = true;
      state.errorInfo = action.payload;
    },
    
    clearError: (state) => {
      state.hasError = false;
      state.errorInfo = null;
    },
    
    // Update actions
    setUpdateAvailable: (state, action) => {
      state.updateAvailable = true;
      state.updateVersion = action.payload;
    },
    
    clearUpdateAvailable: (state) => {
      state.updateAvailable = false;
      state.updateVersion = '';
    },
  },
});

// Action creators
export const {
  setTheme,
  toggleTheme,
  toggleSidebar,
  setSidebarCollapsed,
  setSidebarVisible,
  setHeaderVisible,
  setScreenSize,
  setGlobalLoading,
  setLoadingMessage,
  showModal,
  hideModal,
  hideAllModals,
  addToast,
  removeToast,
  clearAllToasts,
  setPageTitle,
  setBreadcrumbs,
  addBreadcrumb,
  toggleGlobalSearch,
  setGlobalSearchVisible,
  setGlobalSearchQuery,
  setGlobalSearchResults,
  setIsGlobalSearching,
  clearGlobalSearch,
  setActiveNavItem,
  addToNavigationHistory,
  setScrollPosition,
  getScrollPosition,
  clearScrollPositions,
  setFormState,
  clearFormState,
  clearAllFormStates,
  setKeyboardShortcutsEnabled,
  toggleKeyboardShortcutsVisible,
  setHighContrast,
  setReducedMotion,
  setFontSize,
  setEnableAnimations,
  setEnableTransitions,
  setEnableParticles,
  toggleGridOverlay,
  toggleComponentBoundaries,
  setDebugMode,
  setIsOnline,
  setConnectionType,
  setShowTutorial,
  setCurrentTutorialStep,
  addCompletedTutorialStep,
  resetTutorial,
  updatePreference,
  updatePreferences,
  resetPreferences,
  setError,
  clearError,
  setUpdateAvailable,
  clearUpdateAvailable,
} = uiSlice.actions;

// Selectors
export const selectUI = (state) => state.ui;
export const selectTheme = (state) => state.ui.theme;
export const selectIsMobile = (state) => state.ui.isMobile;
export const selectIsTablet = (state) => state.ui.isTablet;
export const selectIsDesktop = (state) => state.ui.isDesktop;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectModals = (state) => state.ui.modals;
export const selectToasts = (state) => state.ui.toasts;
export const selectPageTitle = (state) => state.ui.pageTitle;
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;
export const selectGlobalSearchVisible = (state) => state.ui.globalSearchVisible;
export const selectPreferences = (state) => state.ui.preferences;
export const selectIsOnline = (state) => state.ui.isOnline;
export const selectShowTutorial = (state) => state.ui.showTutorial;

// Complex selectors
export const selectIsModalOpen = (modalName) => (state) =>
  state.ui.modals[modalName] || false;

export const selectHasAnyModalOpen = (state) =>
  Object.values(state.ui.modals).some(isOpen => isOpen);

export const selectFormState = (formId) => (state) =>
  state.ui.formStates[formId] || {};

export const selectIsDarkTheme = (state) => state.ui.theme === 'dark';

export default uiSlice.reducer;
