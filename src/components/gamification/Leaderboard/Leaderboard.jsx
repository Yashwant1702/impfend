import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import Avatar from '../../common/Avatar';
import { ComponentLoading } from '../../common/Loading';
import { leaderboardStyles } from './Leaderboard.styles';

const Leaderboard = ({
  leaderboardData = [],
  currentUser = null,
  period = 'all_time',
  category = 'points',
  isLoading = false,
  onPeriodChange,
  onCategoryChange,
  className = '',
}) => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [selectedCategory, setSelectedCategory] = useState(category);

  const leaderboardClasses = [
    leaderboardStyles.container,
    className,
  ].filter(Boolean).join(' ');

  const periods = [
    { value: 'all_time', label: 'All Time' },
    { value: 'this_month', label: 'This Month' },
    { value: 'this_week', label: 'This Week' },
    { value: 'today', label: 'Today' },
  ];

  const categories = [
    { value: 'points', label: 'Points' },
    { value: 'badges', label: 'Badges' },
    { value: 'events_attended', label: 'Events' },
    { value: 'clubs_joined', label: 'Clubs' },
  ];

  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    if (onCategoryChange) {
      onCategoryChange(newCategory);
    }
  };

  // Get rank styling
  const getRankStyling = (rank) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
          text: 'text-yellow-800',
          shadow: 'shadow-[4px_4px_8px_#d4af37,-4px_-4px_8px_#f4e583]',
        };
      case 2:
        return {
          bg: 'bg-gradient-to-br from-gray-400 to-gray-600',
          text: 'text-gray-800',
          shadow: 'shadow-[4px_4px_8px_#a8a8a8,-4px_-4px_8px_#d3d3d3]',
        };
      case 3:
        return {
          bg: 'bg-gradient-to-br from-orange-600 to-orange-800',
          text: 'text-orange-800',
          shadow: 'shadow-[4px_4px_8px_#cd7f32,-4px_-4px_8px_#e89c6b]',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          shadow: 'shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff]',
        };
    }
  };

  // Format value based on category
  const formatValue = (value, category) => {
    switch (category) {
      case 'points':
        return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
      default:
        return value.toString();
    };
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'points':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 'badges':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'events_attended':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'clubs_joined':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Icons
  const TrophyIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const ChevronUpIcon = () => (
    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  if (isLoading) {
    return <ComponentLoading text="Loading leaderboard..." />;
  }

  return (
    <NeomorphicCard className={leaderboardClasses}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-yellow-500">
            <TrophyIcon />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Period Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
          <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodChange(period.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period.value
                    ? 'bg-blue-100 text-blue-800 shadow-[inset_2px_2px_4px_#a7c7d4,inset_-2px_-2px_4px_#d3f2ff]'
                    : 'bg-gray-100 text-gray-600 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff] hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? 'bg-green-100 text-green-800 shadow-[inset_2px_2px_4px_#a7c7a7,inset_-2px_-2px_4px_#d3f2d3]'
                    : 'bg-gray-100 text-gray-600 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff] hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                }`}
              >
                {getCategoryIcon(category.value)}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      {leaderboardData.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <TrophyIcon />
          </div>
          <p className="text-gray-500">No leaderboard data available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboardData.slice(0, 10).map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = user && entry.user_id === user.id;
            const rankStyling = getRankStyling(rank);

            return (
              <div
                key={entry.user_id || index}
                className={`
                  flex items-center space-x-4 p-4 rounded-xl transition-all duration-200
                  ${isCurrentUser 
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-[4px_4px_8px_#a7c7d4,-4px_-4px_8px_#d3f2ff]' 
                    : 'bg-gray-50 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff] hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                  }
                `}
              >
                {/* Rank */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  ${rankStyling.bg} ${rankStyling.text} ${rankStyling.shadow}
                `}>
                  {rank <= 3 ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    rank
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 flex items-center space-x-3">
                  <Avatar
                    src={entry.avatar}
                    name={entry.full_name || entry.username}
                    size="small"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${isCurrentUser ? 'text-blue-800' : 'text-gray-800'}`}>
                      {entry.full_name || entry.username}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Level {entry.level || 1}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-lg text-gray-800">
                      {formatValue(entry.value, selectedCategory)}
                    </span>
                    {getCategoryIcon(selectedCategory) && (
                      <div className="text-gray-500">
                        {getCategoryIcon(selectedCategory)}
                      </div>
                    )}
                  </div>
                  
                  {/* Rank Change */}
                  {entry.rank_change && (
                    <div className="flex items-center space-x-1 text-xs">
                      {entry.rank_change > 0 ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      <span className={entry.rank_change > 0 ? 'text-green-600' : 'text-red-600'}>
                        {Math.abs(entry.rank_change)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Current User Rank (if not in top 10) */}
      {currentUser && user && !leaderboardData.slice(0, 10).some(entry => entry.user_id === user.id) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm">
              {currentUser.rank}
            </div>
            <div className="flex-1 flex items-center space-x-3">
              <Avatar
                src={user.avatar}
                name={user.full_name}
                size="small"
              />
              <div>
                <p className="font-medium text-blue-800">
                  {user.full_name}
                  <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                    You
                  </span>
                </p>
                <p className="text-xs text-blue-600">
                  Level {user.gamification?.level || 1}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-lg text-blue-800">
                  {formatValue(currentUser.value, selectedCategory)}
                </span>
                {getCategoryIcon(selectedCategory) && (
                  <div className="text-blue-600">
                    {getCategoryIcon(selectedCategory)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </NeomorphicCard>
  );
};

export default Leaderboard;
