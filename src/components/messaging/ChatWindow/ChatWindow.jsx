import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import NeomorphicInput from '../../common/NeomorphicInput';
import Avatar from '../../common/Avatar';
import { ComponentLoading } from '../../common/Loading';
import { chatWindowStyles } from './ChatWindow.styles';

const ChatWindow = ({
  conversation,
  messages = [],
  onSendMessage,
  onLoadMore,
  onMarkAsRead,
  onTyping,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  className = '',
}) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const windowClasses = [
    chatWindowStyles.container,
    className,
  ].filter(Boolean).join(' ');

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    if (newMessage && onTyping) {
      if (!isTyping) {
        setIsTyping(true);
        onTyping(true);
      }
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping(false);
      }, 1000);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [newMessage, isTyping, onTyping]);

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() && attachments.length === 0) return;

    const messageData = {
      content: newMessage.trim(),
      attachments: attachments,
      conversation_id: conversation.id,
    };

    try {
      await onSendMessage(messageData);
      setNewMessage('');
      setAttachments([]);
      setIsTyping(false);
      if (onTyping) onTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle file attachment
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(prev => {
      const attachment = prev[index];
      if (attachment.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // Format message time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;

    messages.forEach(message => {
      const messageDate = new Date(message.created_at).toDateString();
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          type: 'date',
          date: new Date(message.created_at),
          messages: [],
        });
      }
      
      groups[groups.length - 1].messages.push(message);
    });

    return groups;
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Common emojis
  const commonEmojis = ['😊', '😂', '👍', '❤️', '😢', '😮', '😡', '🎉', '👏', '🔥'];

  // Icons
  const SendIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );

  const AttachIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  );

  const EmojiIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const MoreIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );

  if (isLoading) {
    return (
      <NeomorphicCard className={windowClasses}>
        <ComponentLoading text="Loading conversation..." />
      </NeomorphicCard>
    );
  }

  if (!conversation) {
    return (
      <NeomorphicCard className={windowClasses}>
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium">No conversation selected</p>
            <p className="text-sm mt-1">Choose a conversation to start messaging</p>
          </div>
        </div>
      </NeomorphicCard>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <NeomorphicCard className={windowClasses}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <Avatar
            src={conversation.participants?.find(p => p.id !== user?.id)?.avatar}
            name={conversation.name || conversation.participants?.find(p => p.id !== user?.id)?.full_name}
            size="medium"
            online={conversation.participants?.find(p => p.id !== user?.id)?.is_online}
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              {conversation.name || conversation.participants?.find(p => p.id !== user?.id)?.full_name || 'Unknown'}
            </h3>
            <p className="text-xs text-gray-500">
              {conversation.participants?.find(p => p.id !== user?.id)?.is_online 
                ? 'Online' 
                : `Last seen ${formatMessageTime(conversation.participants?.find(p => p.id !== user?.id)?.last_seen)}`
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <NeomorphicButton
            variant="secondary"
            size="small"
            icon={<MoreIcon />}
            title="More options"
          />
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-96"
      >
        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
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
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff]">
                {group.date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {/* Messages */}
            {group.messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              const sender = isOwn ? user : conversation.participants?.find(p => p.id === message.sender_id);

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  {!isOwn && (
                    <div className="flex-shrink-0 mr-3">
                      <Avatar
                        src={sender?.avatar}
                        name={sender?.full_name || sender?.username}
                        size="small"
                      />
                    </div>
                  )}

                  <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : ''}`}>
                    {/* Message Bubble */}
                    <div className={`
                      p-3 rounded-2xl ${isOwn 
                        ? 'bg-blue-600 text-white shadow-[4px_4px_8px_#4a90e2,-4px_-4px_8px_#6bb6ff] ml-auto' 
                        : 'bg-white text-gray-800 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                      }
                    `}>
                      {/* Message Content */}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
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
                                <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
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
                    </div>

                    {/* Message Info */}
                    <div className={`flex items-center mt-1 space-x-2 text-xs text-gray-400 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <span>{formatMessageTime(message.created_at)}</span>
                      {isOwn && (
                        <div className="flex items-center space-x-1">
                          {message.is_read ? (
                            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
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
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        {conversation.is_typing && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-gray-500">typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative">
                {attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt={attachment.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <AttachIcon />
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="text-xl p-1 hover:bg-gray-200 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex items-center space-x-2">
            {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
            <NeomorphicButton
              type="button"
              variant="secondary"
              size="small"
              onClick={() => fileInputRef.current?.click()}
              icon={<AttachIcon />}
              title="Attach file"
            />

            {/* Emoji Picker Toggle */}
            <NeomorphicButton
              type="button"
              variant="secondary"
              size="small"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              icon={<EmojiIcon />}
              title="Add emoji"
            />
          </div>

          {/* Message Input */}
          <div className="flex-1">
            <NeomorphicInput
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              fullWidth
              className="resize-none"
            />
          </div>

          {/* Send Button */}
          <NeomorphicButton
            type="submit"
            variant="primary"
            size="medium"
            disabled={!newMessage.trim() && attachments.length === 0}
            icon={<SendIcon />}
            title="Send message"
          />
        </form>
      </div>
    </NeomorphicCard>
  );
};

export default ChatWindow;
