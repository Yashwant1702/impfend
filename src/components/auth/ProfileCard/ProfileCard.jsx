import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import Avatar from '../../common/Avatar';
import { profileCardStyles } from './ProfileCard.styles';

const ProfileCard = ({ 
  showEditButton = true, 
  showStats = true, 
  compact = false,
  className = '' 
}) => {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const cardClasses = [
    profileCardStyles.container,
    compact ? profileCardStyles.compact : '',
    className,
  ].filter(Boolean).join(' ');

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadAvatar(file);
      if (!result.success) {
        console.error('Failed to upload avatar:', result.error);
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Format join date
  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} months ago`;
    } else {
      const diffYears = Math.floor(diffDays / 365);
      return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    }
  };

  // Get user type display name
  const getUserTypeDisplay = (userType) => {
    const typeMap = {
      student: 'Student',
      faculty: 'Faculty',
      college_admin: 'College Admin',
    };
    return typeMap[userType] || 'User';
  };

  // Get user type color
  const getUserTypeColor = (userType) => {
    const colorMap = {
      student: 'bg-blue-100 text-blue-800',
      faculty: 'bg-green-100 text-green-800',
      college_admin: 'bg-purple-100 text-purple-800',
    };
    return colorMap[userType] || 'bg-gray-100 text-gray-800';
  };

  // Icons
  const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const CameraIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
  );

  const SchoolIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  if (!user) {
    return null;
  }

  return (
    <NeomorphicCard className={cardClasses}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar
              src={user.avatar}
              name={user.full_name}
              size={compact ? 'medium' : 'xlarge'}
              online={user.is_online}
            />
            
            {/* Avatar Upload Button */}
            {showEditButton && (
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] cursor-pointer hover:shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] transition-all duration-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <svg className="w-4 h-4 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <CameraIcon />
                )}
              </label>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {user.full_name || `${user.first_name} ${user.last_name}`}
            </h3>
            
            <div className="flex items-center space-x-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeColor(user.user_type)}`}>
                {getUserTypeDisplay(user.user_type)}
              </span>
              
              {user.is_verified && (
                <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verified</span>
                </div>
              )}
            </div>

            {!compact && user.bio && (
              <p className="text-sm text-gray-600 mb-3">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Edit Button */}
        {showEditButton && (
          <NeomorphicButton
            variant="secondary"
            size="small"
            onClick={() => setIsEditing(true)}
            icon={<EditIcon />}
          >
            Edit
          </NeomorphicButton>
        )}
      </div>

      {/* User Details */}
      {!compact && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <EmailIcon />
            <span>{user.email}</span>
          </div>

          {user.college && (
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <SchoolIcon />
              <span>{user.college}</span>
              {user.department && <span>• {user.department}</span>}
            </div>
          )}

          {user.student_id && (
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <span className="text-gray-400">ID:</span>
              <span>{user.student_id}</span>
            </div>
          )}

          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <CalendarIcon />
            <span>Joined {formatJoinDate(user.created_at)}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      {showStats && !compact && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">{user.clubs_count || 0}</div>
              <div className="text-xs text-gray-500">Clubs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{user.events_attended || 0}</div>
              <div className="text-xs text-gray-500">Events</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{user.points || 0}</div>
              <div className="text-xs text-gray-500">Points</div>
            </div>
          </div>
        </div>
      )}
    </NeomorphicCard>
  );
};

export default ProfileCard;
