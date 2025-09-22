import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import NeomorphicButton from '../NeomorphicButton';
import Avatar from '../Avatar';
import { headerStyles } from './Header.styles';

const Header = ({ onMenuClick, className = '' }) => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { unreadCount } = useNotifications();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const headerClasses = [
    headerStyles.base,
    className,
  ].filter(Boolean).join(' ');

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
  };

  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const BellIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v2.25l.75.75H15v4.5H6v-4.5H2.25l.75-.75V9.75a6 6 0 0 1 6-6z" />
    </svg>
  );

  const ThemeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isDark ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      )}
    </svg>
  );

  return (
    <header className={headerClasses}>
      <div className="flex items-center justify-between w-full px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <NeomorphicButton
            variant="secondary"
            size="small"
            onClick={onMenuClick}
            icon={<MenuIcon />}
            className="lg:hidden"
          />
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              Campus Club Suite
            </h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Search clubs, events..."
              className="w-full px-4 py-2 bg-gray-100 rounded-lg shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] border-none focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <NeomorphicButton
            variant="secondary"
            size="small"
            onClick={toggleTheme}
            icon={<ThemeIcon />}
          />

          {/* Notifications */}
          <div className="relative">
            <NeomorphicButton
              variant="secondary"
              size="small"
              icon={<BellIcon />}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <Avatar
                src={user?.avatar}
                name={user?.full_name || 'User'}
                size="small"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
