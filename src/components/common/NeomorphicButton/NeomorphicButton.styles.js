export const buttonStyles = {
  base: 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none bg-gray-100 text-gray-800 border-none',
  
  variants: {
    primary: 'shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]',
    secondary: 'shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#bebebe,inset_-3px_-3px_6px_#ffffff]',
    success: 'bg-green-100 text-green-800 shadow-[6px_6px_12px_#a7c7a7,-6px_-6px_12px_#d3f2d3] hover:shadow-[8px_8px_16px_#a7c7a7,-8px_-8px_16px_#d3f2d3] active:shadow-[inset_4px_4px_8px_#a7c7a7,inset_-4px_-4px_8px_#d3f2d3]',
    danger: 'bg-red-100 text-red-800 shadow-[6px_6px_12px_#d4a7a7,-6px_-6px_12px_#fdd3d3] hover:shadow-[8px_8px_16px_#d4a7a7,-8px_-8px_16px_#fdd3d3] active:shadow-[inset_4px_4px_8px_#d4a7a7,inset_-4px_-4px_8px_#fdd3d3]',
    ghost: 'bg-transparent shadow-none hover:bg-gray-50 active:bg-gray-100',
  },
  
  sizes: {
    small: 'px-3 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  },
  
  fullWidth: 'w-full',
  
  disabled: 'opacity-50 cursor-not-allowed shadow-none',
  
  loading: 'cursor-wait',
};
