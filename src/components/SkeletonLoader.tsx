import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../constants/colors';

interface SkeletonLoaderProps {
  height?: number;
  width?: number;
  borderRadius?: number;
}

/**
 * Single skeleton line component
 */
const SkeletonLine: React.FC<SkeletonLoaderProps> = ({
  height = 20,
  width = '100%',
  borderRadius = BorderRadius.md,
}) => {
  return (
    <View
      style={[
        styles.skeletonLine,
        { height, width: typeof width === 'number' ? width : undefined },
        { borderRadius },
      ]}
    />
  );
};

interface SkeletonCardProps {
  title?: boolean;
  value?: boolean;
  progress?: boolean;
}

/**
 * Skeleton card for sensor data loading state
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  title = true,
  value = true,
  progress = true,
}) => {
  return (
    <View style={styles.card}>
      {title && (
        <>
          <SkeletonLine height={18} width="60%" />
          <View style={styles.spacing} />
        </>
      )}
      
      {value && (
        <>
          <SkeletonLine height={32} width="40%" />
          <View style={styles.spacing} />
        </>
      )}
      
      {progress && <SkeletonLine height={8} width="100%" />}
    </View>
  );
};

interface FullScreenLoaderProps {
  message?: string;
}

/**
 * Full screen loading indicator
 */
export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  message = 'Memuat data...',
}) => {
  return (
    <View style={styles.fullScreenLoader}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loaderText}>{message}</Text>
    </View>
  );
};

interface SkeletonDashboardProps {
  cardCount?: number;
}

/**
 * Complete dashboard skeleton with multiple cards
 */
export const SkeletonDashboard: React.FC<SkeletonDashboardProps> = ({
  cardCount = 3,
}) => {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.headerSkeleton}>
        <SkeletonLine height={24} width="70%" />
        <View style={styles.spacingSmall} />
        <SkeletonLine height={16} width="50%" />
      </View>
      
      {/* Sensor cards skeleton */}
      {Array.from({ length: cardCount }).map((_, index) => (
        <View key={index} style={styles.spacing}>
          <SkeletonCard />
        </View>
      ))}
      
      {/* Location skeleton */}
      <View style={styles.locationSkeleton}>
        <SkeletonLine height={16} width="60%" />
        <View style={styles.spacingSmall} />
        <SkeletonLine height={40} width="100%" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  skeletonLine: {
    backgroundColor: Colors.skeletonBase,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  spacing: {
    height: Spacing.lg,
  },
  spacingSmall: {
    height: Spacing.sm,
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loaderText: {
    marginTop: Spacing.lg,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  headerSkeleton: {
    marginBottom: Spacing.xxl,
  },
  locationSkeleton: {
    marginTop: Spacing.xl,
  },
});

export default SkeletonLine;
