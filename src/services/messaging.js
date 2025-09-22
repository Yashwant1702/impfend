import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

class MessagingService {
  // Get user conversations
  async getConversations(filters = {}) {
    try {
      const {
        page = 1,
        search = '',
        status = 'active',
        type = '',
        limit = 20,
      } = filters;

      const params = {
        page,
        search,
        status,
        type,
        page_size: limit,
      };

      const response = await apiService.get(API_ENDPOINTS.MESSAGING.CONVERSATIONS, { params });

      return {
        success: true,
        data: response.results || [],
        pagination: {
          count: response.count || 0,
          totalPages: Math.ceil((response.count || 0) / limit),
          currentPage: page,
          hasNext: !!response.next,
          hasPrevious: !!response.previous,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Get conversation details
  async getConversationDetails(conversationId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.MESSAGING.CONVERSATION_DETAIL(conversationId));

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: null,
      };
    }
  }

  // Get messages in a conversation
  async getMessages(conversationId, filters = {}) {
    try {
      const {
        page = 1,
        beforeId = '',
        afterId = '',
        limit = 50,
      } = filters;

      const params = {
        page,
        before_id: beforeId,
        after_id: afterId,
        page_size: limit,
      };

      const response = await apiService.get(API_ENDPOINTS.MESSAGING.MESSAGES(conversationId), { params });

      return {
        success: true,
        data: response.results || [],
        pagination: {
          count: response.count || 0,
          totalPages: Math.ceil((response.count || 0) / limit),
          currentPage: page,
          hasNext: !!response.next,
          hasPrevious: !!response.previous,
        },
        hasMore: !!response.next,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Send a message
  async sendMessage(conversationId, messageData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.MESSAGING.SEND_MESSAGE(conversationId), {
        content: messageData.content,
        message_type: messageData.messageType || 'text',
        reply_to: messageData.replyTo,
        attachments: messageData.attachments || [],
        metadata: messageData.metadata || {},
      });

      return {
        success: true,
        data: response,
        message: 'Message sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Start new conversation
  async startConversation(participantIds, messageContent = '', conversationName = '') {
    try {
      const response = await apiService.post('/api/v1/messaging/conversations/start/', {
        participants: participantIds,
        initial_message: messageContent,
        name: conversationName,
      });

      return {
        success: true,
        data: response,
        message: 'Conversation started successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Add participant to conversation
  async addParticipant(conversationId, userId) {
    try {
      const response = await apiService.post(
        `${API_ENDPOINTS.MESSAGING.CONVERSATION_DETAIL(conversationId)}add-participant/`,
        { user_id: userId }
      );

      return {
        success: true,
        data: response,
        message: 'Participant added successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Remove participant from conversation
  async removeParticipant(conversationId, userId) {
    try {
      const response = await apiService.post(
        `${API_ENDPOINTS.MESSAGING.CONVERSATION_DETAIL(conversationId)}remove-participant/`,
        { user_id: userId }
      );

      return {
        success: true,
        data: response,
        message: 'Participant removed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Mark conversation as read
  async markAsRead(conversationId) {
    try {
      const response = await apiService.post(API_ENDPOINTS.MESSAGING.MARK_READ(conversationId));

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Archive conversation
  async archiveConversation(conversationId) {
    try {
      const response = await apiService.post(
        `${API_ENDPOINTS.MESSAGING.CONVERSATION_DETAIL(conversationId)}archive/`
      );

      return {
        success: true,
        data: response,
        message: 'Conversation archived successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Unarchive conversation
  async unarchiveConversation(conversationId) {
    try {
      const response = await apiService.post(
        `${API_ENDPOINTS.MESSAGING.CONVERSATION_DETAIL(conversationId)}unarchive/`
      );

      return {
        success: true,
        data: response,
        message: 'Conversation unarchived successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Delete conversation
  async deleteConversation(conversationId) {
    try {
      await apiService.delete(API_ENDPOINTS.MESSAGING.CONVERSATION_DETAIL(conversationId));

      return {
        success: true,
        message: 'Conversation deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Edit message
  async editMessage(conversationId, messageId, newContent) {
    try {
      const response = await apiService.patch(
        `${API_ENDPOINTS.MESSAGING.MESSAGES(conversationId)}${messageId}/`,
        { content: newContent, edited: true }
      );

      return {
        success: true,
        data: response,
        message: 'Message edited successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Delete message
  async deleteMessage(conversationId, messageId) {
    try {
      await apiService.delete(`${API_ENDPOINTS.MESSAGING.MESSAGES(conversationId)}${messageId}/`);

      return {
        success: true,
        message: 'Message deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // React to message
  async reactToMessage(conversationId, messageId, reaction) {
    try {
      const response = await apiService.post(
        `${API_ENDPOINTS.MESSAGING.MESSAGES(conversationId)}${messageId}/react/`,
        { reaction }
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Remove reaction from message
  async removeReaction(conversationId, messageId, reactionId) {
    try {
      const response = await apiService.delete(
        `${API_ENDPOINTS.MESSAGING.MESSAGES(conversationId)}${messageId}/reactions/${reactionId}/`
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Search messages
  async searchMessages(query, filters = {}) {
    try {
      const {
        conversationId = '',
        messageType = '',
        fromDate = '',
        toDate = '',
        page = 1,
      } = filters;

      const params = {
        q: query,
        conversation_id: conversationId,
        message_type: messageType,
        from_date: fromDate,
        to_date: toDate,
        page,
      };

      const response = await apiService.get('/api/v1/messaging/search/', { params });

      return {
        success: true,
        data: response.results || [],
        pagination: response.count ? {
          count: response.count,
          totalPages: Math.ceil(response.count / 20),
          currentPage: page,
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

  // Upload attachment
  async uploadAttachment(file, onProgress = null) {
    try {
      const response = await apiService.uploadFile(
        '/api/v1/messaging/attachments/upload/',
        file,
        {},
        onProgress
      );

      return {
        success: true,
        data: response,
        message: 'Attachment uploaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get conversation participants
  async getParticipants(conversationId) {
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MESSAGING.CONVERSATION_DETAIL(conversationId)}participants/`
      );

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

  // Update conversation settings
  async updateConversationSettings(conversationId, settings) {
    try {
      const response = await apiService.patch(
        API_ENDPOINTS.MESSAGING.CONVERSATION_DETAIL(conversationId),
        {
          name: settings.name,
          description: settings.description,
          is_muted: settings.isMuted,
          notification_level: settings.notificationLevel,
        }
      );

      return {
        success: true,
        data: response,
        message: 'Conversation settings updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await apiService.get('/api/v1/messaging/unread-count/');

      return {
        success: true,
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

  // Set typing indicator
  async setTyping(conversationId, isTyping = true) {
    try {
      const response = await apiService.post(
        `${API_ENDPOINTS.MESSAGING.CONVERSATION_DETAIL(conversationId)}typing/`,
        { is_typing: isTyping }
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Real-time messaging setup (WebSocket simulation)
  setupRealTimeMessaging(onNewMessage = null, onTyping = null, onMessageUpdate = null) {
    // In a real implementation, this would set up WebSocket connections
    // For now, we'll provide a polling mechanism as fallback
    
    const pollInterval = 3000; // 3 seconds for messages
    let pollingInterval;
    let activeConversations = new Set();

    const startPolling = () => {
      pollingInterval = setInterval(async () => {
        for (const conversationId of activeConversations) {
          try {
            // Poll for new messages (in real implementation, use WebSocket)
            const result = await this.getMessages(conversationId, { limit: 10 });
            if (result.success && result.data.length > 0 && onNewMessage) {
              // This is a simplified approach - in reality, you'd track last seen message
              onNewMessage({
                conversationId,
                messages: result.data,
              });
            }
          } catch (error) {
            console.error('Message polling error:', error);
          }
        }
      }, pollInterval);
    };

    const stopPolling = () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    };

    const joinConversation = (conversationId) => {
      activeConversations.add(conversationId);
    };

    const leaveConversation = (conversationId) => {
      activeConversations.delete(conversationId);
    };

    // Auto-start polling
    startPolling();

    return {
      start: startPolling,
      stop: stopPolling,
      joinConversation,
      leaveConversation,
      isRunning: () => !!pollingInterval,
    };
  }
}

// Create singleton instance
const messagingService = new MessagingService();

export default messagingService;
