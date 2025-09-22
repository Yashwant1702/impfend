export const cardStyles = {
  base: 'bg-gray-100 rounded-2xl transition-all duration-300 ease-in-out',
  
  variants: {
    raised: 'shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]',
    inset: 'shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff]',
    flat: 'shadow-[0px_0px_0px_#bebebe,0px_0px_0px_#ffffff] border border-gray-200',
    floating: 'shadow-[12px_12px_24px_#bebebe,-12px_-12px_24px_#ffffff]',
  },
  
  sizes: {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
    xlarge: 'p-10',
  },
  
  hover: 'hover:shadow-[12px_12px_24px_#bebebe,-12px_-12px_24px_#ffffff] hover:transform hover:scale-105',
  
  clickable: 'cursor-pointer active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]',
};
