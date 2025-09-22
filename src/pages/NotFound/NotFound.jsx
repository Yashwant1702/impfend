import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NeomorphicCard from '../../components/common/NeomorphicCard';
import NeomorphicButton from '../../components/common/NeomorphicButton';
import { notFoundStyles } from './NotFound.styles';

const NotFound = () => {
  const navigate = useNavigate();

  const pageClasses = [
    notFoundStyles.container,
  ].filter(Boolean).join(' ');

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className={pageClasses}>
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-10 right-1/3 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 text-center">
        <NeomorphicCard className="p-8 max-w-2xl mx-auto">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              404
            </div>
            
            {/* Sad Club Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Oops! The page you're looking for seems to have wandered off.
            </p>
            <p className="text-gray-500">
              It might have joined a club we haven't heard of yet!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NeomorphicButton
              variant="primary"
              size="large"
              onClick={handleGoHome}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            >
              Go to Dashboard
            </NeomorphicButton>

            <NeomorphicButton
              variant="secondary"
              size="large"
              onClick={handleGoBack}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Go Back
            </NeomorphicButton>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Looking for something specific? Try these popular sections:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link 
                to="/clubs" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Browse Clubs
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                to="/events" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Upcoming Events
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                to="/messages" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Messages
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                to="/profile" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                My Profile
              </Link>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-6 text-xs text-gray-400">
            Still need help? 
            <Link 
              to="/support" 
              className="text-blue-500 hover:text-blue-700 ml-1"
            >
              Contact Support
            </Link>
          </div>
        </NeomorphicCard>
      </div>

      {/* Floating Elements Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-yellow-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
};

export default NotFound;
