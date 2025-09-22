// Export all style utilities
export { theme, default as themeConfig } from './theme';
export { createGlobalStyles, applyGlobalStyles } from './GlobalStyles';
export { default as mixins } from './mixins';
export { default as animations } from './animations';

// Create a comprehensive style system
import { theme } from './theme';
import { createGlobalStyles, applyGlobalStyles } from './GlobalStyles';
import mixins from './mixins';
import animations from './animations';

export const styleSystem = {
  theme,
  mixins,
  animations,
  createGlobalStyles,
  applyGlobalStyles,
};

export default styleSystem;
