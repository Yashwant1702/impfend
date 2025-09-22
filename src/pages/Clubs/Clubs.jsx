import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import ClubList from '../../components/clubs/ClubList';
import CreateClubForm from '../../components/clubs/CreateClubForm';
import { clubsStyles } from './Clubs.styles';

const Clubs = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const pageClasses = [
    clubsStyles.container,
  ].filter(Boolean).join(' ');

  // Handle club click
  const handleClubClick = (club) => {
    navigate(`/clubs/${club.id}`);
  };

  // Handle club creation
  const handleCreateClub = async (clubData) => {
    try {
      // Simulate API call
      console.log('Creating club:', clubData);
      
      // Simulate success response
      const result = {
        success: true,
        data: {
          id: Date.now(),
          ...clubData,
        },
      };

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create club',
      };
    }
  };

  // Handle successful club creation
  const handleCreateSuccess = (clubData) => {
    setShowCreateForm(false);
    // Navigate to new club or refresh list
    navigate(`/clubs/${clubData.id}`);
  };

  return (
    <MainLayout>
      <div className={pageClasses}>
        <ClubList
          onClubClick={handleClubClick}
          onCreateClick={() => setShowCreateForm(true)}
          showCreateButton={true}
          showSearch={true}
          showFilters={true}
        />

        <CreateClubForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateClub}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </MainLayout>
  );
};

export default Clubs;
