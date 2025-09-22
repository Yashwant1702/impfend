import { theme } from './theme';

// Animation constants and utilities
export const ANIMATION_CONFIG = {
  // Animation states
  STATES: {
    ENTERING: 'entering',
    ENTERED: 'entered',
    EXITING: 'exiting',
    EXITED: 'exited',
  },
  
  // Animation directions
  DIRECTIONS: {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
    IN: 'in',
    OUT: 'out',
  },
  
  // Animation types
  TYPES: {
    FADE: 'fade',
    SLIDE: 'slide',
    SCALE: 'scale',
    ROTATE: 'rotate',
    BOUNCE: 'bounce',
    PULSE: 'pulse',
    SHAKE: 'shake',
    FLIP: 'flip',
  }
};

// CSS Animation keyframes
export const keyframes = {
  // Fade animations
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  
  fadeOut: `
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `,
  
  fadeInUp: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  fadeInDown: `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  fadeInLeft: `
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  
  fadeInRight: `
    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,

  // Scale animations
  scaleIn: `
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
  
  scaleOut: `
    @keyframes scaleOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.8);
      }
    }
  `,
  
  scaleInCenter: `
    @keyframes scaleInCenter {
      from {
        opacity: 0;
        transform: scale(0) translateZ(0);
      }
      to {
        opacity: 1;
        transform: scale(1) translateZ(0);
      }
    }
  `,

  // Slide animations
  slideInUp: `
    @keyframes slideInUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
  `,
  
  slideInDown: `
    @keyframes slideInDown {
      from {
        transform: translateY(-100%);
      }
      to {
        transform: translateY(0);
      }
    }
  `,
  
  slideInLeft: `
    @keyframes slideInLeft {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }
  `,
  
  slideInRight: `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
  `,

  // Bounce animations
  bounceIn: `
    @keyframes bounceIn {
      0%, 20%, 40%, 60%, 80%, 100% {
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      }
      0% {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
      }
      20% {
        transform: scale3d(1.1, 1.1, 1.1);
      }
      40% {
        transform: scale3d(0.9, 0.9, 0.9);
      }
      60% {
        opacity: 1;
        transform: scale3d(1.03, 1.03, 1.03);
      }
      80% {
        transform: scale3d(0.97, 0.97, 0.97);
      }
      100% {
        opacity: 1;
        transform: scale3d(1, 1, 1);
      }
    }
  `,
  
  bounceOut: `
    @keyframes bounceOut {
      20% {
        transform: scale3d(0.9, 0.9, 0.9);
      }
      50%, 55% {
        opacity: 1;
        transform: scale3d(1.1, 1.1, 1.1);
      }
      100% {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
      }
    }
  `,

  // Pulse animations
  pulse: `
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
  `,
  
  pulseGlow: `
    @keyframes pulseGlow {
      0%, 100% {
        opacity: 1;
        box-shadow: 0 0 0 0 ${theme.colors.primary[400]}40;
      }
      50% {
        opacity: 0.8;
        box-shadow: 0 0 0 10px ${theme.colors.primary[400]}00;
      }
    }
  `,

  // Shake animations
  shake: `
    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      10%, 30%, 50%, 70%, 90% {
        transform: translateX(-5px);
      }
      20%, 40%, 60%, 80% {
        transform: translateX(5px);
      }
    }
  `,
  
  shakeVertical: `
    @keyframes shakeVertical {
      0%, 100% {
        transform: translateY(0);
      }
      10%, 30%, 50%, 70%, 90% {
        transform: translateY(-5px);
      }
      20%, 40%, 60%, 80% {
        transform: translateY(5px);
      }
    }
  `,

  // Rotate animations
  rotateIn: `
    @keyframes rotateIn {
      from {
        opacity: 0;
        transform: rotate3d(0, 0, 1, -200deg);
        transform-origin: center;
      }
      to {
        opacity: 1;
        transform: rotate3d(0, 0, 1, 0deg);
        transform-origin: center;
      }
    }
  `,
  
  rotateOut: `
    @keyframes rotateOut {
      from {
        opacity: 1;
        transform: rotate3d(0, 0, 1, 0deg);
        transform-origin: center;
      }
      to {
        opacity: 0;
        transform: rotate3d(0, 0, 1, 200deg);
        transform-origin: center;
      }
    }
  `,

  // Flip animations
  flipInX: `
    @keyframes flipInX {
      from {
        opacity: 0;
        transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
        animation-timing-function: ease-in;
      }
      40% {
        transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
        animation-timing-function: ease-in;
      }
      60% {
        opacity: 1;
        transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
      }
      80% {
        transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
      }
      to {
        transform: perspective(400px);
      }
    }
  `,
  
  flipInY: `
    @keyframes flipInY {
      from {
        opacity: 0;
        transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
        animation-timing-function: ease-in;
      }
      40% {
        transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
        animation-timing-function: ease-in;
      }
      60% {
        opacity: 1;
        transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
      }
      80% {
        transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
      }
      to {
        transform: perspective(400px);
      }
    }
  `,

  // Float animation
  float: `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }
  `,

  // Wiggle animation
  wiggle: `
    @keyframes wiggle {
      0%, 7% {
        transform: rotateZ(0);
      }
      15% {
        transform: rotateZ(-15deg);
      }
      20% {
        transform: rotateZ(10deg);
      }
      25% {
        transform: rotateZ(-10deg);
      }
      30% {
        transform: rotateZ(6deg);
      }
      35% {
        transform: rotateZ(-4deg);
      }
      40%, 100% {
        transform: rotateZ(0);
      }
    }
  `,

  // Loading animations
  spin: `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  
  loading: `
    @keyframes loading {
      0%, 80%, 100% {
        opacity: 0;
      }
      40% {
        opacity: 1;
      }
    }
  `,
  
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }
  `,

  // Progress animations
  progressBar: `
    @keyframes progressBar {
      0% {
        width: 0%;
      }
      100% {
        width: 100%;
      }
    }
  `,
  
  progressCircle: `
    @keyframes progressCircle {
      0% {
        stroke-dasharray: 0 100;
      }
      100% {
        stroke-dasharray: 100 0;
      }
    }
  `,

  // Neomorphic specific animations
  neomorphicPress: `
    @keyframes neomorphicPress {
      0% {
        box-shadow: ${theme.shadows.raised.medium};
        transform: translateY(0);
      }
      100% {
        box-shadow: ${theme.shadows.inset.medium};
        transform: translateY(1px);
      }
    }
  `,
  
  neomorphicFloat: `
    @keyframes neomorphicFloat {
      0%, 100% {
        box-shadow: ${theme.shadows.raised.medium};
        transform: translateY(0);
      }
      50% {
        box-shadow: ${theme.shadows.floating.medium};
        transform: translateY(-4px);
      }
    }
  `,
};

// Animation classes generator
export const createAnimationClasses = () => {
  const animationClasses = {};
  
  // Generate classes for each keyframe
  Object.keys(keyframes).forEach(animationName => {
    animationClasses[animationName] = `
      ${keyframes[animationName]}
      
      .animate-${animationName} {
        animation: ${animationName} ${theme.animation.duration.normal} ${theme.animation.easing.smooth} both;
      }
      
      .animate-${animationName}-fast {
        animation: ${animationName} ${theme.animation.duration.fast} ${theme.animation.easing.smooth} both;
      }
      
      .animate-${animationName}-slow {
        animation: ${animationName} ${theme.animation.duration.slow} ${theme.animation.easing.smooth} both;
      }
    `;
  });
  
  return animationClasses;
};

// Animation utility functions
export const animationUtils = {
  // Create custom animation
  createAnimation: (name, keyframeRules, duration = 'normal', easing = 'smooth', fillMode = 'both') => `
    @keyframes ${name} {
      ${keyframeRules}
    }
    
    .animate-${name} {
      animation: ${name} ${theme.animation.duration[duration]} ${theme.animation.easing[easing]} ${fillMode};
    }
  `,

  // Animation delay utilities
  createDelayClasses: () => {
    let delayClasses = '';
    for (let i = 1; i <= 10; i++) {
      delayClasses += `
        .animate-delay-${i} {
          animation-delay: ${i * 0.1}s;
        }
      `;
    }
    return delayClasses;
  },

  // Animation duration utilities
  createDurationClasses: () => `
    .animate-duration-fast {
      animation-duration: ${theme.animation.duration.fast} !important;
    }
    .animate-duration-normal {
      animation-duration: ${theme.animation.duration.normal} !important;
    }
    .animate-duration-slow {
      animation-duration: ${theme.animation.duration.slow} !important;
    }
    .animate-duration-slowest {
      animation-duration: ${theme.animation.duration.slowest} !important;
    }
  `,

  // Animation iteration utilities
  createIterationClasses: () => `
    .animate-infinite {
      animation-iteration-count: infinite;
    }
    .animate-once {
      animation-iteration-count: 1;
    }
    .animate-twice {
      animation-iteration-count: 2;
    }
  `,

  // Animation direction utilities
  createDirectionClasses: () => `
    .animate-reverse {
      animation-direction: reverse;
    }
    .animate-alternate {
      animation-direction: alternate;
    }
    .animate-alternate-reverse {
      animation-direction: alternate-reverse;
    }
  `,

  // Animation fill mode utilities
  createFillModeClasses: () => `
    .animate-fill-none {
      animation-fill-mode: none;
    }
    .animate-fill-forwards {
      animation-fill-mode: forwards;
    }
    .animate-fill-backwards {
      animation-fill-mode: backwards;
    }
    .animate-fill-both {
      animation-fill-mode: both;
    }
  `,

  // Animation play state utilities
  createPlayStateClasses: () => `
    .animate-paused {
      animation-play-state: paused;
    }
    .animate-running {
      animation-play-state: running;
    }
  `,
};

// Stagger animation utility
export const staggerAnimation = (elements, animationClass, delayIncrement = 0.1) => {
  elements.forEach((element, index) => {
    if (element) {
      element.style.animationDelay = `${index * delayIncrement}s`;
      element.classList.add(animationClass);
    }
  });
};

// Animation hook helpers
export const animationHelpers = {
  // Check if animations are supported
  supportsAnimation: () => {
    const div = document.createElement('div');
    return 'animationName' in div.style || 'webkitAnimationName' in div.style;
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get animation duration in milliseconds
  getAnimationDuration: (element) => {
    const duration = window.getComputedStyle(element).animationDuration;
    return parseFloat(duration) * (duration.includes('ms') ? 1 : 1000);
  },

  // Wait for animation to complete
  waitForAnimation: (element) => {
    return new Promise(resolve => {
      const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      };
      element.addEventListener('animationend', handleAnimationEnd);
    });
  },

  // Create timeline animation
  createTimeline: (animations) => {
    let totalDelay = 0;
    return animations.map(({ element, animation, duration = 'normal', delay = 0 }) => {
      const animationDelay = totalDelay + delay;
      totalDelay += animationDelay + (typeof duration === 'string' ? 
        parseFloat(theme.animation.duration[duration]) : duration) * 1000;
      
      return {
        element,
        animation,
        delay: animationDelay,
        duration
      };
    });
  },
};

// Export all animations as CSS string
export const getAllAnimationCSS = () => {
  let css = '';
  
  // Add all keyframes
  Object.values(keyframes).forEach(keyframe => {
    css += keyframe;
  });
  
  // Add all animation classes
  const animationClasses = createAnimationClasses();
  Object.values(animationClasses).forEach(classRule => {
    css += classRule;
  });
  
  // Add utility classes
  css += animationUtils.createDelayClasses();
  css += animationUtils.createDurationClasses();
  css += animationUtils.createIterationClasses();
  css += animationUtils.createDirectionClasses();
  css += animationUtils.createFillModeClasses();
  css += animationUtils.createPlayStateClasses();
  
  return css;
};

export default {
  ANIMATION_CONFIG,
  keyframes,
  createAnimationClasses,
  animationUtils,
  staggerAnimation,
  animationHelpers,
  getAllAnimationCSS,
};
