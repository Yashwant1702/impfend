import { useState, useEffect, useCallback } from 'react';
import messagingService from '../services/messaging';

export const useMessaging = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [realTimeConnection, setRealTimeConnection] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});

  // Fetch conversations
  const fetchConversations = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await messagingService.getConversations(filters);
      
      if (result.success) {
        setConversations(result.data);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to fetch conversations';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId, filters = {}) => {
    setError(null);

    try {
      const result = await messagingService.getMessages(conversationId, filters);
      
      if (result.success) {
        setMessages(prev => ({
          ...prev,
          [conversationId]: filters.page && filters.page > 1 
            ? [...(prev[conversationId] || []), ...result.data]
            : result.data
        }));
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to fetch messages';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await messagingService.getUnreadCount();
      if (result.success) {
        setUnreadCount(result.count);
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, [fetchConversations, fetchUnreadCount]);

  // Set up real-time messaging
  useEffect(() => {
    const connection = messagingService.setupRealTimeMessaging(
      // On new message
      (data) => {
        const { conversationId, messages: newMessages } = data;
        
        setMessages(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), ...newMessages]
        }));
        
        // Update conversation list with last message
        setConversations(prev =>
          prev.map(conversation =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  last_message: newMessages[newMessages.length - 1],
                  updated_at: new Date().toISOString()
                }
              : conversation
          )
        );
        
        // Update unread count if not in active conversation
        if (activeConversation?.id !== conversationId) {
          setUnreadCount(prev => prev + 1);
        }
      },
      // On typing indicator
      (data) => {
        const { conversationId, userId, isTyping, userName } = data;
        
        setTypingUsers(prev => ({
          ...prev,
          [conversationId]: {
            ...prev[conversationId],
            [userId]: isTyping ? { userName, timestamp: Date.now() } : undefined
          }
        }));
      },
      // On message update
      (data) => {
        const { conversationId, messageId, updates } = data;
        
        setMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map(message =>
            message.id === messageId ? { ...message, ...updates } : message
          )
        }));
      }
    );

    setRealTimeConnection(connection);

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [activeConversation]);

  // Send message
  const sendMessage = useCallback(async (conversationId, messageData) => {
    setError(null);
    
    try {
      const result = await messagingService.sendMessage(conversationId, messageData);
      
      if (result.success) {
        // Add message to local state (optimistic update)
        setMessages(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), result.data]
        }));
        
        // Update conversation list
        setConversations(prev =>
          prev.map(conversation =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  last_message: result.data,
                  updated_at: new Date().toISOString()
                }
              : conversation
          )
        );
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to send message';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Start new conversation
  const startConversation = useCallback(async (participantIds, messageContent = '', conversationName = '') => {
    setError(null);
    
    try {
      const result = await messagingService.startConversation(participantIds, messageContent, conversationName);
      
      if (result.success) {
        // Add new conversation to list
        setConversations(prev => [result.data, ...prev]);
        
        // Set as active conversation
        setActiveConversation(result.data);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to start conversation';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId) => {
    try {
      const result = await messagingService.markAsRead(conversationId);
      
      if (result.success) {
        // Update conversation in list
        setConversations(prev =>
          prev.map(conversation =>
            conversation.id === conversationId
              ? { ...conversation, unread_count: 0 }
              : conversation
          )
        );
        
        // Update total unread count
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation && conversation.unread_count > 0) {
          setUnreadCount(prev => Math.max(0, prev - conversation.unread_count));
        }
      }
      
      return result;
    } catch (error) {
      console.error('Failed to mark as read:', error);
      return { success: false, error: 'Failed to mark as read' };
    }
  }, [conversations]);

  // Set active conversation
  const selectConversation = useCallback(async (conversation) => {
    setActiveConversation(conversation);
    
    // Mark as read when selecting
    if (conversation.unread_count > 0) {
      await markAsRead(conversation.id);
    }
    
    // Join real-time updates for this conversation
    if (realTimeConnection) {
      realTimeConnection.joinConversation(conversation.id);
    }
    
    // Fetch messages if not already loaded
    if (!messages[conversation.id]) {
      await fetchMessages(conversation.id);
    }
  }, [markAsRead, realTimeConnection, messages, fetchMessages]);

  // Leave active conversation
  const leaveActiveConversation = useCallback(() => {
    if (activeConversation && realTimeConnection) {
      realTimeConnection.leaveConversation(activeConversation.id);
    }
    setActiveConversation(null);
  }, [activeConversation, realTimeConnection]);

  // Edit message
  const editMessage = useCallback(async (conversationId, messageId, newContent) => {
    setError(null);
    
    try {
      const result = await messagingService.editMessage(conversationId, messageId, newContent);
      
      if (result.success) {
        // Update message in local state
        setMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map(message =>
            message.id === messageId 
              ? { ...message, content: newContent, edited: true, updated_at: new Date().toISOString() }
              : message
          )
        }));
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to edit message';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Delete message
  const deleteMessage = useCallback(async (conversationId, messageId) => {
    setError(null);
    
    try {
      const result = await messagingService.deleteMessage(conversationId, messageId);
      
      if (result.success) {
        // Remove message from local state
        setMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).filter(message => message.id !== messageId)
        }));
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to delete message';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // React to message
  const reactToMessage = useCallback(async (conversationId, messageId, reaction) => {
    setError(null);
    
    try {
      const result = await messagingService.reactToMessage(conversationId, messageId, reaction);
      
      if (result.success) {
        // Update message reactions in local state
        setMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map(message =>
            message.id === messageId 
              ? { ...message, reactions: [...(message.reactions || []), result.data] }
              : message
          )
        }));
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to add reaction';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Set typing indicator
  const setTyping = useCallback(async (conversationId, isTyping = true) => {
    if (!activeConversation || activeConversation.id !== conversationId) return;
    
    try {
      await messagingService.setTyping(conversationId, isTyping);
    } catch (error) {
      console.error('Failed to set typing indicator:', error);
    }
  }, [activeConversation]);

  // Search messages
  const searchMessages = useCallback(async (query, filters = {}) => {
    setError(null);
    
    try {
      const result = await messagingService.searchMessages(query, filters);
      return result;
    } catch (error) {
      const errorMessage = 'Failed to search messages';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Upload attachment
  const uploadAttachment = useCallback(async (file, onProgress = null) => {
    setError(null);
    
    try {
      const result = await messagingService.uploadAttachment(file, onProgress);
      return result;
    } catch (error) {
      const errorMessage = 'Failed to upload attachment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get typing users for a conversation
  const getTypingUsers = useCallback((conversationId) => {
    const conversationTyping = typingUsers[conversationId] || {};
    const now = Date.now();
    
    // Filter out old typing indicators (older than 5 seconds)
    return Object.entries(conversationTyping)
      .filter(([_, data]) => data && (now - data.timestamp) < 5000)
      .map(([userId, data]) => ({ userId, userName: data.userName }));
  }, [typingUsers]);

  // Get messages for active conversation
  const getActiveMessages = useCallback(() => {
    return activeConversation ? messages[activeConversation.id] || [] : [];
  }, [activeConversation, messages]);

  return {
    // State
    conversations,
    activeConversation,
    messages,
    unreadCount,
    isLoading,
    error,
    
    // Actions
    fetchConversations,
    fetchMessages,
    sendMessage,
    startConversation,
    markAsRead,
    selectConversation,
    leaveActiveConversation,
    editMessage,
    deleteMessage,
    reactToMessage,
    setTyping,
    searchMessages,
    uploadAttachment,
    clearError,
    
    // Helpers
    getTypingUsers,
    getActiveMessages,
    
    // Computed values
    hasUnreadMessages: unreadCount > 0,
    activeMessages: getActiveMessages(),
    hasActiveConversation: !!activeConversation,
    activeConversationId: activeConversation?.id,
    activeConversationName: activeConversation?.name,
    activeConversationParticipants: activeConversation?.participants || [],
    
    // Real-time connection status
    isRealTimeConnected: realTimeConnection?.isRunning() || false,
  };
};

export default useMessaging;
