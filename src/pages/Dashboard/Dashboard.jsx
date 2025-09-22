import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import NeomorphicCard from '../../components/common/NeomorphicCard';
import NeomorphicButton from '../../components/common/NeomorphicButton';
import ClubCard from '../../components/clubs/ClubCard';
import EventCard from '../../components/events/EventCard';
import PointsDisplay from '../../components/gamification/PointsDisplay';
import BadgeCard from '../../components/gamification/BadgeCard';
import NotificationCard from '../../components/notifications/NotificationCard';
import Avatar from '../../components/common/Avatar';
import { dashboardStyles } from './Dashboard.styles';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    clubs: [],
    events: [],
    notifications: [],
    achievements: [],
    stats: {},
    loading: true,
  });

  const pageClasses = [
    dashboardStyles.container,
  ].filter(Boolean).join(' ');

  // Simulate data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      // Simulate API call
      setTimeout(() => {
        setDashboardData({
          clubs: [
            {
              id: 1,
              name: 'Photography Club',
              description: 'Capture life\'s beautiful moments',
              member_count: 156,
              cover_image: null,
              category: { name: 'Arts' },
              is_member: true,
              status: 'active',
            },
            {
              id: 2,
              name: 'Tech Innovation Society',
              description: 'Building tomorrow\'s technology today',
              member_count: 89,
              cover_image: null,
              category: { name: 'Technology' },
              is_member: true,
              status: 'active',
            },
          ],
          events: [
            {
              id: 1,
              title: 'Photography Workshop',
              description: 'Learn advanced photography techniques',
              start_datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              location: 'Art Studio Room 101',
              registered_count: 45,
              max_participants: 50,
              is_free: true,
              event_type: 'workshop',
              club: { name: 'Photography Club' },
            },
            {
              id: 2,
              title: 'Hackathon 2025',
              description: '48-hour coding challenge',
              start_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              location: 'Tech Hub',
              registered_count: 120,
              max_participants: 200,
              is_free: false,
              registration_fee: 25,
              event_type: 'competition',
              club: { name: 'Tech Innovation Society' },
            },
          ],
          notifications: [
            {
              id: 1,
              title: 'New Event Registration',
              message: 'Photography Workshop registration is now open!',
              type: 'info',
              is_read: false,
              created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
          ],
          achievements: [
            {
              id: 1,
              title: 'Social Butterfly',
              description: 'Join 5 different clubs',
              points: 500,
              icon_image: null,
              category: 'social',
              is_unlocked: true,
              unlocked_at: new Date().toISOString(),
            },
          ],
          stats: {
            totalPoints: 2450,
            level: 8,
            clubsJoined: 3,
            eventsAttended: 12,
            badgesEarned: 7,
          },
          loading: false,
        });
      }, 1000);
    };

    loadDashboardData();
  }, []);

  // Quick actions
  const quickActions = [
    {
      title: 'Join a Club',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      onClick: () => navigate('/clubs'),
      color: 'from-blue-500 to-purple-600',
    },
    {
      title: 'Find Events',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => navigate('/events'),
      color: 'from-green-500 to-blue-600',
    },
    {
      title: 'Send Message',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      onClick: () => navigate('/messages'),
      color: 'from-pink-500 to-red-600',
    },
    {
      title: 'View Achievements',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      onClick: () => navigate('/gamification'),
      color: 'from-yellow-500 to-orange-600',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (dashboardData.loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={pageClasses}>
        {/* Welcome Header */}
        <div className="mb-8">
          <NeomorphicCard className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar
                  src={user?.avatar}
                  name={user?.full_name || `${user?.first_name} ${user?.last_name}`}
                  size="large"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {getGreeting()}, {user?.first_name || 'Student'}!
                  </h1>
                  <p className="text-gray-600">
                    Welcome back to Campus Club Suite
                  </p>
                </div>
              </div>
              
              <div className="hidden md:block">
                <PointsDisplay 
                  variant="compact" 
                  showLevel={true}
                  showProgress={false}
                />
              </div>
            </div>
          </NeomorphicCard>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <NeomorphicCard
                key={index}
                className="p-6 cursor-pointer hover:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] transition-all duration-200"
                onClick={action.onClick}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl mx-auto mb-3 flex items-center justify-center text-white shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]`}>
                    {action.icon}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800">{action.title}</h3>
                </div>
              </NeomorphicCard>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Clubs */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">My Clubs</h2>
                <NeomorphicButton
                  variant="secondary"
                  size="small"
                  onClick={() => navigate('/clubs')}
                >
                  View All
                </NeomorphicButton>
              </div>
              
              {dashboardData.clubs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboardData.clubs.map((club) => (
                    <ClubCard
                      key={club.id}
                      club={club}
                      onView={() => navigate(`/clubs/${club.id}`)}
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
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No clubs yet</h3>
                  <p className="text-gray-500 mb-4">Join your first club to get started!</p>
                  <NeomorphicButton
                    variant="primary"
                    onClick={() => navigate('/clubs')}
                  >
                    Explore Clubs
                  </NeomorphicButton>
                </NeomorphicCard>
              )}
            </section>

            {/* Upcoming Events */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
                <NeomorphicButton
                  variant="secondary"
                  size="small"
                  onClick={() => navigate('/events')}
                >
                  View All
                </NeomorphicButton>
              </div>
              
              {dashboardData.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboardData.events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onView={() => navigate(`/events/${event.id}`)}
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
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No upcoming events</h3>
                  <p className="text-gray-500 mb-4">Check out events happening on campus!</p>
                  <NeomorphicButton
                    variant="primary"
                    onClick={() => navigate('/events')}
                  >
                    Browse Events
                  </NeomorphicButton>
                </NeomorphicCard>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Stats Overview */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Stats</h2>
              <NeomorphicCard className="p-6">
                <div className="space-y-4">
                  <div className="text-center border-b border-gray-200 pb-4">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {dashboardData.stats.totalPoints}
                    </div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-gray-800">
                        {dashboardData.stats.clubsJoined}
                      </div>
                      <div className="text-xs text-gray-600">Clubs Joined</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">
                        {dashboardData.stats.eventsAttended}
                      </div>
                      <div className="text-xs text-gray-600">Events Attended</div>
                    </div>
                  </div>
                </div>
              </NeomorphicCard>
            </section>

            {/* Recent Achievement */}
            {dashboardData.achievements.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Latest Achievement</h2>
                  <NeomorphicButton
                    variant="secondary"
                    size="small"
                    onClick={() => navigate('/gamification')}
                  >
                    View All
                  </NeomorphicButton>
                </div>
                
                <BadgeCard
                  badge={dashboardData.achievements[0]}
                  isEarned={true}
                  onClick={() => navigate('/gamification')}
                />
              </section>
            )}

            {/* Recent Notifications */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Recent Notifications</h2>
                <NeomorphicButton
                  variant="secondary"
                  size="small"
                  onClick={() => navigate('/notifications')}
                >
                  View All
                </NeomorphicButton>
              </div>
              
              {dashboardData.notifications.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.notifications.slice(0, 3).map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      compact={true}
                      showActions={false}
                      onClick={() => navigate('/notifications')}
                    />
                  ))}
                </div>
              ) : (
                <NeomorphicCard className="p-6 text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v2.25l.75.75H15v4.5H6v-4.5H2.25l.75-.75V9.75a6 6 0 0 1 6-6z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">No new notifications</p>
                </NeomorphicCard>
              )}
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
