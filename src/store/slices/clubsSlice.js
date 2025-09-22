import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clubService from '../../services/clubs';

// Async thunks
export const fetchClubs = createAsyncThunk(
  'clubs/fetchClubs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const result = await clubService.getClubs(filters);
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

export const fetchClubDetails = createAsyncThunk(
  'clubs/fetchClubDetails',
  async (slug, { rejectWithValue }) => {
    try {
      const result = await clubService.getClubDetails(slug);
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

export const createClub = createAsyncThunk(
  'clubs/createClub',
  async (clubData, { rejectWithValue }) => {
    try {
      const result = await clubService.createClub(clubData);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue({
          message: result.error,
          validationErrors: result.validationErrors
        });
      }
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const updateClub = createAsyncThunk(
  'clubs/updateClub',
  async ({ slug, clubData }, { rejectWithValue }) => {
    try {
      const result = await clubService.updateClub(slug, clubData);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue({
          message: result.error,
          validationErrors: result.validationErrors
        });
      }
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const joinClub = createAsyncThunk(
  'clubs/joinClub',
  async ({ slug, applicationMessage }, { rejectWithValue }) => {
    try {
      const result = await clubService.joinClub(slug, applicationMessage);
      if (result.success) {
        return { slug, data: result.data };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const leaveClub = createAsyncThunk(
  'clubs/leaveClub',
  async (slug, { rejectWithValue }) => {
    try {
      const result = await clubService.leaveClub(slug);
      if (result.success) {
        return { slug, data: result.data };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyClubs = createAsyncThunk(
  'clubs/fetchMyClubs',
  async (status = 'active', { rejectWithValue }) => {
    try {
      const result = await clubService.getMyClubs(status);
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

// Initial state with exact Django backend field mapping
const initialState = {
  // Club lists
  clubs: [],
  myClubs: [],
  
  // Current active club (for club details page)
  activeClub: null,
  
  // Pagination
  pagination: {
    count: 0,
    totalPages: 0,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
  },
  
  // Filters
  filters: {
    page: 1,
    search: '',
    category: '',
    status: 'active',
    college: '',
    sortBy: 'name',
    sortOrder: 'asc',
    limit: 20,
  },
  
  // Loading states
  isLoading: false,
  isLoadingMore: false,
  isCreating: false,
  isUpdating: false,
  isJoining: false,
  isLeaving: false,
  isLoadingMyClubs: false,
  isLoadingDetails: false,
  
  // Error states
  error: null,
  createError: null,
  updateError: null,
  joinError: null,
  leaveError: null,
  validationErrors: {},
  
  // UI states
  showCreateModal: false,
  showUpdateModal: false,
  selectedClubForEdit: null,
  
  // Categories cache
  categories: [],
  
  // Search suggestions
  searchSuggestions: [],
  
  // Last updated timestamp
  lastUpdated: null,
};

const clubsSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.joinError = null;
      state.leaveError = null;
      state.validationErrors = {};
    },
    
    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Reset filters
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        search: '',
        category: '',
        status: 'active',
        college: '',
        sortBy: 'name',
        sortOrder: 'asc',
        limit: 20,
      };
    },
    
    // UI actions
    showCreateModal: (state) => {
      state.showCreateModal = true;
    },
    
    hideCreateModal: (state) => {
      state.showCreateModal = false;
      state.createError = null;
      state.validationErrors = {};
    },
    
    showUpdateModal: (state, action) => {
      state.showUpdateModal = true;
      state.selectedClubForEdit = action.payload;
    },
    
    hideUpdateModal: (state) => {
      state.showUpdateModal = false;
      state.selectedClubForEdit = null;
      state.updateError = null;
      state.validationErrors = {};
    },
    
    // Set active club
    setActiveClub: (state, action) => {
      state.activeClub = action.payload;
    },
    
    // Clear active club
    clearActiveClub: (state) => {
      state.activeClub = null;
    },
    
    // Set categories
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    
    // Update search suggestions
    updateSearchSuggestions: (state, action) => {
      state.searchSuggestions = action.payload;
    },
    
    // Optimistic updates for join/leave
    optimisticJoinClub: (state, action) => {
      const { slug } = action.payload;
      state.clubs = state.clubs.map(club =>
        club.slug === slug
          ? { ...club, is_member: true, member_count: club.member_count + 1 }
          : club
      );
      
      if (state.activeClub && state.activeClub.slug === slug) {
        state.activeClub = {
          ...state.activeClub,
          is_member: true,
          member_count: state.activeClub.member_count + 1
        };
      }
    },
    
    optimisticLeaveClub: (state, action) => {
      const { slug } = action.payload;
      state.clubs = state.clubs.map(club =>
        club.slug === slug
          ? { ...club, is_member: false, member_count: club.member_count - 1 }
          : club
      );
      
      if (state.activeClub && state.activeClub.slug === slug) {
        state.activeClub = {
          ...state.activeClub,
          is_member: false,
          member_count: state.activeClub.member_count - 1
        };
      }
      
      // Remove from myClubs
      state.myClubs = state.myClubs.filter(club => club.slug !== slug);
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch clubs
      .addCase(fetchClubs.pending, (state, action) => {
        const isLoadMore = action.meta.arg?.page > 1;
        if (isLoadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchClubs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        
        const { data, pagination } = action.payload;
        const isLoadMore = pagination.currentPage > 1;
        
        if (isLoadMore) {
          state.clubs = [...state.clubs, ...data];
        } else {
          state.clubs = data;
        }
        
        state.pagination = pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchClubs.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.payload;
      })
      
      // Fetch club details
      .addCase(fetchClubDetails.pending, (state) => {
        state.isLoadingDetails = true;
        state.error = null;
      })
      .addCase(fetchClubDetails.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.activeClub = action.payload;
        
        // Update the club in the list if it exists
        const clubIndex = state.clubs.findIndex(club => club.slug === action.payload.slug);
        if (clubIndex !== -1) {
          state.clubs[clubIndex] = action.payload;
        }
      })
      .addCase(fetchClubDetails.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.payload;
      })
      
      // Create club
      .addCase(createClub.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
        state.validationErrors = {};
      })
      .addCase(createClub.fulfilled, (state, action) => {
        state.isCreating = false;
        state.clubs = [action.payload, ...state.clubs];
        state.showCreateModal = false;
      })
      .addCase(createClub.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload?.message || 'Failed to create club';
        state.validationErrors = action.payload?.validationErrors || {};
      })
      
      // Update club
      .addCase(updateClub.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
        state.validationErrors = {};
      })
      .addCase(updateClub.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        // Update in clubs list
        const clubIndex = state.clubs.findIndex(club => club.slug === action.payload.slug);
        if (clubIndex !== -1) {
          state.clubs[clubIndex] = action.payload;
        }
        
        // Update active club if it's the same
        if (state.activeClub && state.activeClub.slug === action.payload.slug) {
          state.activeClub = action.payload;
        }
        
        state.showUpdateModal = false;
        state.selectedClubForEdit = null;
      })
      .addCase(updateClub.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload?.message || 'Failed to update club';
        state.validationErrors = action.payload?.validationErrors || {};
      })
      
      // Join club
      .addCase(joinClub.pending, (state) => {
        state.isJoining = true;
        state.joinError = null;
      })
      .addCase(joinClub.fulfilled, (state, action) => {
        state.isJoining = false;
        const { slug } = action.payload;
        
        // Update in clubs list
        state.clubs = state.clubs.map(club =>
          club.slug === slug
            ? { ...club, is_member: true, member_count: club.member_count + 1 }
            : club
        );
        
        // Update active club
        if (state.activeClub && state.activeClub.slug === slug) {
          state.activeClub = {
            ...state.activeClub,
            is_member: true,
            member_count: state.activeClub.member_count + 1
          };
        }
      })
      .addCase(joinClub.rejected, (state, action) => {
        state.isJoining = false;
        state.joinError = action.payload;
      })
      
      // Leave club
      .addCase(leaveClub.pending, (state) => {
        state.isLeaving = true;
        state.leaveError = null;
      })
      .addCase(leaveClub.fulfilled, (state, action) => {
        state.isLeaving = false;
        const { slug } = action.payload;
        
        // Update in clubs list
        state.clubs = state.clubs.map(club =>
          club.slug === slug
            ? { ...club, is_member: false, member_count: club.member_count - 1 }
            : club
        );
        
        // Update active club
        if (state.activeClub && state.activeClub.slug === slug) {
          state.activeClub = {
            ...state.activeClub,
            is_member: false,
            member_count: state.activeClub.member_count - 1
          };
        }
        
        // Remove from myClubs
        state.myClubs = state.myClubs.filter(club => club.slug !== slug);
      })
      .addCase(leaveClub.rejected, (state, action) => {
        state.isLeaving = false;
        state.leaveError = action.payload;
      })
      
      // Fetch my clubs
      .addCase(fetchMyClubs.pending, (state) => {
        state.isLoadingMyClubs = true;
        state.error = null;
      })
      .addCase(fetchMyClubs.fulfilled, (state, action) => {
        state.isLoadingMyClubs = false;
        state.myClubs = action.payload;
      })
      .addCase(fetchMyClubs.rejected, (state, action) => {
        state.isLoadingMyClubs = false;
        state.error = action.payload;
      });
  },
});

// Action creators
export const {
  clearError,
  updateFilters,
  resetFilters,
  showCreateModal,
  hideCreateModal,
  showUpdateModal,
  hideUpdateModal,
  setActiveClub,
  clearActiveClub,
  setCategories,
  updateSearchSuggestions,
  optimisticJoinClub,
  optimisticLeaveClub,
} = clubsSlice.actions;

// Selectors
export const selectClubs = (state) => state.clubs;
export const selectClubsList = (state) => state.clubs.clubs;
export const selectMyClubs = (state) => state.clubs.myClubs;
export const selectActiveClub = (state) => state.clubs.activeClub;
export const selectClubsPagination = (state) => state.clubs.pagination;
export const selectClubsFilters = (state) => state.clubs.filters;
export const selectClubsLoading = (state) => state.clubs.isLoading;
export const selectClubsError = (state) => state.clubs.error;
export const selectClubCategories = (state) => state.clubs.categories;

// Complex selectors
export const selectClubBySlug = (slug) => (state) =>
  state.clubs.clubs.find(club => club.slug === slug);

export const selectUserClubRole = (clubSlug) => (state) => {
  const club = state.clubs.clubs.find(c => c.slug === clubSlug);
  return club?.user_role || null;
};

export const selectIsClubMember = (clubSlug) => (state) => {
  const club = state.clubs.clubs.find(c => c.slug === clubSlug);
  return club?.is_member || false;
};

export const selectClubsByCategory = (category) => (state) =>
  state.clubs.clubs.filter(club => club.category?.slug === category);

export default clubsSlice.reducer;
