import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

class EventService {
  // Get all events with filtering and pagination
  async getEvents(filters = {}) {
    try {
      const {
        page = 1,
        search = '',
        status = 'upcoming',
        club = '',
        eventType = '',
        startDate = '',
        endDate = '',
        location = '',
        sortBy = 'start_datetime',
        sortOrder = 'asc',
        limit = 20,
        isOnline = '',
        isFree = '',
      } = filters;

      const params = {
        page,
        search,
        status,
        club,
        event_type: eventType,
        start_date: startDate,
        end_date: endDate,
        location,
        ordering: sortOrder === 'desc' ? `-${sortBy}` : sortBy,
        page_size: limit,
        is_online: isOnline,
        is_free: isFree,
      };

      const response = await apiService.get(API_ENDPOINTS.EVENTS.LIST, { params });

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

  // Get event details by slug
  async getEventDetails(slug) {
    try {
      const response = await apiService.get(API_ENDPOINTS.EVENTS.DETAIL(slug));

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

  // Create new event
  async createEvent(eventData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.EVENTS.CREATE, {
        title: eventData.title,
        description: eventData.description,
        short_description: eventData.shortDescription,
        event_type: eventData.eventType,
        club: eventData.clubId,
        start_datetime: eventData.startDateTime,
        end_datetime: eventData.endDateTime,
        location: eventData.location,
        address: eventData.address,
        is_online: eventData.isOnline || false,
        online_link: eventData.onlineLink,
        max_attendees: eventData.maxAttendees,
        registration_required: eventData.registrationRequired !== false,
        registration_deadline: eventData.registrationDeadline,
        registration_fee: eventData.registrationFee || 0,
        is_free: eventData.isFree !== false,
        tags: eventData.tags || [],
        requirements: eventData.requirements || '',
        agenda: eventData.agenda || '',
        contact_email: eventData.contactEmail,
        contact_phone: eventData.contactPhone,
        is_public: eventData.isPublic !== false,
        allow_guests: eventData.allowGuests === true,
      });

      return {
        success: true,
        data: response,
        message: 'Event created successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Update event
  async updateEvent(slug, eventData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.EVENTS.UPDATE(slug), {
        title: eventData.title,
        description: eventData.description,
        short_description: eventData.shortDescription,
        event_type: eventData.eventType,
        start_datetime: eventData.startDateTime,
        end_datetime: eventData.endDateTime,
        location: eventData.location,
        address: eventData.address,
        is_online: eventData.isOnline,
        online_link: eventData.onlineLink,
        max_attendees: eventData.maxAttendees,
        registration_required: eventData.registrationRequired,
        registration_deadline: eventData.registrationDeadline,
        registration_fee: eventData.registrationFee,
        is_free: eventData.isFree,
        tags: eventData.tags,
        requirements: eventData.requirements,
        agenda: eventData.agenda,
        contact_email: eventData.contactEmail,
        contact_phone: eventData.contactPhone,
        is_public: eventData.isPublic,
        allow_guests: eventData.allowGuests,
      });

      return {
        success: true,
        data: response,
        message: 'Event updated successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Delete event
  async deleteEvent(slug) {
    try {
      await apiService.delete(API_ENDPOINTS.EVENTS.DELETE(slug));

      return {
        success: true,
        message: 'Event deleted successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Register for event
  async registerForEvent(slug, registrationData = {}) {
    try {
      const response = await apiService.post(API_ENDPOINTS.EVENTS.REGISTER(slug), {
        guest_name: registrationData.guestName,
        guest_email: registrationData.guestEmail,
        special_requirements: registrationData.specialRequirements,
        dietary_restrictions: registrationData.dietaryRestrictions,
        emergency_contact: registrationData.emergencyContact,
        additional_info: registrationData.additionalInfo,
      });

      return {
        success: true,
        data: response,
        message: 'Successfully registered for the event!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        validationErrors: error.getValidationErrors(),
      };
    }
  }

  // Unregister from event
  async unregisterFromEvent(slug) {
    try {
      const response = await apiService.post(API_ENDPOINTS.EVENTS.UNREGISTER(slug));

      return {
        success: true,
        data: response,
        message: 'Successfully unregistered from the event!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get event attendees
  async getEventAttendees(slug, filters = {}) {
    try {
      const {
        page = 1,
        status = 'registered',
        search = '',
      } = filters;

      const params = {
        page,
        status,
        search,
      };

      const response = await apiService.get(API_ENDPOINTS.EVENTS.ATTENDEES(slug), { params });

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

  // Update attendee status
  async updateAttendeeStatus(slug, attendeeId, status) {
    try {
      const response = await apiService.patch(
        `${API_ENDPOINTS.EVENTS.ATTENDEES(slug)}${attendeeId}/`,
        { status }
      );

      return {
        success: true,
        data: response,
        message: 'Attendee status updated successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get user's events
  async getMyEvents(status = 'upcoming') {
    try {
      const response = await apiService.get(API_ENDPOINTS.EVENTS.MY_EVENTS, {
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

  // Get upcoming events
  async getUpcomingEvents(limit = 10) {
    try {
      const response = await apiService.get(API_ENDPOINTS.EVENTS.UPCOMING, {
        params: { limit }
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

  // Upload event featured image
  async uploadFeaturedImage(slug, file, onProgress = null) {
    try {
      const response = await apiService.uploadFile(
        `${API_ENDPOINTS.EVENTS.DETAIL(slug)}upload-image/`,
        file,
        {},
        onProgress
      );

      return {
        success: true,
        data: response,
        message: 'Featured image uploaded successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Get event types
  async getEventTypes() {
    try {
      const response = await apiService.get('/api/v1/events/types/');

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

  // Search events
  async searchEvents(query, filters = {}) {
    try {
      const searchFilters = {
        search: query,
        ...filters,
      };

      return await this.getEvents(searchFilters);
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: [],
      };
    }
  }

  // Get event statistics
  async getEventStats(slug) {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.EVENTS.DETAIL(slug)}stats/`);

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

  // Check event registration status
  async checkRegistrationStatus(slug) {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.EVENTS.DETAIL(slug)}registration-status/`);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
        data: { is_registered: false },
      };
    }
  }

  // Export attendee list
  async exportAttendees(slug, format = 'csv') {
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.EVENTS.ATTENDEES(slug)}export/`,
        {
          params: { format },
          headers: {
            'Accept': format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        }
      );

      return {
        success: true,
        data: response,
        message: 'Attendee list exported successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.getUserMessage(),
      };
    }
  }

  // Send event reminder
  async sendEventReminder(slug, message = '') {
    try {
      const response = await apiService.post(
        `${API_ENDPOINTS.EVENTS.DETAIL(slug)}send-reminder/`,
        { message }
      );

      return {
        success: true,
        data: response,
        message: 'Event reminder sent successfully!',
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
const eventService = new EventService();

export default eventService;
