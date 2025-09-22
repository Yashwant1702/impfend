import React from 'react';
import { cardStyles } from './NeomorphicCard.styles';

const NeomorphicCard = ({
  children,
  variant = 'raised',
  size = 'medium',
  hover = false,
  clickable = false,
  onClick,
  className = '',
  ...props
}) => {
  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  const cardClasses = [
    cardStyles.base,
    cardStyles.variants[variant] || cardStyles.variants.raised,
    cardStyles.sizes[size] || cardStyles.sizes.medium,
    hover ? cardStyles.hover : '',
    clickable ? cardStyles.clickable : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default NeomorphicCard;
