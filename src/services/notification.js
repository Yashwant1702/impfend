import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

class NotificationService {
  // Get user notifications
  async getNotifications(filters = {}) {
    try {
      const {
        page = 1,
        isRead = '',
        notificationType = '',
        priority = '',
        startDate = '',
        endDate = '',
        limit = 20,
      } = filters;

      const params = {
        page,
        is_read: isRead,
        notification_type: notificationType,
        priority,
        start_date: startDate,
        end_date: endDate,
        page_size: limit,
      };

      const response = await apiService.get(API_ENDPOINTS.NOTIFICATIONS.LIST, { params });

      return {
        success: true,
        data: response.results || [],
        pagination: {
          count: response.count || 0,
          totalPages: Math.ceil((response.count || 0) / limit),
          currentPage: page,
          hasNext: !!response.next,
          hasPrevious: !!response.previous,
          next: response.next,
          previous: response.previous,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
        pagination: null,
      };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await apiService.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId), {
        is_read: true
      });

      return {
        success: true,
        data: response,
        message: 'Notification marked as read',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Mark notification as unread
  async markAsUnread(notificationId) {
    try {
      const response = await apiService.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId), {
        is_read: false
      });

      return {
        success: true,
        data: response,
        message: 'Notification marked as unread',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await apiService.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);

      return {
        success: true,
        data: response,
        message: 'All notifications marked as read',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get unread notification count
  async getUnreadCount() {
    try {
      const response = await apiService.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);

      return {
        success: true,
        data: response,
        count: response.unread_count || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        count: 0,
      };
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      await apiService.delete(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId));

      return {
        success: true,
        message: 'Notification deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Delete all read notifications
  async deleteAllRead() {
    try {
      const response = await apiService.post('/api/v1/notifications/delete-all-read/');

      return {
        success: true,
        data: response,
        message: 'All read notifications deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get notification settings
  async getNotificationSettings() {
    try {
      const response = await apiService.get(API_ENDPOINTS.NOTIFICATIONS.SETTINGS);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: {},
      };
    }
  }

  // Update notification settings
  async updateNotificationSettings(settings) {
    try {
      const response = await apiService.put(API_ENDPOINTS.NOTIFICATIONS.SETTINGS, {
        email_notifications: settings.emailNotifications,
        push_notifications: settings.pushNotifications,
        club_invitations: settings.clubInvitations,
        event_reminders: settings.eventReminders,
        event_registrations: settings.eventRegistrations,
        club_announcements: settings.clubAnnouncements,
        messages: settings.messages,
        badge_earned: settings.badgeEarned,
        achievement_unlocked: settings.achievementUnlocked,
        weekly_digest: settings.weeklyDigest,
        marketing_emails: settings.marketingEmails,
        frequency: settings.frequency || 'immediate',
        quiet_hours_start: settings.quietHoursStart,
        quiet_hours_end: settings.quietHoursEnd,
        timezone: settings.timezone,
      });

      return {
        success: true,
        data: response,
        message: 'Notification settings updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Get notification types
  async getNotificationTypes() {
    try {
      const response = await apiService.get('/api/v1/notifications/types/');

      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Subscribe to push notifications
  async subscribeToPushNotifications(subscription) {
    try {
      const response = await apiService.post('/api/v1/notifications/push/subscribe/', {
        subscription: subscription,
        user_agent: navigator.userAgent,
      });

      return {
        success: true,
        data: response,
        message: 'Successfully subscribed to push notifications',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPushNotifications(subscriptionId) {
    try {
      const response = await apiService.post('/api/v1/notifications/push/unsubscribe/', {
        subscription_id: subscriptionId,
      });

      return {
        success: true,
        data: response,
        message: 'Successfully unsubscribed from push notifications',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Test notifications (for development)
  async testNotification(type = 'general') {
    try {
      const response = await apiService.post(API_ENDPOINTS.NOTIFICATIONS.TEST, {
        type: type,
      });

      return {
        success: true,
        data: response,
        message: 'Test notification sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get notification statistics
  async getNotificationStats() {
    try {
      const response = await apiService.get('/api/v1/notifications/stats/');

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: {
          total_notifications: 0,
          unread_notifications: 0,
          read_notifications: 0,
          notifications_by_type: {},
        },
      };
    }
  }

  // Bulk operations on notifications
  async bulkOperation(operation, notificationIds) {
    try {
      const response = await apiService.post('/api/v1/notifications/bulk/', {
        operation: operation, // 'mark_read', 'mark_unread', 'delete'
        notification_ids: notificationIds,
      });

      return {
        success: true,
        data: response,
        message: `Bulk operation '${operation}' completed successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Archive notification
  async archiveNotification(notificationId) {
    try {
      const response = await apiService.post(`/api/v1/notifications/${notificationId}/archive/`);

      return {
        success: true,
        data: response,
        message: 'Notification archived successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get archived notifications
  async getArchivedNotifications(page = 1) {
    try {
      const response = await apiService.get('/api/v1/notifications/archived/', {
        params: { page }
      });

      return {
        success: true,
        data: response.results || [],
        pagination: response.count ? {
          count: response.count,
          totalPages: Math.ceil(response.count / 20),
          currentPage: page,
          hasNext: !!response.next,
          hasPrevious: !!response.previous,
        } : null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Snooze notification
  async snoozeNotification(notificationId, snoozeUntil) {
    try {
      const response = await apiService.post(`/api/v1/notifications/${notificationId}/snooze/`, {
        snooze_until: snoozeUntil,
      });

      return {
        success: true,
        data: response,
        message: 'Notification snoozed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Real-time notification handling
  setupRealTimeNotifications(onNewNotification = null) {
    // Implementation for WebSocket or Server-Sent Events would go here
    // For now, we'll use polling as a fallback
    
    const pollInterval = 30000; // 30 seconds
    let pollingInterval;

    const startPolling = () => {
      pollingInterval = setInterval(async () => {
        try {
          const result = await this.getUnreadCount();
          if (result.success && onNewNotification) {
            onNewNotification({
              type: 'unread_count_update',
              count: result.count,
            });
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, pollInterval);
    };

    const stopPolling = () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    };

    // Auto-start polling
    startPolling();

    // Return control functions
    return {
      start: startPolling,
      stop: stopPolling,
      isRunning: () => !!pollingInterval,
    };
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
