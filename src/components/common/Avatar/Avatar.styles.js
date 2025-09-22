export const avatarStyles = {
  base: 'inline-flex items-center justify-center bg-gray-300 text-gray-700 font-medium overflow-hidden flex-shrink-0 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]',
  
  sizes: {
    xsmall: 'w-6 h-6 text-xs',
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg',
    xlarge: 'w-16 h-16 text-xl',
    xxlarge: 'w-20 h-20 text-2xl',
  },
  
  variants: {
    circular: 'rounded-full',
    square: 'rounded-lg',
    rounded: 'rounded-md',
  },
  
  clickable: 'cursor-pointer hover:shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] transition-all duration-200',
};
