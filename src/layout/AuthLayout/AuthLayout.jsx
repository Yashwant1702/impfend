import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NeomorphicCard from '../../common/NeomorphicCard';
import { authLayoutStyles } from './AuthLayout.styles';

const AuthLayout = ({ 
  children,
  showBranding = true,
  showFooter = true,
  backgroundVariant = 'gradient',
  className = '',
}) => {
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const layoutClasses = [
    authLayoutStyles.container,
    authLayoutStyles.backgrounds[backgroundVariant] || authLayoutStyles.backgrounds.gradient,
    className,
  ].filter(Boolean).join(' ');

  // Slideshow data for the auth screens
  const slides = [
    {
      title: "Connect with Your Campus Community",
      description: "Join clubs, attend events, and build lasting friendships with students who share your interests.",
      image: "🏫",
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Discover Amazing Events",
      description: "Never miss out on workshops, competitions, cultural events, and social gatherings happening around campus.",
      image: "🎉",
      color: "from-green-500 to-blue-600"
    },
    {
      title: "Earn Achievements & Level Up",
      description: "Get recognized for your participation with badges, points, and climb the leaderboards with fellow students.",
      image: "🏆",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Stay Connected",
      description: "Chat with club members, get real-time notifications, and never miss important updates from your community.",
      image: "💬",
      color: "from-orange-500 to-red-600"
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('register')) return 'Create Account';
    if (path.includes('forgot-password')) return 'Reset Password';
    if (path.includes('verify')) return 'Verify Email';
    return 'Welcome Back';
  };

  // Get page subtitle based on route
  const getPageSubtitle = () => {
    const path = location.pathname;
    if (path.includes('register')) return 'Join the campus community';
    if (path.includes('forgot-password')) return 'Reset your password';
    if (path.includes('verify')) return 'Check your email for verification';
    return 'Sign in to your account';
  };

  return (
    <div className={layoutClasses}>
      {/* Left Side - Branding & Slideshow */}
      {showBranding && (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          {/* Slideshow Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center text-white p-12">
            {/* Logo */}
            <div className="mb-12">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.1)]">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Campus Club Suite</h1>
              <p className="text-white text-opacity-80">Your Campus Community Hub</p>
            </div>

            {/* Current Slide */}
            <div className="max-w-lg transition-all duration-500">
              <div className="text-6xl mb-6">{slides[currentSlide].image}</div>
              <h2 className="text-3xl font-bold mb-4">{slides[currentSlide].title}</h2>
              <p className="text-lg text-white text-opacity-90 leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Slide Indicators */}
            <div className="flex space-x-3 mt-12">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-white shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.2)]'
                      : 'bg-white bg-opacity-40 hover:bg-opacity-60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      {/* Right Side - Auth Form */}
      <div className={`flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 ${
        showBranding ? 'lg:w-1/2' : 'w-full'
      }`}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Campus Club Suite</h1>
            <p className="text-gray-600">Your Campus Community Hub</p>
          </div>

          {/* Page Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {getPageTitle()}
            </h2>
            <p className="text-gray-600">
              {getPageSubtitle()}
            </p>
          </div>

          {/* Auth Form Container */}
          <div className="relative">
            {children}
          </div>

          {/* Additional Links */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">
                Help
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {showFooter && (
        <footer className="absolute bottom-4 left-4 right-4 text-center text-sm text-gray-400 lg:text-left">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <p>&copy; 2025 Campus Club Suite. All rights reserved.</p>
            <p className="lg:mt-0 mt-2">
              Made with ❤️ for campus communities
            </p>
          </div>
        </footer>
      )}

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-10 right-1/3 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default AuthLayout;
