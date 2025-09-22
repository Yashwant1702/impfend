import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import NeomorphicButton from '../NeomorphicButton';
import { modalStyles } from './Modal.styles';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscapeKey = true,
  footer = null,
  className = '',
}) => {
  const modalRef = useRef();
  const previousActiveElement = useRef();

  const modalClasses = [
    modalStyles.modal,
    modalStyles.sizes[size] || modalStyles.sizes.medium,
    className,
  ].filter(Boolean).join(' ');

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscapeKey) return;

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose, closeOnEscapeKey]);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      document.body.style.overflow = 'hidden';
    } else {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
      
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = () => {
    onClose();
  };

  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={modalStyles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={modalStyles.backdrop}
        onClick={handleOverlayClick}
      />
      
      <div className={modalStyles.container}>
        <div
          ref={modalRef}
          tabIndex={-1}
          className={modalClasses}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={modalStyles.header}>
              {title && (
                <h2 id="modal-title" className={modalStyles.title}>
                  {title}
                </h2>
              )}
              
              {showCloseButton && (
                <NeomorphicButton
                  variant="secondary"
                  size="small"
                  onClick={handleCloseClick}
                  icon={<CloseIcon />}
                  className="!p-2"
                />
              )}
            </div>
          )}
          
          {/* Content */}
          <div className={modalStyles.content}>
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className={modalStyles.footer}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Confirmation Modal
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  isDestructive = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <div className="flex justify-end space-x-3">
          <NeomorphicButton
            variant="secondary"
            onClick={onClose}
          >
            {cancelText}
          </NeomorphicButton>
          <NeomorphicButton
            variant={isDestructive ? 'danger' : confirmVariant}
            onClick={handleConfirm}
          >
            {confirmText}
          </NeomorphicButton>
        </div>
      }
    >
      <p className="text-gray-700 leading-relaxed">
        {message}
      </p>
    </Modal>
  );
};

// Alert Modal
export const AlertModal = ({
  isOpen,
  onClose,
  title = 'Alert',
  message = '',
  type = 'info',
  buttonText = 'OK',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <div className="flex justify-center">
          <NeomorphicButton
            variant="primary"
            onClick={onClose}
          >
            {buttonText}
          </NeomorphicButton>
        </div>
      }
    >
      <div className="text-center">
        {getIcon()}
        <p className="text-gray-700 leading-relaxed">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default Modal;
