import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import Avatar from '../../common/Avatar';
import { eventCardStyles } from './EventCard.styles';

const EventCard = ({
  event,
  onRegister,
  onUnregister,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  isLoading = false,
  className = '',
}) => {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);

  const cardClasses = [
    eventCardStyles.container,
    className,
  ].filter(Boolean).join(' ');

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Check if user can manage this event
  const canManageEvent = () => {
    if (!user) return false;
    return user.user_type === 'college_admin' || 
           event.created_by === user.id || 
           event.organizers?.some(org => org.id === user.id);
  };

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'TBD';
    
    const date = new Date(dateTimeString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (diffDays === 0) {
      return `Today at ${timeStr}`;
    } else if (diffDays === 1) {
      return `Tomorrow at ${timeStr}`;
    } else if (diffDays > 0 && diffDays <= 7) {
      return `${date.toLocaleDateString('en-US', { weekday: 'long' })} at ${timeStr}`;
    }

    return `${dateStr} at ${timeStr}`;
  };

  // Get event status
  const getEventStatus = () => {
    if (!event.start_datetime) return 'scheduled';
    
    const now = new Date();
    const startDate = new Date(event.start_datetime);
    const endDate = event.end_datetime ? new Date(event.end_datetime) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'completed';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colorMap = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Get event type color
  const getEventTypeColor = (type) => {
    const colorMap = {
      workshop: 'bg-purple-100 text-purple-800',
      seminar: 'bg-blue-100 text-blue-800',
      competition: 'bg-orange-100 text-orange-800',
      social: 'bg-pink-100 text-pink-800',
      cultural: 'bg-indigo-100 text-indigo-800',
      sports: 'bg-green-100 text-green-800',
      academic: 'bg-teal-100 text-teal-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  // Format registration count
  const formatRegistrationCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // Check if registration is full
  const isRegistrationFull = () => {
    return event.max_participants && event.registered_count >= event.max_participants;
  };

  // Check if registration is still open
  const isRegistrationOpen = () => {
    if (!event.registration_deadline) return true;
    return new Date() < new Date(event.registration_deadline);
  };

  const eventStatus = getEventStatus();

  // Icons
  const CalendarIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );

  const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const PriceIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );

  return (
    <NeomorphicCard
      className={cardClasses}
      hover={true}
      clickable={!!onView}
      onClick={onView}
    >
      {/* Event Image */}
      <div className="relative mb-4">
        <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl overflow-hidden shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]">
          {event.banner_image && !imageError ? (
            <img
              src={event.banner_image}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-16 h-16 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm opacity-80">{event.title}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(eventStatus)}`}>
            {eventStatus}
          </span>
        </div>

        {/* Registration Status Badge */}
        {event.is_registered && (
          <div className="absolute top-3 left-3">
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Registered</span>
            </div>
          </div>
        )}

        {/* Full Badge */}
        {isRegistrationFull() && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Full
            </div>
          </div>
        )}

        {/* Management Actions */}
        {canManageEvent() && (
          <div className="absolute bottom-3 right-3 flex space-x-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(event);
                }}
                className="p-1.5 bg-white bg-opacity-90 text-gray-600 hover:text-blue-600 rounded-lg transition-colors duration-200 shadow-lg"
                title="Edit event"
              >
                <EditIcon />
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event);
                }}
                className="p-1.5 bg-white bg-opacity-90 text-gray-600 hover:text-red-600 rounded-lg transition-colors duration-200 shadow-lg"
                title="Delete event"
              >
                <DeleteIcon />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Event Info */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 flex-1">
            {event.title}
          </h3>
        </div>

        {/* Event Type and Price */}
        <div className="flex items-center space-x-2 mb-3">
          {event.event_type && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
              {event.event_type.replace('_', ' ')}
            </span>
          )}
          
          {event.is_free ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Free
            </span>
          ) : event.registration_fee && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              <PriceIcon />
              <span className="ml-1">${event.registration_fee}</span>
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {event.description || 'No description available.'}
        </p>

        {/* Event Meta Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <CalendarIcon />
            <span>{formatDateTime(event.start_datetime)}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <LocationIcon />
              <span>{event.is_online ? 'Online' : event.location || 'TBD'}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <UsersIcon />
              <span>
                {formatRegistrationCount(event.registered_count || 0)}
                {event.max_participants && ` / ${event.max_participants}`}
                {' participants'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Organizer Info */}
      {event.club && (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Organized by</span>
            <div className="flex items-center space-x-2">
              {event.club.logo && (
                <img
                  src={event.club.logo}
                  alt={event.club.name}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="text-xs font-medium text-gray-700">
                {event.club.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Organizers */}
      {event.organizers && event.organizers.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Organizers</p>
          <div className="flex -space-x-2">
            {event.organizers.slice(0, 3).map((organizer, index) => (
              <Avatar
                key={organizer.id || index}
                src={organizer.avatar}
                name={organizer.full_name || organizer.name}
                size="small"
                className="border-2 border-white"
              />
            ))}
            
            {event.organizers.length > 3 && (
              <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  +{event.organizers.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && user && eventStatus === 'upcoming' && (
        <div className="flex space-x-2">
          {event.is_registered ? (
            <NeomorphicButton
              variant="danger"
              size="small"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onUnregister && onUnregister(event);
              }}
              loading={isLoading}
              disabled={isLoading}
            >
              Unregister
            </NeomorphicButton>
          ) : (
            <NeomorphicButton
              variant="primary"
              size="small"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onRegister && onRegister(event);
              }}
              loading={isLoading}
              disabled={isLoading || isRegistrationFull() || !isRegistrationOpen()}
            >
              {isRegistrationFull() 
                ? 'Full' 
                : !isRegistrationOpen() 
                ? 'Registration Closed' 
                : event.requires_approval 
                ? 'Request to Join' 
                : 'Register'}
            </NeomorphicButton>
          )}

          <NeomorphicButton
            variant="secondary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onView && onView(event);
            }}
          >
            View
          </NeomorphicButton>
        </div>
      )}

      {/* Registration Deadline Warning */}
      {event.registration_deadline && eventStatus === 'upcoming' && (
        <div className="mt-3">
          {(() => {
            const deadline = new Date(event.registration_deadline);
            const now = new Date();
            const timeDiff = deadline - now;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            if (daysDiff <= 0) {
              return (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-800 text-center font-medium">
                    Registration closed
                  </p>
                </div>
              );
            } else if (daysDiff <= 3) {
              return (
                <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-xs text-orange-800 text-center">
                    Registration closes in {daysDiff} day{daysDiff > 1 ? 's' : ''}
                  </p>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Event Status Messages */}
      {eventStatus === 'ongoing' && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-800 text-center font-medium">
            Event is currently ongoing
          </p>
        </div>
      )}

      {eventStatus === 'completed' && (
        <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            This event has ended
          </p>
        </div>
      )}
    </NeomorphicCard>
  );
};

export default EventCard;
