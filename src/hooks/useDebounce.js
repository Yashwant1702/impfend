import { useState, useEffect } from 'react';

/**
 * Hook that debounces a value by delaying its update
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook that provides a debounced callback function
 * @param {Function} callback - The callback function to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {Array} deps - Dependencies array for the callback
 * @returns {Function} - The debounced callback function
 */
export const useDebouncedCallback = (callback, delay = 300, deps = []) => {
  const [debouncedCallback, setDebouncedCallback] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay, ...deps]);

  return debouncedCallback || (() => {});
};

/**
 * Hook that tracks if a debounced value is currently pending
 * @param {any} value - The value being debounced
 * @param {number} delay - The delay in milliseconds
 * @returns {Object} - Object containing debouncedValue and isPending
 */
export const useDebounceWithStatus = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(true);
    
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsPending(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return {
    debouncedValue,
    isPending,
  };
};

export default useDebounce;
