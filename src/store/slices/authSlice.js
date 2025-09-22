import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth';
import storage from '../../utils/storage';

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      const result = await authService.login(email, password, rememberMe);
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

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        return result;
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

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.getProfile();
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

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const result = await authService.updateProfile(profileData);
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

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      // Even if logout fails, clear local state
      return null;
    }
  }
);

// Initial state matching exact Django backend user model
const initialState = {
  // User data - exact field mapping from Django backend
  user: null,
  
  // Authentication status
  isAuthenticated: false,
  
  // Loading states
  isLoading: false,
  isRegistering: false,
  isUpdatingProfile: false,
  
  // Error states
  error: null,
  registrationError: null,
  profileUpdateError: null,
  validationErrors: {},
  
  // Authentication tokens (not stored in Redux for security)
  tokenExpiry: null,
  
  // UI states
  showLoginModal: false,
  showRegistrationModal: false,
  
  // Permissions cache
  permissions: [],
  
  // Last login timestamp
  lastLoginAt: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.registrationError = null;
      state.profileUpdateError = null;
      state.validationErrors = {};
    },
    
    // Clear all auth data
    clearAuthData: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.permissions = [];
      state.error = null;
      state.validationErrors = {};
      state.tokenExpiry = null;
      state.lastLoginAt = null;
    },
    
    // Set user data (for initialization from storage)
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        state.permissions = authService.getUserPermissions();
      }
    },
    
    // UI actions
    showLoginModal: (state) => {
      state.showLoginModal = true;
    },
    
    hideLoginModal: (state) => {
      state.showLoginModal = false;
    },
    
    showRegistrationModal: (state) => {
      state.showRegistrationModal = true;
    },
    
    hideRegistrationModal: (state) => {
      state.showRegistrationModal = false;
    },
    
    // Update token expiry
    setTokenExpiry: (state, action) => {
      state.tokenExpiry = action.payload;
    },
    
    // Update permissions
    updatePermissions: (state) => {
      state.permissions = authService.getUserPermissions();
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.permissions = authService.getUserPermissions();
        state.lastLoginAt = new Date().toISOString();
        state.showLoginModal = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.isRegistering = true;
        state.registrationError = null;
        state.validationErrors = {};
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.showRegistrationModal = false;
        // Don't auto-login after registration, user needs to verify email
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegistering = false;
        state.registrationError = action.payload?.message || 'Registration failed';
        state.validationErrors = action.payload?.validationErrors || {};
      })
      
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.permissions = authService.getUserPermissions();
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Don't clear auth on profile fetch failure
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdatingProfile = true;
        state.profileUpdateError = null;
        state.validationErrors = {};
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.profileUpdateError = action.payload?.message || 'Profile update failed';
        state.validationErrors = action.payload?.validationErrors || {};
      })
      
      // Logout user
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.error = null;
        state.validationErrors = {};
        state.tokenExpiry = null;
        state.lastLoginAt = null;
        state.isLoading = false;
        state.showLoginModal = false;
        state.showRegistrationModal = false;
      });
  },
});

// Action creators
export const {
  clearError,
  clearAuthData,
  setUser,
  showLoginModal,
  hideLoginModal,
  showRegistrationModal,
  hideRegistrationModal,
  setTokenExpiry,
  updatePermissions,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectPermissions = (state) => state.auth.permissions;
export const selectUserType = (state) => state.auth.user?.user_type;
export const selectUserId = (state) => state.auth.user?.id;
export const selectUserEmail = (state) => state.auth.user?.email;
export const selectUserName = (state) => state.auth.user?.full_name;
export const selectUserAvatar = (state) => state.auth.user?.avatar;
export const selectUserCollege = (state) => state.auth.user?.college;
export const selectValidationErrors = (state) => state.auth.validationErrors;

// Complex selectors
export const selectIsStudent = (state) => state.auth.user?.user_type === 'student';
export const selectIsFaculty = (state) => state.auth.user?.user_type === 'faculty';
export const selectIsCollegeAdmin = (state) => state.auth.user?.user_type === 'college_admin';

export const selectHasPermission = (permission) => (state) => 
  state.auth.permissions.includes(permission);

export const selectCanCreateClub = (state) => 
  state.auth.permissions.includes('create_clubs');

export const selectCanManageClubs = (state) => 
  state.auth.permissions.includes('manage_clubs');

export default authSlice.reducer;
