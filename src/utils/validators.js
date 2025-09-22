// Email validation
export const emailValidators = {
  // Basic email format
  isValid: (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // College email validation
  isCollegeEmail: (email) => {
    if (!emailValidators.isValid(email)) return false;
    
    // Common college email domains
    const collegeDomains = [
      '.edu', '.ac.', '.university', '.college',
      // Add more patterns as needed
    ];
    
    return collegeDomains.some(domain => email.toLowerCase().includes(domain));
  },

  // Domain validation
  hasDomain: (email, domains = []) => {
    if (!emailValidators.isValid(email) || !domains.length) return false;
    
    const emailDomain = email.split('@')[1].toLowerCase();
    return domains.some(domain => emailDomain === domain.toLowerCase());
  },

  // Email length validation
  isValidLength: (email) => {
    return email && email.length >= 5 && email.length <= 254;
  },
};

// Password validation
export const passwordValidators = {
  // Minimum length
  minLength: (password, minLength = 8) => {
    return password && password.length >= minLength;
  },

  // Maximum length
  maxLength: (password, maxLength = 128) => {
    return password && password.length <= maxLength;
  },

  // Contains uppercase
  hasUppercase: (password) => {
    return password && /[A-Z]/.test(password);
  },

  // Contains lowercase
  hasLowercase: (password) => {
    return password && /[a-z]/.test(password);
  },

  // Contains number
  hasNumber: (password) => {
    return password && /\d/.test(password);
  },

  // Contains special character
  hasSpecialChar: (password) => {
    return password && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  },

  // No common patterns
  noCommonPatterns: (password) => {
    if (!password) return false;
    
    const commonPatterns = [
      /^(.)\1{2,}$/, // Same character repeated
      /^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i,
      /^(qwerty|asdfgh|zxcvbn|password|admin)/i,
    ];
    
    return !commonPatterns.some(pattern => pattern.test(password));
  },

  // Overall strength
  strength: (password) => {
    if (!password) return { score: 0, level: 'weak' };
    
    let score = 0;
    const checks = [
      passwordValidators.minLength(password, 8),
      passwordValidators.hasUppercase(password),
      passwordValidators.hasLowercase(password),
      passwordValidators.hasNumber(password),
      passwordValidators.hasSpecialChar(password),
      passwordValidators.noCommonPatterns(password),
      passwordValidators.minLength(password, 12),
    ];
    
    score = checks.filter(Boolean).length;
    
    if (score < 3) return { score, level: 'weak' };
    if (score < 5) return { score, level: 'medium' };
    if (score < 7) return { score, level: 'strong' };
    return { score, level: 'very-strong' };
  },

  // Password match
  matches: (password, confirmPassword) => {
    return password && confirmPassword && password === confirmPassword;
  },
};

// Name validation
export const nameValidators = {
  // Valid name format
  isValid: (name) => {
    if (!name) return false;
    const nameRegex = /^[a-zA-Z\s\-'\.]{2,50}$/;
    return nameRegex.test(name.trim());
  },

  // Minimum length
  minLength: (name, minLength = 2) => {
    return name && name.trim().length >= minLength;
  },

  // Maximum length
  maxLength: (name, maxLength = 50) => {
    return name && name.trim().length <= maxLength;
  },

  // Has multiple parts (first and last name)
  hasMultipleParts: (name) => {
    return name && name.trim().split(/\s+/).length >= 2;
  },
};

// Phone validation
export const phoneValidators = {
  // US phone number
  isValidUS: (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
  },

  // International phone number
  isValidInternational: (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 7 && cleaned.length <= 15;
  },

  // Has valid format
  hasValidFormat: (phone) => {
    if (!phone) return false;
    const formats = [
      /^\(\d{3}\) \d{3}-\d{4}$/,     // (123) 456-7890
      /^\d{3}-\d{3}-\d{4}$/,         // 123-456-7890
      /^\d{3}\.\d{3}\.\d{4}$/,       // 123.456.7890
      /^\d{10}$/,                    // 1234567890
      /^\+\d{1,3}\s?\d{4,14}$/,      // +1 1234567890
    ];
    
    return formats.some(format => format.test(phone));
  },
};

// URL validation
export const urlValidators = {
  // Valid URL format
  isValid: (url) => {
    if (!url) return false;
    try {
      new URL(url.includes('://') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  },

  // HTTPS URL
  isHTTPS: (url) => {
    if (!url) return false;
    return url.toLowerCase().startsWith('https://');
  },

  // Valid domain
  hasValidDomain: (url) => {
    if (!urlValidators.isValid(url)) return false;
    try {
      const domain = new URL(url.includes('://') ? url : `https://${url}`).hostname;
      return /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/.test(domain);
    } catch {
      return false;
    }
  },
};

// Date validation
export const dateValidators = {
  // Valid date
  isValid: (date) => {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  },

  // Date is in the future
  isFuture: (date) => {
    if (!dateValidators.isValid(date)) return false;
    return new Date(date) > new Date();
  },

  // Date is in the past
  isPast: (date) => {
    if (!dateValidators.isValid(date)) return false;
    return new Date(date) < new Date();
  },

  // Date is today
  isToday: (date) => {
    if (!dateValidators.isValid(date)) return false;
    const today = new Date();
    const checkDate = new Date(date);
    
    return today.getDate() === checkDate.getDate() &&
           today.getMonth() === checkDate.getMonth() &&
           today.getFullYear() === checkDate.getFullYear();
  },

  // Age validation
  isValidAge: (birthDate, minAge = 13, maxAge = 120) => {
    if (!dateValidators.isValid(birthDate)) return false;
    
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
    
    return actualAge >= minAge && actualAge <= maxAge;
  },

  // Date range validation
  isInRange: (date, startDate, endDate) => {
    if (!dateValidators.isValid(date)) return false;
    
    const checkDate = new Date(date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && checkDate < start) return false;
    if (end && checkDate > end) return false;
    
    return true;
  },
};

// File validation
export const fileValidators = {
  // Valid file type
  isValidType: (file, allowedTypes = []) => {
    if (!file || !allowedTypes.length) return false;
    
    return allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.toLowerCase().includes(type.toLowerCase());
    });
  },

  // Valid file size
  isValidSize: (file, maxSizeInMB = 10) => {
    if (!file) return false;
    
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  },

  // Image file
  isImage: (file) => {
    return fileValidators.isValidType(file, ['image/']);
  },

  // Document file
  isDocument: (file) => {
    return fileValidators.isValidType(file, [
      '.pdf', '.doc', '.docx', '.txt', '.rtf'
    ]);
  },

  // Valid image dimensions
  hasValidDimensions: (file, minWidth = 0, minHeight = 0, maxWidth = Infinity, maxHeight = Infinity) => {
    return new Promise((resolve) => {
      if (!fileValidators.isImage(file)) {
        resolve(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const valid = img.width >= minWidth && 
                     img.height >= minHeight && 
                     img.width <= maxWidth && 
                     img.height <= maxHeight;
        resolve(valid);
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  },
};

// Form validation
export const formValidators = {
  // Required field
  required: (value) => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
  },

  // Field length
  length: (value, min = 0, max = Infinity) => {
    if (!value) return min === 0;
    const length = typeof value === 'string' ? value.length : 
                  Array.isArray(value) ? value.length : 0;
    return length >= min && length <= max;
  },

  // Numeric value
  isNumeric: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },

  // Integer value
  isInteger: (value) => {
    return Number.isInteger(Number(value));
  },

  // Number range
  numberRange: (value, min = -Infinity, max = Infinity) => {
    if (!formValidators.isNumeric(value)) return false;
    const num = Number(value);
    return num >= min && num <= max;
  },

  // Alpha characters only
  isAlpha: (value) => {
    return /^[a-zA-Z]+$/.test(value);
  },

  // Alphanumeric characters only
  isAlphaNumeric: (value) => {
    return /^[a-zA-Z0-9]+$/.test(value);
  },

  // Custom pattern
  pattern: (value, regex) => {
    return regex.test(value);
  },
};

// Social media validation
export const socialValidators = {
  // Facebook URL
  facebook: (url) => {
    return /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9\.]+\/?$/.test(url);
  },

  // Twitter URL
  twitter: (url) => {
    return /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/.test(url);
  },

  // Instagram URL
  instagram: (url) => {
    return /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/.test(url);
  },

  // LinkedIn URL
  linkedin: (url) => {
    return /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+\/?$/.test(url);
  },

  // YouTube URL
  youtube: (url) => {
    return /^https?:\/\/(www\.)?youtube\.com\/(channel|user|c)\/[a-zA-Z0-9_-]+\/?$/.test(url);
  },
};

// Comprehensive validator
export const validate = (value, rules = []) => {
  const errors = [];
  
  for (const rule of rules) {
    const { validator, message, params = [] } = rule;
    
    let isValid = false;
    
    if (typeof validator === 'function') {
      isValid = validator(value, ...params);
    } else if (typeof validator === 'string') {
      // Handle string-based validators
      const validatorParts = validator.split('.');
      let validatorFn = window;
      
      for (const part of validatorParts) {
        validatorFn = validatorFn[part];
        if (!validatorFn) break;
      }
      
      if (typeof validatorFn === 'function') {
        isValid = validatorFn(value, ...params);
      }
    }
    
    if (!isValid) {
      errors.push(message || 'Validation failed');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export all validators
export default {
  email: emailValidators,
  password: passwordValidators,
  name: nameValidators,
  phone: phoneValidators,
  url: urlValidators,
  date: dateValidators,
  file: fileValidators,
  form: formValidators,
  social: socialValidators,
  validate,
};
