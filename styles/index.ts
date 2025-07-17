// Export all modular styles
export { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from './tokens';
export { gradients, getGradient, pageGradients, gradientSets } from './gradients';
export { baseStyles } from './baseStyles';
export { buttonStyles } from './buttonStyles';
export { tableStyles } from './tableStyles';
export { modalStyles } from './modalStyles';
export { componentStyles } from './componentStyles';
export { textStyles } from './textStyles';
export { calendarStyles } from './calendarStyles';

// Import the current globalStyles (simplified version with nav-specific styles)
import { globalStyles as navStyles } from './globalStyles';

// Combined styles for migration compatibility
// This merges all modular styles into one object matching globalStyles structure
import { StyleSheet } from 'react-native';
import { baseStyles } from './baseStyles';
import { buttonStyles } from './buttonStyles';
import { tableStyles } from './tableStyles';
import { modalStyles } from './modalStyles';
import { componentStyles } from './componentStyles';
import { textStyles } from './textStyles';
import { calendarStyles } from './calendarStyles';

// Merge all styles into globalStyles for backward compatibility
export const globalStyles = StyleSheet.create({
  ...baseStyles,
  ...buttonStyles,
  ...tableStyles,
  ...modalStyles,
  ...componentStyles,
  ...textStyles,
  ...calendarStyles,
  ...navStyles, // Include navigation-specific styles
});
