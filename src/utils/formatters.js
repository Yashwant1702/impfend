// Number formatters
export const numberFormatters = {
  // Format large numbers (1K, 1M, 1B)
  compact: (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    
    if (absNum >= 1e9) {
      return sign + (absNum / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (absNum >= 1e6) {
      return sign + (absNum / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (absNum >= 1e3) {
      return sign + (absNum / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  },

  // Format currency
  currency: (amount, currency = 'USD', locale = 'en-US') => {
    if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Format percentage
  percentage: (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    return `${(value * 100).toFixed(decimals)}%`;
  },

  // Format with commas
  withCommas: (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Format ordinal numbers (1st, 2nd, 3rd)
  ordinal: (num) => {
    if (num === null || num === undefined || isNaN(num)) return '';
    
    const j = num % 10;
    const k = num % 100;
    
    if (j === 1 && k !== 11) return num + 'st';
    if (j === 2 && k !== 12) return num + 'nd';
    if (j === 3 && k !== 13) return num + 'rd';
    return num + 'th';
  },

  // Format decimal places
  decimal: (num, places = 2) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return parseFloat(num).toFixed(places);
  },
};

// Date formatters
export const dateFormatters = {
  // Format relative time (2 hours ago, 3 days ago)
  relative: (date) => {
    if (!date) return '';
    
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  },

  // Format date in various formats
  format: (date, format = 'short') => {
    if (!date) return '';
    
    const d = new Date(date);
    
    const formats = {
      short: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      medium: { year: 'numeric', month: 'long', day: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' },
      datetime: { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      },
      iso: () => d.toISOString().split('T')[0],
      timestamp: () => d.getTime(),
    };

    if (format === 'iso') return formats.iso();
    if (format === 'timestamp') return formats.timestamp();
    
    return d.toLocaleDateString('en-US', formats[format] || formats.short);
  },

  // Get day of week
  dayOfWeek: (date, format = 'long') => {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: format // 'long', 'short', 'narrow'
    });
  },

  // Get month name
  monthName: (date, format = 'long') => {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: format // 'long', 'short', 'narrow'
    });
  },

  // Format duration (2h 30m)
  duration: (milliseconds) => {
    if (!milliseconds || milliseconds < 0) return '0m';
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return `${seconds}s`;
  },

  // Check if date is today
  isToday: (date) => {
    if (!date) return false;
    
    const today = new Date();
    const checkDate = new Date(date);
    
    return today.getDate() === checkDate.getDate() &&
           today.getMonth() === checkDate.getMonth() &&
           today.getFullYear() === checkDate.getFullYear();
  },

  // Check if date is tomorrow
  isTomorrow: (date) => {
    if (!date) return false;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkDate = new Date(date);
    
    return tomorrow.getDate() === checkDate.getDate() &&
           tomorrow.getMonth() === checkDate.getMonth() &&
           tomorrow.getFullYear() === checkDate.getFullYear();
  },
};

// Text formatters
export const textFormatters = {
  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Title case
  titleCase: (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Camel case to words
  camelToWords: (str) => {
    if (!str) return '';
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
  },

  // Snake case to words
  snakeToWords: (str) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  },

  // Truncate text
  truncate: (str, maxLength = 100, suffix = '...') => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substr(0, maxLength - suffix.length) + suffix;
  },

  // Truncate by words
  truncateWords: (str, maxWords = 10, suffix = '...') => {
    if (!str) return '';
    const words = str.split(' ');
    if (words.length <= maxWords) return str;
    return words.slice(0, maxWords).join(' ') + suffix;
  },

  // Remove HTML tags
  stripHtml: (str) => {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '');
  },

  // Extract initials
  initials: (str, maxLength = 2) => {
    if (!str) return '';
    return str.split(' ')
              .map(word => word.charAt(0).toUpperCase())
              .slice(0, maxLength)
              .join('');
  },

  // Pluralize
  pluralize: (count, singular, plural = null) => {
    if (count === 1) return singular;
    return plural || singular + 's';
  },

  // Generate slug
  slug: (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Highlight search terms
  highlight: (text, searchTerm) => {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },
};

// File formatters
export const fileFormatters = {
  // Format file size
  size: (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get file extension
  extension: (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
  },

  // Get filename without extension
  nameWithoutExtension: (filename) => {
    if (!filename) return '';
    return filename.replace(/\.[^/.]+$/, '');
  },

  // Check file type
  type: (filename) => {
    if (!filename) return 'unknown';
    
    const ext = fileFormatters.extension(filename);
    const types = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
      video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
      audio: ['mp3', 'wav', 'ogg', 'aac', 'flac'],
      document: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
      spreadsheet: ['xls', 'xlsx', 'csv'],
      presentation: ['ppt', 'pptx'],
      archive: ['zip', 'rar', '7z', 'tar', 'gz'],
      code: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'json', 'xml'],
    };

    for (const [type, extensions] of Object.entries(types)) {
      if (extensions.includes(ext)) return type;
    }
    
    return 'unknown';
  },

  // Get file icon based on type
  icon: (filename) => {
    const type = fileFormatters.type(filename);
    const icons = {
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      document: '📄',
      spreadsheet: '📊',
      presentation: '📽️',
      archive: '🗜️',
      code: '💻',
      unknown: '📎',
    };
    
    return icons[type] || icons.unknown;
  },
};

// URL formatters
export const urlFormatters = {
  // Clean URL
  clean: (url) => {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  },

  // Get domain from URL
  domain: (url) => {
    if (!url) return '';
    try {
      return new URL(url.includes('://') ? url : `https://${url}`).hostname;
    } catch {
      return url;
    }
  },

  // Add protocol if missing
  addProtocol: (url, protocol = 'https://') => {
    if (!url) return '';
    return url.includes('://') ? url : protocol + url;
  },

  // Create query string
  queryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  },

  // Parse query string
  parseQuery: (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (let [key, value] of params) {
      result[key] = value;
    }
    return result;
  },
};

// Phone formatters
export const phoneFormatters = {
  // Format US phone number
  us: (phone) => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phone;
  },

  // Format international phone
  international: (phone, countryCode = '+1') => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    return `${countryCode} ${cleaned}`;
  },

  // Clean phone number (digits only)
  clean: (phone) => {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  },
};

// Color formatters
export const colorFormatters = {
  // Convert hex to RGB
  hexToRgb: (hex) => {
    if (!hex) return null;
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // Convert RGB to hex
  rgbToHex: (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  // Generate random color
  random: () => {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
  },

  // Get contrast color (black or white)
  contrast: (hex) => {
    const rgb = colorFormatters.hexToRgb(hex);
    if (!rgb) return '#000000';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  },
};

// Address formatters
export const addressFormatters = {
  // Format full address
  full: (address) => {
    if (!address) return '';
    
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zipCode) parts.push(address.zipCode);
    if (address.country) parts.push(address.country);
    
    return parts.join(', ');
  },

  // Format city, state
  cityState: (address) => {
    if (!address) return '';
    
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    
    return parts.join(', ');
  },
};

// Export all formatters
export default {
  number: numberFormatters,
  date: dateFormatters,
  text: textFormatters,
  file: fileFormatters,
  url: urlFormatters,
  phone: phoneFormatters,
  color: colorFormatters,
  address: addressFormatters,
};
