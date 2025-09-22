
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notifications';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const result = await notificationService.getNotifications(filters);
      if (result.success) {
        return result;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const result = await notificationService.markAsRead(notificationId);
      if (result.success) {
        return { notificationId, data: result.data };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const result = await notificationService.markAllAsRead();
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      const result = await notificationService.deleteNotification(notificationId);
      if (result.success) {
        return { notificationId };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const result = await notificationService.getUnreadCount();
      if (result.success) {
        return result.count;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state with exact Django backend field mapping
const initialState = {
  // Notifications list - exact backend fields
  notifications: [],
  
  // Pagination
  pagination: {
    count: 0,
    totalPages: 0,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
  },
  
  // Filters matching Django backend
  filters: {
    page: 1,
    is_read: '', // '', 'true', 'false'
    notification_type: '', // club_invitation, event_reminder, etc.
    priority: '', // low, normal, high, urgent
    start_date: '',
    end_date: '',
    limit: 20,
  },
  
  // Counts
  unreadCount: 0,
  totalCount: 0,
  
  // Loading states
  isLoading: false,
  isLoadingMore: false,
  isMarkingAsRead: false,
  isMarkingAllAsRead: false,
  isDeleting: false,
  isLoadingUnreadCount: false,
  
  // Error states
  error: null,
  markAsReadError: null,
  deleteError: null,
  
  // UI states
  showNotificationsPanel: false,
  selectedNotification: null,
  showNotificationModal: false,
  
  // Settings
  notificationSettings: {
    email_notifications: true,
    push_notifications: true,
    club_invitations: true,
    event_reminders: true,
    event_registrations: true,
    club_announcements: true,
    messages: true,
    badge_earned: true,
    achievement_unlocked: true,
    weekly_digest: true,
    marketing_emails: false,
    frequency: 'immediate', // immediate, hourly, daily, weekly
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    timezone: 'UTC',
  },
  
  // Notification types cache
  notificationTypes: [],
  
  // Real-time connection status
  realTimeConnected: false,
  
  // Last updated timestamp
  lastUpdated: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.markAsReadError = null;
      state.deleteError = null;
    },
    
    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Reset filters
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        is_read: '',
        notification_type: '',
        priority: '',
        start_date: '',
        end_date: '',
        limit: 20,
      };
    },
    
    // UI actions
    showNotificationsPanel: (state) => {
      state.showNotificationsPanel = true;
    },
    
    hideNotificationsPanel: (state) => {
      state.showNotificationsPanel = false;
    },
    
    toggleNotificationsPanel: (state) => {
      state.showNotificationsPanel = !state.showNotificationsPanel;
    },
    
    setSelectedNotification: (state, action) => {
      state.selectedNotification = action.payload;
    },
    
    showNotificationModal: (state, action) => {
      state.showNotificationModal = true;
      state.selectedNotification = action.payload;
    },
    
    hideNotificationModal: (state) => {
      state.showNotificationModal = false;
      state.selectedNotification = null;
    },
    
    // Real-time updates
    addNewNotification: (state, action) => {
      const newNotification = action.payload;
      state.notifications = [newNotification, ...state.notifications];
      
      if (!newNotification.is_read) {
        state.unreadCount += 1;
      }
      
      state.totalCount += 1;
    },
    
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    
    // Optimistic updates
    optimisticMarkAsRead: (state, action) => {
      const notificationId = action.payload;
      
      state.notifications = state.notifications.map(notification =>
        notification.id === notificationId
          ? { 
              ...notification, 
              is_read: true, 
              read_at: new Date().toISOString() 
            }
          : notification
      );
      
      // Find if notification was unread and update count
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.is_read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    optimisticMarkAllAsRead: (state) => {
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        is_read: true,
        read_at: new Date().toISOString()
      }));
      
      state.unreadCount = 0;
    },
    
    optimisticDeleteNotification: (state, action) => {
      const notificationId = action.payload;
      
      // Find notification to check if it was unread
      const notification = state.notifications.find(n => n.id === notificationId);
      
      // Remove from list
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
      
      // Update counts
      state.totalCount -= 1;
      if (notification && !notification.is_read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    // Settings
    updateNotificationSettings: (state, action) => {
      state.notificationSettings = { ...state.notificationSettings, ...action.payload };
    },
    
    // Set notification types
    setNotificationTypes: (state, action) => {
      state.notificationTypes = action.payload;
    },
    
    // Set real-time connection status
    setRealTimeConnected: (state, action) => {
      state.realTimeConnected = action.payload;
    },
    
    // Bulk operations
    bulkMarkAsRead: (state, action) => {
      const notificationIds = action.payload;
      let unreadUpdated = 0;
      
      state.notifications = state.notifications.map(notification => {
        if (notificationIds.includes(notification.id) && !notification.is_read) {
          unreadUpdated += 1;
          return {
            ...notification,
            is_read: true,
            read_at: new Date().toISOString()
          };
        }
        return notification;
      });
      
      state.unreadCount = Math.max(0, state.unreadCount - unreadUpdated);
    },
    
    bulkDelete: (state, action) => {
      const notificationIds = action.payload;
      let unreadDeleted = 0;
      
      const notificationsToDelete = state.notifications.filter(n =>
        notificationIds.includes(n.id)
      );
      
      unreadDeleted = notificationsToDelete.filter(n => !n.is_read).length;
      
      state.notifications = state.notifications.filter(n =>
        !notificationIds.includes(n.id)
      );
      
      state.totalCount -= notificationIds.length;
      state.unreadCount = Math.max(0, state.unreadCount - unreadDeleted);
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state, action) => {
        const isLoadMore = action.meta.arg?.page > 1;
        if (isLoadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        
        const { data, pagination } = action.payload;
        const isLoadMore = pagination.currentPage > 1;
        
        if (isLoadMore) {
          state.notifications = [...state.notifications, ...data];
        } else {
          state.notifications = data;
        }
        
        state.pagination = pagination;
        state.totalCount = pagination.count;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.payload;
      })
      
      // Mark as read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.isMarkingAsRead = true;
        state.markAsReadError = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.isMarkingAsRead = false;
        
        const { notificationId } = action.payload;
        
        // Update notification in list
        state.notifications = state.notifications.map(notification =>
          notification.id === notificationId
            ? { 
                ...notification, 
                is_read: true, 
                read_at: new Date().toISOString() 
              }
            : notification
        );
        
        // Update unread count
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.isMarkingAsRead = false;
        state.markAsReadError = action.payload;
      })
      
      // Mark all as read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.isMarkingAllAsRead = true;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.isMarkingAllAsRead = false;
        
        // Mark all notifications as read
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          is_read: true,
          read_at: new Date().toISOString()
        }));
        
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.isMarkingAllAsRead = false;
        state.error = action.payload;
      })
      
      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isDeleting = false;
        
        const { notificationId } = action.payload;
        
        // Find notification to check if it was unread
        const notification = state.notifications.find(n => n.id === notificationId);
        
        // Remove from list
        state.notifications = state.notifications.filter(n => n.id !== notificationId);
        
        // Update counts
        state.totalCount -= 1;
        if (notification && !notification.is_read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload;
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.isLoadingUnreadCount = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.isLoadingUnreadCount = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.isLoadingUnreadCount = false;
        state.error = action.payload;
      });
  },
});

// Action creators
export const {
  clearError,
  updateFilters,
  resetFilters,
  showNotificationsPanel,
  hideNotificationsPanel,
  toggleNotificationsPanel,
  setSelectedNotification,
  showNotificationModal,
  hideNotificationModal,
  addNewNotification,
  updateUnreadCount,
  optimisticMarkAsRead,
  optimisticMarkAllAsRead,
  optimisticDeleteNotification,
  updateNotificationSettings,
  setNotificationTypes,
  setRealTimeConnected,
  bulkMarkAsRead,
  bulkDelete,
} = notificationsSlice.actions;

// Selectors
export const selectNotifications = (state) => state.notifications;
export const selectNotificationsList = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state) => state.notifications.isLoading;
export const selectNotificationsError = (state) => state.notifications.error;
export const selectNotificationsPagination = (state) => state.notifications.pagination;
export const selectNotificationsFilters = (state) => state.notifications.filters;
export const selectNotificationSettings = (state) => state.notifications.notificationSettings;
export const selectShowNotificationsPanel = (state) => state.notifications.showNotificationsPanel;

// Complex selectors
export const selectUnreadNotifications = (state) =>
  state.notifications.notifications.filter(n => !n.is_read);

export const selectReadNotifications = (state) =>
  state.notifications.notifications.filter(n => n.is_read);

export const selectNotificationsByType = (type) => (state) =>
  state.notifications.notifications.filter(n => n.notification_type?.name === type);

export const selectNotificationsByPriority = (priority) => (state) =>
  state.notifications.notifications.filter(n => n.priority === priority);

export const selectHasUnreadNotifications = (state) =>
  state.notifications.unreadCount > 0;

export default notificationsSlice.reducer;
