import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import NeomorphicCard from '../../components/common/NeomorphicCard';
import NeomorphicButton from '../../components/common/NeomorphicButton';
import NeomorphicInput from '../../components/common/NeomorphicInput';
import Avatar from '../../components/common/Avatar';
import ClubCard from '../../components/clubs/ClubCard';
import EventCard from '../../components/events/EventCard';
import BadgeCard from '../../components/gamification/BadgeCard';
import PointsDisplay from '../../components/gamification/PointsDisplay';
import { profileStyles } from './Profile.styles';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    college: '',
    department: '',
    student_id: '',
    phone: '',
    location: '',
    website: '',
    social_links: {
      linkedin: '',
      twitter: '',
      instagram: '',
      github: '',
    },
  });
  const [userActivity, setUserActivity] = useState({
    clubs: [],
    events: [],
    badges: [],
    stats: {},
  });

  const pageClasses = [
    profileStyles.container,
  ].filter(Boolean).join(' ');

  // Load profile data
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        bio: user.bio || '',
        college: user.college || '',
        department: user.department || '',
        student_id: user.student_id || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
        social_links: user.social_links || {
          linkedin: '',
          twitter: '',
          instagram: '',
          github: '',
        },
      });

      // Load user activity data
      setUserActivity({
        clubs: [
          {
            id: 1,
            name: 'Photography Club',
            member_count: 156,
            is_member: true,
            status: 'active',
            category: { name: 'Arts' },
          },
          {
            id: 2,
            name: 'Tech Innovation Society',
            member_count: 89,
            is_member: true,
            status: 'active',
            category: { name: 'Technology' },
          },
        ],
        events: [
          {
            id: 1,
            title: 'Photography Workshop',
            start_datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            location: 'Art Studio',
            is_registered: true,
            event_type: 'workshop',
            club: { name: 'Photography Club' },
          },
        ],
        badges: [
          {
            id: 1,
            name: 'Social Butterfly',
            description: 'Join 5 different clubs',
            points: 500,
            category: 'social',
            rarity: 'uncommon',
          },
        ],
        stats: {
          totalPoints: 2450,
          level: 8,
          clubsJoined: 3,
          eventsAttended: 12,
          badgesEarned: 7,
        },
      });
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    // Reset form data
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        bio: user.bio || '',
        college: user.college || '',
        department: user.department || '',
        student_id: user.student_id || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
        social_links: user.social_links || {
          linkedin: '',
          twitter: '',
          instagram: '',
          github: '',
        },
      });
    }
    setIsEditing(false);
  };

  // Tab configuration
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'clubs', label: `My Clubs (${userActivity.clubs.length})` },
    { id: 'events', label: `My Events (${userActivity.events.length})` },
    { id: 'achievements', label: `Achievements (${userActivity.badges.length})` },
  ];

  // Icons
  const EditIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const SaveIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const CancelIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <MainLayout>
      <div className={pageClasses}>
        {/* Profile Header */}
        <NeomorphicCard className="p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar
                src={user?.avatar}
                name={user?.full_name || `${user?.first_name} ${user?.last_name}`}
                size="xlarge"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {user?.full_name || `${user?.first_name} ${user?.last_name}` || 'User'}
              </h1>
              <p className="text-lg text-gray-600 mb-1 capitalize">
                {user?.user_type || 'Student'}
              </p>
              {user?.college && (
                <p className="text-gray-500 mb-4">{user.college}</p>
              )}
              
              {profileData.bio && (
                <p className="text-gray-600 leading-relaxed max-w-2xl">
                  {profileData.bio}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              {!isEditing ? (
                <NeomorphicButton
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  icon={<EditIcon />}
                >
                  Edit Profile
                </NeomorphicButton>
              ) : (
                <div className="space-y-2">
                  <NeomorphicButton
                    variant="primary"
                    onClick={handleUpdateProfile}
                    loading={isLoading}
                    icon={<SaveIcon />}
                  >
                    Save Changes
                  </NeomorphicButton>
                  <NeomorphicButton
                    variant="secondary"
                    onClick={handleCancelEdit}
                    icon={<CancelIcon />}
                  >
                    Cancel
                  </NeomorphicButton>
                </div>
              )}

              {/* Points Display */}
              <div className="pt-4 border-t border-gray-200">
                <PointsDisplay 
                  variant="compact" 
                  showLevel={true}
                  showProgress={false}
                />
              </div>
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
        <div>
          {activeTab === 'profile' && (
            <NeomorphicCard className="p-6">
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <NeomorphicInput
                        label="First Name"
                        value={profileData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                      
                      <NeomorphicInput
                        label="Last Name"
                        value={profileData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                      
                      <NeomorphicInput
                        type="email"
                        label="Email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                      
                      <NeomorphicInput
                        label="Phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className={`w-full px-4 py-3 bg-gray-100 border-none rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200 resize-none ${
                        !isEditing ? 'opacity-60' : ''
                      }`}
                      placeholder="Tell others about yourself..."
                    />
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <NeomorphicInput
                        label="College/University"
                        value={profileData.college}
                        onChange={(e) => handleInputChange('college', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                      
                      <NeomorphicInput
                        label="Department"
                        value={profileData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                      
                      <NeomorphicInput
                        label="Student ID"
                        value={profileData.student_id}
                        onChange={(e) => handleInputChange('student_id', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                      
                      <NeomorphicInput
                        label="Location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <NeomorphicInput
                        label="Website"
                        type="url"
                        value={profileData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                      
                      <NeomorphicInput
                        label="LinkedIn"
                        value={profileData.social_links.linkedin}
                        onChange={(e) => handleInputChange('social_links.linkedin', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                      
                      <NeomorphicInput
                        label="Twitter"
                        value={profileData.social_links.twitter}
                        onChange={(e) => handleInputChange('social_links.twitter', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                      
                      <NeomorphicInput
                        label="GitHub"
                        value={profileData.social_links.github}
                        onChange={(e) => handleInputChange('social_links.github', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
              </form>
            </NeomorphicCard>
          )}

          {activeTab === 'clubs' && (
            <div>
              {userActivity.clubs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userActivity.clubs.map((club) => (
                    <ClubCard
                      key={club.id}
                      club={club}
                      showActions={false}
                    />
                  ))}
                </div>
              ) : (
                <NeomorphicCard className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No clubs joined yet</h3>
                  <p className="text-gray-500">Join your first club to get started!</p>
                </NeomorphicCard>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              {userActivity.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userActivity.events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showActions={false}
                    />
                  ))}
                </div>
              ) : (
                <NeomorphicCard className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No events registered</h3>
                  <p className="text-gray-500">Register for events to see them here!</p>
                </NeomorphicCard>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              {userActivity.badges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {userActivity.badges.map((badge) => (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      isEarned={true}
                    />
                  ))}
                </div>
              ) : (
                <NeomorphicCard className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No achievements yet</h3>
                  <p className="text-gray-500">Start participating to earn your first badges!</p>
                </NeomorphicCard>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
