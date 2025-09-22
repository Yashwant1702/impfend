import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

class GamificationService {
  // Get user gamification profile
  async getGamificationProfile() {
    try {
      const response = await apiService.get(API_ENDPOINTS.GAMIFICATION.PROFILE);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: null,
      };
    }
  }

  // Get user points breakdown
  async getUserPoints() {
    try {
      const response = await apiService.get(API_ENDPOINTS.GAMIFICATION.POINTS);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: null,
      };
    }
  }

  // Get all available badges
  async getBadges(filters = {}) {
    try {
      const {
        page = 1,
        category = '',
        difficulty = '',
        earned = '',
        search = '',
      } = filters;

      const params = {
        page,
        category,
        difficulty,
        earned,
        search,
      };

      const response = await apiService.get(API_ENDPOINTS.GAMIFICATION.BADGES, { params });

      return {
        success: true,
        data: response.results || response,
        pagination: response.count ? {
          count: response.count,
          totalPages: Math.ceil(response.count / 20),
          currentPage: page,
          hasNext: !!response.next,
          hasPrevious: !!response.previous,
        } : null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Get user's earned badges
  async getMyBadges() {
    try {
      const response = await apiService.get(API_ENDPOINTS.GAMIFICATION.MY_BADGES);

      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Get all achievements
  async getAchievements(filters = {}) {
    try {
      const {
        page = 1,
        category = '',
        status = '',
        difficulty = '',
        search = '',
      } = filters;

      const params = {
        page,
        category,
        status,
        difficulty,
        search,
      };

      const response = await apiService.get(API_ENDPOINTS.GAMIFICATION.ACHIEVEMENTS, { params });

      return {
        success: true,
        data: response.results || response,
        pagination: response.count ? {
          count: response.count,
          totalPages: Math.ceil(response.count / 20),
          currentPage: page,
          hasNext: !!response.next,
          hasPrevious: !!response.previous,
        } : null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Join an achievement challenge
  async joinAchievement(achievementId) {
    try {
      const response = await apiService.post(API_ENDPOINTS.GAMIFICATION.JOIN_ACHIEVEMENT(achievementId));

      return {
        success: true,
        data: response,
        message: 'Successfully joined the achievement challenge!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get leaderboard data
  async getLeaderboard(filters = {}) {
    try {
      const {
        type = 'global',
        timePeriod = 'all_time',
        category = '',
        limit = 50,
        page = 1,
      } = filters;

      const params = {
        type,
        time_period: timePeriod,
        category,
        limit,
        page,
      };

      const response = await apiService.get(API_ENDPOINTS.GAMIFICATION.LEADERBOARD, { params });

      return {
        success: true,
        data: response.results || response,
        pagination: response.count ? {
          count: response.count,
          totalPages: Math.ceil(response.count / limit),
          currentPage: page,
          hasNext: !!response.next,
          hasPrevious: !!response.previous,
        } : null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Get user rank in leaderboard
  async getUserRank(type = 'global', timePeriod = 'all_time') {
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.GAMIFICATION.LEADERBOARD}user-rank/`,
        {
          params: { type, time_period: timePeriod }
        }
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: { rank: 0, total_users: 0 },
      };
    }
  }

  // Get points history
  async getPointsHistory(filters = {}) {
    try {
      const {
        page = 1,
        category = '',
        startDate = '',
        endDate = '',
        limit = 20,
      } = filters;

      const params = {
        page,
        category,
        start_date: startDate,
        end_date: endDate,
        page_size: limit,
      };

      const response = await apiService.get(
        `${API_ENDPOINTS.GAMIFICATION.POINTS}history/`,
        { params }
      );

      return {
        success: true,
        data: response.results || response,
        pagination: response.count ? {
          count: response.count,
          totalPages: Math.ceil(response.count / limit),
          currentPage: page,
          hasNext: !!response.next,
          hasPrevious: !!response.previous,
        } : null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Get badge categories
  async getBadgeCategories() {
    try {
      const response = await apiService.get('/api/v1/gamification/badge-categories/');

      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Get achievement categories
  async getAchievementCategories() {
    try {
      const response = await apiService.get('/api/v1/gamification/achievement-categories/');

      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Get user's achievement progress
  async getAchievementProgress(achievementId) {
    try {
      const response = await apiService.get(
        `/api/v1/gamification/achievements/${achievementId}/progress/`
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: null,
      };
    }
  }

  // Get daily challenge
  async getDailyChallenge() {
    try {
      const response = await apiService.get('/api/v1/gamification/daily-challenge/');

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: null,
      };
    }
  }

  // Complete daily challenge
  async completeDailyChallenge(challengeId, proof = {}) {
    try {
      const response = await apiService.post(
        `/api/v1/gamification/daily-challenge/${challengeId}/complete/`,
        { proof }
      );

      return {
        success: true,
        data: response,
        message: 'Daily challenge completed! Points awarded.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get user's level information
  async getLevelInfo() {
    try {
      const response = await apiService.get('/api/v1/gamification/level-info/');

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: {
          current_level: 1,
          experience_points: 0,
          points_to_next_level: 100,
          level_name: 'Beginner'
        },
      };
    }
  }

  // Get streak information
  async getStreakInfo() {
    try {
      const response = await apiService.get('/api/v1/gamification/streak/');

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: {
          current_streak: 0,
          longest_streak: 0,
          last_activity_date: null
        },
      };
    }
  }

  // Get gamification statistics
  async getGamificationStats() {
    try {
      const response = await apiService.get('/api/v1/gamification/stats/');

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: {
          total_points: 0,
          badges_earned: 0,
          achievements_completed: 0,
          rank: 0
        },
      };
    }
  }

  // Claim reward
  async claimReward(rewardId) {
    try {
      const response = await apiService.post(`/api/v1/gamification/rewards/${rewardId}/claim/`);

      return {
        success: true,
        data: response,
        message: 'Reward claimed successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get available rewards
  async getRewards(category = '') {
    try {
      const params = category ? { category } : {};
      const response = await apiService.get('/api/v1/gamification/rewards/', { params });

      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Get user's claimed rewards
  async getMyRewards() {
    try {
      const response = await apiService.get('/api/v1/gamification/rewards/my-rewards/');

      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Share achievement
  async shareAchievement(achievementId, platform = 'general') {
    try {
      const response = await apiService.post(
        `/api/v1/gamification/achievements/${achievementId}/share/`,
        { platform }
      );

      return {
        success: true,
        data: response,
        message: 'Achievement shared successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }
}

// Create singleton instance
const gamificationService = new GamificationService();

export default gamificationService;
