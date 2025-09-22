export const notificationBadgeStyles = {
  base: 'inline-flex items-center justify-center font-bold text-white rounded-full shadow-[2px_2px_4px_#bebebe,-1px_-1px_2px_#ffffff] min-w-0',
  
  sizes: {
    small: 'text-xs px-1.5 py-0.5 min-w-[18px] h-4',
    medium: 'text-xs px-2 py-1 min-w-[20px] h-5',
    large: 'text-sm px-2.5 py-1 min-w-[24px] h-6',
  },
  
  variants: {
    default: 'bg-red-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    secondary: 'bg-gray-500',
  },
  
  positions: {
    'top-right': 'absolute -top-1 -right-1 z-10',
    'top-left': 'absolute -top-1 -left-1 z-10',
    'bottom-right': 'absolute -bottom-1 -right-1 z-10',
    'bottom-left': 'absolute -bottom-1 -left-1 z-10',
  },
  
  dot: {
    base: 'rounded-full',
    
    sizes: {
      small: 'w-2 h-2',
      medium: 'w-3 h-3',
      large: 'w-4 h-4',
    },
    
    colors: {
      red: 'bg-red-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500',
    },
  },
  
  pulse: {
    base: 'relative',
    
    sizes: {
      small: 'h-2 w-2',
      medium: 'h-3 w-3',
      large: 'h-4 w-4',
    },
  },
};
