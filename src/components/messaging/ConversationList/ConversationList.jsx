import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import Avatar from '../../common/Avatar';
import SearchBar from '../../common/SearchBar';
import { ComponentLoading, SkeletonLoading } from '../../common/Loading';
import { conversationListStyles } from './ConversationList.styles';

const ConversationList = ({
  conversations = [],
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  onArchiveConversation,
  isLoading = false,
  showSearch = true,
  showNewButton = true,
  className = '',
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const listClasses = [
    conversationListStyles.container,
    className,
  ].filter(Boolean).join(' ');

  // Filter conversations
  const filteredConversations = conversations.filter(conversation => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const conversationName = getConversationName(conversation).toLowerCase();
      const lastMessage = conversation.last_message?.content?.toLowerCase() || '';
      
      if (!conversationName.includes(searchLower) && !lastMessage.includes(searchLower)) {
        return false;
      }
    }

    // Status filter
    switch (filter) {
      case 'unread':
        return conversation.unread_count > 0;
      case 'archived':
        return conversation.is_archived;
      case 'active':
        return !conversation.is_archived;
      default:
        return true;
    }
  });

  // Get conversation name
  const getConversationName = (conversation) => {
    if (conversation.name) {
      return conversation.name;
    }
    
    const otherParticipant = conversation.participants?.find(p => p.id !== user?.id);
    return otherParticipant?.full_name || otherParticipant?.username || 'Unknown';
  };

  // Get conversation avatar
  const getConversationAvatar = (conversation) => {
    if (conversation.avatar) {
      return conversation.avatar;
    }
    
    const otherParticipant = conversation.participants?.find(p => p.id !== user?.id);
    return otherParticipant?.avatar;
  };

  // Format last message time
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get last message preview
  const getLastMessagePreview = (conversation) => {
    if (!conversation.last_message) return 'No messages yet';
    
    const message = conversation.last_message;
    const isOwn = message.sender_id === user?.id;
    const prefix = isOwn ? 'You: ' : '';
    
    if (message.attachments?.length > 0) {
      return `${prefix}📎 Attachment`;
    }
    
    return `${prefix}${message.content}`;
  };

  // Handle delete conversation
  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      try {
        await onDeleteConversation(conversationId);
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    }
  };

  // Handle archive conversation
  const handleArchiveConversation = async (e, conversationId) => {
    e.stopPropagation();
    
    try {
      await onArchiveConversation(conversationId);
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
  ];

  // Icons
  const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const ArchiveIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4 4-4m6 0l-1 12a2 2 0 01-2 2H6a2 2 0 01-2-2L3 8m18 0V6a2 2 0 00-2-2H4a2 2 0 00-2 2v2" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const MoreIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );

  const ChatIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );

  return (
    <NeomorphicCard className={listClasses}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="text-blue-600">
            <ChatIcon />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
        </div>

        {showNewButton && (
          <NeomorphicButton
            variant="primary"
            size="small"
            onClick={onNewConversation}
            icon={<PlusIcon />}
            title="Start new conversation"
          />
        )}
      </div>

      {/* Search and Filters */}
      {showSearch && (
        <div className="p-4 border-b border-gray-200 space-y-4">
          <SearchBar
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={setSearchQuery}
            fullWidth
          />

          <div className="flex space-x-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`
                  px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                  ${filter === option.value
                    ? 'bg-blue-100 text-blue-800 shadow-[inset_2px_2px_4px_#a7c7d4,inset_-2px_-2px_4px_#d3f2ff]'
                    : 'bg-gray-100 text-gray-600 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff] hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="overflow-y-auto max-h-96">
        {isLoading ? (
          <div className="p-4">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonLoading key={index} />
              ))}
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <ChatIcon />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Start a conversation with someone to see it here'
              }
            </p>
            {showNewButton && !searchQuery && (
              <NeomorphicButton
                variant="primary"
                onClick={onNewConversation}
                icon={<PlusIcon />}
              >
                Start First Conversation
              </NeomorphicButton>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;
              const hasUnread = conversation.unread_count > 0;
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation)}
                  className={`
                    flex items-center p-4 cursor-pointer transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-50 border-l-4 border-blue-500 shadow-[inset_4px_4px_8px_#a7c7d4,inset_-4px_-4px_8px_#d3f2ff]' 
                      : 'hover:bg-gray-50 hover:shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff]'
                    }
                  `}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 mr-3">
                    <Avatar
                      src={getConversationAvatar(conversation)}
                      name={getConversationName(conversation)}
                      size="medium"
                      online={conversation.participants?.find(p => p.id !== user?.id)?.is_online}
                    />
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-medium truncate ${
                        hasUnread ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {getConversationName(conversation)}
                        {conversation.type === 'group' && (
                          <span className="ml-1 text-xs text-gray-500">
                            ({conversation.participants?.length || 0} members)
                          </span>
                        )}
                      </h3>
                      
                      <div className="flex items-center space-x-2 ml-2">
                        {conversation.last_message && (
                          <span className="text-xs text-gray-400">
                            {formatLastMessageTime(conversation.last_message.created_at)}
                          </span>
                        )}
                        
                        {hasUnread && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full min-w-[20px]">
                            {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className={`text-sm truncate ${
                      hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>
                      {getLastMessagePreview(conversation)}
                    </p>
                    
                    {/* Typing indicator */}
                    {conversation.is_typing && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center">
                        <span className="mr-2">Typing</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center space-x-1">
                      {onArchiveConversation && (
                        <button
                          onClick={(e) => handleArchiveConversation(e, conversation.id)}
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors duration-200"
                          title="Archive conversation"
                        >
                          <ArchiveIcon />
                        </button>
                      )}
                      
                      {onDeleteConversation && (
                        <button
                          onClick={(e) => handleDeleteConversation(e, conversation.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          title="Delete conversation"
                        >
                          <DeleteIcon />
                        </button>
                      )}
                      
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        title="More options"
                      >
                        <MoreIcon />
                      </button>
                    </div>
                  </div>

                  {/* Online indicator */}
                  {conversation.participants?.find(p => p.id !== user?.id)?.is_online && (
                    <div className="absolute bottom-2 right-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </NeomorphicCard>
  );
};

export default ConversationList;
