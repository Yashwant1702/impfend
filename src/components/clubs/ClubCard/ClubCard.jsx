import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import Avatar from '../../common/Avatar';
import { clubCardStyles } from './ClubCard.styles';

const ClubCard = ({
  club,
  onJoin,
  onLeave,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  isLoading = false,
  className = '',
}) => {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);

  const cardClasses = [
    clubCardStyles.container,
    className,
  ].filter(Boolean).join(' ');

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Check if user can manage this club
  const canManageClub = () => {
    if (!user) return false;
    return user.user_type === 'college_admin' || 
           club.created_by === user.id || 
           club.admins?.some(admin => admin.id === user.id);
  };

  // Format member count
  const formatMemberCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // Get club status color
  const getStatusColor = (status) => {
    const colorMap = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Icons
  const UsersIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  return (
    <NeomorphicCard
      className={cardClasses}
      hover={true}
      clickable={!!onView}
      onClick={onView}
    >
      {/* Club Image */}
      <div className="relative mb-4">
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl overflow-hidden shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]">
          {club.cover_image && !imageError ? (
            <img
              src={club.cover_image}
              alt={club.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-16 h-16 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm opacity-80">{club.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(club.status)}`}>
            {club.status}
          </span>
        </div>

        {/* Member Badge */}
        {club.is_member && (
          <div className="absolute top-3 left-3">
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Member</span>
            </div>
          </div>
        )}
      </div>

      {/* Club Info */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{club.name}</h3>
          
          {/* Management Actions */}
          {canManageClub() && (
            <div className="flex space-x-1 ml-2">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(club);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  title="Edit club"
                >
                  <EditIcon />
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(club);
                  }}
                  className="p-1.5 text-gray-500 hover:text-red-600 transition-colors duration-200"
                  title="Delete club"
                >
                  <DeleteIcon />
                </button>
              )}
            </div>
          )}
        </div>

        {club.category && (
          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {club.category.name || club.category}
            </span>
          </div>
        )}

        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {club.description || 'No description available.'}
        </p>

        {/* Club Meta Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <UsersIcon />
              <span>{formatMemberCount(club.member_count || 0)} members</span>
            </div>
            
            {club.next_meeting_date && (
              <div className="flex items-center space-x-1">
                <CalendarIcon />
                <span>{new Date(club.next_meeting_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {club.meeting_location && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <LocationIcon />
              <span>{club.meeting_location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Club Admins */}
      {club.admins && club.admins.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Club Admins</p>
          <div className="flex -space-x-2">
            {club.admins.slice(0, 3).map((admin, index) => (
              <Avatar
                key={admin.id || index}
                src={admin.avatar}
                name={admin.full_name || admin.name}
                size="small"
                className="border-2 border-white"
              />
            ))}
            
            {club.admins.length > 3 && (
              <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  +{club.admins.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && user && (
        <div className="flex space-x-2">
          {club.is_member ? (
            <NeomorphicButton
              variant="danger"
              size="small"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onLeave && onLeave(club);
              }}
              loading={isLoading}
              disabled={isLoading}
            >
              Leave Club
            </NeomorphicButton>
          ) : (
            <NeomorphicButton
              variant="primary"
              size="small"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onJoin && onJoin(club);
              }}
              loading={isLoading}
              disabled={isLoading || club.status !== 'active'}
            >
              {club.requires_approval ? 'Request to Join' : 'Join Club'}
            </NeomorphicButton>
          )}

          <NeomorphicButton
            variant="secondary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onView && onView(club);
            }}
          >
            View
          </NeomorphicButton>
        </div>
      )}

      {/* Join Status for Pending Requests */}
      {club.membership_status === 'pending' && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center space-x-2 text-yellow-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Join request pending approval</span>
          </div>
        </div>
      )}

      {/* Club Inactive Notice */}
      {club.status !== 'active' && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-sm text-gray-600 text-center">
            This club is currently {club.status}
          </p>
        </div>
      )}
    </NeomorphicCard>
  );
};

export default ClubCard;
