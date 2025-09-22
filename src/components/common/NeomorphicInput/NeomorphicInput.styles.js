export const inputStyles = {
  base: 'block bg-gray-100 border-none rounded-xl transition-all duration-200 focus:outline-none text-gray-800',
  
  states: {
    default: 'shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]',
    focused: 'shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] ring-2 ring-blue-300 ring-opacity-50',
    error: 'shadow-[inset_4px_4px_8px_#d4a7a7,inset_-4px_-4px_8px_#fdd3d3] bg-red-50',
    disabled: 'shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff] bg-gray-50 text-gray-400 cursor-not-allowed',
  },
  
  sizes: {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-5 py-4 text-lg',
  },
  
  fullWidth: 'w-full',
  
  iconLeft: 'pl-12',
  
  iconRight: 'pr-12',
};
