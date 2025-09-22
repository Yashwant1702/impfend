import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import Avatar from '../../common/Avatar';
import { ComponentLoading } from '../../common/Loading';
import { clubDetailsStyles } from './ClubDetails.styles';

const ClubDetails = ({
  club,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  onBack,
  isLoading = false,
  className = '',
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [imageError, setImageError] = useState(false);

  const detailsClasses = [
    clubDetailsStyles.container,
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return 'Not set';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colorMap = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Tab components
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: `Members (${club.member_count || 0})` },
    { id: 'events', label: 'Events' },
    { id: 'announcements', label: 'Announcements' },
  ];

  // Icons
  const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const EditIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  if (isLoading) {
    return <ComponentLoading text="Loading club details..." />;
  }

  if (!club) {
    return (
      <div className={detailsClasses}>
        <NeomorphicCard className="p-8 text-center">
          <p className="text-gray-600">Club not found</p>
          <NeomorphicButton variant="primary" onClick={onBack} className="mt-4">
            Go Back
          </NeomorphicButton>
        </NeomorphicCard>
      </div>
    );
  }

  return (
    <div className={detailsClasses}>
      {/* Header */}
      <div className="mb-6">
        <NeomorphicButton
          variant="secondary"
          size="small"
          onClick={onBack}
          icon={<BackIcon />}
          className="mb-4"
        >
          Back to Clubs
        </NeomorphicButton>
      </div>

      {/* Hero Section */}
      <NeomorphicCard className="mb-6">
        <div className="relative">
          {/* Cover Image */}
          <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl overflow-hidden mb-6">
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
                  <svg className="w-20 h-20 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-xl opacity-80">{club.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Club Info */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{club.name}</h1>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(club.status)}`}>
                      {club.status}
                    </span>
                    
                    {club.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {club.category.name || club.category}
                      </span>
                    )}
                    
                    {club.is_member && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Member
                      </span>
                    )}
                  </div>
                </div>

                {/* Management Actions */}
                {canManageClub() && (
                  <div className="flex space-x-2">
                    <NeomorphicButton
                      variant="secondary"
                      size="small"
                      onClick={() => onEdit && onEdit(club)}
                      icon={<EditIcon />}
                    >
                      Edit
                    </NeomorphicButton>
                    
                    <NeomorphicButton
                      variant="danger"
                      size="small"
                      onClick={() => onDelete && onDelete(club)}
                      icon={<DeleteIcon />}
                    >
                      Delete
                    </NeomorphicButton>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {club.description || 'No description available.'}
              </p>

              {/* Club Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{club.member_count || 0}</div>
                  <div className="text-sm text-gray-500">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{club.events_count || 0}</div>
                  <div className="text-sm text-gray-500">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {formatDate(club.created_at).split(' ')[2] || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">Est. Year</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {club.rating ? club.rating.toFixed(1) : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {user && (
              <div className="flex flex-col space-y-3 lg:w-64">
                {club.is_member ? (
                  <NeomorphicButton
                    variant="danger"
                    size="large"
                    fullWidth
                    onClick={() => onLeave && onLeave(club)}
                  >
                    Leave Club
                  </NeomorphicButton>
                ) : (
                  <NeomorphicButton
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={() => onJoin && onJoin(club)}
                    disabled={club.status !== 'active'}
                  >
                    {club.requires_approval ? 'Request to Join' : 'Join Club'}
                  </NeomorphicButton>
                )}

                {/* Quick Info */}
                <div className="space-y-3 text-sm text-gray-600">
                  {club.meeting_schedule && (
                    <div className="flex items-center space-x-2">
                      <CalendarIcon />
                      <span>{club.meeting_schedule}</span>
                    </div>
                  )}
                  
                  {club.meeting_location && (
                    <div className="flex items-center space-x-2">
                      <LocationIcon />
                      <span>{club.meeting_location}</span>
                    </div>
                  )}
                  
                  {club.next_meeting_date && (
                    <div className="flex items-center space-x-2">
                      <CalendarIcon />
                      <span>Next: {formatDate(club.next_meeting_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </NeomorphicCard>

      {/* Navigation Tabs */}
      <NeomorphicCard className="mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </NeomorphicCard>

      {/* Tab Content */}
      <NeomorphicCard>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Club Details */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Club Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Meeting Schedule</h4>
                  <p className="text-gray-600">{club.meeting_schedule || 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Meeting Location</h4>
                  <p className="text-gray-600">{club.meeting_location || 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Contact Email</h4>
                  <p className="text-gray-600">{club.contact_email || 'Not provided'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Founded</h4>
                  <p className="text-gray-600">{formatDate(club.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Club Admins */}
            {club.admins && club.admins.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Club Leadership</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {club.admins.map((admin) => (
                    <div key={admin.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <Avatar
                        src={admin.avatar}
                        name={admin.full_name || admin.name}
                        size="medium"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{admin.full_name || admin.name}</p>
                        <p className="text-sm text-gray-500">{admin.role || 'Admin'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {club.recent_activities && club.recent_activities.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {club.recent_activities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-gray-700">{activity.description}</p>
                      <span className="text-sm text-gray-500">{formatDate(activity.created_at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Members ({club.member_count || 0})
            </h3>
            
            {club.members && club.members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {club.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Avatar
                      src={member.avatar}
                      name={member.full_name || member.name}
                      size="medium"
                      online={member.is_online}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{member.full_name || member.name}</p>
                      <p className="text-sm text-gray-500">
                        {member.user_type === 'student' ? 'Student' : 
                         member.user_type === 'faculty' ? 'Faculty' : 'Admin'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Joined {formatDate(member.joined_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No members to display</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Upcoming Events</h3>
            <div className="text-center py-8">
              <p className="text-gray-500">Events functionality coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Announcements</h3>
            <div className="text-center py-8">
              <p className="text-gray-500">No announcements yet</p>
            </div>
          </div>
        )}
      </NeomorphicCard>
    </div>
  );
};

export default ClubDetails;
