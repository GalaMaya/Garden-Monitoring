// src/constants/colors.ts

export const Colors = {
  // Background - Dark green (sesuai design Figma AgroSense)
  background: '#0D1F14',
  surface: '#142C1B',
  surfaceLight: '#1A3A24',
  cardBackground: '#142C1B',

  // Primary - Bright green
  primary: '#22C55E',
  primaryDark: '#16A34A',
  primaryLight: '#4ADE80',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',

  // Status Colors
  success: '#22C55E',
  successLight: '#4ADE80',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  error: '#EF4444',
  errorLight: '#F87171',
  info: '#3B82F6',

  // Borders
  border: '#1F3D28',
  borderLight: '#2A4D35',

  // Simulation Badge
  badgeBackground: '#1A3A24',
  badgeText: '#F59E0B',
  badgeBorder: '#2A4D35',

  // Sensor Status Colors (berdasarkan status, bukan jenis sensor)
  sensorNormal: '#22C55E',
  sensorWarning: '#F59E0B',
  sensorDanger: '#EF4444',

  // Skeleton Loading
  skeletonBase: '#1A3A24',
  skeletonHighlight: '#142C1B',
};

// Font sizes untuk readability outdoor (minimal 16sp)
export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Font weights
export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border Radius
export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  round: 9999,
};
