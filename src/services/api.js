import { API_CONFIG, API_ENDPOINTS } from '../utils/constants';
import storage from '../utils/storage';

// API Configuration
class APIService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Get authentication headers
  getAuthHeaders() {
    const token = storage.getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Get complete headers
  getHeaders(customHeaders = {}) {
    return {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...customHeaders,
    };
  }

  // Handle API response
  async handleResponse(response) {
    // Check if response is ok
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Network error occurred' };
      }

      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Unauthorized - try to refresh token
          const refreshed = await this.refreshToken();
          if (!refreshed) {
            storage.clearAuthTokens();
            window.location.href = '/login';
          }
          throw new APIError('Authentication required', 401, errorData);
        
        case 403:
          throw new APIError('Access forbidden', 403, errorData);
        
        case 404:
          throw new APIError('Resource not found', 404, errorData);
        
        case 422:
          throw new APIError('Validation error', 422, errorData);
        
        case 500:
          throw new APIError('Server error', 500, errorData);
        
        default:
          throw new APIError(
            errorData.message || 'An error occurred', 
            response.status, 
            errorData
          );
      }
    }

    // Parse JSON response
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  // Refresh authentication token
  async refreshToken() {
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        storage.setAuthTokens(data.access, refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      data = null,
      headers = {},
      params = {},
      timeout = this.timeout,
      ...otherOptions
    } = options;

    // Build URL with query parameters
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    // Build request options
    const requestOptions = {
      method,
      headers: this.getHeaders(headers),
      ...otherOptions,
    };

    // Add body for non-GET requests
    if (data && method !== 'GET') {
      if (data instanceof FormData) {
        // For file uploads, remove Content-Type header to let browser set it
        delete requestOptions.headers['Content-Type'];
        requestOptions.body = data;
      } else {
        requestOptions.body = JSON.stringify(data);
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    requestOptions.signal = controller.signal;

    try {
      const response = await fetch(url.toString(), requestOptions);
      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408);
      }
      
      if (error instanceof APIError) {
        throw error;
      }
      
      // Network or other errors
      throw new APIError('Network error', 0, { originalError: error });
    }
  }

  // HTTP method helpers
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', data });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // File upload helper
  async uploadFile(endpoint, file, additionalData = {}, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional form fields
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const options = {
      method: 'POST',
      data: formData,
    };

    // Add progress tracking if callback provided
    if (onProgress && typeof onProgress === 'function') {
      options.onUploadProgress = (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        onProgress(Math.round(progress));
      };
    }

    return this.request(endpoint, options);
  }

  // Batch requests helper
  async batch(requests) {
    try {
      const promises = requests.map(request => {
        const { endpoint, options = {} } = request;
        return this.request(endpoint, options);
      });

      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        ...requests[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
      }));
    } catch (error) {
      throw new APIError('Batch request failed', 0, { originalError: error });
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.get('/health/');
      return response;
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }
}

// Custom API Error class
class APIError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  // Check if error is specific type
  isUnauthorized() {
    return this.status === 401;
  }

  isForbidden() {
    return this.status === 403;
  }

  isNotFound() {
    return this.status === 404;
  }

  isValidationError() {
    return this.status === 422;
  }

  isServerError() {
    return this.status >= 500;
  }

  isNetworkError() {
    return this.status === 0;
  }

  // Get validation errors
  getValidationErrors() {
    if (this.isValidationError() && this.data) {
      return this.data.details || this.data.errors || {};
    }
    return {};
  }

  // Get user-friendly message
  getUserMessage() {
    switch (this.status) {
      case 0:
        return 'Network connection error. Please check your internet connection.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 408:
        return 'Request timeout. Please try again.';
      case 422:
        return 'Please check your input and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return this.message || 'An error occurred. Please try again.';
    }
  }
}

// Request interceptors
class RequestInterceptor {
  constructor() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  // Add request interceptor
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Process request through interceptors
  async processRequest(config) {
    let processedConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      try {
        processedConfig = await interceptor(processedConfig);
      } catch (error) {
        console.error('Request interceptor error:', error);
      }
    }
    
    return processedConfig;
  }

  // Process response through interceptors
  async processResponse(response) {
    let processedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      try {
        processedResponse = await interceptor(processedResponse);
      } catch (error) {
        console.error('Response interceptor error:', error);
      }
    }
    
    return processedResponse;
  }
}

// Create singleton instances
const apiService = new APIService();
const requestInterceptor = new RequestInterceptor();

// Add default request interceptor for logging
requestInterceptor.addRequestInterceptor((config) => {
  console.log(`API Request: ${config.method || 'GET'} ${config.url}`);
  return config;
});

// Add default response interceptor for logging
requestInterceptor.addResponseInterceptor((response) => {
  console.log(`API Response: ${response.status}`);
  return response;
});

// Export API service and utilities
export { apiService as default, APIError, requestInterceptor };
export { APIService, RequestInterceptor };
