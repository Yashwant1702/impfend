import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gamificationService from '../../services/gamification';

// Async thunks
export const fetchGamificationProfile = createAsyncThunk(
  'gamification/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const result = await gamificationService.getGamificationProfile();
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBadges = createAsyncThunk(
  'gamification/fetchBadges',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const result = await gamificationService.getBadges(filters);
      if (result.success) {
        return result;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyBadges = createAsyncThunk(
  'gamification/fetchMyBadges',
  async (_, { rejectWithValue }) => {
    try {
      const result = await gamificationService.getMyBadges();
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAchievements = createAsyncThunk(
  'gamification/fetchAchievements',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const result = await gamificationService.getAchievements(filters);
      if (result.success) {
        return result;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'gamification/fetchLeaderboard',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const result = await gamificationService.getLeaderboard(filters);
      if (result.success) {
        return result;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserPoints = createAsyncThunk(
  'gamification/fetchUserPoints',
  async (_, { rejectWithValue }) => {
    try {
      const result = await gamificationService.getUserPoints();
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLevelInfo = createAsyncThunk(
  'gamification/fetchLevelInfo',
  async (_, { rejectWithValue }) => {
    try {
      const result = await gamificationService.getLevelInfo();
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinAchievementChallenge = createAsyncThunk(
  'gamification/joinAchievement',
  async (achievementId, { rejectWithValue }) => {
    try {
      const result = await gamificationService.joinAchievement(achievementId);
      if (result.success) {
        return { achievementId, data: result.data };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state with exact Django backend field mapping
const initialState = {
  // User gamification profile - exact backend fields
  profile: {
    user: null,
    total_points: 0,
    current_level: 1,
    level_name: 'Beginner',
    experience_points: 0,
    points_to_next_level: 100,
    badges_count: 0,
    achievements_completed: 0,
    college_rank: 0,
    global_rank: 0,
    streak_count: 0,
    longest_streak: 0,
    created_at: null,
    updated_at: null,
  },
  
  // Badges
  badges: [],
  myBadges: [],
  badgesPagination: null,
  
  // Achievements
  achievements: [],
  achievementsPagination: null,
  
  // Leaderboard
  leaderboard: [],
  leaderboardPagination: null,
  userRank: null,
  
  // Points and level info
  pointsBreakdown: null,
  levelInfo: {
    current_level: 1,
    level_name: 'Beginner',
    experience_points: 0,
    points_to_next_level: 100,
    level_description: '',
    level_benefits: [],
    next_level_name: '',
  },
  
  // Streak information
  streakInfo: {
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: null,
    streak_bonus: 0,
  },
  
  // Daily challenge
  dailyChallenge: null,
  
  // Loading states
  isLoading: false,
  isLoadingBadges: false,
  isLoadingAchievements: false,
  isLoadingLeaderboard: false,
  isLoadingProfile: false,
  isJoiningAchievement: false,
  
  // Error states
  error: null,
  badgesError: null,
  achievementsError: null,
  leaderboardError: null,
  joinAchievementError: null,
  
  // Filters
  badgeFilters: {
    page: 1,
    category: '',
    difficulty: '',
    earned: '',
    search: '',
  },
  
  achievementFilters: {
    page: 1,
    category: '',
    status: '',
    difficulty: '',
    search: '',
  },
  
  leaderboardFilters: {
    type: 'global', // global, college, friends
    timePeriod: 'all_time', // all_time, this_month, this_week
    category: '',
    limit: 50,
    page: 1,
  },
  
  // UI states
  selectedBadge: null,
  selectedAchievement: null,
  showBadgeModal: false,
  showAchievementModal: false,
  showLeaderboardModal: false,
  
  // Categories
  badgeCategories: [],
  achievementCategories: [],
  
  // Last updated timestamps
  lastUpdated: null,
  profileLastUpdated: null,
};

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.badgesError = null;
      state.achievementsError = null;
      state.leaderboardError = null;
      state.joinAchievementError = null;
    },
    
    // Update filters
    updateBadgeFilters: (state, action) => {
      state.badgeFilters = { ...state.badgeFilters, ...action.payload };
    },
    
    updateAchievementFilters: (state, action) => {
      state.achievementFilters = { ...state.achievementFilters, ...action.payload };
    },
    
    updateLeaderboardFilters: (state, action) => {
      state.leaderboardFilters = { ...state.leaderboardFilters, ...action.payload };
    },
    
    // Reset filters
    resetBadgeFilters: (state) => {
      state.badgeFilters = {
        page: 1,
        category: '',
        difficulty: '',
        earned: '',
        search: '',
      };
    },
    
    resetAchievementFilters: (state) => {
      state.achievementFilters = {
        page: 1,
        category: '',
        status: '',
        difficulty: '',
        search: '',
      };
    },
    
    resetLeaderboardFilters: (state) => {
      state.leaderboardFilters = {
        type: 'global',
        timePeriod: 'all_time',
        category: '',
        limit: 50,
        page: 1,
      };
    },
    
    // UI actions
    setSelectedBadge: (state, action) => {
      state.selectedBadge = action.payload;
    },
    
    setSelectedAchievement: (state, action) => {
      state.selectedAchievement = action.payload;
    },
    
    showBadgeModal: (state, action) => {
      state.showBadgeModal = true;
      state.selectedBadge = action.payload;
    },
    
    hideBadgeModal: (state) => {
      state.showBadgeModal = false;
      state.selectedBadge = null;
    },
    
    showAchievementModal: (state, action) => {
      state.showAchievementModal = true;
      state.selectedAchievement = action.payload;
    },
    
    hideAchievementModal: (state) => {
      state.showAchievementModal = false;
      state.selectedAchievement = null;
    },
    
    showLeaderboardModal: (state) => {
      state.showLeaderboardModal = true;
    },
    
    hideLeaderboardModal: (state) => {
      state.showLeaderboardModal = false;
    },
    
    // Set categories
    setBadgeCategories: (state, action) => {
      state.badgeCategories = action.payload;
    },
    
    setAchievementCategories: (state, action) => {
      state.achievementCategories = action.payload;
    },
    
    // Set daily challenge
    setDailyChallenge: (state, action) => {
      state.dailyChallenge = action.payload;
    },
    
    // Update profile points (for real-time updates)
    updateProfilePoints: (state, action) => {
      const { pointsEarned, newTotal } = action.payload;
      state.profile.total_points = newTotal;
      state.profile.experience_points += pointsEarned;
      
      // Check for level up
      if (state.profile.experience_points >= state.profile.points_to_next_level) {
        state.profile.current_level += 1;
        state.profile.experience_points = 0; // Reset for next level
      }
    },
    
    // Add new badge (for real-time updates)
    addNewBadge: (state, action) => {
      state.myBadges = [action.payload, ...state.myBadges];
      state.profile.badges_count += 1;
    },
    
    // Update streak info
    updateStreakInfo: (state, action) => {
      state.streakInfo = { ...state.streakInfo, ...action.payload };
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch gamification profile
      .addCase(fetchGamificationProfile.pending, (state) => {
        state.isLoadingProfile = true;
        state.error = null;
      })
      .addCase(fetchGamificationProfile.fulfilled, (state, action) => {
        state.isLoadingProfile = false;
        state.profile = action.payload;
        state.profileLastUpdated = new Date().toISOString();
      })
      .addCase(fetchGamificationProfile.rejected, (state, action) => {
        state.isLoadingProfile = false;
        state.error = action.payload;
      })
      
      // Fetch badges
      .addCase(fetchBadges.pending, (state) => {
        state.isLoadingBadges = true;
        state.badgesError = null;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.isLoadingBadges = false;
        state.badges = action.payload.data;
        state.badgesPagination = action.payload.pagination;
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.isLoadingBadges = false;
        state.badgesError = action.payload;
      })
      
      // Fetch my badges
      .addCase(fetchMyBadges.pending, (state) => {
        state.isLoadingBadges = true;
      })
      .addCase(fetchMyBadges.fulfilled, (state, action) => {
        state.isLoadingBadges = false;
        state.myBadges = action.payload;
      })
      .addCase(fetchMyBadges.rejected, (state, action) => {
        state.isLoadingBadges = false;
        state.badgesError = action.payload;
      })
      
      // Fetch achievements
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoadingAchievements = true;
        state.achievementsError = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.isLoadingAchievements = false;
        state.achievements = action.payload.data;
        state.achievementsPagination = action.payload.pagination;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoadingAchievements = false;
        state.achievementsError = action.payload;
      })
      
      // Fetch leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoadingLeaderboard = true;
        state.leaderboardError = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoadingLeaderboard = false;
        state.leaderboard = action.payload.data;
        state.leaderboardPagination = action.payload.pagination;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoadingLeaderboard = false;
        state.leaderboardError = action.payload;
      })
      
      // Fetch user points
      .addCase(fetchUserPoints.fulfilled, (state, action) => {
        state.pointsBreakdown = action.payload;
      })
      
      // Fetch level info
      .addCase(fetchLevelInfo.fulfilled, (state, action) => {
        state.levelInfo = action.payload;
      })
      
      // Join achievement
      .addCase(joinAchievementChallenge.pending, (state) => {
        state.isJoiningAchievement = true;
        state.joinAchievementError = null;
      })
      .addCase(joinAchievementChallenge.fulfilled, (state, action) => {
        state.isJoiningAchievement = false;
        
        const { achievementId } = action.payload;
        
        // Update achievement in the list
        state.achievements = state.achievements.map(achievement =>
          achievement.id === achievementId
            ? {
                ...achievement,
                user_progress: {
                  ...achievement.user_progress,
                  is_participating: true,
                  status: 'in_progress',
                  joined_at: new Date().toISOString()
                }
              }
            : achievement
        );
      })
      .addCase(joinAchievementChallenge.rejected, (state, action) => {
        state.isJoiningAchievement = false;
        state.joinAchievementError = action.payload;
      });
  },
});

// Action creators
export const {
  clearError,
  updateBadgeFilters,
  updateAchievementFilters,
  updateLeaderboardFilters,
  resetBadgeFilters,
  resetAchievementFilters,
  resetLeaderboardFilters,
  setSelectedBadge,
  setSelectedAchievement,
  showBadgeModal,
  hideBadgeModal,
  showAchievementModal,
  hideAchievementModal,
  showLeaderboardModal,
  hideLeaderboardModal,
  setBadgeCategories,
  setAchievementCategories,
  setDailyChallenge,
  updateProfilePoints,
  addNewBadge,
  updateStreakInfo,
} = gamificationSlice.actions;

// Selectors
export const selectGamification = (state) => state.gamification;
export const selectGamificationProfile = (state) => state.gamification.profile;
export const selectBadges = (state) => state.gamification.badges;
export const selectMyBadges = (state) => state.gamification.myBadges;
export const selectAchievements = (state) => state.gamification.achievements;
export const selectLeaderboard = (state) => state.gamification.leaderboard;
export const selectLevelInfo = (state) => state.gamification.levelInfo;
export const selectStreakInfo = (state) => state.gamification.streakInfo;
export const selectDailyChallenge = (state) => state.gamification.dailyChallenge;
export const selectTotalPoints = (state) => state.gamification.profile.total_points;
export const selectCurrentLevel = (state) => state.gamification.profile.current_level;
export const selectGlobalRank = (state) => state.gamification.profile.global_rank;
export const selectCollegeRank = (state) => state.gamification.profile.college_rank;

// Complex selectors
export const selectBadgesByCategory = (category) => (state) =>
  state.gamification.badges.filter(badge => badge.category === category);

export const selectAchievementsByStatus = (status) => (state) =>
  state.gamification.achievements.filter(
    achievement => achievement.user_progress?.status === status
  );

export const selectLevelProgress = (state) => {
  const levelInfo = state.gamification.levelInfo;
  if (!levelInfo.points_to_next_level) return 0;
  
  const progress = (levelInfo.experience_points / 
    (levelInfo.experience_points + levelInfo.points_to_next_level)) * 100;
  
  return Math.min(progress, 100);
};

export default gamificationSlice.reducer;
