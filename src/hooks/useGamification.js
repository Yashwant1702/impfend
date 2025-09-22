import { useState, useEffect, useCallback } from 'react';
import gamificationService from '../services/gamification';

export const useGamification = () => {
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [myBadges, setMyBadges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [levelInfo, setLevelInfo] = useState(null);
  const [streakInfo, setStreakInfo] = useState(null);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch gamification profile
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await gamificationService.getGamificationProfile();
      
      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to fetch gamification profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user badges
  const fetchMyBadges = useCallback(async () => {
    try {
      const result = await gamificationService.getMyBadges();
      
      if (result.success) {
        setMyBadges(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to fetch user badges:', error);
      return { success: false, error: 'Failed to fetch badges' };
    }
  }, []);

  // Fetch all badges
  const fetchBadges = useCallback(async (filters = {}) => {
    try {
      const result = await gamificationService.getBadges(filters);
      
      if (result.success) {
        setBadges(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to fetch badges:', error);
      return { success: false, error: 'Failed to fetch badges' };
    }
  }, []);

  // Fetch achievements
  const fetchAchievements = useCallback(async (filters = {}) => {
    try {
      const result = await gamificationService.getAchievements(filters);
      
      if (result.success) {
        setAchievements(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      return { success: false, error: 'Failed to fetch achievements' };
    }
  }, []);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await gamificationService.getLeaderboard(filters);
      
      if (result.success) {
        setLeaderboard(result.data);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to fetch leaderboard';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user rank
  const fetchUserRank = useCallback(async (type = 'global', timePeriod = 'all_time') => {
    try {
      const result = await gamificationService.getUserRank(type, timePeriod);
      
      if (result.success) {
        setUserRank(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to fetch user rank:', error);
      return { success: false, error: 'Failed to fetch user rank' };
    }
  }, []);

  // Fetch points history
  const fetchPointsHistory = useCallback(async (filters = {}) => {
    try {
      const result = await gamificationService.getPointsHistory(filters);
      
      if (result.success) {
        setPointsHistory(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to fetch points history:', error);
      return { success: false, error: 'Failed to fetch points history' };
    }
  }, []);

  // Fetch level information
  const fetchLevelInfo = useCallback(async () => {
    try {
      const result = await gamificationService.getLevelInfo();
      
      if (result.success) {
        setLevelInfo(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to fetch level info:', error);
      return { success: false, error: 'Failed to fetch level info' };
    }
  }, []);

  // Fetch streak information
  const fetchStreakInfo = useCallback(async () => {
    try {
      const result = await gamificationService.getStreakInfo();
      
      if (result.success) {
        setStreakInfo(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to fetch streak info:', error);
      return { success: false, error: 'Failed to fetch streak info' };
    }
  }, []);

  // Fetch daily challenge
  const fetchDailyChallenge = useCallback(async () => {
    try {
      const result = await gamificationService.getDailyChallenge();
      
      if (result.success) {
        setDailyChallenge(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to fetch daily challenge:', error);
      return { success: false, error: 'Failed to fetch daily challenge' };
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const initializeGamification = async () => {
      await Promise.all([
        fetchProfile(),
        fetchMyBadges(),
        fetchLevelInfo(),
        fetchStreakInfo(),
        fetchDailyChallenge(),
      ]);
    };

    initializeGamification();
  }, [fetchProfile, fetchMyBadges, fetchLevelInfo, fetchStreakInfo, fetchDailyChallenge]);

  // Join achievement
  const joinAchievement = useCallback(async (achievementId) => {
    setError(null);
    
    try {
      const result = await gamificationService.joinAchievement(achievementId);
      
      if (result.success) {
        // Update achievements list to reflect participation
        setAchievements(prev =>
          prev.map(achievement =>
            achievement.id === achievementId
              ? { 
                  ...achievement, 
                  user_progress: { 
                    ...achievement.user_progress, 
                    is_participating: true,
                    status: 'in_progress'
                  } 
                }
              : achievement
          )
        );
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to join achievement';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Complete daily challenge
  const completeDailyChallenge = useCallback(async (challengeId, proof = {}) => {
    setError(null);
    
    try {
      const result = await gamificationService.completeDailyChallenge(challengeId, proof);
      
      if (result.success) {
        // Update daily challenge status
        setDailyChallenge(prev => ({
          ...prev,
          is_completed: true,
          completed_at: new Date().toISOString()
        }));
        
        // Refresh profile to update points
        await fetchProfile();
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to complete daily challenge';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchProfile]);

  // Claim reward
  const claimReward = useCallback(async (rewardId) => {
    setError(null);
    
    try {
      const result = await gamificationService.claimReward(rewardId);
      
      if (result.success) {
        // Refresh profile to update points
        await fetchProfile();
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to claim reward';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchProfile]);

  // Share achievement
  const shareAchievement = useCallback(async (achievementId, platform = 'general') => {
    setError(null);
    
    try {
      const result = await gamificationService.shareAchievement(achievementId, platform);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to share achievement';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get achievement progress
  const getAchievementProgress = useCallback(async (achievementId) => {
    try {
      const result = await gamificationService.getAchievementProgress(achievementId);
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to fetch achievement progress' };
    }
  }, []);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchProfile(),
        fetchMyBadges(),
        fetchLevelInfo(),
        fetchStreakInfo(),
        fetchDailyChallenge(),
      ]);
    } catch (error) {
      setError('Failed to refresh gamification data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile, fetchMyBadges, fetchLevelInfo, fetchStreakInfo, fetchDailyChallenge]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Filter badges by category
  const getBadgesByCategory = useCallback((category) => {
    return badges.filter(badge => badge.category === category);
  }, [badges]);

  // Filter achievements by status
  const getAchievementsByStatus = useCallback((status) => {
    return achievements.filter(achievement => achievement.user_progress?.status === status);
  }, [achievements]);

  // Get user's level progress percentage
  const getLevelProgress = useCallback(() => {
    if (!levelInfo || !levelInfo.points_to_next_level) return 0;
    
    const currentLevelPoints = levelInfo.experience_points;
    const pointsNeeded = levelInfo.points_to_next_level;
    const totalPointsForLevel = currentLevelPoints + pointsNeeded;
    
    return totalPointsForLevel > 0 ? (currentLevelPoints / totalPointsForLevel) * 100 : 0;
  }, [levelInfo]);

  return {
    // State
    profile,
    badges,
    myBadges,
    achievements,
    leaderboard,
    userRank,
    pointsHistory,
    levelInfo,
    streakInfo,
    dailyChallenge,
    isLoading,
    error,
    
    // Data fetching
    fetchProfile,
    fetchBadges,
    fetchMyBadges,
    fetchAchievements,
    fetchLeaderboard,
    fetchUserRank,
    fetchPointsHistory,
    fetchLevelInfo,
    fetchStreakInfo,
    fetchDailyChallenge,
    
    // Actions
    joinAchievement,
    completeDailyChallenge,
    claimReward,
    shareAchievement,
    getAchievementProgress,
    refreshAll,
    clearError,
    
    // Helpers
    getBadgesByCategory,
    getAchievementsByStatus,
    getLevelProgress,
    
    // Computed values
    totalPoints: profile?.total_points || 0,
    currentLevel: levelInfo?.current_level || 1,
    currentLevelName: levelInfo?.level_name || 'Beginner',
    experiencePoints: levelInfo?.experience_points || 0,
    pointsToNextLevel: levelInfo?.points_to_next_level || 100,
    levelProgressPercentage: getLevelProgress(),
    currentStreak: streakInfo?.current_streak || 0,
    longestStreak: streakInfo?.longest_streak || 0,
    badgesCount: myBadges.length,
    globalRank: userRank?.rank || 0,
    collegeRank: profile?.college_rank || 0,
    isDailyChallengeComplete: dailyChallenge?.is_completed || false,
    canCompleteDailyChallenge: dailyChallenge && !dailyChallenge.is_completed,
    
    // Achievement status helpers
    inProgressAchievements: getAchievementsByStatus('in_progress'),
    completedAchievements: getAchievementsByStatus('completed'),
    availableAchievements: getAchievementsByStatus('available'),
  };
};

export default useGamification;
