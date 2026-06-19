import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from "../constants/colors";

interface MapModalProps {
  visible: boolean;
  latitude: number;
  longitude: number;
  locationName?: string;
  onClose: () => void;
}

/**
 * Fullscreen map modal showing device location with a marker
 */
export const MapModal: React.FC<MapModalProps> = ({
  visible,
  latitude,
  longitude,
  locationName,
  onClose,
}) => {
  const initialRegion: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header Overlay */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {locationName || "Lokasi Device"}
            </Text>
            <Text style={styles.subtitle}>
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Map */}
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          mapType={Platform.OS === "ios" ? "standard" : "terrain"}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            title={locationName || "Device Location"}
            description={`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
          />
        </MapView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === "ios" ? Spacing.xl : Spacing.lg + 20,
    paddingBottom: Spacing.md,
    backgroundColor: "rgba(13, 31, 20, 0.85)",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeIcon: {
    color: Colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  placeholder: {
    width: 40,
  },
});

export default MapModal;
