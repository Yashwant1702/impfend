import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import NeomorphicInput from '../../common/NeomorphicInput';
import Modal from '../../common/Modal';
import { createClubFormStyles } from './CreateClubForm.styles';

const CreateClubForm = ({
  isOpen = false,
  onClose,
  onSubmit,
  onSuccess,
  isLoading = false,
  className = '',
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    meeting_schedule: '',
    meeting_location: '',
    contact_email: '',
    website: '',
    social_media: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
    requires_approval: true,
    is_public: true,
    max_members: '',
    tags: [],
    cover_image: null,
    club_rules: '',
    meeting_time: '',
    meeting_day: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const formClasses = [
    createClubFormStyles.container,
    className,
  ].filter(Boolean).join(' ');

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Handle tags
  const handleTagAdd = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // Handle image upload
  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({
        ...prev,
        cover_image: file,
      }));
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleImageUpload(files[0]);
    }
  };

  // Validate current step
  const validateStep = (stepNumber) => {
    const errors = {};
    
    if (stepNumber === 1) {
      if (!formData.name.trim()) {
        errors.name = 'Club name is required';
      } else if (formData.name.length < 3) {
        errors.name = 'Club name must be at least 3 characters';
      }
      
      if (!formData.description.trim()) {
        errors.description = 'Description is required';
      } else if (formData.description.length < 20) {
        errors.description = 'Description must be at least 20 characters';
      }
      
      if (!formData.category) {
        errors.category = 'Category is required';
      }
    }
    
    if (stepNumber === 2) {
      if (!formData.meeting_schedule.trim()) {
        errors.meeting_schedule = 'Meeting schedule is required';
      }
      
      if (!formData.meeting_location.trim()) {
        errors.meeting_location = 'Meeting location is required';
      }
      
      if (formData.contact_email && !/\S+@\S+\.\S+/.test(formData.contact_email)) {
        errors.contact_email = 'Please enter a valid email address';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'social_media') {
          submitData.append('social_media', JSON.stringify(formData.social_media));
        } else if (key === 'tags') {
          submitData.append('tags', JSON.stringify(formData.tags));
        } else if (key === 'cover_image' && formData.cover_image) {
          submitData.append('cover_image', formData.cover_image);
        } else if (key !== 'cover_image') {
          submitData.append(key, formData[key]);
        }
      });

      if (onSubmit) {
        const result = await onSubmit(submitData);
        if (result && result.success) {
          handleClose();
          if (onSuccess) {
            onSuccess(result.data);
          }
        }
      }
    } catch (error) {
      console.error('Club creation error:', error);
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Handle close
  const handleClose = () => {
    setStep(1);
    setFormData({
      name: '',
      description: '',
      category: '',
      meeting_schedule: '',
      meeting_location: '',
      contact_email: '',
      website: '',
      social_media: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
      },
      requires_approval: true,
      is_public: true,
      max_members: '',
      tags: [],
      cover_image: null,
      club_rules: '',
      meeting_time: '',
      meeting_day: '',
    });
    setValidationErrors({});
    setImagePreview(null);
    onClose();
  };

  // Categories
  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'technology', label: 'Technology' },
    { value: 'social', label: 'Social & Community' },
    { value: 'professional', label: 'Professional Development' },
    { value: 'hobby', label: 'Hobby & Interest' },
    { value: 'volunteer', label: 'Volunteer & Service' },
  ];

  // Days of the week
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Icons
  const ImageIcon = () => (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const ClubIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  // Step indicators
  const steps = [
    { number: 1, title: 'Basic Info', icon: <ClubIcon /> },
    { number: 2, title: 'Meeting Details', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { number: 3, title: 'Settings', icon: <SettingsIcon /> },
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <NeomorphicInput
              label="Club Name"
              placeholder="Enter club name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={validationErrors.name}
              required
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe your club's purpose, activities, and goals..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200 resize-none"
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Club Cover Image
              </label>
              <div
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                  ${dragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, cover_image: null }));
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon />
                    <div>
                      <p className="text-gray-600">Drag and drop an image here, or</p>
                      <label className="inline-block mt-2 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0])}
                          className="hidden"
                        />
                        <span className="text-blue-600 hover:text-blue-800 font-medium">
                          browse files
                        </span>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Recommended: 1200x400px, max 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <NeomorphicInput
              label="Meeting Schedule"
              placeholder="e.g., Every Tuesday at 7 PM"
              value={formData.meeting_schedule}
              onChange={(e) => handleInputChange('meeting_schedule', e.target.value)}
              error={validationErrors.meeting_schedule}
              required
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Day
                </label>
                <select
                  value={formData.meeting_day}
                  onChange={(e) => handleInputChange('meeting_day', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200"
                >
                  <option value="">Select day</option>
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <NeomorphicInput
                type="time"
                label="Meeting Time"
                value={formData.meeting_time}
                onChange={(e) => handleInputChange('meeting_time', e.target.value)}
                fullWidth
              />
            </div>

            <NeomorphicInput
              label="Meeting Location"
              placeholder="e.g., Room 201, Student Center"
              value={formData.meeting_location}
              onChange={(e) => handleInputChange('meeting_location', e.target.value)}
              error={validationErrors.meeting_location}
              required
              fullWidth
            />

            <NeomorphicInput
              type="email"
              label="Contact Email"
              placeholder="club@university.edu"
              value={formData.contact_email}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              error={validationErrors.contact_email}
              fullWidth
            />

            <NeomorphicInput
              type="url"
              label="Website"
              placeholder="https://clubwebsite.com"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Social Media Links
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NeomorphicInput
                  label="Facebook"
                  placeholder="Facebook page URL"
                  value={formData.social_media.facebook}
                  onChange={(e) => handleInputChange('social_media.facebook', e.target.value)}
                  fullWidth
                />

                <NeomorphicInput
                  label="Instagram"
                  placeholder="Instagram handle"
                  value={formData.social_media.instagram}
                  onChange={(e) => handleInputChange('social_media.instagram', e.target.value)}
                  fullWidth
                />

                <NeomorphicInput
                  label="Twitter"
                  placeholder="Twitter handle"
                  value={formData.social_media.twitter}
                  onChange={(e) => handleInputChange('social_media.twitter', e.target.value)}
                  fullWidth
                />

                <NeomorphicInput
                  label="LinkedIn"
                  placeholder="LinkedIn page URL"
                  value={formData.social_media.linkedin}
                  onChange={(e) => handleInputChange('social_media.linkedin', e.target.value)}
                  fullWidth
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Membership Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Membership Settings</h3>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.requires_approval}
                    onChange={(e) => handleInputChange('requires_approval', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">Require approval for new members</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => handleInputChange('is_public', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">Make club public (visible to everyone)</span>
                </label>

                <NeomorphicInput
                  type="number"
                  label="Maximum Members (optional)"
                  placeholder="Leave blank for unlimited"
                  value={formData.max_members}
                  onChange={(e) => handleInputChange('max_members', e.target.value)}
                  fullWidth
                />
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Tags</h3>
                
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <NeomorphicInput
                    placeholder="Add tags (press Enter)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTagAdd(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    fullWidth
                    helperText="Press Enter to add tags. These help people discover your club."
                  />
                </div>
              </div>
            </div>

            {/* Club Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Club Rules & Guidelines (optional)
              </label>
              <textarea
                placeholder="Outline any rules, expectations, or guidelines for club members..."
                value={formData.club_rules}
                onChange={(e) => handleInputChange('club_rules', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200 resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Club"
      size="xlarge"
      className={formClasses}
    >
      <form onSubmit={handleSubmit}>
        {/* Step Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                  ${step >= stepItem.number
                    ? 'bg-blue-600 text-white shadow-[4px_4px_8px_#4a90e2,-4px_-4px_8px_#6bb6ff]'
                    : 'bg-gray-200 text-gray-600 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                  }
                `}>
                  {stepItem.icon}
                </div>
                
                <div className="ml-3">
                  <p className={`text-sm font-medium ${step >= stepItem.number ? 'text-blue-600' : 'text-gray-500'}`}>
                    Step {stepItem.number}
                  </p>
                  <p className={`text-xs ${step >= stepItem.number ? 'text-blue-500' : 'text-gray-400'}`}>
                    {stepItem.title}
                  </p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-4 transition-all duration-200
                    ${step > stepItem.number ? 'bg-blue-600' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <div>
            {step > 1 && (
              <NeomorphicButton
                type="button"
                variant="secondary"
                onClick={handlePreviousStep}
              >
                Previous
              </NeomorphicButton>
            )}
          </div>

          <div className="flex space-x-3">
            <NeomorphicButton
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </NeomorphicButton>

            {step < 3 ? (
              <NeomorphicButton
                type="button"
                variant="primary"
                onClick={handleNextStep}
              >
                Next
              </NeomorphicButton>
            ) : (
              <NeomorphicButton
                type="submit"
                variant="primary"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Club...' : 'Create Club'}
              </NeomorphicButton>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClubForm;
