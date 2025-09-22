import React, { useState, useRef, useEffect } from 'react';
import NeomorphicButton from '../NeomorphicButton';
import { searchBarStyles } from './SearchBar.styles';

const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  suggestions = [],
  showSuggestions = false,
  loading = false,
  disabled = false,
  size = 'medium',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const searchBarClasses = [
    searchBarStyles.container,
    fullWidth ? searchBarStyles.fullWidth : '',
    className,
  ].filter(Boolean).join(' ');

  const inputClasses = [
    searchBarStyles.input,
    searchBarStyles.sizes[size] || searchBarStyles.sizes.medium,
    disabled ? searchBarStyles.disabled : '',
    className,
  ].filter(Boolean).join(' ');

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
    setIsOpen(newValue.length > 0 && suggestions.length > 0);
    setHighlightedIndex(-1);
  };

  // Handle input focus
  const handleInputFocus = (e) => {
    setIsOpen(value.length > 0 && suggestions.length > 0);
    if (onFocus) {
      onFocus(e);
    }
  };

  // Handle input blur
  const handleInputBlur = (e) => {
    // Delay to allow suggestion clicks
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }, 200);
    
    if (onBlur) {
      onBlur(e);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (onChange) {
      onChange(suggestion.value || suggestion);
    }
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const ClearIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const LoadingSpinner = () => (
    <svg className="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <div ref={containerRef} className={searchBarClasses}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            {...props}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
            {loading && <LoadingSpinner />}
            
            {value && !loading && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ClearIcon />
              </button>
            )}
            
            <NeomorphicButton
              type="submit"
              variant="primary"
              size="small"
              disabled={disabled || loading}
              className="!px-3"
            >
              Search
            </NeomorphicButton>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && showSuggestions && suggestions.length > 0 && (
          <div className={searchBarStyles.suggestions}>
            {suggestions.map((suggestion, index) => {
              const isHighlighted = index === highlightedIndex;
              const suggestionText = typeof suggestion === 'string' ? suggestion : suggestion.label || suggestion.value;
              
              return (
                <button
                  key={index}
                  type="button"
                  className={`
                    ${searchBarStyles.suggestion}
                    ${isHighlighted ? searchBarStyles.suggestionHighlighted : ''}
                  `}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="flex items-center space-x-3">
                    <SearchIcon />
                    <span>{suggestionText}</span>
                  </div>
                  
                  {typeof suggestion === 'object' && suggestion.category && (
                    <span className="text-xs text-gray-400 capitalize">
                      {suggestion.category}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </form>
    </div>
  );
};

// Quick Search Component
export const QuickSearch = ({ onSearch, placeholder = "Quick search..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (searchQuery) => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <SearchBar
      value={query}
      onChange={setQuery}
      onSubmit={handleSubmit}
      placeholder={placeholder}
      size="small"
      fullWidth
    />
  );
};

export default SearchBar;
