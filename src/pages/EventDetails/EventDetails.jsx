import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import EventDetails from '../../components/events/EventDetails';
import { eventDetailsPageStyles } from './EventDetails.styles';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const pageClasses = [
    eventDetailsPageStyles.container,
  ].filter(Boolean).join(' ');

  // Load event data
  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock event data
        const mockEvent = {
          id: parseInt(id),
          title: 'Photography Workshop: Portrait Techniques',
          description: 'Learn professional portrait photography techniques from industry experts.',
          detailed_description: 'Join us for an intensive 3-hour workshop covering advanced portrait photography techniques. Topics include lighting setup, posing direction, composition, and post-processing workflows. Bring your own camera (DSLR or mirrorless preferred) and a laptop with Lightroom or similar editing software.\n\nWhat you\'ll learn:\n- Professional lighting techniques\n- Directing and posing subjects\n- Camera settings for portraits\n- Post-processing workflows\n- Building a portfolio\n\nAll skill levels welcome!',
          event_type: 'workshop',
          start_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          end_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          location: 'Photography Studio, Art Building Room 205',
          is_online: false,
          max_participants: 20,
          registered_count: 15,
          registration_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          registration_fee: 25,
          is_free: false,
          requires_approval: false,
          banner_image: null,
          is_registered: false,
          club: {
            id: 1,
            name: 'Photography Club',
            logo: null,
          },
          tags: ['photography', 'workshop', 'portraits', 'lighting', 'editing'],
          requirements: 'Bring your own camera (DSLR or mirrorless preferred)\nLaptop with photo editing software\nBasic photography knowledge helpful but not required',
          contact_info: 'For questions, contact Sarah Johnson at sarah@photography-club.edu',
          duration_hours: 3,
          rating: 4.8,
          organizers: [
            {
              id: 1,
              full_name: 'Sarah Johnson',
              avatar: null,
              role: 'Lead Instructor',
            },
            {
              id: 2,
              full_name: 'Mike Chen',
              avatar: null,
              role: 'Technical Assistant',
            },
          ],
          participants: Array.from({ length: 15 }, (_, index) => ({
            id: index + 1,
            full_name: `Participant ${index + 1}`,
            avatar: null,
            user_type: 'student',
            registered_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          })),
        };

        setEvent(mockEvent);
      } catch (error) {
        console.error('Failed to load event:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadEvent();
    }
  }, [id]);

  // Handle register for event
  const handleRegister = async (event) => {
    try {
      // Simulate API call
      console.log('Registering for event:', event.id);
      
      // Update local state
      setEvent(prev => ({
        ...prev,
        is_registered: true,
        registered_count: prev.registered_count + 1,
      }));
    } catch (error) {
      console.error('Failed to register for event:', error);
    }
  };

  // Handle unregister from event
  const handleUnregister = async (event) => {
    try {
      // Simulate API call
      console.log('Unregistering from event:', event.id);
      
      // Update local state
      setEvent(prev => ({
        ...prev,
        is_registered: false,
        registered_count: prev.registered_count - 1,
      }));
    } catch (error) {
      console.error('Failed to unregister from event:', error);
    }
  };

  // Handle edit event
  const handleEditEvent = (event) => {
    navigate(`/events/${event.id}/edit`);
  };

  // Handle delete event
  const handleDeleteEvent = async (event) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        // Simulate API call
        console.log('Deleting event:', event.id);
        
        // Navigate back to events list
        navigate('/events');
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/events');
  };

  return (
    <MainLayout>
      <div className={pageClasses}>
        <EventDetails
          event={event}
          onRegister={handleRegister}
          onUnregister={handleUnregister}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onBack={handleBack}
          isLoading={isLoading}
        />
      </div>
    </MainLayout>
  );
};

export default EventDetailsPage;
