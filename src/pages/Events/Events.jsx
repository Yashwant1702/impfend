import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import EventList from '../../components/events/EventList';
import CreateEventForm from '../../components/events/CreateEventForm';
import { eventsStyles } from './Events.styles';

const Events = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const pageClasses = [
    eventsStyles.container,
  ].filter(Boolean).join(' ');

  // Handle event click
  const handleEventClick = (event) => {
    navigate(`/events/${event.id}`);
  };

  // Handle event creation
  const handleCreateEvent = async (eventData) => {
    try {
      // Simulate API call
      console.log('Creating event:', eventData);
      
      // Simulate success response
      const result = {
        success: true,
        data: {
          id: Date.now(),
          ...eventData,
        },
      };

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create event',
      };
    }
  };

  // Handle successful event creation
  const handleCreateSuccess = (eventData) => {
    setShowCreateForm(false);
    // Navigate to new event or refresh list
    navigate(`/events/${eventData.id}`);
  };

  return (
    <MainLayout>
      <div className={pageClasses}>
        <EventList
          onEventClick={handleEventClick}
          onCreateClick={() => setShowCreateForm(true)}
          showCreateButton={true}
          showSearch={true}
          showFilters={true}
        />

        <CreateEventForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateEvent}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </MainLayout>
  );
};

export default Events;
