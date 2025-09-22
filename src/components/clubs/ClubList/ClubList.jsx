import React, { useState, useEffect } from 'react';
import { useClubs } from '../../../hooks/useClubs';
import ClubCard from '../ClubCard';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import SearchBar from '../../common/SearchBar';
import { ComponentLoading, SkeletonLoading } from '../../common/Loading';
import { clubListStyles } from './ClubList.styles';

const ClubList = ({
  initialFilters = {},
  showSearch = true,
  showFilters = true,
  showCreateButton = true,
  onClubClick,
  onClubJoin,
  onClubLeave,
  onClubEdit,
  onClubDelete,
  onCreateClick,
  className = '',
}) => {
  const {
    clubs,
    isLoading,
    isLoadingMore,
    error,
    filters,
    pagination,
    hasMore,
    updateFilters,
    loadMore,
    refresh,
    joinClub,
    leaveClub,
  } = useClubs(initialFilters);

  const [loadingClubId, setLoadingClubId] = useState(null);
  
  const listClasses = [
    clubListStyles.container,
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

  // Handle club join
  const handleClubJoin = async (club) => {
    if (onClubJoin) {
      onClubJoin(club);
      return;
    }

    setLoadingClubId(club.id);
    try {
      await joinClub(club.slug);
    } catch (error) {
      console.error('Failed to join club:', error);
    } finally {
      setLoadingClubId(null);
    }
  };

  // Handle club leave
  const handleClubLeave = async (club) => {
    if (onClubLeave) {
      onClubLeave(club);
      return;
    }

    setLoadingClubId(club.id);
    try {
      await leaveClub(club.slug);
    } catch (error) {
      console.error('Failed to leave club:', error);
    } finally {
      setLoadingClubId(null);
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  };

  // Filter options
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'technology', label: 'Technology' },
    { value: 'social', label: 'Social' },
    { value: 'professional', label: 'Professional' },
    { value: 'hobby', label: 'Hobby' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'member_count', label: 'Most Members' },
    { value: 'created_at', label: 'Newest' },
    { value: 'last_activity', label: 'Most Active' },
  ];

  const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const FilterIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
    </svg>
  );

  const RefreshIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  return (
    <div className={listClasses}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Campus Clubs</h1>
            <p className="text-gray-600">
              Discover and join clubs that match your interests
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
                Create Club
              </NeomorphicButton>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <NeomorphicCard className="p-4">
          <div className="space-y-4">
            {showSearch && (
              <SearchBar
                placeholder="Search clubs by name, description, or category..."
                value={filters.search}
                onChange={handleSearch}
                fullWidth
              />
            )}

            {showFilters && (
              <div className="flex flex-wrap gap-4">
                {/* Category Filter */}
                <div className="flex-1 min-w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border-none rounded-lg shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
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
                    <option value="active">Active</option>
                    <option value="all">All Status</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
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
          </div>
        </NeomorphicCard>
      </div>

      {/* Results Summary */}
      {!isLoading && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {pagination.count ? `${pagination.count} clubs found` : 'No clubs found'}
          </p>
          
          {filters.search && (
            <button
              onClick={() => handleSearch('')}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <NeomorphicCard className="p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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

      {/* Clubs Grid */}
      {!isLoading && !error && (
        <>
          {clubs.length === 0 ? (
            <NeomorphicCard className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No clubs found</h3>
                <p className="text-gray-500 mb-4">
                  {filters.search 
                    ? 'Try adjusting your search terms or filters'
                    : 'Be the first to create a club for your community'
                  }
                </p>
                {showCreateButton && (
                  <NeomorphicButton
                    variant="primary"
                    onClick={onCreateClick}
                    icon={<PlusIcon />}
                  >
                    Create First Club
                  </NeomorphicButton>
                )}
              </div>
            </NeomorphicCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clubs.map((club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  onView={() => onClubClick && onClubClick(club)}
                  onJoin={() => handleClubJoin(club)}
                  onLeave={() => handleClubLeave(club)}
                  onEdit={() => onClubEdit && onClubEdit(club)}
                  onDelete={() => onClubDelete && onClubDelete(club)}
                  isLoading={loadingClubId === club.id}
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
                {isLoadingMore ? 'Loading...' : 'Load More Clubs'}
              </NeomorphicButton>
            </div>
          )}

          {/* End of Results */}
          {!hasMore && clubs.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-500">You've reached the end of the list</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClubList;
