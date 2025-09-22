import { useState, useEffect, useCallback } from 'react';
import eventService from '../services/events';
import { useDebounce } from './useDebounce';

export const useEvents = (initialFilters = {}) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    search: '',
    status: 'upcoming',
    club: '',
    eventType: '',
    sortBy: 'start_datetime',
    sortOrder: 'asc',
    limit: 20,
    ...initialFilters,
  });

  // Debounce search
  const debouncedSearchTerm = useDebounce(filters.search, 300);

  // Fetch events function
  const fetchEvents = useCallback(async (currentFilters = filters, append = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await eventService.getEvents(currentFilters);
      
      if (result.success) {
        setEvents(prevEvents => 
          append ? [...prevEvents, ...result.data] : result.data
        );
        setPagination(result.pagination);
      } else {
        setError(result.error);
        if (!append) {
          setEvents([]);
          setPagination(null);
        }
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to fetch events';
      setError(errorMessage);
      if (!append) {
        setEvents([]);
        setPagination(null);
      }
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Initial fetch and when filters change
  useEffect(() => {
    const updatedFilters = { ...filters, search: debouncedSearchTerm };
    fetchEvents(updatedFilters);
  }, [debouncedSearchTerm, filters.page, filters.status, filters.club, filters.eventType, filters.sortBy, filters.sortOrder]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1,
    }));
  }, []);

  // Load more events
  const loadMore = useCallback(async () => {
    if (!pagination?.hasNext || isLoading) return;

    const nextPageFilters = {
      ...filters,
      page: pagination.currentPage + 1,
    };

    return await fetchEvents(nextPageFilters, true);
  }, [pagination, isLoading, filters, fetchEvents]);

  // Refresh events
  const refresh = useCallback(() => {
    return fetchEvents();
  }, [fetchEvents]);

  // Search events
  const search = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm, page: 1 });
  }, [updateFilters]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      search: '',
      status: 'upcoming',
      club: '',
      eventType: '',
      sortBy: 'start_datetime',
      sortOrder: 'asc',
      limit: 20,
    });
  }, []);

  // Get specific event
  const getEvent = useCallback(async (slug) => {
    setError(null);
    
    try {
      const result = await eventService.getEventDetails(slug);
      return result;
    } catch (error) {
      const errorMessage = 'Failed to fetch event details';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Register for event
  const registerForEvent = useCallback(async (slug, registrationData = {}) => {
    setError(null);
    
    try {
      const result = await eventService.registerForEvent(slug, registrationData);
      
      if (result.success) {
        // Update events list to reflect registration
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.slug === slug
              ? { ...event, is_registered: true, total_registrations: event.total_registrations + 1 }
              : event
          )
        );
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to register for event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Unregister from event
  const unregisterFromEvent = useCallback(async (slug) => {
    setError(null);
    
    try {
      const result = await eventService.unregisterFromEvent(slug);
      
      if (result.success) {
        // Update events list to reflect unregistration
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.slug === slug
              ? { ...event, is_registered: false, total_registrations: event.total_registrations - 1 }
              : event
          )
        );
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to unregister from event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Create event
  const createEvent = useCallback(async (eventData) => {
    setError(null);
    
    try {
      const result = await eventService.createEvent(eventData);
      
      if (result.success) {
        // Add new event to the list
        setEvents(prevEvents => [result.data, ...prevEvents]);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to create event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Update event
  const updateEvent = useCallback(async (slug, eventData) => {
    setError(null);
    
    try {
      const result = await eventService.updateEvent(slug, eventData);
      
      if (result.success) {
        // Update event in the list
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.slug === slug ? { ...event, ...result.data } : event
          )
        );
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to update event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Delete event
  const deleteEvent = useCallback(async (slug) => {
    setError(null);
    
    try {
      const result = await eventService.deleteEvent(slug);
      
      if (result.success) {
        // Remove event from the list
        setEvents(prevEvents => prevEvents.filter(event => event.slug !== slug));
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to delete event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get upcoming events
  const getUpcomingEvents = useCallback(async (limit = 5) => {
    try {
      const result = await eventService.getUpcomingEvents(limit);
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to fetch upcoming events', data: [] };
    }
  }, []);

  // Check registration status
  const checkRegistrationStatus = useCallback(async (slug) => {
    try {
      const result = await eventService.checkRegistrationStatus(slug);
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to check registration status' };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Filter events by status
  const filterByStatus = useCallback((status) => {
    updateFilters({ status, page: 1 });
  }, [updateFilters]);

  // Filter events by club
  const filterByClub = useCallback((clubSlug) => {
    updateFilters({ club: clubSlug, page: 1 });
  }, [updateFilters]);

  // Filter events by type
  const filterByType = useCallback((eventType) => {
    updateFilters({ eventType, page: 1 });
  }, [updateFilters]);

  return {
    // State
    events,
    isLoading,
    error,
    pagination,
    filters,
    
    // Actions
    fetchEvents,
    updateFilters,
    loadMore,
    refresh,
    search,
    clearFilters,
    clearError,
    
    // Event operations
    getEvent,
    registerForEvent,
    unregisterFromEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getUpcomingEvents,
    checkRegistrationStatus,
    
    // Filter helpers
    filterByStatus,
    filterByClub,
    filterByType,
    
    // Computed values
    hasMore: pagination?.hasNext || false,
    totalEvents: pagination?.count || 0,
    isEmpty: events.length === 0 && !isLoading,
    upcomingEvents: events.filter(event => event.status === 'upcoming'),
    ongoingEvents: events.filter(event => event.status === 'ongoing'),
    pastEvents: events.filter(event => event.status === 'completed'),
  };
};

export default useEvents;
