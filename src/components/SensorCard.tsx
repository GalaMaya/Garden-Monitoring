import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../constants/colors';

type SensorStatus = 'normal' | 'warning' | 'danger';

interface SensorCardProps {
  icon: string;
  title: string;
  value: number;
  unit: string;
  optimalRange: string;
  status: SensorStatus;
  statusLabel: string;
  message: string;
}

const statusColors: Record<SensorStatus, { border: string; iconBg: string; value: string; badge: string }> = {
  normal: {
    border: Colors.sensorNormal,
    iconBg: 'rgba(34, 197, 94, 0.15)',
    value: Colors.sensorNormal,
    badge: Colors.sensorNormal,
  },
  warning: {
    border: Colors.sensorWarning,
    iconBg: 'rgba(245, 158, 11, 0.15)',
    value: Colors.sensorWarning,
    badge: Colors.sensorWarning,
  },
  danger: {
    border: Colors.sensorDanger,
    iconBg: 'rgba(239, 68, 68, 0.15)',
    value: Colors.sensorDanger,
    badge: Colors.sensorDanger,
  },
};

const statusIcons: Record<SensorStatus, string> = {
  normal: '✓',
  warning: '⚠',
  danger: '✕',
};

/**
 * Sensor data card with status indicator (matches Figma AgroSense design)
 */
export const SensorCard: React.FC<SensorCardProps> = ({
  icon,
  title,
  value,
  unit,
  optimalRange,
  status,
  statusLabel,
  message,
}) => {
  const colors = statusColors[status];

  return (
    <View style={[styles.card, { borderColor: colors.border }]}>
      {/* Top Row: Icon + Title/Optimal + Value */}
      <View style={styles.topRow}>
        {/* Left: Icon + Info */}
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.optimal}>Optimal: {optimalRange}</Text>
          </View>
        </View>

        {/* Right: Value */}
        <View style={styles.valueSection}>
          <Text style={[styles.value, { color: colors.value }]}>
            {value}
            <Text style={styles.unit}>{unit}</Text>
          </Text>
        </View>
      </View>

      {/* Bottom Row: Status Badge + Message */}
      <View style={styles.bottomRow}>
        <View style={[styles.badge, { borderColor: colors.badge }]}>
          <Text style={[styles.badgeIcon, { color: colors.badge }]}>
            {statusIcons[status]}
          </Text>
          <Text style={[styles.badgeText, { color: colors.badge }]}>
            {statusLabel}
          </Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: FontSizes.lg,
  },
  infoSection: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  optimal: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  valueSection: {
    marginLeft: Spacing.md,
  },
  value: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
  },
  unit: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  badgeIcon: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  message: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    flexShrink: 1,
  },
});

export default SensorCard;
