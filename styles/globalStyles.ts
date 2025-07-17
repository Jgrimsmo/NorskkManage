import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Simplified global styles - most styles have been moved to modular files
export const globalStyles = StyleSheet.create({
  // Navigation Button Styles (specific to navigation)
  navButton: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#005BB5',
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666666',
  },
  navButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  navContainer: {
    flexDirection: 'column',
    marginBottom: 4,
    gap: 6,
  },

  // Add Button (specific styling)
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

// Color constants (legacy - prefer using tokens.colors)
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#007AFF',
  light: '#F2F2F7',
  dark: '#000000',
  gray: '#8E8E93',
  white: '#FFFFFF',
  border: '#E5E5EA',
  background: '#F2F2F7',
  text: '#000000',
  textSecondary: '#666666',
};

// Font sizes (legacy - prefer using tokens.fontSize)
export const fontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
};

// Spacing (legacy - prefer using tokens.spacing)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// Border radius (legacy - prefer using tokens.borderRadius)
export const borderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
};
