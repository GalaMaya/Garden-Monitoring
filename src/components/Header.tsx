import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../constants/colors';

interface HeaderProps {
  title: string;
  onEdit?: () => void;
  showSimulationBadge?: boolean;
}

/**
 * Dashboard header with simulation badge and edit button
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  onEdit,
  showSimulationBadge = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Device Name Row */}
      <View style={styles.nameRow}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        
        {onEdit && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Edit nama perangkat"
          >
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Simulation Badge */}
      {showSimulationBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>🛠️</Text>
          <Text style={styles.badgeText}>MODE SIMULASI</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    flex: 1,
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginRight: Spacing.md,
  },
  editButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editIcon: {
    fontSize: FontSizes.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.badgeBackground,
    borderWidth: 1,
    borderColor: Colors.badgeBorder,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  badgeIcon: {
    fontSize: FontSizes.sm,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.badgeText,
    letterSpacing: 0.5,
  },
});

export default Header;
