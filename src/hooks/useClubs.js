import { useState, useEffect, useCallback } from 'react';
import clubService from '../services/clubs';
import { useDebounce } from './useDebounce';

export const useClubs = (initialFilters = {}) => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    search: '',
    category: '',
    status: 'active',
    sortBy: 'name',
    sortOrder: 'asc',
    limit: 20,
    ...initialFilters,
  });

  // Debounce search to avoid too many API calls
  const debouncedSearchTerm = useDebounce(filters.search, 300);

  // Fetch clubs function
  const fetchClubs = useCallback(async (currentFilters = filters, append = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await clubService.getClubs(currentFilters);
      
      if (result.success) {
        setClubs(prevClubs => 
          append ? [...prevClubs, ...result.data] : result.data
        );
        setPagination(result.pagination);
      } else {
        setError(result.error);
        if (!append) {
          setClubs([]);
          setPagination(null);
        }
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to fetch clubs';
      setError(errorMessage);
      if (!append) {
        setClubs([]);
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
    fetchClubs(updatedFilters);
  }, [debouncedSearchTerm, filters.page, filters.category, filters.status, filters.sortBy, filters.sortOrder]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Reset page unless explicitly provided
    }));
  }, []);

  // Load more clubs (for infinite scroll)
  const loadMore = useCallback(async () => {
    if (!pagination?.hasNext || isLoading) return;

    const nextPageFilters = {
      ...filters,
      page: pagination.currentPage + 1,
    };

    return await fetchClubs(nextPageFilters, true);
  }, [pagination, isLoading, filters, fetchClubs]);

  // Refresh clubs
  const refresh = useCallback(() => {
    return fetchClubs();
  }, [fetchClubs]);

  // Search clubs
  const search = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm, page: 1 });
  }, [updateFilters]);

  // Clear search and filters
  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      search: '',
      category: '',
      status: 'active',
      sortBy: 'name',
      sortOrder: 'asc',
      limit: 20,
    });
  }, []);

  // Get specific club by slug
  const getClub = useCallback(async (slug) => {
    setError(null);
    
    try {
      const result = await clubService.getClubDetails(slug);
      return result;
    } catch (error) {
      const errorMessage = 'Failed to fetch club details';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Join club
  const joinClub = useCallback(async (slug, applicationMessage = '') => {
    setError(null);
    
    try {
      const result = await clubService.joinClub(slug, applicationMessage);
      
      if (result.success) {
        // Update clubs list to reflect membership change
        setClubs(prevClubs =>
          prevClubs.map(club =>
            club.slug === slug
              ? { ...club, is_member: true, member_count: club.member_count + 1 }
              : club
          )
        );
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to join club';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Leave club
  const leaveClub = useCallback(async (slug) => {
    setError(null);
    
    try {
      const result = await clubService.leaveClub(slug);
      
      if (result.success) {
        // Update clubs list to reflect membership change
        setClubs(prevClubs =>
          prevClubs.map(club =>
            club.slug === slug
              ? { ...club, is_member: false, member_count: club.member_count - 1 }
              : club
          )
        );
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to leave club';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Create club
  const createClub = useCallback(async (clubData) => {
    setError(null);
    
    try {
      const result = await clubService.createClub(clubData);
      
      if (result.success) {
        // Add new club to the list
        setClubs(prevClubs => [result.data, ...prevClubs]);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to create club';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Update club
  const updateClub = useCallback(async (slug, clubData) => {
    setError(null);
    
    try {
      const result = await clubService.updateClub(slug, clubData);
      
      if (result.success) {
        // Update club in the list
        setClubs(prevClubs =>
          prevClubs.map(club =>
            club.slug === slug ? { ...club, ...result.data } : club
          )
        );
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to update club';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Delete club
  const deleteClub = useCallback(async (slug) => {
    setError(null);
    
    try {
      const result = await clubService.deleteClub(slug);
      
      if (result.success) {
        // Remove club from the list
        setClubs(prevClubs => prevClubs.filter(club => club.slug !== slug));
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to delete club';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    clubs,
    isLoading,
    error,
    pagination,
    filters,
    
    // Actions
    fetchClubs,
    updateFilters,
    loadMore,
    refresh,
    search,
    clearFilters,
    clearError,
    
    // Club operations
    getClub,
    joinClub,
    leaveClub,
    createClub,
    updateClub,
    deleteClub,
    
    // Computed values
    hasMore: pagination?.hasNext || false,
    totalClubs: pagination?.count || 0,
    isEmpty: clubs.length === 0 && !isLoading,
  };
};

export default useClubs;
