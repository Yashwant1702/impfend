import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventService from '../../services/events';

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const result = await eventService.getEvents(filters);
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

export const fetchEventDetails = createAsyncThunk(
  'events/fetchEventDetails',
  async (slug, { rejectWithValue }) => {
    try {
      const result = await eventService.getEventDetails(slug);
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

export const registerForEvent = createAsyncThunk(
  'events/registerForEvent',
  async ({ slug, registrationData }, { rejectWithValue }) => {
    try {
      const result = await eventService.registerForEvent(slug, registrationData);
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

export const unregisterFromEvent = createAsyncThunk(
  'events/unregisterFromEvent',
  async (slug, { rejectWithValue }) => {
    try {
      const result = await eventService.unregisterFromEvent(slug);
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

export const fetchUpcomingEvents = createAsyncThunk(
  'events/fetchUpcomingEvents',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const result = await eventService.getUpcomingEvents(limit);
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
  // Event lists
  events: [],
  upcomingEvents: [],
  myEvents: [],
  
  // Current active event
  activeEvent: null,
  
  // Pagination
  pagination: {
    count: 0,
    totalPages: 0,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
  },
  
  // Filters - exact mapping to Django backend filters
  filters: {
    page: 1,
    search: '',
    status: 'upcoming', // upcoming, ongoing, completed, cancelled
    club: '',
    event_type: '', // workshop, seminar, competition, social, cultural, sports, academic, other
    start_date: '',
    end_date: '',
    location: '',
    is_online: '', // true, false, empty for both
    is_free: '', // true, false, empty for both
    sortBy: 'start_datetime',
    sortOrder: 'asc',
    limit: 20,
  },
  
  // Loading states
  isLoading: false,
  isLoadingMore: false,
  isLoadingDetails: false,
  isLoadingUpcoming: false,
  isRegistering: false,
  isUnregistering: false,
  isCreating: false,
  isUpdating: false,
  
  // Error states
  error: null,
  registrationError: null,
  unregistrationError: null,
  createError: null,
  updateError: null,
  validationErrors: {},
  
  // UI states
  showCreateModal: false,
  showUpdateModal: false,
  showRegistrationModal: false,
  selectedEventForEdit: null,
  selectedEventForRegistration: null,
  
  // Event types cache
  eventTypes: [],
  
  // Registration status cache
  registrationStatuses: {},
  
  // Last updated timestamp
  lastUpdated: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.registrationError = null;
      state.unregistrationError = null;
      state.createError = null;
      state.updateError = null;
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
        status: 'upcoming',
        club: '',
        event_type: '',
        start_date: '',
        end_date: '',
        location: '',
        is_online: '',
        is_free: '',
        sortBy: 'start_datetime',
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
      state.selectedEventForEdit = action.payload;
    },
    
    hideUpdateModal: (state) => {
      state.showUpdateModal = false;
      state.selectedEventForEdit = null;
      state.updateError = null;
      state.validationErrors = {};
    },
    
    showRegistrationModal: (state, action) => {
      state.showRegistrationModal = true;
      state.selectedEventForRegistration = action.payload;
    },
    
    hideRegistrationModal: (state) => {
      state.showRegistrationModal = false;
      state.selectedEventForRegistration = null;
      state.registrationError = null;
    },
    
    // Set active event
    setActiveEvent: (state, action) => {
      state.activeEvent = action.payload;
    },
    
    // Clear active event
    clearActiveEvent: (state) => {
      state.activeEvent = null;
    },
    
    // Set event types
    setEventTypes: (state, action) => {
      state.eventTypes = action.payload;
    },
    
    // Update registration status
    updateRegistrationStatus: (state, action) => {
      const { eventSlug, status } = action.payload;
      state.registrationStatuses[eventSlug] = status;
    },
    
    // Optimistic updates for registration
    optimisticRegisterEvent: (state, action) => {
      const { slug } = action.payload;
      state.events = state.events.map(event =>
        event.slug === slug
          ? { 
              ...event, 
              is_registered: true, 
              total_registrations: event.total_registrations + 1,
              available_spots: event.max_attendees ? event.available_spots - 1 : event.available_spots
            }
          : event
      );
      
      if (state.activeEvent && state.activeEvent.slug === slug) {
        state.activeEvent = {
          ...state.activeEvent,
          is_registered: true,
          total_registrations: state.activeEvent.total_registrations + 1,
          available_spots: state.activeEvent.max_attendees ? state.activeEvent.available_spots - 1 : state.activeEvent.available_spots
        };
      }
    },
    
    optimisticUnregisterEvent: (state, action) => {
      const { slug } = action.payload;
      state.events = state.events.map(event =>
        event.slug === slug
          ? { 
              ...event, 
              is_registered: false, 
              total_registrations: event.total_registrations - 1,
              available_spots: event.max_attendees ? event.available_spots + 1 : event.available_spots
            }
          : event
      );
      
      if (state.activeEvent && state.activeEvent.slug === slug) {
        state.activeEvent = {
          ...state.activeEvent,
          is_registered: false,
          total_registrations: state.activeEvent.total_registrations - 1,
          available_spots: state.activeEvent.max_attendees ? state.activeEvent.available_spots + 1 : state.activeEvent.available_spots
        };
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state, action) => {
        const isLoadMore = action.meta.arg?.page > 1;
        if (isLoadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        
        const { data, pagination } = action.payload;
        const isLoadMore = pagination.currentPage > 1;
        
        if (isLoadMore) {
          state.events = [...state.events, ...data];
        } else {
          state.events = data;
        }
        
        state.pagination = pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.payload;
      })
      
      // Fetch event details
      .addCase(fetchEventDetails.pending, (state) => {
        state.isLoadingDetails = true;
        state.error = null;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.activeEvent = action.payload;
        
        // Update the event in the list if it exists
        const eventIndex = state.events.findIndex(event => event.slug === action.payload.slug);
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.payload;
      })
      
      // Register for event
      .addCase(registerForEvent.pending, (state) => {
        state.isRegistering = true;
        state.registrationError = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.showRegistrationModal = false;
        
        const { slug } = action.payload;
        
        // Update in events list
        state.events = state.events.map(event =>
          event.slug === slug
            ? { 
                ...event, 
                is_registered: true, 
                total_registrations: event.total_registrations + 1,
                available_spots: event.max_attendees ? event.available_spots - 1 : event.available_spots
              }
            : event
        );
        
        // Update active event
        if (state.activeEvent && state.activeEvent.slug === slug) {
          state.activeEvent = {
            ...state.activeEvent,
            is_registered: true,
            total_registrations: state.activeEvent.total_registrations + 1,
            available_spots: state.activeEvent.max_attendees ? state.activeEvent.available_spots - 1 : state.activeEvent.available_spots
          };
        }
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.isRegistering = false;
        state.registrationError = action.payload;
      })
      
      // Unregister from event
      .addCase(unregisterFromEvent.pending, (state) => {
        state.isUnregistering = true;
        state.unregistrationError = null;
      })
      .addCase(unregisterFromEvent.fulfilled, (state, action) => {
        state.isUnregistering = false;
        
        const { slug } = action.payload;
        
        // Update in events list
        state.events = state.events.map(event =>
          event.slug === slug
            ? { 
                ...event, 
                is_registered: false, 
                total_registrations: event.total_registrations - 1,
                available_spots: event.max_attendees ? event.available_spots + 1 : event.available_spots
              }
            : event
        );
        
        // Update active event
        if (state.activeEvent && state.activeEvent.slug === slug) {
          state.activeEvent = {
            ...state.activeEvent,
            is_registered: false,
            total_registrations: state.activeEvent.total_registrations - 1,
            available_spots: state.activeEvent.max_attendees ? state.activeEvent.available_spots + 1 : state.activeEvent.available_spots
          };
        }
      })
      .addCase(unregisterFromEvent.rejected, (state, action) => {
        state.isUnregistering = false;
        state.unregistrationError = action.payload;
      })
      
      // Fetch upcoming events
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.isLoadingUpcoming = true;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.isLoadingUpcoming = false;
        state.upcomingEvents = action.payload;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.isLoadingUpcoming = false;
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
  showRegistrationModal,
  hideRegistrationModal,
  setActiveEvent,
  clearActiveEvent,
  setEventTypes,
  updateRegistrationStatus,
  optimisticRegisterEvent,
  optimisticUnregisterEvent,
} = eventsSlice.actions;

// Selectors
export const selectEvents = (state) => state.events;
export const selectEventsList = (state) => state.events.events;
export const selectUpcomingEvents = (state) => state.events.upcomingEvents;
export const selectActiveEvent = (state) => state.events.activeEvent;
export const selectEventsPagination = (state) => state.events.pagination;
export const selectEventsFilters = (state) => state.events.filters;
export const selectEventsLoading = (state) => state.events.isLoading;
export const selectEventsError = (state) => state.events.error;
export const selectEventTypes = (state) => state.events.eventTypes;

// Complex selectors
export const selectEventBySlug = (slug) => (state) =>
  state.events.events.find(event => event.slug === slug);

export const selectIsEventRegistered = (eventSlug) => (state) => {
  const event = state.events.events.find(e => e.slug === eventSlug);
  return event?.is_registered || false;
};

export const selectEventsByStatus = (status) => (state) =>
  state.events.events.filter(event => event.status === status);

export const selectEventsByClub = (clubSlug) => (state) =>
  state.events.events.filter(event => event.club?.slug === clubSlug);

export const selectEventsByType = (eventType) => (state) =>
  state.events.events.filter(event => event.event_type === eventType);

export default eventsSlice.reducer;
