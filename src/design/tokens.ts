import { TextStyle } from 'react-native';

// Color palette - dark theme, minimal
export const colors = {
  // Backgrounds
  bg: {
    primary: '#0F172A',
    secondary: '#1E293B',
    tertiary: '#334155',
  },

  // Text
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    tertiary: '#64748B',
  },

  // Semantic
  semantic: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },

  // Trading sessions
  trading: {
    asia: '#F59E0B',
    london: '#8B5CF6',
    nyAm: '#10B981',
    nyPm: '#3B82F6',
  },
} as const;

// Typography scale - 4 levels
export const typography: Record<string, TextStyle> = {
  hero: {
    fontSize: 48,
    fontWeight: '200',
    lineHeight: 56,
    color: colors.text.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    color: colors.text.primary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.text.primary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.text.secondary,
  },
};

// Spacing scale - 8px base
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Border radii
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;
