export const modalStyles = {
  overlay: 'fixed inset-0 z-50 overflow-y-auto',
  
  backdrop: 'fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300',
  
  container: 'flex min-h-full items-center justify-center p-4',
  
  modal: 'relative bg-gray-100 rounded-2xl shadow-[12px_12px_24px_#bebebe,-12px_-12px_24px_#ffffff] transform transition-all duration-300 w-full',
  
  sizes: {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4',
  },
  
  header: 'flex items-center justify-between p-6 border-b border-gray-200',
  
  title: 'text-lg font-semibold text-gray-900',
  
  content: 'p-6',
  
  footer: 'flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl',
};
