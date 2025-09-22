import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import Avatar from '../../common/Avatar';
import { ComponentLoading } from '../../common/Loading';
import { messageListStyles } from './MessageList.styles';

const MessageList = ({
  messages = [],
  conversation,
  onLoadMore,
  onMarkAsRead,
  onDeleteMessage,
  onEditMessage,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  className = '',
}) => {
  const { user } = useAuth();
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');

  const listClasses = [
    messageListStyles.container,
    className,
  ].filter(Boolean).join(' ');

  // Format message time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Group messages by sender and time
  const groupMessages = (messages) => {
    const groups = [];
    let currentGroup = null;

    messages.forEach(message => {
      const shouldGroup = currentGroup && 
        currentGroup.sender_id === message.sender_id &&
        (new Date(message.created_at) - new Date(currentGroup.lastTimestamp)) < 300000; // 5 minutes

      if (shouldGroup) {
        currentGroup.messages.push(message);
        currentGroup.lastTimestamp = message.created_at;
      } else {
        currentGroup = {
          sender_id: message.sender_id,
          sender: message.sender,
          messages: [message],
          lastTimestamp: message.created_at,
        };
        groups.push(currentGroup);
      }
    });

    return groups;
  };

  // Handle edit message
  const handleEditStart = (message) => {
    setEditingMessage(message.id);
    setEditContent(message.content);
  };

  const handleEditCancel = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  const handleEditSave = async (messageId) => {
    if (!editContent.trim()) return;

    try {
      await onEditMessage(messageId, editContent.trim());
      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await onDeleteMessage(messageId);
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
  };

  const messageGroups = groupMessages(messages);

  // Icons
  const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const ReplyIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  );

  const SaveIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const CancelIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  if (isLoading) {
    return (
      <NeomorphicCard className={listClasses}>
        <ComponentLoading text="Loading messages..." />
      </NeomorphicCard>
    );
  }

  return (
    <div className={listClasses}>
      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mb-4">
          <NeomorphicButton
            variant="secondary"
            size="small"
            onClick={onLoadMore}
            loading={isLoadingMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load More Messages'}
          </NeomorphicButton>
        </div>
      )}

      {/* Message Groups */}
      <div className="space-y-6">
        {messageGroups.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No messages yet</h3>
            <p className="text-gray-500">Start the conversation by sending a message</p>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => {
            const isOwn = group.sender_id === user?.id;
            const sender = isOwn ? user : group.sender;

            return (
              <div key={groupIndex} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                {!isOwn && (
                  <div className="flex-shrink-0 mr-3">
                    <Avatar
                      src={sender?.avatar}
                      name={sender?.full_name || sender?.username}
                      size="small"
                    />
                  </div>
                )}

                <div className={`max-w-xs lg:max-w-md space-y-2 ${isOwn ? 'order-1' : ''}`}>
                  {/* Sender Name (for group chats) */}
                  {!isOwn && conversation?.type === 'group' && (
                    <p className="text-xs text-gray-500 ml-3">
                      {sender?.full_name || sender?.username || 'Unknown'}
                    </p>
                  )}

                  {/* Messages */}
                  {group.messages.map((message, messageIndex) => (
                    <div key={message.id} className="group">
                      <NeomorphicCard
                        className={`
                          p-3 transition-all duration-200 hover:shadow-lg
                          ${isOwn 
                            ? 'bg-blue-600 text-white shadow-[4px_4px_8px_#4a90e2,-4px_-4px_8px_#6bb6ff]' 
                            : 'bg-white text-gray-800 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                          }
                        `}
                      >
                        {/* Message Content */}
                        {editingMessage === message.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full p-2 text-sm bg-white text-gray-800 border border-gray-300 rounded resize-none"
                              rows="2"
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={handleEditCancel}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Cancel"
                              >
                                <CancelIcon />
                              </button>
                              <button
                                onClick={() => handleEditSave(message.id)}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="Save"
                              >
                                <SaveIcon />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                              {message.is_edited && (
                                <span className={`text-xs ml-2 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                                  (edited)
                                </span>
                              )}
                            </p>

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index}>
                                    {attachment.type?.startsWith('image/') ? (
                                      <img
                                        src={attachment.url}
                                        alt={attachment.name}
                                        className="max-w-full h-auto rounded-lg"
                                      />
                                    ) : (
                                      <div className={`flex items-center space-x-2 p-2 rounded-lg ${
                                        isOwn ? 'bg-blue-500' : 'bg-gray-100'
                                      }`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <span className="text-xs">{attachment.name}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Message Actions */}
                            <div className={`flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                              <div className="flex items-center space-x-1">
                                <button
                                  className={`p-1 rounded transition-colors ${
                                    isOwn ? 'text-blue-200 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                  title="Reply"
                                >
                                  <ReplyIcon />
                                </button>
                                
                                {isOwn && (
                                  <>
                                    <button
                                      onClick={() => handleEditStart(message)}
                                      className={`p-1 rounded transition-colors ${
                                        isOwn ? 'text-blue-200 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                                      }`}
                                      title="Edit"
                                    >
                                      <EditIcon />
                                    </button>
                                    
                                    <button
                                      onClick={() => handleDeleteMessage(message.id)}
                                      className={`p-1 rounded transition-colors ${
                                        isOwn ? 'text-blue-200 hover:text-red-300' : 'text-gray-400 hover:text-red-500'
                                      }`}
                                      title="Delete"
                                    >
                                      <DeleteIcon />
                                    </button>
                                  </>
                                )}
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className={`text-xs ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                                  {formatMessageTime(message.created_at)}
                                </span>
                                
                                {isOwn && (
                                  <div className="flex items-center">
                                    {message.is_read ? (
                                      <svg className="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    ) : (
                                      <svg className="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </NeomorphicCard>
                    </div>
                  ))}

                  {/* Timestamp for the group */}
                  <div className={`text-xs text-gray-400 ${isOwn ? 'text-right' : 'text-left'} mt-1`}>
                    {formatMessageTime(group.lastTimestamp)}
                  </div>
                </div>

                {isOwn && (
                  <div className="flex-shrink-0 ml-3 order-2">
                    <Avatar
                      src={user?.avatar}
                      name={user?.full_name}
                      size="small"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MessageList;
