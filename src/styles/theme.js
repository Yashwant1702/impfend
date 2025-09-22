// Complete Neomorphic Theme Configuration
export const theme = {
  // Color Palette - White to Sea Grass Gradient
  colors: {
    // Primary gradient colors (White to Sea Grass)
    primary: {
      50: '#ffffff',   // Pure white
      100: '#f8fffe',  // Very light mint
      200: '#f3fdfb',  // Light mint
      300: '#e6faf5',  // Soft mint
      400: '#d1f5e8',  // Medium mint
      500: '#9fedd1',  // Light sea grass
      600: '#52d4a0',  // Main sea grass
      700: '#36b883',  // Darker sea grass
      800: '#2d9968',  // Deep sea grass
      900: '#1e6b47',  // Very deep sea grass
    },
    
    // Neutral colors for neomorphic effects
    neutral: {
      white: '#ffffff',
      lightest: '#fefefe',
      lighter: '#fafafa',
      light: '#f7f7f7',
      gray: '#e8e8e8',
      mediumGray: '#d0d0d0',
      darkGray: '#a8a8a8',
      darker: '#666666',
      darkest: '#2d2d2d',
      text: '#2d3748',
      textSecondary: '#4a5568',
      textMuted: '#718096',
      border: '#e2e8f0',
    },
    
    // Semantic colors
    semantic: {
      success: {
        light: '#c6f6d5',
        main: '#48bb78',
        dark: '#2f855a',
      },
      warning: {
        light: '#faf089',
        main: '#ed8936',
        dark: '#c05621',
      },
      error: {
        light: '#fed7d7',
        main: '#f56565',
        dark: '#c53030',
      },
      info: {
        light: '#bee3f8',
        main: '#4299e1',
        dark: '#2b6cb0',
      },
    },
    
    // Background gradients
    gradients: {
      primary: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 20%, #f3fdfb 40%, #e6faf5 60%, #d1f5e8 80%, #52d4a0 100%)',
      primaryReverse: 'linear-gradient(315deg, #ffffff 0%, #f8fffe 20%, #f3fdfb 40%, #e6faf5 60%, #d1f5e8 80%, #52d4a0 100%)',
      card: 'linear-gradient(145deg, #ffffff 0%, #f8fffe 50%, #f3fdfb 100%)',
      cardHover: 'linear-gradient(145deg, #f8fffe 0%, #f3fdfb 50%, #e6faf5 100%)',
      button: 'linear-gradient(135deg, #52d4a0 0%, #36b883 100%)',
      buttonHover: 'linear-gradient(135deg, #36b883 0%, #2d9968 100%)',
      buttonPressed: 'linear-gradient(135deg, #2d9968 0%, #1e6b47 100%)',
      header: 'linear-gradient(90deg, #ffffff 0%, #f3fdfb 100%)',
      sidebar: 'linear-gradient(180deg, #ffffff 0%, #f8fffe 100%)',
      modal: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
    }
  },

  // Neomorphic Shadow System
  shadows: {
    // Inset shadows (pressed/focused states)
    inset: {
      small: 'inset 3px 3px 6px #d4d4d4, inset -3px -3px 6px #ffffff',
      medium: 'inset 5px 5px 10px #d4d4d4, inset -5px -5px 10px #ffffff',
      large: 'inset 8px 8px 16px #d4d4d4, inset -8px -8px 16px #ffffff',
    },
    
    // Raised shadows (normal states)
    raised: {
      small: '3px 3px 6px #d4d4d4, -3px -3px 6px #ffffff',
      medium: '5px 5px 10px #d4d4d4, -5px -5px 10px #ffffff',
      large: '8px 8px 16px #d4d4d4, -8px -8px 16px #ffffff',
      extraLarge: '12px 12px 24px #d4d4d4, -12px -12px 24px #ffffff',
    },
    
    // Floating shadows (hover states)
    floating: {
      small: '4px 4px 8px #c8c8c8, -4px -4px 8px #ffffff',
      medium: '6px 6px 12px #c8c8c8, -6px -6px 12px #ffffff',
      large: '10px 10px 20px #c8c8c8, -10px -10px 20px #ffffff',
      extraLarge: '15px 15px 30px #c8c8c8, -15px -15px 30px #ffffff',
    },
    
    // Soft shadows for subtle elevation
    soft: {
      small: '2px 2px 4px rgba(212, 212, 212, 0.4), -2px -2px 4px rgba(255, 255, 255, 0.9)',
      medium: '4px 4px 8px rgba(212, 212, 212, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.9)',
      large: '6px 6px 12px rgba(212, 212, 212, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.9)',
    },
    
    // Dropdown shadows
    dropdown: '8px 8px 16px rgba(212, 212, 212, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.8)',
    
    // Modal shadows
    modal: '20px 20px 40px rgba(212, 212, 212, 0.6), -20px -20px 40px rgba(255, 255, 255, 0.8)',
  },

  // Typography system
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      secondary: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
    },
    
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    
    fontWeight: {
      thin: 100,
      extraLight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
      black: 900,
    },
    
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    }
  },

  // Spacing system
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',   // 2px
    1: '0.25rem',      // 4px
    1.5: '0.375rem',   // 6px
    2: '0.5rem',       // 8px
    2.5: '0.625rem',   // 10px
    3: '0.75rem',      // 12px
    3.5: '0.875rem',   // 14px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    7: '1.75rem',      // 28px
    8: '2rem',         // 32px
    9: '2.25rem',      // 36px
    10: '2.5rem',      // 40px
    11: '2.75rem',     // 44px
    12: '3rem',        // 48px
    14: '3.5rem',      // 56px
    16: '4rem',        // 64px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
    28: '7rem',        // 112px
    32: '8rem',        // 128px
    36: '9rem',        // 144px
    40: '10rem',       // 160px
    44: '11rem',       // 176px
    48: '12rem',       // 192px
    52: '13rem',       // 208px
    56: '14rem',       // 224px
    60: '15rem',       // 240px
    64: '16rem',       // 256px
    72: '18rem',       // 288px
    80: '20rem',       // 320px
    96: '24rem',       // 384px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',    // 2px
    base: '0.25rem',   // 4px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',   // 24px
    full: '50%',
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 100,
    sticky: 200,
    banner: 300,
    overlay: 400,
    modal: 500,
    popover: 600,
    skipLink: 700,
    toast: 800,
    tooltip: 900,
    max: 999999,
  },

  // Animation and transitions
  animation: {
    duration: {
      fastest: '0.1s',
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s',
      slowest: '0.8s',
    },
    
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      bounceIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      bounceOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

   // Component-specific configurations
  components: {
    button: {
      height: {
        xs: '1.75rem',   // 28px
        sm: '2rem',      // 32px
        md: '2.5rem',    // 40px
        lg: '3rem',      // 48px
        xl: '3.5rem',    // 56px
      },
      padding: {
        xs: '0.375rem 0.75rem',  // 6px 12px
        sm: '0.5rem 1rem',       // 8px 16px
        md: '0.625rem 1.25rem',  // 10px 20px
        lg: '0.75rem 1.5rem',    // 12px 24px
        xl: '1rem 2rem',         // 16px 32px
      },
      borderRadius: {
        sm: '0.375rem',   // 6px
        md: '0.5rem',     // 8px
        lg: '0.75rem',    // 12px
        xl: '1rem',       // 16px
      }
    },
    
    input: {
      height: {
        sm: '2rem',      // 32px
        md: '2.5rem',    // 40px
        lg: '3rem',      // 48px
      },
      padding: {
        sm: '0.375rem 0.75rem',
        md: '0.625rem 1rem',
        lg: '0.75rem 1.25rem',
      }
    },
    
    card: {
      padding: {
        sm: '1rem',      // 16px
        md: '1.5rem',    // 24px
        lg: '2rem',      // 32px
        xl: '2.5rem',    // 40px
      },
      borderRadius: {
        sm: '0.75rem',   // 12px
        md: '1rem',      // 16px
        lg: '1.25rem',   // 20px
        xl: '1.5rem',    // 24px
      }
    },
    
    modal: {
      borderRadius: '1.5rem',  // 24px
      padding: '2rem',         // 32px
      maxWidth: {
        sm: '28rem',    // 448px
        md: '32rem',    // 512px
        lg: '48rem',    // 768px
        xl: '56rem',    // 896px
      }
    }
  }
};

// Export default theme
export default theme;