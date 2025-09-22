import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import ClubDetails from '../../components/clubs/ClubDetails';
import { ComponentLoading } from '../../components/common/Loading';
import { clubDetailsPageStyles } from './ClubDetails.styles';

const ClubDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const pageClasses = [
    clubDetailsPageStyles.container,
  ].filter(Boolean).join(' ');

  // Load club data
  useEffect(() => {
    const loadClub = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock club data
        const mockClub = {
          id: parseInt(id),
          name: 'Photography Club',
          description: 'A community of photography enthusiasts capturing life\'s beautiful moments.',
          detailed_description: 'Join our photography club to explore the art of visual storytelling. We organize weekly photo walks, monthly exhibitions, and workshops led by professional photographers. Whether you\'re a beginner with a smartphone or an experienced photographer with professional equipment, everyone is welcome!',
          category: { name: 'Arts & Culture' },
          cover_image: null,
          member_count: 156,
          events_count: 8,
          status: 'active',
          is_member: false,
          created_at: '2024-01-15T10:00:00Z',
          meeting_schedule: 'Every Saturday at 2:00 PM',
          meeting_location: 'Art Building, Room 205',
          contact_email: 'photography@university.edu',
          website: 'https://photography-club.university.edu',
          admins: [
            {
              id: 1,
              full_name: 'Sarah Johnson',
              avatar: null,
              role: 'President',
            },
            {
              id: 2,
              full_name: 'Mike Chen',
              avatar: null,
              role: 'Vice President',
            },
          ],
          members: Array.from({ length: 10 }, (_, index) => ({
            id: index + 1,
            full_name: `Member ${index + 1}`,
            avatar: null,
            user_type: 'student',
            joined_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          })),
          recent_activities: [
            {
              description: 'Monthly photo exhibition opened',
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              description: 'New member orientation completed',
              created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              description: 'Portrait photography workshop held',
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
        };

        setClub(mockClub);
      } catch (error) {
        console.error('Failed to load club:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadClub();
    }
  }, [id]);

  // Handle join club
  const handleJoinClub = async (club) => {
    try {
      // Simulate API call
      console.log('Joining club:', club.id);
      
      // Update local state
      setClub(prev => ({
        ...prev,
        is_member: true,
        member_count: prev.member_count + 1,
      }));
    } catch (error) {
      console.error('Failed to join club:', error);
    }
  };

  // Handle leave club
  const handleLeaveClub = async (club) => {
    try {
      // Simulate API call
      console.log('Leaving club:', club.id);
      
      // Update local state
      setClub(prev => ({
        ...prev,
        is_member: false,
        member_count: prev.member_count - 1,
      }));
    } catch (error) {
      console.error('Failed to leave club:', error);
    }
  };

  // Handle edit club
  const handleEditClub = (club) => {
    // Navigate to edit page or open edit modal
    navigate(`/clubs/${club.id}/edit`);
  };

  // Handle delete club
  const handleDeleteClub = async (club) => {
    if (window.confirm('Are you sure you want to delete this club? This action cannot be undone.')) {
      try {
        // Simulate API call
        console.log('Deleting club:', club.id);
        
        // Navigate back to clubs list
        navigate('/clubs');
      } catch (error) {
        console.error('Failed to delete club:', error);
      }
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/clubs');
  };

  return (
    <MainLayout>
      <div className={pageClasses}>
        <ClubDetails
          club={club}
          onJoin={handleJoinClub}
          onLeave={handleLeaveClub}
          onEdit={handleEditClub}
          onDelete={handleDeleteClub}
          onBack={handleBack}
          isLoading={isLoading}
        />
      </div>
    </MainLayout>
  );
};

export default ClubDetailsPage;
