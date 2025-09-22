export const searchBarStyles = {
  container: 'relative',
  
  fullWidth: 'w-full',
  
  input: 'w-full pl-10 pr-20 py-3 bg-gray-100 border-none rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] transition-all duration-200 text-gray-800',
  
  sizes: {
    small: 'py-2 text-sm',
    medium: 'py-3 text-base',
    large: 'py-4 text-lg',
  },
  
  disabled: 'bg-gray-50 text-gray-400 cursor-not-allowed shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]',
  
  suggestions: 'absolute top-full left-0 right-0 mt-2 bg-gray-100 rounded-xl shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] border border-gray-200 max-h-60 overflow-y-auto z-50',
  
  suggestion: 'w-full px-4 py-3 text-left hover:bg-gray-200 transition-colors duration-150 flex items-center justify-between border-b border-gray-200 last:border-b-0',
  
  suggestionHighlighted: 'bg-gray-200 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]',
};
