import React, { useState } from 'react';
import { useEvents } from '../../../hooks/useEvents';
import EventCard from '../EventCard';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import SearchBar from '../../common/SearchBar';
import { ComponentLoading, SkeletonLoading } from '../../common/Loading';
import { eventListStyles } from './EventList.styles';

const EventList = ({
  initialFilters = {},
  showSearch = true,
  showFilters = true,
  showCreateButton = true,
  onEventClick,
  onEventRegister,
  onEventUnregister,
  onEventEdit,
  onEventDelete,
  onCreateClick,
  className = '',
}) => {
  const {
    events,
    isLoading,
    isLoadingMore,
    error,
    filters,
    pagination,
    hasMore,
    updateFilters,
    loadMore,
    refresh,
    registerForEvent,
    unregisterFromEvent,
  } = useEvents(initialFilters);

  const [loadingEventId, setLoadingEventId] = useState(null);
  
  const listClasses = [
    eventListStyles.container,
    className,
  ].filter(Boolean).join(' ');

  // Handle search
  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm, page: 1 });
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    updateFilters({ [filterName]: value, page: 1 });
  };

  // Handle event registration
  const handleEventRegister = async (event) => {
    if (onEventRegister) {
      onEventRegister(event);
      return;
    }

    setLoadingEventId(event.id);
    try {
      await registerForEvent(event.slug);
    } catch (error) {
      console.error('Failed to register for event:', error);
    } finally {
      setLoadingEventId(null);
    }
  };

  // Handle event unregistration
  const handleEventUnregister = async (event) => {
    if (onEventUnregister) {
      onEventUnregister(event);
      return;
    }

    setLoadingEventId(event.id);
    try {
      await unregisterFromEvent(event.slug);
    } catch (error) {
      console.error('Failed to unregister from event:', error);
    } finally {
      setLoadingEventId(null);
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  };

  // Filter options
  const eventTypes = [
    { value: '', label: 'All Types' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'competition', label: 'Competition' },
    { value: 'social', label: 'Social' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'academic', label: 'Academic' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'all', label: 'All Events' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
  ];

  const sortOptions = [
    { value: 'start_datetime', label: 'Date (Earliest)' },
    { value: '-start_datetime', label: 'Date (Latest)' },
    { value: 'title', label: 'Title A-Z' },
    { value: '-title', label: 'Title Z-A' },
    { value: '-registered_count', label: 'Most Popular' },
    { value: 'registration_fee', label: 'Price (Low to High)' },
  ];

  const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const RefreshIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div className={listClasses}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Campus Events</h1>
            <p className="text-gray-600">
              Discover exciting events happening on campus
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <NeomorphicButton
              variant="secondary"
              size="small"
              onClick={refresh}
              icon={<RefreshIcon />}
              disabled={isLoading}
            >
              Refresh
            </NeomorphicButton>

            {showCreateButton && (
              <NeomorphicButton
                variant="primary"
                size="medium"
                onClick={onCreateClick}
                icon={<PlusIcon />}
              >
                Create Event
              </NeomorphicButton>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <NeomorphicCard className="p-4">
          <div className="space-y-4">
            {showSearch && (
              <SearchBar
                placeholder="Search events by title, description, or organizer..."
                value={filters.search}
                onChange={handleSearch}
                fullWidth
              />
            )}

            {showFilters && (
              <div className="flex flex-wrap gap-4">
                {/* Event Type Filter */}
                <div className="flex-1 min-w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={filters.event_type}
                    onChange={(e) => handleFilterChange('event_type', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border-none rounded-lg shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200"
                  >
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex-1 min-w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border-none rounded-lg shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div className="flex-1 min-w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border-none rounded-lg shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200"
                  />
                </div>

                {/* Sort Filter */}
                <div className="flex-1 min-w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border-none rounded-lg shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('is_free', filters.is_free === 'true' ? '' : 'true')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  filters.is_free === 'true'
                    ? 'bg-green-100 text-green-800 shadow-[inset_2px_2px_4px_#a7c7a7,inset_-2px_-2px_4px_#d3f2d3]'
                    : 'bg-gray-100 text-gray-600 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff] hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                }`}
              >
                Free Events
              </button>
              
              <button
                onClick={() => handleFilterChange('is_online', filters.is_online === 'true' ? '' : 'true')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  filters.is_online === 'true'
                    ? 'bg-blue-100 text-blue-800 shadow-[inset_2px_2px_4px_#a7c7d4,inset_-2px_-2px_4px_#d3f2ff]'
                    : 'bg-gray-100 text-gray-600 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff] hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                }`}
              >
                Online Events
              </button>
              
              <button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  handleFilterChange('start_date', filters.start_date === today ? '' : today);
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  filters.start_date === new Date().toISOString().split('T')[0]
                    ? 'bg-purple-100 text-purple-800 shadow-[inset_2px_2px_4px_#c7a7d4,inset_-2px_-2px_4px_#f2d3ff]'
                    : 'bg-gray-100 text-gray-600 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff] hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                }`}
              >
                Today's Events
              </button>
            </div>
          </div>
        </NeomorphicCard>
      </div>

      {/* Results Summary */}
      {!isLoading && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {pagination.count ? `${pagination.count} events found` : 'No events found'}
          </p>
          
          {(filters.search || filters.event_type || filters.start_date || filters.is_free || filters.is_online) && (
            <button
              onClick={() => updateFilters({ 
                search: '', 
                event_type: '', 
                start_date: '', 
                is_free: '', 
                is_online: '', 
                page: 1 
              })}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <NeomorphicCard className="p-6 text-center">
          <div className="text-red-600 mb-4">
            <CalendarIcon />
            <p className="text-lg font-medium">Something went wrong</p>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <NeomorphicButton variant="primary" onClick={refresh}>
            Try Again
          </NeomorphicButton>
        </NeomorphicCard>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="w-full">
              <SkeletonLoading />
            </div>
          ))}
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && !error && (
        <>
          {events.length === 0 ? (
            <NeomorphicCard className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <CalendarIcon />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No events found</h3>
                <p className="text-gray-500 mb-4">
                  {filters.search || filters.event_type || filters.start_date
                    ? 'Try adjusting your search terms or filters'
                    : 'Be the first to create an event for your community'
                  }
                </p>
                {showCreateButton && (
                  <NeomorphicButton
                    variant="primary"
                    onClick={onCreateClick}
                    icon={<PlusIcon />}
                  >
                    Create First Event
                  </NeomorphicButton>
                )}
              </div>
            </NeomorphicCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onView={() => onEventClick && onEventClick(event)}
                  onRegister={() => handleEventRegister(event)}
                  onUnregister={() => handleEventUnregister(event)}
                  onEdit={() => onEventEdit && onEventEdit(event)}
                  onDelete={() => onEventDelete && onEventDelete(event)}
                  isLoading={loadingEventId === event.id}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <NeomorphicButton
                variant="secondary"
                size="large"
                onClick={handleLoadMore}
                loading={isLoadingMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading...' : 'Load More Events'}
              </NeomorphicButton>
            </div>
          )}

          {/* End of Results */}
          {!hasMore && events.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-500">You've reached the end of the list</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventList;
