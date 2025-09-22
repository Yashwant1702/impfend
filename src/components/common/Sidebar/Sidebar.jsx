import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import NeomorphicButton from '../NeomorphicButton';
import { sidebarStyles } from './Sidebar.styles';

const Sidebar = ({ isOpen = true, onClose, className = '' }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [activeItem, setActiveItem] = useState('dashboard');

  const sidebarClasses = [
    sidebarStyles.base,
    isOpen ? sidebarStyles.open : sidebarStyles.closed,
    className,
  ].filter(Boolean).join(' ');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v10H8V5z" />
        </svg>
      ),
      href: '/dashboard',
    },
    {
      id: 'clubs',
      label: 'Clubs',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      href: '/clubs',
    },
    {
      id: 'events',
      label: 'Events',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/events',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      href: '/messages',
    },
    {
      id: 'gamification',
      label: 'Achievements',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      href: '/gamification',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      href: '/profile',
    },
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]"></div>
            <h2 className="text-lg font-bold text-gray-800">Campus Suite</h2>
          </div>
          
          <NeomorphicButton
            variant="secondary"
            size="small"
            onClick={onClose}
            icon={<CloseIcon />}
            className="lg:hidden"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all duration-200
                ${activeItem === item.id 
                  ? 'bg-gray-100 text-blue-600 shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff]'
                }
              `}
            >
              <span className={activeItem === item.id ? 'text-blue-600' : 'text-gray-500'}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-100 rounded-xl p-4 shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {user?.full_name || 'User Name'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.user_type || 'student'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
