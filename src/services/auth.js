import apiService, { APIError } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import storage from '../utils/storage';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  // User registration
  async register(userData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, {
        email: userData.email,
        full_name: userData.fullName,
        password: userData.password,
        password_confirm: userData.confirmPassword,
        user_type: userData.userType || 'student',
        college_name: userData.collegeName,
        phone_number: userData.phoneNumber,
        bio: userData.bio,
      });

      return {
        success: true,
        data: response,
        message: 'Registration successful! Please check your email for verification.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // User login
  async login(email, password, rememberMe = false) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.access_token) {
        // Store tokens
        storage.setAuthTokens(response.access_token, response.refresh_token);
        
        // Store user data
        if (response.user) {
          storage.setUserData(response.user);
          this.currentUser = response.user;
        }

        this.isAuthenticated = true;

        return {
          success: true,
          data: response,
          user: response.user,
          message: 'Login successful!',
        };
      }

      return {
        success: false,
        error: 'Invalid response from server',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // User logout
  async logout() {
    try {
      // Call logout endpoint if available
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Logout endpoint failed:', error.message);
    } finally {
      // Clear local data regardless of API call success
      storage.clearAuthTokens();
      storage.clearUserData();
      this.currentUser = null;
      this.isAuthenticated = false;
      
      // Redirect to login
      window.location.href = '/login';
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await apiService.get(API_ENDPOINTS.AUTH.PROFILE);
      
      if (response) {
        storage.setUserData(response);
        this.currentUser = response;
        return {
          success: true,
          data: response,
        };
      }

      return {
        success: false,
        error: 'Failed to fetch profile',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
        full_name: profileData.fullName,
        bio: profileData.bio,
        phone_number: profileData.phoneNumber,
        avatar: profileData.avatar,
        social_links: profileData.socialLinks,
        skills: profileData.skills,
        interests: profileData.interests,
      });

      if (response) {
        storage.setUserData(response);
        this.currentUser = response;
        
        return {
          success: true,
          data: response,
          message: 'Profile updated successfully!',
        };
      }

      return {
        success: false,
        error: 'Failed to update profile',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Change password
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        old_password: oldPassword,
        new_password: newPassword,
      });

      return {
        success: true,
        data: response,
        message: 'Password changed successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Check if email exists
  async checkEmail(email) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.CHECK_EMAIL, {
        email,
      });

      return {
        success: true,
        exists: response.exists,
        isCollegeEmail: response.is_college_email,
        collegeName: response.college_name,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get available colleges
  async getColleges(searchTerm = '') {
    try {
      const response = await apiService.get(API_ENDPOINTS.AUTH.COLLEGES, {
        params: searchTerm ? { search: searchTerm } : {},
      });

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

  // Upload avatar
  async uploadAvatar(file, onProgress = null) {
    try {
      const response = await apiService.uploadFile(
        `${API_ENDPOINTS.AUTH.UPDATE_PROFILE}avatar/`,
        file,
        {},
        onProgress
      );

      if (response) {
        // Update stored user data with new avatar
        const currentUserData = storage.getUserData();
        if (currentUserData) {
          currentUserData.avatar = response.avatar;
          storage.setUserData(currentUserData);
          this.currentUser = currentUserData;
        }

        return {
          success: true,
          data: response,
          message: 'Avatar updated successfully!',
        };
      }

      return {
        success: false,
        error: 'Failed to upload avatar',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST, {
        email,
      });

      return {
        success: true,
        data: response,
        message: 'Password reset email sent successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
        token,
        new_password: newPassword,
      });

      return {
        success: true,
        data: response,
        message: 'Password reset successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
        token,
      });

      return {
        success: true,
        data: response,
        message: 'Email verified successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Resend verification email
  async resendVerificationEmail(email) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
        email,
      });

      return {
        success: true,
        data: response,
        message: 'Verification email sent successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Check authentication status
  isLoggedIn() {
    return storage.isLoggedIn() && !!storage.getAccessToken();
  }

  // Get current user from storage
  getCurrentUser() {
    if (!this.currentUser) {
      this.currentUser = storage.getUserData();
    }
    return this.currentUser;
  }

  // Initialize auth state from storage
  initializeAuth() {
    if (this.isLoggedIn()) {
      this.currentUser = storage.getUserData();
      this.isAuthenticated = true;
    }
  }

  // Get user permissions
  getUserPermissions() {
    const user = this.getCurrentUser();
    if (!user) return [];

    const permissions = [];
    
    // Base permissions for all authenticated users
    permissions.push('view_profile', 'update_profile', 'join_clubs', 'view_events');

    // Role-based permissions
    switch (user.user_type) {
      case 'student':
        permissions.push('register_events', 'create_clubs');
        break;
      case 'faculty':
        permissions.push('create_clubs', 'moderate_clubs', 'create_events');
        break;
      case 'college_admin':
        permissions.push('manage_colleges', 'manage_users', 'manage_clubs', 'view_analytics');
        break;
    }

    return permissions;
  }

  // Check if user has specific permission
  hasPermission(permission) {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }

  // Check if user can perform action
  canPerformAction(action, resource = null) {
    const user = this.getCurrentUser();
    if (!user) return false;

    switch (action) {
      case 'create_club':
        return this.hasPermission('create_clubs');
      case 'edit_club':
        return resource && (
          resource.created_by === user.id ||
          this.hasPermission('moderate_clubs')
        );
      case 'delete_club':
        return resource && (
          resource.created_by === user.id ||
          this.hasPermission('manage_clubs')
        );
      case 'create_event':
        return this.hasPermission('create_events') || 
               (resource && resource.is_member);
      default:
        return false;
    }
  }
}

// Create singleton instance
const authService = new AuthService();

// Initialize auth state on import
authService.initializeAuth();

export default authService;
