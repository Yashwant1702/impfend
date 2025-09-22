import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import NeomorphicCard from '../../components/common/NeomorphicCard';
import PointsDisplay from '../../components/gamification/PointsDisplay';
import BadgeCard from '../../components/gamification/BadgeCard';
import AchievementCard from '../../components/gamification/AchievementCard';
import Leaderboard from '../../components/gamification/Leaderboard';
import { gamificationStyles } from './Gamification.styles';

const Gamification = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [gamificationData, setGamificationData] = useState({
    badges: [],
    achievements: [],
    leaderboard: [],
    userRank: null,
    stats: {},
    loading: true,
  });

  const pageClasses = [
    gamificationStyles.container,
  ].filter(Boolean).join(' ');

  // Load gamification data
  useEffect(() => {
    const loadGamificationData = async () => {
      // Simulate API call
      setTimeout(() => {
        setGamificationData({
          badges: [
            {
              id: 1,
              name: 'First Steps',
              description: 'Complete your profile',
              points: 100,
              rarity: 'common',
              category: 'milestone',
              requirements: 'Fill out all basic profile information',
              earned_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 2,
              name: 'Social Butterfly',
              description: 'Join 5 different clubs',
              points: 500,
              rarity: 'uncommon',
              category: 'social',
              requirements: 'Join 5 different clubs on campus',
              earned_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 3,
              name: 'Event Explorer',
              description: 'Attend 10 events',
              points: 750,
              rarity: 'rare',
              category: 'participation',
              requirements: 'Attend 10 different events',
              earned_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 4,
              name: 'Club Leader',
              description: 'Create and manage a club',
              points: 1000,
              rarity: 'epic',
              category: 'leadership',
              requirements: 'Create and successfully manage a club with 20+ members',
            },
            {
              id: 5,
              name: 'Master Networker',
              description: 'Connect with 100 students',
              points: 2000,
              rarity: 'legendary',
              category: 'social',
              requirements: 'Send messages to 100 different students',
            },
          ],
          achievements: [
            {
              id: 1,
              title: 'Academic Excellence',
              description: 'Maintain active membership in 3+ academic clubs',
              points: 1500,
              category: 'academic',
              difficulty: 4,
              requirements: 'Join and remain active in at least 3 academic clubs for one semester',
              progress: { current: 2, total: 3 },
            },
            {
              id: 2,
              title: 'Community Builder',
              description: 'Help organize 5 successful events',
              points: 2000,
              category: 'leadership',
              difficulty: 5,
              requirements: 'Successfully organize 5 events with 50+ participants each',
              progress: { current: 1, total: 5 },
            },
          ],
          leaderboard: [
            {
              user_id: 1,
              full_name: 'Alice Johnson',
              value: 5420,
              level: 12,
              avatar: null,
              rank_change: 2,
            },
            {
              user_id: 2,
              full_name: 'Bob Smith',
              value: 4890,
              level: 11,
              avatar: null,
              rank_change: -1,
            },
            {
              user_id: 3,
              full_name: 'Carol Williams',
              value: 4320,
              level: 10,
              avatar: null,
              rank_change: 0,
            },
            {
              user_id: 4,
              full_name: 'David Brown',
              value: 3980,
              level: 9,
              avatar: null,
              rank_change: 1,
            },
            {
              user_id: 5,
              full_name: 'Emma Davis',
              value: 3750,
              level: 9,
              avatar: null,
              rank_change: -2,
            },
          ],
          userRank: {
            rank: 15,
            value: 2450,
          },
          stats: {
            totalPoints: 2450,
            level: 8,
            badgesEarned: 3,
            achievementsUnlocked: 0,
            rankPosition: 15,
            pointsToNextLevel: 550,
          },
          loading: false,
        });
      }, 1000);
    };

    loadGamificationData();
  }, []);

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'badges', label: `Badges (${gamificationData.badges.filter(b => b.earned_at).length}/${gamificationData.badges.length})` },
    { id: 'achievements', label: `Achievements (${gamificationData.achievements.filter(a => a.is_unlocked).length}/${gamificationData.achievements.length})` },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

  if (gamificationData.loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading achievements...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={pageClasses}>
        {/* Header */}
        <div className="mb-8">
          <NeomorphicCard className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Achievements & Rewards
              </h1>
              <p className="text-gray-600">
                Track your progress and unlock exciting rewards
              </p>
            </div>
          </NeomorphicCard>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <NeomorphicCard className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              #{gamificationData.stats.rankPosition}
            </div>
            <div className="text-sm text-gray-600">Campus Rank</div>
          </NeomorphicCard>

          <NeomorphicCard className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {gamificationData.stats.totalPoints}
            </div>
            <div className="text-sm text-gray-600">Total Points</div>
          </NeomorphicCard>

          <NeomorphicCard className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {gamificationData.stats.badgesEarned}
            </div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </NeomorphicCard>

          <NeomorphicCard className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {gamificationData.stats.level}
            </div>
            <div className="text-sm text-gray-600">Current Level</div>
          </NeomorphicCard>
        </div>

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
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress Overview */}
              <div className="space-y-6">
                <NeomorphicCard className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Your Progress</h3>
                  <PointsDisplay 
                    showLevel={true}
                    showProgress={true}
                    showHistory={true}
                  />
                </NeomorphicCard>

                {/* Recent Badges */}
                <NeomorphicCard className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Badges</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {gamificationData.badges
                      .filter(badge => badge.earned_at)
                      .slice(0, 4)
                      .map((badge) => (
                        <BadgeCard
                          key={badge.id}
                          badge={badge}
                          isEarned={true}
                          size="small"
                        />
                      ))}
                  </div>
                </NeomorphicCard>
              </div>

              {/* Mini Leaderboard */}
              <div>
                <NeomorphicCard className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Top Performers</h3>
                  <Leaderboard
                    leaderboardData={gamificationData.leaderboard.slice(0, 5)}
                    currentUser={gamificationData.userRank}
                    period="all_time"
                    category="points"
                    className="shadow-none border-none"
                  />
                </NeomorphicCard>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gamificationData.badges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  isEarned={!!badge.earned_at}
                  showProgress={!badge.earned_at}
                />
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gamificationData.achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={achievement.is_unlocked}
                  progress={achievement.progress}
                  showProgress={true}
                />
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <Leaderboard
              leaderboardData={gamificationData.leaderboard}
              currentUser={gamificationData.userRank}
              period="all_time"
              category="points"
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Gamification;
