import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import { pointsDisplayStyles } from './PointsDisplay.styles';

const PointsDisplay = ({
  variant = 'default',
  size = 'medium',
  showLevel = true,
  showProgress = true,
  showHistory = false,
  animated = true,
  className = '',
}) => {
  const { user } = useAuth();
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [showPointsGain, setShowPointsGain] = useState(false);

  const displayClasses = [
    pointsDisplayStyles.container,
    pointsDisplayStyles.sizes[size] || pointsDisplayStyles.sizes.medium,
    pointsDisplayStyles.variants[variant] || pointsDisplayStyles.variants.default,
    className,
  ].filter(Boolean).join(' ');

  const currentPoints = user?.gamification?.total_points || 0;
  const currentLevel = user?.gamification?.level || 1;
  const pointsToNextLevel = user?.gamification?.points_to_next_level || 0;
  const levelProgress = user?.gamification?.level_progress || 0;

  // Animate points counter
  useEffect(() => {
    if (animated && currentPoints !== animatedPoints) {
      const difference = currentPoints - animatedPoints;
      if (Math.abs(difference) > 100) {
        // For large differences, animate quickly
        setAnimatedPoints(currentPoints);
      } else {
        // For small differences, animate smoothly
        const increment = difference > 0 ? 1 : -1;
        const timer = setInterval(() => {
          setAnimatedPoints(prev => {
            const newValue = prev + increment;
            if ((increment > 0 && newValue >= currentPoints) || 
                (increment < 0 && newValue <= currentPoints)) {
              clearInterval(timer);
              return currentPoints;
            }
            return newValue;
          });
        }, 20);

        return () => clearInterval(timer);
      }
    }
  }, [currentPoints, animatedPoints, animated]);

  // Initialize animated points
  useEffect(() => {
    if (!animated) {
      setAnimatedPoints(currentPoints);
    }
  }, [animated, currentPoints]);

  // Format points with commas
  const formatPoints = (points) => {
    return points.toLocaleString();
  };

  // Calculate level from total points
  const calculateLevel = (totalPoints) => {
    // Simple level calculation: 1000 points per level
    return Math.floor(totalPoints / 1000) + 1;
  };

  // Calculate progress to next level
  const calculateLevelProgress = (totalPoints) => {
    const pointsInCurrentLevel = totalPoints % 1000;
    return (pointsInCurrentLevel / 1000) * 100;
  };

  // Get level color based on level
  const getLevelColor = (level) => {
    if (level >= 50) return 'text-purple-600';
    if (level >= 25) return 'text-orange-600';
    if (level >= 10) return 'text-blue-600';
    if (level >= 5) return 'text-green-600';
    return 'text-gray-600';
  };

  // Get level badge color
  const getLevelBadgeColor = (level) => {
    if (level >= 50) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (level >= 25) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (level >= 10) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (level >= 5) return 'bg-green-100 text-green-800 border-green-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Icons
  const StarIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const TrendingUpIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  const AwardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <div className="text-yellow-500">
          <StarIcon />
        </div>
        <span className="font-bold text-gray-800">
          {formatPoints(animatedPoints)}
        </span>
        {showLevel && (
          <>
            <span className="text-gray-400">•</span>
            <span className={`text-sm font-medium ${getLevelColor(currentLevel)}`}>
              Level {currentLevel}
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <NeomorphicCard className={displayClasses}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Your Points</h3>
        <div className="text-yellow-500">
          <StarIcon />
        </div>
      </div>

      {/* Main Points Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-4xl font-bold text-gray-800">
            {formatPoints(animatedPoints)}
          </span>
          <TrendingUpIcon />
        </div>
        <p className="text-sm text-gray-600">Total Points Earned</p>
      </div>

      {/* Level Information */}
      {showLevel && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AwardIcon />
            <span className="font-medium text-gray-700">Level</span>
          </div>
          <div className={`px-3 py-1 rounded-full border-2 text-sm font-bold ${getLevelBadgeColor(currentLevel)}`}>
            {currentLevel}
          </div>
        </div>
      )}

      {/* Level Progress */}
      {showProgress && showLevel && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Progress to Level {currentLevel + 1}</span>
            <span>{Math.round(levelProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-[2px_2px_4px_#4a90e2,-2px_-2px_4px_#6bb6ff]"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {pointsToNextLevel} points to next level
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {user?.gamification?.badges_earned || 0}
          </div>
          <div className="text-xs text-blue-500">Badges</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {user?.gamification?.achievements_unlocked || 0}
          </div>
          <div className="text-xs text-green-500">Achievements</div>
        </div>
      </div>

      {/* Recent Activity */}
      {showHistory && user?.gamification?.recent_activities && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
          <div className="space-y-2">
            {user.gamification.recent_activities.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{activity.description}</span>
                <span className="font-medium text-green-600">+{activity.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Points Gain Animation */}
      {showPointsGain && (
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 animate-bounce">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            +{user?.gamification?.recent_points_gain || 0}
          </div>
        </div>
      )}
    </NeomorphicCard>
  );
};

// Quick Points Display Component
export const QuickPointsDisplay = ({ points, level, compact = true }) => {
  return (
    <PointsDisplay
      variant={compact ? 'compact' : 'default'}
      size="small"
      showLevel={!!level}
      showProgress={false}
      showHistory={false}
      animated={false}
    />
  );
};

export default PointsDisplay;
