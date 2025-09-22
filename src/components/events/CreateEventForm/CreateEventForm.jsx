import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import NeomorphicCard from '../../common/NeomorphicCard';
import NeomorphicButton from '../../common/NeomorphicButton';
import NeomorphicInput from '../../common/NeomorphicInput';
import Modal from '../../common/Modal';
import { createEventFormStyles } from './CreateEventForm.styles';

const CreateEventForm = ({
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
    title: '',
    description: '',
    detailed_description: '',
    event_type: '',
    start_datetime: '',
    end_datetime: '',
    location: '',
    is_online: false,
    online_link: '',
    max_participants: '',
    registration_deadline: '',
    registration_fee: '',
    is_free: true,
    requires_approval: false,
    banner_image: null,
    tags: [],
    requirements: '',
    contact_info: '',
    club_id: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const formClasses = [
    createEventFormStyles.container,
    className,
  ].filter(Boolean).join(' ');

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }

    // Handle free/paid logic
    if (field === 'is_free') {
      if (value) {
        setFormData(prev => ({
          ...prev,
          registration_fee: '',
        }));
      }
    } else if (field === 'registration_fee') {
      if (value && value > 0) {
        setFormData(prev => ({
          ...prev,
          is_free: false,
        }));
      }
    }

    // Handle online/offline logic
    if (field === 'is_online') {
      if (!value) {
        setFormData(prev => ({
          ...prev,
          online_link: '',
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          location: '',
        }));
      }
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
        banner_image: file,
      }));
    }
  };

  // Validate current step
  const validateStep = (stepNumber) => {
    const errors = {};
    
    if (stepNumber === 1) {
      if (!formData.title.trim()) {
        errors.title = 'Event title is required';
      }
      
      if (!formData.description.trim()) {
        errors.description = 'Description is required';
      }
      
      if (!formData.event_type) {
        errors.event_type = 'Event type is required';
      }
    }
    
    if (stepNumber === 2) {
      if (!formData.start_datetime) {
        errors.start_datetime = 'Start date and time is required';
      }
      
      if (formData.end_datetime && formData.start_datetime && 
          new Date(formData.end_datetime) <= new Date(formData.start_datetime)) {
        errors.end_datetime = 'End time must be after start time';
      }
      
      if (!formData.is_online && !formData.location.trim()) {
        errors.location = 'Location is required for offline events';
      }
      
      if (formData.is_online && !formData.online_link.trim()) {
        errors.online_link = 'Online link is required for virtual events';
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
        if (key === 'tags') {
          submitData.append('tags', JSON.stringify(formData.tags));
        } else if (key === 'banner_image' && formData.banner_image) {
          submitData.append('banner_image', formData.banner_image);
        } else if (key !== 'banner_image') {
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
      console.error('Event creation error:', error);
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
      title: '',
      description: '',
      detailed_description: '',
      event_type: '',
      start_datetime: '',
      end_datetime: '',
      location: '',
      is_online: false,
      online_link: '',
      max_participants: '',
      registration_deadline: '',
      registration_fee: '',
      is_free: true,
      requires_approval: false,
      banner_image: null,
      tags: [],
      requirements: '',
      contact_info: '',
      club_id: '',
    });
    setValidationErrors({});
    setImagePreview(null);
    onClose();
  };

  // Event types
  const eventTypes = [
    { value: '', label: 'Select event type' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'competition', label: 'Competition' },
    { value: 'social', label: 'Social Event' },
    { value: 'cultural', label: 'Cultural Event' },
    { value: 'sports', label: 'Sports Event' },
    { value: 'academic', label: 'Academic Event' },
    { value: 'other', label: 'Other' },
  ];

  // Step indicators
  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Date & Location' },
    { number: 3, title: 'Details & Settings' },
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <NeomorphicInput
              label="Event Title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={validationErrors.title}
              required
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.event_type}
                onChange={(e) => handleInputChange('event_type', e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200"
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {validationErrors.event_type && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.event_type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Brief description of the event"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200 resize-none"
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                placeholder="Detailed information about the event..."
                value={formData.detailed_description}
                onChange={(e) => handleInputChange('detailed_description', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200 resize-none"
              />
            </div>

            {/* Banner Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Banner
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, banner_image: null }));
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-gray-600">Upload an event banner</p>
                      <label className="inline-block mt-2 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0])}
                          className="hidden"
                        />
                        <span className="text-blue-600 hover:text-blue-800 font-medium">
                          Choose file
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NeomorphicInput
                type="datetime-local"
                label="Start Date & Time"
                value={formData.start_datetime}
                onChange={(e) => handleInputChange('start_datetime', e.target.value)}
                error={validationErrors.start_datetime}
                required
                fullWidth
              />

              <NeomorphicInput
                type="datetime-local"
                label="End Date & Time"
                value={formData.end_datetime}
                onChange={(e) => handleInputChange('end_datetime', e.target.value)}
                error={validationErrors.end_datetime}
                fullWidth
              />
            </div>

            <div>
              <label className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  checked={formData.is_online}
                  onChange={(e) => handleInputChange('is_online', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">This is an online event</span>
              </label>
            </div>

            {formData.is_online ? (
              <NeomorphicInput
                type="url"
                label="Online Event Link"
                placeholder="https://zoom.us/j/..."
                value={formData.online_link}
                onChange={(e) => handleInputChange('online_link', e.target.value)}
                error={validationErrors.online_link}
                required
                fullWidth
              />
            ) : (
              <NeomorphicInput
                label="Event Location"
                placeholder="Enter the venue address"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                error={validationErrors.location}
                required
                fullWidth
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NeomorphicInput
                type="number"
                label="Maximum Participants"
                placeholder="Leave blank for unlimited"
                value={formData.max_participants}
                onChange={(e) => handleInputChange('max_participants', e.target.value)}
                fullWidth
              />

              <NeomorphicInput
                type="datetime-local"
                label="Registration Deadline"
                value={formData.registration_deadline}
                onChange={(e) => handleInputChange('registration_deadline', e.target.value)}
                fullWidth
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Pricing</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) => handleInputChange('is_free', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">This is a free event</span>
                </label>

                {!formData.is_free && (
                  <NeomorphicInput
                    type="number"
                    label="Registration Fee"
                    placeholder="0.00"
                    value={formData.registration_fee}
                    onChange={(e) => handleInputChange('registration_fee', e.target.value)}
                    fullWidth
                    step="0.01"
                    min="0"
                  />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Registration Settings</h3>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.requires_approval}
                  onChange={(e) => handleInputChange('requires_approval', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">Require approval for registration</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                placeholder="Any special requirements or prerequisites..."
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200 resize-none"
              />
            </div>

            <NeomorphicInput
              label="Contact Information"
              placeholder="Contact details for inquiries"
              value={formData.contact_info}
              onChange={(e) => handleInputChange('contact_info', e.target.value)}
              fullWidth
            />

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
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
                helperText="Press Enter to add tags"
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
      title="Create New Event"
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
                  w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-200
                  ${step >= stepItem.number
                    ? 'bg-blue-600 text-white shadow-[4px_4px_8px_#4a90e2,-4px_-4px_8px_#6bb6ff]'
                    : 'bg-gray-200 text-gray-600 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
                  }
                `}>
                  {stepItem.number}
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
                {isLoading ? 'Creating Event...' : 'Create Event'}
              </NeomorphicButton>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEventForm;
