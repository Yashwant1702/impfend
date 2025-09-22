import { theme } from './theme';

// Neomorphic effect mixins
export const neomorphicMixins = {
  // Basic neomorphic card
  card: (size = 'medium') => `
    background: ${theme.colors.gradients.card};
    border-radius: ${theme.components.card.borderRadius[size]};
    box-shadow: ${theme.shadows.raised[size]};
    transition: all ${theme.animation.duration.normal} ${theme.animation.easing.smooth};
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.8), 
        transparent
      );
    }

    &:hover {
      background: ${theme.colors.gradients.cardHover};
      box-shadow: ${theme.shadows.floating[size]};
      transform: translateY(-2px);
    }
  `,

  // Neomorphic button
  button: (variant = 'secondary', size = 'md') => `
    background: ${variant === 'primary' ? theme.colors.gradients.button : theme.colors.neutral.white};
    color: ${variant === 'primary' ? theme.colors.neutral.white : theme.colors.neutral.text};
    border: none;
    border-radius: ${theme.components.button.borderRadius[size]};
    padding: ${theme.components.button.padding[size]};
    font-family: ${theme.typography.fontFamily.primary};
    font-weight: ${theme.typography.fontWeight.medium};
    box-shadow: ${theme.shadows.raised.small};
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all ${theme.animation.duration.fast} ${theme.animation.easing.smooth};
    user-select: none;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.4), 
        transparent
      );
      transition: left ${theme.animation.duration.slow} ease;
    }

    &:hover {
      background: ${variant === 'primary' ? theme.colors.gradients.buttonHover : theme.colors.neutral.lighter};
      box-shadow: ${theme.shadows.floating.small};
      transform: translateY(-1px);
    }

    &:hover::before {
      left: 100%;
    }

    &:active {
      box-shadow: ${theme.shadows.inset.small};
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: ${theme.shadows.raised.small};
      
      &:hover {
        transform: none;
        box-shadow: ${theme.shadows.raised.small};
      }
    }
  `,

  // Neomorphic input
  input: (size = 'md') => `
    background: ${theme.colors.neutral.white};
    border: none;
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.components.input.padding[size]};
    font-family: ${theme.typography.fontFamily.primary};
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.neutral.text};
    box-shadow: ${theme.shadows.inset.small};
    transition: all ${theme.animation.duration.normal} ${theme.animation.easing.smooth};
    width: 100%;

    &::placeholder {
      color: ${theme.colors.neutral.textMuted};
      opacity: 1;
    }

    &:focus {
      outline: none;
      box-shadow: ${theme.shadows.inset.medium};
    }

    &:hover {
      box-shadow: ${theme.shadows.inset.medium};
    }
  `,

  // Neomorphic container
  container: (padding = 'md') => `
    background: ${theme.colors.gradients.card};
    border-radius: ${theme.components.card.borderRadius.lg};
    padding: ${theme.components.card.padding[padding]};
    box-shadow: ${theme.shadows.raised.medium};
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.6), 
        transparent
      );
    }
  `,
};

// Layout mixins
export const layoutMixins = {
  // Flex utilities
  flexCenter: `
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  flexBetween: `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  flexColumn: `
    display: flex;
    flex-direction: column;
  `,

  // Grid utilities
  gridAuto: (minWidth = '250px') => `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${minWidth}, 1fr));
    gap: ${theme.spacing[4]};
  `,

  gridCols: (cols) => `
    display: grid;
    grid-template-columns: repeat(${cols}, 1fr);
    gap: ${theme.spacing[4]};
  `,

  // Container utilities
  container: (maxWidth = '1200px') => `
    max-width: ${maxWidth};
    margin: 0 auto;
    padding: 0 ${theme.spacing[4]};

    @media (min-width: ${theme.breakpoints.sm}) {
      padding: 0 ${theme.spacing[6]};
    }

    @media (min-width: ${theme.breakpoints.lg}) {
      padding: 0 ${theme.spacing[8]};
    }
  `,

  // Centering utilities
  absoluteCenter: `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,

  // Aspect ratio utilities
  aspectRatio: (ratio = '16/9') => `
    aspect-ratio: ${ratio};
    
    @supports not (aspect-ratio: ${ratio}) {
      position: relative;
      
      &::before {
        content: '';
        display: block;
        padding-bottom: ${ratio === '16/9' ? '56.25%' : ratio === '4/3' ? '75%' : ratio === '1/1' ? '100%' : '56.25%'};
      }
      
      > * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  `,
};

// Typography mixins
export const typographyMixins = {
  // Text utilities
  textTruncate: `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  textClamp: (lines = 2) => `
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `,

  // Heading styles
  heading: (size = 'lg', weight = 'semiBold') => `
    font-size: ${theme.typography.fontSize[size]};
    font-weight: ${theme.typography.fontWeight[weight]};
    line-height: ${theme.typography.lineHeight.tight};
    color: ${theme.colors.neutral.text};
    margin-bottom: ${theme.spacing[2]};
  `,

  // Body text styles
  bodyText: (size = 'base', color = 'text') => `
    font-size: ${theme.typography.fontSize[size]};
    line-height: ${theme.typography.lineHeight.relaxed};
    color: ${theme.colors.neutral[color]};
    margin-bottom: ${theme.spacing[4]};
  `,

  // Caption text
  caption: `
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.neutral.textMuted};
    line-height: ${theme.typography.lineHeight.normal};
  `,
};

// Animation mixins
export const animationMixins = {
  // Fade animations
  fadeIn: (duration = 'normal') => `
    opacity: 0;
    animation: fadeIn ${theme.animation.duration[duration]} ${theme.animation.easing.smooth} forwards;
  `,

  fadeOut: (duration = 'normal') => `
    animation: fadeOut ${theme.animation.duration[duration]} ${theme.animation.easing.smooth} forwards;
  `,

  // Slide animations
  slideUp: (duration = 'normal', distance = '20px') => `
    opacity: 0;
    transform: translateY(${distance});
    animation: slideUp ${theme.animation.duration[duration]} ${theme.animation.easing.smooth} forwards;
  `,

  slideDown: (duration = 'normal', distance = '20px') => `
    opacity: 0;
    transform: translateY(-${distance});
    animation: slideDown ${theme.animation.duration[duration]} ${theme.animation.easing.smooth} forwards;
  `,

  // Scale animations
  scaleIn: (duration = 'fast') => `
    opacity: 0;
    transform: scale(0.9);
    animation: scaleIn ${theme.animation.duration[duration]} ${theme.animation.easing.bounceOut} forwards;
  `,

  // Hover effects
  hoverLift: `
    transition: transform ${theme.animation.duration.fast} ${theme.animation.easing.smooth};
    
    &:hover {
      transform: translateY(-2px);
    }
  `,

  hoverScale: (scale = '1.02') => `
    transition: transform ${theme.animation.duration.fast} ${theme.animation.easing.smooth};
    
    &:hover {
      transform: scale(${scale});
    }
  `,
};

// Responsive mixins
export const responsiveMixins = {
  // Media queries
  mobile: (styles) => `
    @media (max-width: ${theme.breakpoints.md}) {
      ${styles}
    }
  `,

  tablet: (styles) => `
    @media (min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg}) {
      ${styles}
    }
  `,

  desktop: (styles) => `
    @media (min-width: ${theme.breakpoints.lg}) {
      ${styles}
    }
  `,

  // Responsive text
  responsiveText: `
    font-size: ${theme.typography.fontSize.sm};
    
    @media (min-width: ${theme.breakpoints.sm}) {
      font-size: ${theme.typography.fontSize.base};
    }
    
    @media (min-width: ${theme.breakpoints.lg}) {
      font-size: ${theme.typography.fontSize.lg};
    }
  `,

  // Responsive spacing
  responsivePadding: `
    padding: ${theme.spacing[4]};
    
    @media (min-width: ${theme.breakpoints.sm}) {
      padding: ${theme.spacing[6]};
    }
    
    @media (min-width: ${theme.breakpoints.lg}) {
      padding: ${theme.spacing[8]};
    }
  `,
};

// Export all mixins
export default {
  neomorphic: neomorphicMixins,
  layout: layoutMixins,
  typography: typographyMixins,
  animation: animationMixins,
  responsive: responsiveMixins,
};
