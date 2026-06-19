import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "../constants/colors";
import { openInMaps, isValidCoordinates, MapOpenResult } from "../utils/maps";

interface LocationButtonProps {
  latitude: number;
  longitude: number;
  label?: string;
  onPress?: () => void;
  onSuccess?: () => void;
  onError?: (result: MapOpenResult) => void;
}

/**
 * Button to open location in Google Maps / Apple Maps, or trigger custom onPress
 */
export const LocationButton: React.FC<LocationButtonProps> = ({
  latitude,
  longitude,
  label = "Buka Peta",
  onPress,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const coordinatesValid = isValidCoordinates(latitude, longitude);

  const handlePress = async () => {
    if (!coordinatesValid) {
      Alert.alert("Error", "Koordinat tidak valid");
      return;
    }

    if (onPress) {
      onPress();
      return;
    }

    setIsLoading(true);

    try {
      const result = await openInMaps(latitude, longitude, onError);

      if (result.success) {
        onSuccess?.();
      } else {
        Alert.alert("Gagal Membuka Peta", result.message, [
          { text: "OK", onPress: () => console.log("Error acknowledged") },
        ]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Alert.alert("Error", `Gagal membuka peta: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!coordinatesValid) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.button, isLoading && styles.buttonDisabled]}
      onPress={handlePress}
      accessibilityLabel="Buka lokasi di maps"
      disabled={isLoading || !coordinatesValid}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.textOnPrimary} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>{label}</Text>
          <Text style={styles.buttonArrow}>↗</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

interface LocationDisplayProps {
  locationName?: string;
  latitude: number;
  longitude: number;
  showButton?: boolean;
  buttonLabel?: string;
  onPress?: () => void;
  onSuccess?: () => void;
  onError?: (result: MapOpenResult) => void;
}

/**
 * Complete location display card (matches Figma AgroSense design)
 */
export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  locationName,
  latitude,
  longitude,
  showButton = true,
  buttonLabel,
  onPress,
  onSuccess,
  onError,
}) => {
  const coordinatesValid = isValidCoordinates(latitude, longitude);

  if (!coordinatesValid) {
    return null;
  }

  const latDir = latitude >= 0 ? "N" : "S";
  const lngDir = longitude >= 0 ? "E" : "W";
  const formattedCoords = `${Math.abs(latitude).toFixed(4)}° ${latDir}, ${Math.abs(longitude).toFixed(4)}° ${lngDir}`;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📍</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.locationName} numberOfLines={1}>
            {locationName || "Lokasi Device"}
          </Text>
          <Text style={styles.coordinates}>{formattedCoords}</Text>
        </View>

        {/* Maps Button */}
        {showButton && (
          <LocationButton
            latitude={latitude}
            longitude={longitude}
            label={buttonLabel}
            onPress={onPress}
            onSuccess={onSuccess}
            onError={onError}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: FontSizes.md,
  },
  info: {
    flex: 1,
  },
  locationName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  coordinates: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  buttonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textOnPrimary,
  },
  buttonArrow: {
    fontSize: FontSizes.sm,
    color: Colors.textOnPrimary,
  },
});

export default LocationButton;
