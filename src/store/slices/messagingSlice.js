import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messagingService from '../../services/messaging';

// Async thunks
export const fetchConversations = createAsyncThunk(
  'messaging/fetchConversations',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const result = await messagingService.getConversations(filters);
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

export const fetchMessages = createAsyncThunk(
  'messaging/fetchMessages',
  async ({ conversationId, filters = {} }, { rejectWithValue }) => {
    try {
      const result = await messagingService.getMessages(conversationId, filters);
      if (result.success) {
        return { conversationId, ...result };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messaging/sendMessage',
  async ({ conversationId, messageData }, { rejectWithValue }) => {
    try {
      const result = await messagingService.sendMessage(conversationId, messageData);
      if (result.success) {
        return { conversationId, message: result.data };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const startConversation = createAsyncThunk(
  'messaging/startConversation',
  async ({ participantIds, messageContent, conversationName }, { rejectWithValue }) => {
    try {
      const result = await messagingService.startConversation(participantIds, messageContent, conversationName);
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

export const markConversationAsRead = createAsyncThunk(
  'messaging/markAsRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      const result = await messagingService.markAsRead(conversationId);
      if (result.success) {
        return { conversationId };
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
  // Conversations list - exact backend fields
  conversations: [],
  
  // Messages organized by conversation ID
  messages: {}, // { conversationId: [messages] }
  
  // Message pagination by conversation
  messagesPagination: {}, // { conversationId: pagination }
  
  // Active conversation
  activeConversation: null,
  activeConversationId: null,
  
  // Pagination for conversations
  conversationsPagination: {
    count: 0,
    totalPages: 0,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
  },
  
  // Filters matching Django backend
  conversationsFilters: {
    page: 1,
    search: '',
    status: 'active', // active, archived, deleted
    type: '', // direct, group
    limit: 20,
  },
  
  messagesFilters: {
    page: 1,
    before_id: '',
    after_id: '',
    limit: 50,
  },
  
  // Counts
  unreadCount: 0,
  totalConversations: 0,
  
  // Loading states
  isLoadingConversations: false,
  isLoadingMessages: false,
  isLoadingMoreMessages: false,
  isSendingMessage: false,
  isStartingConversation: false,
  isMarkingAsRead: false,
  
  // Error states
  error: null,
  conversationsError: null,
  messagesError: null,
  sendMessageError: null,
  startConversationError: null,
  
  // UI states
  showMessagingPanel: false,
  showNewConversationModal: false,
  selectedParticipants: [],
  
  // Typing indicators - { conversationId: { userId: { userName, timestamp } } }
  typingUsers: {},
  
  // Draft messages - { conversationId: draftText }
  draftMessages: {},
  
  // Search results
  searchResults: [],
  isSearching: false,
  searchQuery: '',
  
  // Real-time connection status
  realTimeConnected: false,
  
  // Message operations
  editingMessage: null,
  replyingToMessage: null,
  
  // Last updated timestamp
  lastUpdated: null,
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.conversationsError = null;
      state.messagesError = null;
      state.sendMessageError = null;
      state.startConversationError = null;
    },
    
    // Set active conversation
    setActiveConversation: (state, action) => {
      const conversation = action.payload;
      state.activeConversation = conversation;
      state.activeConversationId = conversation ? conversation.id : null;
    },
    
    // Clear active conversation
    clearActiveConversation: (state) => {
      state.activeConversation = null;
      state.activeConversationId = null;
    },
    
    // UI actions
    showMessagingPanel: (state) => {
      state.showMessagingPanel = true;
    },
    
    hideMessagingPanel: (state) => {
      state.showMessagingPanel = false;
    },
    
    toggleMessagingPanel: (state) => {
      state.showMessagingPanel = !state.showMessagingPanel;
    },
    
    showNewConversationModal: (state) => {
      state.showNewConversationModal = true;
      state.selectedParticipants = [];
    },
    
    hideNewConversationModal: (state) => {
      state.showNewConversationModal = false;
      state.selectedParticipants = [];
      state.startConversationError = null;
    },
    
    // Participant selection
    addSelectedParticipant: (state, action) => {
      const participant = action.payload;
      if (!state.selectedParticipants.find(p => p.id === participant.id)) {
        state.selectedParticipants.push(participant);
      }
    },
    
    removeSelectedParticipant: (state, action) => {
      const participantId = action.payload;
      state.selectedParticipants = state.selectedParticipants.filter(p => p.id !== participantId);
    },
    
    clearSelectedParticipants: (state) => {
      state.selectedParticipants = [];
    },
    
    // Real-time updates
    addNewMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      
      // Check if message already exists (prevent duplicates)
      const existingMessage = state.messages[conversationId].find(m => m.id === message.id);
      if (!existingMessage) {
        state.messages[conversationId].push(message);
        
        // Sort messages by timestamp
        state.messages[conversationId].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
      
      // Update conversation last message
      state.conversations = state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, last_message: message, updated_at: message.created_at }
          : conv
      );
      
      // Update unread count if not in active conversation
      if (state.activeConversationId !== conversationId) {
        state.unreadCount += 1;
        
        // Update conversation unread count
        state.conversations = state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, unread_count: (conv.unread_count || 0) + 1 }
            : conv
        );
      }
    },
    
    updateMessage: (state, action) => {
      const { conversationId, messageId, updates } = action.payload;
      
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].map(message =>
          message.id === messageId ? { ...message, ...updates } : message
        );
      }
    },
    
    deleteMessage: (state, action) => {
      const { conversationId, messageId } = action.payload;
      
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].filter(
          message => message.id !== messageId
        );
      }
    },
    
    // Typing indicators
    setTypingUser: (state, action) => {
      const { conversationId, userId, userName, isTyping } = action.payload;
      
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = {};
      }
      
      if (isTyping) {
        state.typingUsers[conversationId][userId] = {
          userName,
          timestamp: Date.now(),
        };
      } else {
        delete state.typingUsers[conversationId][userId];
      }
    },
    
    clearOldTypingIndicators: (state) => {
      const now = Date.now();
      const timeout = 5000; // 5 seconds
      
      Object.keys(state.typingUsers).forEach(conversationId => {
        Object.keys(state.typingUsers[conversationId]).forEach(userId => {
          const typingData = state.typingUsers[conversationId][userId];
          if (now - typingData.timestamp > timeout) {
            delete state.typingUsers[conversationId][userId];
          }
        });
        
        // Clean up empty conversation objects
        if (Object.keys(state.typingUsers[conversationId]).length === 0) {
          delete state.typingUsers[conversationId];
        }
      });
    },
    
    // Draft messages
    updateDraftMessage: (state, action) => {
      const { conversationId, draftText } = action.payload;
      
      if (draftText && draftText.trim()) {
        state.draftMessages[conversationId] = draftText;
      } else {
        delete state.draftMessages[conversationId];
      }
    },
    
    clearDraftMessage: (state, action) => {
      const conversationId = action.payload;
      delete state.draftMessages[conversationId];
    },
    
    // Message operations
    setEditingMessage: (state, action) => {
      state.editingMessage = action.payload;
    },
    
    clearEditingMessage: (state) => {
      state.editingMessage = null;
    },
    
    setReplyingToMessage: (state, action) => {
      state.replyingToMessage = action.payload;
    },
    
    clearReplyingToMessage: (state) => {
      state.replyingToMessage = null;
    },
    
    // Search
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    
    // Real-time connection
    setRealTimeConnected: (state, action) => {
      state.realTimeConnected = action.payload;
    },
    
    // Update unread count
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    
    // Optimistic updates
    optimisticSendMessage: (state, action) => {
      const { conversationId, tempMessage } = action.payload;
      
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      
      // Add temporary message with sending status
      state.messages[conversationId].push({
        ...tempMessage,
        sending: true,
        created_at: new Date().toISOString(),
      });
      
      // Clear draft
      delete state.draftMessages[conversationId];
    },
    
    optimisticMarkAsRead: (state, action) => {
      const conversationId = action.payload;
      
      // Update conversation
      state.conversations = state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unread_count: 0 }
          : conv
      );
      
      // Update global unread count
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation && conversation.unread_count > 0) {
        state.unreadCount = Math.max(0, state.unreadCount - conversation.unread_count);
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoadingConversations = true;
        state.conversationsError = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        state.conversations = action.payload.data;
        state.conversationsPagination = action.payload.pagination;
        state.totalConversations = action.payload.pagination.count;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoadingConversations = false;
        state.conversationsError = action.payload;
      })
      
      // Fetch messages
      .addCase(fetchMessages.pending, (state, action) => {
        const isLoadMore = action.meta.arg?.filters?.page > 1;
        if (isLoadMore) {
          state.isLoadingMoreMessages = true;
        } else {
          state.isLoadingMessages = true;
        }
        state.messagesError = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        state.isLoadingMoreMessages = false;
        
        const { conversationId, data, pagination } = action.payload;
        const isLoadMore = pagination.currentPage > 1;
        
        if (isLoadMore) {
          // Prepend older messages
          state.messages[conversationId] = [
            ...data,
            ...(state.messages[conversationId] || [])
          ];
        } else {
          state.messages[conversationId] = data;
        }
        
        state.messagesPagination[conversationId] = pagination;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.isLoadingMoreMessages = false;
        state.messagesError = action.payload;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isSendingMessage = true;
        state.sendMessageError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSendingMessage = false;
        
        const { conversationId, message } = action.payload;
        
        // Replace optimistic message or add new one
        if (state.messages[conversationId]) {
          // Find and replace sending message or add new one
          const sendingMessageIndex = state.messages[conversationId].findIndex(m => m.sending);
          
          if (sendingMessageIndex !== -1) {
            // Replace optimistic message
            state.messages[conversationId][sendingMessageIndex] = message;
          } else {
            // Add new message
            state.messages[conversationId].push(message);
          }
        } else {
          state.messages[conversationId] = [message];
        }
        
        // Update conversation
        state.conversations = state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, last_message: message, updated_at: message.created_at }
            : conv
        );
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSendingMessage = false;
        state.sendMessageError = action.payload;
        
        // Remove failed optimistic message
        Object.keys(state.messages).forEach(conversationId => {
          state.messages[conversationId] = state.messages[conversationId].filter(m => !m.sending);
        });
      })
      
      // Start conversation
      .addCase(startConversation.pending, (state) => {
        state.isStartingConversation = true;
        state.startConversationError = null;
      })
      .addCase(startConversation.fulfilled, (state, action) => {
        state.isStartingConversation = false;
        
        const newConversation = action.payload;
        
        // Add new conversation to list
        state.conversations = [newConversation, ...state.conversations];
        
        // Set as active conversation
        state.activeConversation = newConversation;
        state.activeConversationId = newConversation.id;
        
        // Close modal
        state.showNewConversationModal = false;
        state.selectedParticipants = [];
      })
      .addCase(startConversation.rejected, (state, action) => {
        state.isStartingConversation = false;
        state.startConversationError = action.payload;
      })
      
      // Mark as read
      .addCase(markConversationAsRead.pending, (state) => {
        state.isMarkingAsRead = true;
      })
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        state.isMarkingAsRead = false;
        
        const { conversationId } = action.payload;
        
        // Update conversation
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation && conversation.unread_count > 0) {
          state.unreadCount = Math.max(0, state.unreadCount - conversation.unread_count);
          
          state.conversations = state.conversations.map(conv =>
            conv.id === conversationId
              ? { ...conv, unread_count: 0 }
              : conv
          );
        }
      })
      .addCase(markConversationAsRead.rejected, (state, action) => {
        state.isMarkingAsRead = false;
        state.error = action.payload;
      });
  },
});

// Action creators
export const {
  clearError,
  setActiveConversation,
  clearActiveConversation,
  showMessagingPanel,
  hideMessagingPanel,
  toggleMessagingPanel,
  showNewConversationModal,
  hideNewConversationModal,
  addSelectedParticipant,
  removeSelectedParticipant,
  clearSelectedParticipants,
  addNewMessage,
  updateMessage,
  deleteMessage,
  setTypingUser,
  clearOldTypingIndicators,
  updateDraftMessage,
  clearDraftMessage,
  setEditingMessage,
  clearEditingMessage,
  setReplyingToMessage,
  clearReplyingToMessage,
  setSearchQuery,
  clearSearchResults,
  setRealTimeConnected,
  updateUnreadCount,
  optimisticSendMessage,
  optimisticMarkAsRead,
} = messagingSlice.actions;

// Selectors
export const selectMessaging = (state) => state.messaging;
export const selectConversations = (state) => state.messaging.conversations;
export const selectActiveConversation = (state) => state.messaging.activeConversation;
export const selectActiveConversationId = (state) => state.messaging.activeConversationId;
export const selectMessages = (conversationId) => (state) =>
  state.messaging.messages[conversationId] || [];
export const selectMessagingUnreadCount = (state) => state.messaging.unreadCount;
export const selectIsLoadingConversations = (state) => state.messaging.isLoadingConversations;
export const selectIsLoadingMessages = (state) => state.messaging.isLoadingMessages;
export const selectIsSendingMessage = (state) => state.messaging.isSendingMessage;
export const selectShowMessagingPanel = (state) => state.messaging.showMessagingPanel;
export const selectSelectedParticipants = (state) => state.messaging.selectedParticipants;
export const selectDraftMessage = (conversationId) => (state) =>
  state.messaging.draftMessages[conversationId] || '';

// Complex selectors
export const selectTypingUsers = (conversationId) => (state) => {
  const conversationTyping = state.messaging.typingUsers[conversationId] || {};
  const now = Date.now();
  
  return Object.entries(conversationTyping)
    .filter(([_, data]) => data && (now - data.timestamp) < 5000)
    .map(([userId, data]) => ({ userId, userName: data.userName }));
};

export const selectHasUnreadMessages = (state) =>
  state.messaging.unreadCount > 0;

export const selectConversationById = (conversationId) => (state) =>
  state.messaging.conversations.find(conv => conv.id === conversationId);

export default messagingSlice.reducer;
