import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { buildQueryString } from '../utils/helpers';

class ClubService {
  // Get all clubs with filtering and pagination
  async getClubs(filters = {}) {
    try {
      const {
        page = 1,
        search = '',
        category = '',
        status = 'active',
        college = '',
        sortBy = 'name',
        sortOrder = 'asc',
        limit = 20,
      } = filters;

      const params = {
        page,
        search,
        category,
        status,
        college,
        ordering: sortOrder === 'desc' ? `-${sortBy}` : sortBy,
        page_size: limit,
      };

      const response = await apiService.get(API_ENDPOINTS.CLUBS.LIST, { params });

      return {
        success: true,
        data: response.results || [],
        pagination: {
          count: response.count || 0,
          totalPages: Math.ceil((response.count || 0) / limit),
          currentPage: page,
          hasNext: !!response.next,
          hasPrevious: !!response.previous,
          next: response.next,
          previous: response.previous,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
        pagination: null,
      };
    }
  }

  // Get club details by slug
  async getClubDetails(slug) {
    try {
      const response = await apiService.get(API_ENDPOINTS.CLUBS.DETAIL(slug));

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

  // Create new club
  async createClub(clubData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.CLUBS.CREATE, {
        name: clubData.name,
        description: clubData.description,
        short_description: clubData.shortDescription,
        category: clubData.category,
        college: clubData.college,
        email: clubData.email,
        website: clubData.website,
        social_links: clubData.socialLinks,
        meeting_location: clubData.meetingLocation,
        meeting_schedule: clubData.meetingSchedule,
        is_public: clubData.isPublic !== false,
        requires_approval: clubData.requiresApproval === true,
        tags: clubData.tags || [],
        rules: clubData.rules || '',
        objectives: clubData.objectives || '',
      });

      return {
        success: true,
        data: response,
        message: 'Club created successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Update club
  async updateClub(slug, clubData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.CLUBS.UPDATE(slug), {
        name: clubData.name,
        description: clubData.description,
        short_description: clubData.shortDescription,
        category: clubData.category,
        email: clubData.email,
        website: clubData.website,
        social_links: clubData.socialLinks,
        meeting_location: clubData.meetingLocation,
        meeting_schedule: clubData.meetingSchedule,
        is_public: clubData.isPublic,
        requires_approval: clubData.requiresApproval,
        tags: clubData.tags,
        rules: clubData.rules,
        objectives: clubData.objectives,
      });

      return {
        success: true,
        data: response,
        message: 'Club updated successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Delete club
  async deleteClub(slug) {
    try {
      await apiService.delete(API_ENDPOINTS.CLUBS.DELETE(slug));

      return {
        success: true,
        message: 'Club deleted successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Join club
  async joinClub(slug, applicationMessage = '') {
    try {
      const response = await apiService.post(API_ENDPOINTS.CLUBS.JOIN(slug), {
        message: applicationMessage,
      });

      return {
        success: true,
        data: response,
        message: response.requires_approval ? 
          'Application submitted successfully!' : 
          'Successfully joined the club!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Leave club
  async leaveClub(slug) {
    try {
      const response = await apiService.post(API_ENDPOINTS.CLUBS.LEAVE(slug));

      return {
        success: true,
        data: response,
        message: 'Successfully left the club!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get club members
  async getClubMembers(slug, filters = {}) {
    try {
      const {
        page = 1,
        role = '',
        status = 'active',
        search = '',
      } = filters;

      const params = {
        page,
        role,
        status,
        search,
      };

      const response = await apiService.get(API_ENDPOINTS.CLUBS.MEMBERS(slug), { params });

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

  // Update member role
  async updateMemberRole(slug, memberId, newRole) {
    try {
      const response = await apiService.patch(
        `${API_ENDPOINTS.CLUBS.MEMBERS(slug)}${memberId}/`,
        { role: newRole }
      );

      return {
        success: true,
        data: response,
        message: 'Member role updated successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Remove member from club
  async removeMember(slug, memberId) {
    try {
      await apiService.delete(`${API_ENDPOINTS.CLUBS.MEMBERS(slug)}${memberId}/`);

      return {
        success: true,
        message: 'Member removed successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get club announcements
  async getClubAnnouncements(slug, page = 1) {
    try {
      const response = await apiService.get(API_ENDPOINTS.CLUBS.ANNOUNCEMENTS(slug), {
        params: { page }
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

  // Create club announcement
  async createAnnouncement(slug, announcementData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.CLUBS.ANNOUNCEMENTS(slug), {
        title: announcementData.title,
        content: announcementData.content,
        priority: announcementData.priority || 'normal',
        send_notification: announcementData.sendNotification !== false,
        scheduled_at: announcementData.scheduledAt,
      });

      return {
        success: true,
        data: response,
        message: 'Announcement created successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Get user's clubs
  async getMyClubs(status = 'active') {
    try {
      const response = await apiService.get(API_ENDPOINTS.CLUBS.MY_CLUBS, {
        params: { status }
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

  // Discover clubs (recommendations)
  async discoverClubs(filters = {}) {
    try {
      const {
        interests = [],
        location = '',
        exclude_joined = true,
      } = filters;

      const params = {
        interests: interests.join(','),
        location,
        exclude_joined,
      };

      const response = await apiService.get(API_ENDPOINTS.CLUBS.DISCOVER, { params });

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

  // Upload club logo
  async uploadLogo(slug, file, onProgress = null) {
    try {
      const response = await apiService.uploadFile(
        `${API_ENDPOINTS.CLUBS.DETAIL(slug)}upload-logo/`,
        file,
        {},
        onProgress
      );

      return {
        success: true,
        data: response,
        message: 'Logo uploaded successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Upload club cover image
  async uploadCoverImage(slug, file, onProgress = null) {
    try {
      const response = await apiService.uploadFile(
        `${API_ENDPOINTS.CLUBS.DETAIL(slug)}upload-cover/`,
        file,
        {},
        onProgress
      );

      return {
        success: true,
        data: response,
        message: 'Cover image uploaded successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get club categories
  async getCategories() {
    try {
      const response = await apiService.get('/api/v1/clubs/categories/');

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

  // Search clubs
  async searchClubs(query, filters = {}) {
    try {
      const searchFilters = {
        search: query,
        ...filters,
      };

      return await this.getClubs(searchFilters);
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Get club statistics
  async getClubStats(slug) {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.CLUBS.DETAIL(slug)}stats/`);

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
}

// Create singleton instance
const clubService = new ClubService();

export default clubService;
