import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import ChatWindow from '../../components/messaging/ChatWindow';
import ConversationList from '../../components/messaging/ConversationList';
import { messagesStyles } from './Messages.styles';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const pageClasses = [
    messagesStyles.container,
  ].filter(Boolean).join(' ');

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        const mockConversations = [
          {
            id: 1,
            name: null,
            type: 'direct',
            participants: [
              {
                id: 1,
                full_name: 'Sarah Johnson',
                username: 'sarah.j',
                avatar: null,
                is_online: true,
                last_seen: new Date().toISOString(),
              },
              {
                id: 2, // Current user
                full_name: 'Current User',
                username: 'current.user',
                avatar: null,
                is_online: true,
              }
            ],
            last_message: {
              id: 1,
              content: 'Hey! Are you coming to the photography workshop tomorrow?',
              sender_id: 1,
              created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            },
            unread_count: 2,
            is_archived: false,
            is_typing: false,
          },
          {
            id: 2,
            name: 'Photography Club Officers',
            type: 'group',
            participants: [
              {
                id: 1,
                full_name: 'Sarah Johnson',
                username: 'sarah.j',
                avatar: null,
                is_online: true,
              },
              {
                id: 3,
                full_name: 'Mike Chen',
                username: 'mike.c',
                avatar: null,
                is_online: false,
                last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: 4,
                full_name: 'Emma Davis',
                username: 'emma.d',
                avatar: null,
                is_online: true,
              },
            ],
            last_message: {
              id: 2,
              content: 'Great work on organizing the last event!',
              sender_id: 3,
              created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            unread_count: 0,
            is_archived: false,
            is_typing: false,
          },
          {
            id: 3,
            name: null,
            type: 'direct',
            participants: [
              {
                id: 5,
                full_name: 'Alex Wilson',
                username: 'alex.w',
                avatar: null,
                is_online: false,
                last_seen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              },
            ],
            last_message: {
              id: 3,
              content: 'Thanks for the help with the project!',
              sender_id: 2,
              created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
            unread_count: 0,
            is_archived: false,
            is_typing: false,
          },
        ];

        setConversations(mockConversations);
        setIsLoading(false);
      }, 1000);
    };

    loadConversations();
  }, []);

  // Load messages for active conversation
  useEffect(() => {
    if (activeConversation) {
      const loadMessages = async () => {
        // Simulate API call
        const mockMessages = [
          {
            id: 1,
            content: 'Hi there! How are you doing?',
            sender_id: 1,
            sender: {
              id: 1,
              full_name: 'Sarah Johnson',
              avatar: null,
            },
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            is_read: true,
            attachments: [],
          },
          {
            id: 2,
            content: 'I\'m doing great! Just finished my assignment.',
            sender_id: 2,
            sender: {
              id: 2,
              full_name: 'Current User',
              avatar: null,
            },
            created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            is_read: true,
            attachments: [],
          },
          {
            id: 3,
            content: 'That\'s awesome! By the way, are you coming to the photography workshop tomorrow?',
            sender_id: 1,
            sender: {
              id: 1,
              full_name: 'Sarah Johnson',
              avatar: null,
            },
            created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            is_read: false,
            attachments: [],
          },
        ];

        setMessages(mockMessages);
      };

      loadMessages();
    }
  }, [activeConversation]);

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
  };

  // Handle send message
  const handleSendMessage = async (messageData) => {
    try {
      // Simulate API call
      console.log('Sending message:', messageData);

      const newMessage = {
        id: Date.now(),
        content: messageData.content,
        sender_id: 2, // Current user
        sender: {
          id: 2,
          full_name: 'Current User',
          avatar: null,
        },
        created_at: new Date().toISOString(),
        is_read: false,
        attachments: messageData.attachments || [],
      };

      setMessages(prev => [...prev, newMessage]);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Handle new conversation
  const handleNewConversation = () => {
    // Open new conversation modal or navigate to create conversation page
    console.log('Creating new conversation...');
  };

  // Handle delete conversation
  const handleDeleteConversation = async (conversationId) => {
    try {
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (activeConversation && activeConversation.id === conversationId) {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  // Handle archive conversation
  const handleArchiveConversation = async (conversationId) => {
    try {
      setConversations(prev => 
        prev.map(c => 
          c.id === conversationId 
            ? { ...c, is_archived: !c.is_archived }
            : c
        )
      );
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  return (
    <MainLayout>
      <div className={pageClasses}>
        <div className="flex h-full bg-white rounded-2xl shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] overflow-hidden">
          {/* Conversation List Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversation?.id}
              onConversationSelect={handleConversationSelect}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              onArchiveConversation={handleArchiveConversation}
              isLoading={isLoading}
              showSearch={true}
              showNewButton={true}
            />
          </div>

          {/* Chat Window */}
          <div className="hidden md:flex md:w-2/3 lg:w-3/4 flex-col">
            <ChatWindow
              conversation={activeConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              onMarkAsRead={(message) => {
                setMessages(prev => 
                  prev.map(m => 
                    m.id === message.id 
                      ? { ...m, is_read: true }
                      : m
                  )
                );
              }}
              onTyping={(isTyping) => {
                console.log('Typing status:', isTyping);
              }}
            />
          </div>

          {/* Mobile Chat Window (Full Screen) */}
          {activeConversation && (
            <div className="md:hidden fixed inset-0 z-50 bg-white">
              <ChatWindow
                conversation={activeConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                onMarkAsRead={(message) => {
                  setMessages(prev => 
                    prev.map(m => 
                      m.id === message.id 
                        ? { ...m, is_read: true }
                        : m
                    )
                  );
                }}
                onTyping={(isTyping) => {
                  console.log('Typing status:', isTyping);
                }}
              />
              
              {/* Close Button for Mobile */}
              <button
                onClick={() => setActiveConversation(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;
