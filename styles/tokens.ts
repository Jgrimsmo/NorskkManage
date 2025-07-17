// Design tokens and constants
export const colors = {
  // Primary Colors
  primary: '#007AFF',
  primaryDark: '#005BB5',
  secondary: '#E5E5EA',
  secondaryDark: '#D1D1D6',

  // Background Colors
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8F9FA',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Text Colors
  text: '#000',
  textSecondary: '#666',
  textTertiary: '#8E8E93',

  // Status Colors
  success: '#34C759',
  successLight: '#E8F5E8',
  successDark: '#2E7D32',
  error: '#FF3B30',
  errorLight: '#FFEBEE',
  errorDark: '#D32F2F',
  warning: '#FF9500',
  info: '#AF52DE',
  
  // Legacy color aliases for backward compatibility
  danger: '#FF3B30',
  light: '#F2F2F7',
  dark: '#000000',
  gray: '#8E8E93',
  white: '#FFFFFF',

  // Border Colors
  border: '#E5E5EA',
  borderLight: '#F0F0F0',
  borderDark: '#D1D1D6',

  // Shadow
  shadow: '#000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: 'bold',
} as const;

// Common shadow configurations
export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;
