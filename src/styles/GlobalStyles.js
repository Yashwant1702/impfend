import { theme } from './theme';

export const createGlobalStyles = () => `
  /* CSS Reset and Base Styles */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -ms-overflow-style: scrollbar;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.typography.fontFamily.primary};
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.normal};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.neutral.text};
    background: ${theme.colors.gradients.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* Root container */
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Typography improvements */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.typography.fontWeight.semiBold};
    line-height: ${theme.typography.lineHeight.tight};
    color: ${theme.colors.neutral.text};
    margin-bottom: 0;
  }

  h1 { font-size: ${theme.typography.fontSize['4xl']}; }
  h2 { font-size: ${theme.typography.fontSize['3xl']}; }
  h3 { font-size: ${theme.typography.fontSize['2xl']}; }
  h4 { font-size: ${theme.typography.fontSize.xl}; }
  h5 { font-size: ${theme.typography.fontSize.lg}; }
  h6 { font-size: ${theme.typography.fontSize.base}; }

  p {
    margin-bottom: ${theme.spacing[4]};
    line-height: ${theme.typography.lineHeight.relaxed};
  }

  /* Links */
  a {
    color: ${theme.colors.primary[600]};
    text-decoration: none;
    transition: color ${theme.animation.duration.fast} ${theme.animation.easing.smooth};
  }

  a:hover,
  a:focus {
    color: ${theme.colors.primary[700]};
    text-decoration: underline;
  }

  /* Lists */
  ul, ol {
    padding-left: ${theme.spacing[6]};
    margin-bottom: ${theme.spacing[4]};
  }

  li {
    margin-bottom: ${theme.spacing[1]};
  }

  /* Form elements reset */
  button,
  input,
  select,
  textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    margin: 0;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  input,
  select,
  textarea {
    background-color: transparent;
    border: none;
    outline: none;
  }

  /* Remove default form styling */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }

  /* Custom scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.neutral.lighter};
    border-radius: ${theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary[400]};
    border-radius: ${theme.borderRadius.full};
    transition: background-color ${theme.animation.duration.fast} ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary[500]};
  }

  ::-webkit-scrollbar-corner {
    background: ${theme.colors.neutral.lighter};
  }

  /* Firefox scrollbar */
  html {
    scrollbar-width: thin;
    scrollbar-color: ${theme.colors.primary[400]} ${theme.colors.neutral.lighter};
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  *:focus-visible {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background-color: ${theme.colors.primary[200]};
    color: ${theme.colors.primary[800]};
  }

  ::-moz-selection {
    background-color: ${theme.colors.primary[200]};
    color: ${theme.colors.primary[800]};
  }

  /* Image optimization */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Table styles */
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: ${theme.spacing[4]};
  }

  th,
  td {
    text-align: left;
    padding: ${theme.spacing[2]} ${theme.spacing[4]};
    border-bottom: 1px solid ${theme.colors.neutral.border};
  }

  th {
    font-weight: ${theme.typography.fontWeight.semiBold};
    background-color: ${theme.colors.neutral.lighter};
  }

  /* Utility classes for common neomorphic effects */
  .neomorphic-raised {
    box-shadow: ${theme.shadows.raised.medium};
  }

  .neomorphic-inset {
    box-shadow: ${theme.shadows.inset.medium};
  }

  .neomorphic-floating {
    box-shadow: ${theme.shadows.floating.medium};
  }

  .neomorphic-soft {
    box-shadow: ${theme.shadows.soft.medium};
  }

  /* Animation utilities */
  .animate-fade-in {
    animation: fadeIn ${theme.animation.duration.normal} ${theme.animation.easing.smooth};
  }

  .animate-slide-up {
    animation: slideUp ${theme.animation.duration.normal} ${theme.animation.easing.smooth};
  }

  .animate-slide-down {
    animation: slideDown ${theme.animation.duration.normal} ${theme.animation.easing.smooth};
  }

  .animate-scale-in {
    animation: scaleIn ${theme.animation.duration.fast} ${theme.animation.easing.bounceOut};
  }

  .animate-pulse {
    animation: pulse 2s ${theme.animation.easing.easeInOut} infinite;
  }

  .animate-bounce {
    animation: bounce 1s ${theme.animation.easing.bounceOut} infinite;
  }

  .animate-float {
    animation: float 3s ${theme.animation.easing.easeInOut} infinite;
  }

  /* Keyframe animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      transform: translate3d(0, -8px, 0) scaleY(1.1);
    }
    70% {
      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      transform: translate3d(0, -4px, 0) scaleY(1.05);
    }
    90% {
      transform: translate3d(0, -1px, 0) scaleY(1.02);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Responsive typography */
  @media (max-width: ${theme.breakpoints.sm}) {
    html {
      font-size: 14px;
    }
    
    h1 { font-size: ${theme.typography.fontSize['3xl']}; }
    h2 { font-size: ${theme.typography.fontSize['2xl']}; }
    h3 { font-size: ${theme.typography.fontSize.xl}; }
  }

  @media (min-width: ${theme.breakpoints.xl}) {
    html {
      font-size: 18px;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    body {
      background: ${theme.colors.neutral.white};
    }
    
    .neomorphic-raised,
    .neomorphic-inset,
    .neomorphic-floating,
    .neomorphic-soft {
      box-shadow: 0 0 0 1px ${theme.colors.neutral.darkGray};
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    html {
      scroll-behavior: auto;
    }
  }

  /* Print styles */
  @media print {
    body {
      background: white !important;
      color: black !important;
    }
    
    .neomorphic-raised,
    .neomorphic-inset,
    .neomorphic-floating,
    .neomorphic-soft {
      box-shadow: none !important;
      border: 1px solid #ccc !important;
    }
  }

  /* Dark theme media query (for future dark mode support) */
  @media (prefers-color-scheme: dark) {
    /* Will be implemented when dark theme is added */
  }

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    button,
    [role="button"],
    input[type="submit"],
    input[type="button"] {
      min-height: 44px;
      min-width: 44px;
    }
  }

  /* Loading shimmer effect */
  .loading-shimmer {
    background: linear-gradient(90deg, 
      ${theme.colors.neutral.lighter} 25%, 
      ${theme.colors.neutral.light} 50%, 
      ${theme.colors.neutral.lighter} 75%
    );
    background-size: 200px 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }

  /* Error boundary styles */
  .error-boundary {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    padding: ${theme.spacing[8]};
    text-align: center;
  }

  .error-boundary h2 {
    color: ${theme.colors.semantic.error.main};
    margin-bottom: ${theme.spacing[4]};
  }

  .error-boundary p {
    color: ${theme.colors.neutral.textMuted};
    max-width: 500px;
  }
`;

// Apply global styles function
export const applyGlobalStyles = () => {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = createGlobalStyles();
  document.head.appendChild(styleSheet);
};

export default createGlobalStyles;
