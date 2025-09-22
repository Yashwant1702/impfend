import React, { useState } from 'react';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import { achievementCardStyles } from './AchievementCard.styles';

const AchievementCard = ({
  achievement,
  isUnlocked = false,
  progress = null,
  showProgress = true,
  size = 'medium',
  onClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const cardClasses = [
    achievementCardStyles.container,
    achievementCardStyles.sizes[size] || achievementCardStyles.sizes.medium,
    isUnlocked ? achievementCardStyles.unlocked : achievementCardStyles.locked,
    className,
  ].filter(Boolean).join(' ');

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get achievement category color
  const getCategoryColor = (category) => {
    const colorMap = {
      social: 'bg-pink-100 text-pink-800',
      academic: 'bg-blue-100 text-blue-800',
      participation: 'bg-green-100 text-green-800',
      leadership: 'bg-purple-100 text-purple-800',
      milestone: 'bg-orange-100 text-orange-800',
      special: 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!progress || !progress.total) return 0;
    return Math.min((progress.current / progress.total) * 100, 100);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not unlocked';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const progressPercentage = getProgressPercentage();

  // Icons
  const AwardIcon = () => (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const TrophyIcon = () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const LockIcon = () => (
    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const StarIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <NeomorphicCard
      className={cardClasses}
      hover={!!onClick}
      clickable={!!onClick}
      onClick={onClick}
    >
      {/* Achievement Image/Icon */}
      <div className={`
        relative mb-4 mx-auto flex items-center justify-center rounded-full
        ${size === 'small' ? 'w-16 h-16' : size === 'large' ? 'w-24 h-24' : 'w-20 h-20'}
        ${isUnlocked 
          ? 'bg-gradient-to-br from-purple-400 to-pink-500 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]' 
          : 'bg-gray-200 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]'
        }
      `}>
        {achievement.icon_image && !imageError ? (
          <img
            src={achievement.icon_image}
            alt={achievement.title}
            className={`rounded-full object-cover ${
              size === 'small' ? 'w-14 h-14' : size === 'large' ? 'w-22 h-22' : 'w-18 h-18'
            } ${!isUnlocked ? 'opacity-40 grayscale' : ''}`}
            onError={handleImageError}
          />
        ) : (
          <div className={`${isUnlocked ? 'text-white' : 'text-gray-400'} ${!isUnlocked ? 'opacity-40' : ''}`}>
            {isUnlocked ? <TrophyIcon /> : <LockIcon />}
          </div>
        )}

        {/* Unlocked Badge */}
        {isUnlocked && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* New Achievement Glow */}
        {isUnlocked && achievement.is_new && (
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 animate-pulse" />
        )}
      </div>

      {/* Achievement Info */}
      <div className="text-center">
        <h3 className={`font-bold mb-1 ${
          size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
        } ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
          {achievement.title}
        </h3>

        {/* Category Badge */}
        {achievement.category && (
          <div className="mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
              {achievement.category}
            </span>
          </div>
        )}

        <p className={`text-xs mb-3 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {achievement.description}
        </p>

        {/* Points */}
        {achievement.points && (
          <div className={`flex items-center justify-center space-x-1 mb-3 ${
            isUnlocked ? 'text-yellow-600' : 'text-gray-400'
          }`}>
            <StarIcon />
            <span className="text-sm font-medium">
              {achievement.points} points
            </span>
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && progress && !isUnlocked && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress.current}/{progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300 shadow-[2px_2px_4px_#9333ea,-2px_-2px_4px_#c084fc]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(progressPercentage)}% complete
            </p>
          </div>
        )}

        {/* Unlock Date */}
        {isUnlocked && achievement.unlocked_at && (
          <p className="text-xs text-gray-400 mb-3">
            Unlocked on {formatDate(achievement.unlocked_at)}
          </p>
        )}

        {/* Requirements */}
        {!isUnlocked && achievement.requirements && (
          <div className="mt-3 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <span className="font-medium">How to unlock:</span>
              <br />
              {achievement.requirements}
            </p>
          </div>
        )}

        {/* Difficulty/Rarity */}
        {achievement.difficulty && (
          <div className="mt-3 flex justify-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-0.5 ${
                  index < achievement.difficulty
                    ? 'bg-orange-400'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      {onClick && (
        <div className="mt-4">
          <NeomorphicButton
            variant={isUnlocked ? "success" : "secondary"}
            size="small"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onClick(achievement);
            }}
          >
            {isUnlocked ? 'View Details' : 'Learn More'}
          </NeomorphicButton>
        </div>
      )}

      {/* New Achievement Notification */}
      {isUnlocked && achievement.is_new && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold animate-bounce">
          New!
        </div>
      )}
    </NeomorphicCard>
  );
};

export default AchievementCard;
