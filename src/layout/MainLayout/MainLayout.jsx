import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../common/Sidebar';
import Header from '../../common/Header';
import NeomorphicButton from '../../common/NeomorphicButton';
import { NotificationBell } from '../../notifications/NotificationBadge';
import { QuickPointsDisplay } from '../../gamification/PointsDisplay';
import { mainLayoutStyles } from './MainLayout.styles';

const MainLayout = ({ 
  children,
  showSidebar = true,
  showHeader = true,
  className = '',
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const layoutClasses = [
    mainLayoutStyles.container,
    className,
  ].filter(Boolean).join(' ');

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle notifications click
  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  // Handle profile click
  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/clubs': 'Clubs',
      '/events': 'Events',
      '/messages': 'Messages',
      '/gamification': 'Achievements',
      '/notifications': 'Notifications',
      '/profile': 'Profile',
    };

    return titleMap[path] || 'Campus Club Suite';
  };

  // Icons
  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  return (
    <div className={layoutClasses}>
      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          className="lg:translate-x-0 lg:static lg:inset-0"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {showHeader && (
          <header className="bg-white shadow-[0px_2px_4px_#bebebe] border-b border-gray-200 lg:pl-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                  {/* Mobile Menu Button */}
                  {showSidebar && (
                    <NeomorphicButton
                      variant="secondary"
                      size="small"
                      onClick={() => setSidebarOpen(true)}
                      icon={<MenuIcon />}
                      className="lg:hidden"
                      title="Open sidebar"
                    />
                  )}

                  {/* Page Title */}
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-semibold text-gray-900">
                      {getPageTitle()}
                    </h1>
                  </div>

                  {/* Mobile Title */}
                  <div className="block sm:hidden">
                    <h1 className="text-lg font-semibold text-gray-900">
                      Campus Suite
                    </h1>
                  </div>
                </div>

                {/* Center Section - Search (hidden on mobile) */}
                <div className="hidden md:flex flex-1 max-w-lg mx-8">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      placeholder="Search clubs, events, people..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                  {/* Points Display */}
                  <div className="hidden sm:block">
                    <QuickPointsDisplay />
                  </div>

                  {/* Notifications */}
                  <NotificationBell onClick={handleNotificationsClick} />

                  {/* Profile Dropdown */}
                  <div className="relative group">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]">
                        {user?.full_name?.charAt(0) || user?.first_name?.charAt(0) || 'U'}
                      </div>
                      
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.full_name || `${user?.first_name} ${user?.last_name}` || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.user_type || 'student'}
                        </p>
                      </div>

                      <svg className="hidden lg:block w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-2">
                        <button
                          onClick={handleProfileClick}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          View Profile
                        </button>

                        <button
                          onClick={() => navigate('/settings')}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </button>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <LogoutIcon />
                          <span className="ml-3">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <NeomorphicButton
          variant="primary"
          size="large"
          onClick={() => navigate('/create')}
          className="!rounded-full !p-4 shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]"
          title="Quick create"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </NeomorphicButton>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0px_-2px_8px_#bebebe] z-40">
        <div className="grid grid-cols-5 gap-1">
          {[
            { path: '/dashboard', label: 'Home', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v10H8V5z' },
            { path: '/clubs', label: 'Clubs', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            { path: '/events', label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { path: '/messages', label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
            { path: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          ].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center p-2 transition-colors duration-200 ${
                  isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
