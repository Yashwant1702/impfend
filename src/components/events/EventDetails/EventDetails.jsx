import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import Avatar from '../../common/Avatar';
import { ComponentLoading } from '../../common/Loading';
import { eventDetailsStyles } from './EventDetails.styles';

const EventDetails = ({
  event,
  onRegister,
  onUnregister,
  onEdit,
  onDelete,
  onBack,
  isLoading = false,
  className = '',
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const [imageError, setImageError] = useState(false);

  const detailsClasses = [
    eventDetailsStyles.container,
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

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not set';
    
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
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

  // Check if registration is open
  const isRegistrationOpen = () => {
    const status = getEventStatus();
    if (status !== 'upcoming') return false;
    if (!event.registration_deadline) return true;
    return new Date() < new Date(event.registration_deadline);
  };

  // Check if registration is full
  const isRegistrationFull = () => {
    return event.max_participants && event.registered_count >= event.max_participants;
  };

  const eventStatus = getEventStatus();

  // Tab components
  const tabs = [
    { id: 'details', label: 'Event Details' },
    { id: 'participants', label: `Participants (${event.registered_count || 0})` },
    { id: 'agenda', label: 'Agenda' },
    { id: 'resources', label: 'Resources' },
  ];

  // Icons
  const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const EditIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );

  if (isLoading) {
    return <ComponentLoading text="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className={detailsClasses}>
        <NeomorphicCard className="p-8 text-center">
          <p className="text-gray-600">Event not found</p>
          <NeomorphicButton variant="primary" onClick={onBack} className="mt-4">
            Go Back
          </NeomorphicButton>
        </NeomorphicCard>
      </div>
    );
  }

  return (
    <div className={detailsClasses}>
      {/* Header */}
      <div className="mb-6">
        <NeomorphicButton
          variant="secondary"
          size="small"
          onClick={onBack}
          icon={<BackIcon />}
          className="mb-4"
        >
          Back to Events
        </NeomorphicButton>
      </div>

      {/* Hero Section */}
      <NeomorphicCard className="mb-6">
        <div className="relative">
          {/* Banner Image */}
          <div className="w-full h-64 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl overflow-hidden mb-6">
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
                  <svg className="w-20 h-20 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xl opacity-80">{event.title}</p>
                </div>
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h1>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(eventStatus)}`}>
                      {eventStatus}
                    </span>
                    
                    {event.event_type && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {event.event_type.replace('_', ' ')}
                      </span>
                    )}
                    
                    {event.is_free ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Free
                      </span>
                    ) : event.registration_fee && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        ${event.registration_fee}
                      </span>
                    )}
                    
                    {event.is_registered && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Registered
                      </span>
                    )}
                  </div>
                </div>

                {/* Management Actions */}
                {canManageEvent() && (
                  <div className="flex space-x-2">
                    <NeomorphicButton
                      variant="secondary"
                      size="small"
                      onClick={() => onEdit && onEdit(event)}
                      icon={<EditIcon />}
                    >
                      Edit
                    </NeomorphicButton>
                    
                    <NeomorphicButton
                      variant="danger"
                      size="small"
                      onClick={() => onDelete && onDelete(event)}
                      icon={<DeleteIcon />}
                    >
                      Delete
                    </NeomorphicButton>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {event.description || 'No description available.'}
              </p>

              {/* Event Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{event.registered_count || 0}</div>
                  <div className="text-sm text-gray-500">Registered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {event.max_participants || '∞'}
                  </div>
                  <div className="text-sm text-gray-500">Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {event.duration_hours || 'TBD'}
                  </div>
                  <div className="text-sm text-gray-500">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {event.rating ? event.rating.toFixed(1) : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon />
                    <div>
                      <p className="font-medium text-gray-800">Start Time</p>
                      <p className="text-gray-600">{formatDateTime(event.start_datetime)}</p>
                    </div>
                  </div>
                  
                  {event.end_datetime && (
                    <div className="flex items-center space-x-3">
                      <CalendarIcon />
                      <div>
                        <p className="font-medium text-gray-800">End Time</p>
                        <p className="text-gray-600">{formatDateTime(event.end_datetime)}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <LocationIcon />
                    <div>
                      <p className="font-medium text-gray-800">Location</p>
                      <p className="text-gray-600">
                        {event.is_online ? 'Online Event' : event.location || 'TBD'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <UsersIcon />
                    <div>
                      <p className="font-medium text-gray-800">Organizer</p>
                      <p className="text-gray-600">{event.club?.name || 'Independent'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Panel */}
            {user && eventStatus === 'upcoming' && (
              <div className="flex flex-col space-y-3 lg:w-64">
                {event.is_registered ? (
                  <NeomorphicButton
                    variant="danger"
                    size="large"
                    fullWidth
                    onClick={() => onUnregister && onUnregister(event)}
                  >
                    Unregister
                  </NeomorphicButton>
                ) : (
                  <NeomorphicButton
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={() => onRegister && onRegister(event)}
                    disabled={isRegistrationFull() || !isRegistrationOpen()}
                  >
                    {isRegistrationFull() 
                      ? 'Registration Full' 
                      : !isRegistrationOpen() 
                      ? 'Registration Closed' 
                      : event.requires_approval 
                      ? 'Request to Join' 
                      : 'Register Now'}
                  </NeomorphicButton>
                )}

                {/* Registration Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  {event.registration_deadline && (
                    <p>
                      <span className="font-medium">Registration Deadline:</span>
                      <br />
                      {formatDateTime(event.registration_deadline)}
                    </p>
                  )}
                  
                  {event.max_participants && (
                    <p>
                      <span className="font-medium">Spots Available:</span>
                      <br />
                      {event.max_participants - (event.registered_count || 0)} remaining
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </NeomorphicCard>

      {/* Navigation Tabs */}
      <NeomorphicCard className="mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </NeomorphicCard>

      {/* Tab Content */}
      <NeomorphicCard>
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Detailed Description */}
            {event.detailed_description && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">About This Event</h3>
                <div className="prose max-w-none text-gray-600">
                  {event.detailed_description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {event.requirements && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Requirements</h3>
                <div className="text-gray-600">
                  {event.requirements.split('\n').map((req, index) => (
                    <p key={index} className="mb-2">• {req}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {event.contact_info && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                <div className="text-gray-600">
                  <p>{event.contact_info}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'participants' && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Registered Participants ({event.registered_count || 0})
            </h3>
            
            {event.participants && event.participants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Avatar
                      src={participant.avatar}
                      name={participant.full_name || participant.name}
                      size="medium"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{participant.full_name || participant.name}</p>
                      <p className="text-sm text-gray-500">
                        {participant.user_type === 'student' ? 'Student' : 
                         participant.user_type === 'faculty' ? 'Faculty' : 'Admin'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Registered {new Date(participant.registered_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No participants registered yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'agenda' && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Event Agenda</h3>
            <div className="text-center py-8">
              <p className="text-gray-500">Agenda information coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Event Resources</h3>
            <div className="text-center py-8">
              <p className="text-gray-500">Resources will be available closer to the event date</p>
            </div>
          </div>
        )}
      </NeomorphicCard>
    </div>
  );
};

export default EventDetails;
