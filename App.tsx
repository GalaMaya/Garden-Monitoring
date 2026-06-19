import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useDeviceData } from "./src/hooks/useDeviceData";
import { useDeviceName } from "./src/hooks/useDeviceName";
import {
  Header,
  SensorCard,
  EditNameModal,
  LocationDisplay,
  FullScreenLoader,
  ConnectDeviceScreen,
  MapModal,
} from "./src/components";
import { Colors, Spacing, BorderRadius, FontSizes } from "./src/constants/colors";
import {
  saveLastDeviceUrl,
  getLastDeviceUrl,
  removeLastDeviceUrl,
} from "./src/services/storage";
import React, { useState, useEffect, useCallback } from "react";

type AppScreen = "connect" | "dashboard";
type SensorStatus = "normal" | "warning" | "danger";

interface SensorStatusResult {
  status: SensorStatus;
  label: string;
  message: string;
}

function getSensorStatus(
  value: number,
  optimalMin: number,
  optimalMax: number,
  safeMin: number,
  safeMax: number,
  belowMessage: string,
  aboveMessage: string,
  normalMessage: string
): SensorStatusResult {
  if (value >= optimalMin && value <= optimalMax) {
    return { status: "normal", label: "Normal", message: normalMessage };
  }
  if (value < safeMin || value > safeMax) {
    return {
      status: "danger",
      label: "Bahaya",
      message: value < safeMin ? belowMessage : aboveMessage,
    };
  }
  return {
    status: "warning",
    label: "Perhatian",
    message: value < optimalMin ? belowMessage : aboveMessage,
  };
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("connect");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const {
    data: device,
    loading: deviceLoading,
    error,
    fetchDevice,
    loadDummyData,
  } = useDeviceData();
  const {
    displayName,
    updateName: updateDeviceName,
    isLoading: nameLoading,
  } = useDeviceName(device);

  // On mount: check if we have a last connected device URL
  useEffect(() => {
    const init = async () => {
      try {
        const lastUrl = await getLastDeviceUrl();
        if (lastUrl) {
          await fetchDevice(lastUrl);
          setScreen("dashboard");
        }
      } catch {
        // Stay on connect screen if storage read fails
      }
    };

    init();
  }, [fetchDevice]);

  const handleConnect = useCallback(
    async (url: string) => {
      try {
        await fetchDevice(url);
        await saveLastDeviceUrl(url);
        setScreen("dashboard");
      } catch {
        Alert.alert(
          "Gagal Terhubung",
          "Tidak dapat menghubungi endpoint device. Periksa IP/URL dan pastikan device aktif.",
          [
            { text: "Coba Lagi", style: "cancel" },
            {
              text: "Pakai Simulasi",
              onPress: () => {
                loadDummyData();
                setScreen("dashboard");
              },
            },
          ]
        );
      }
    },
    [fetchDevice, loadDummyData]
  );

  const handleSimulation = useCallback(() => {
    loadDummyData();
    setScreen("dashboard");
  }, [loadDummyData]);

  const handleDisconnect = useCallback(async () => {
    await removeLastDeviceUrl();
    setScreen("connect");
  }, []);

  // Connect screen
  if (screen === "connect") {
    return (
      <SafeAreaView style={styles.container}>
        <ConnectDeviceScreen
          onConnect={handleConnect}
          onSimulation={handleSimulation}
          isLoading={deviceLoading}
        />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  // Loading state
  if (deviceLoading || nameLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <FullScreenLoader />
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>❌ Error Loading Device</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setScreen("connect")}
          >
            <Text style={styles.retryButtonText}>KEMBALI KE CONNECT</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  // No device state
  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>📱 No Device Connected</Text>
          <Text style={styles.emptyMessage}>
            Perangkat tidak terhubung. Silakan coba lagi.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setScreen("connect")}
          >
            <Text style={styles.retryButtonText}>KEMBALI KE CONNECT</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  const handleSaveDeviceName = async (newName: string) => {
    const success = await updateDeviceName(newName);
    if (success) {
      setEditModalVisible(false);
    } else {
      Alert.alert("Error", "Failed to save device name");
    }
  };

  const s = device.sensors;

  const soilStatus = getSensorStatus(
    s.soil_moisture,
    40,
    75,
    20,
    90,
    "Tanah terlalu kering",
    "Tanah terlalu basah",
    "Tanah cukup lembab"
  );

  const tempStatus = getSensorStatus(
    s.temperature,
    20,
    32,
    15,
    40,
    "Suhu di bawah batas aman",
    "Suhu di atas batas aman",
    "Suhu dalam kondisi optimal"
  );

  const humStatus = getSensorStatus(
    s.humidity,
    50,
    85,
    30,
    95,
    "Kelembaban terlalu rendah",
    "Kelembaban terlalu tinggi",
    "Kelembaban dalam kondisi optimal"
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header
          title={displayName}
          onEdit={() => setEditModalVisible(true)}
          showSimulationBadge={true}
        />

        {/* Location Card */}
        {device.latitude && device.longitude && (
          <View style={styles.locationSection}>
            <LocationDisplay
              locationName={device.location_name || "Lokasi Device"}
              latitude={device.latitude}
              longitude={device.longitude}
              showButton={true}
              buttonLabel="Buka Peta"
              onPress={() => setMapModalVisible(true)}
            />
          </View>
        )}

        {/* Section Title */}
        <Text style={styles.sectionTitle}>DATA SENSOR REAL-TIME</Text>

        {/* Sensor Cards */}
        <View style={styles.sensorGrid}>
          <SensorCard
            icon="💧"
            title="Kelembaban Tanah"
            value={s.soil_moisture}
            unit="%"
            optimalRange="40-75%"
            status={soilStatus.status}
            statusLabel={soilStatus.label}
            message={soilStatus.message}
          />

          <SensorCard
            icon="🌡️"
            title="Suhu"
            value={s.temperature}
            unit="°C"
            optimalRange="20-32°C"
            status={tempStatus.status}
            statusLabel={tempStatus.label}
            message={tempStatus.message}
          />

          <SensorCard
            icon="💨"
            title="Kelembaban Udara"
            value={s.humidity}
            unit="%"
            optimalRange="50-85%"
            status={humStatus.status}
            statusLabel={humStatus.label}
            message={humStatus.message}
          />
        </View>

        {/* Device Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>ℹ️ Informasi Device</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Device ID:</Text>
            <Text style={styles.infoValue}>{device.device_id}</Text>
          </View>
          {device.location_name && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Lokasi:</Text>
              <Text style={styles.infoValue}>{device.location_name}</Text>
            </View>
          )}
        </View>

        {/* Disconnect Button */}
        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={handleDisconnect}
          activeOpacity={0.8}
        >
          <Text style={styles.disconnectText}>🔌 Pindah Perangkat</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Name Modal */}
      <EditNameModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveDeviceName}
        currentName={displayName}
      />

      {/* Map Modal */}
      {device.latitude && device.longitude && (
        <MapModal
          visible={mapModalVisible}
          latitude={device.latitude}
          longitude={device.longitude}
          locationName={device.location_name || displayName}
          onClose={() => setMapModalVisible(false)}
        />
      )}

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: Spacing.md,
    textTransform: "uppercase",
  },
  sensorGrid: {
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  locationSection: {
    marginBottom: Spacing.xl,
  },
  infoSection: {
    marginBottom: Spacing.xl,
  },
  infoBox: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.error,
    marginBottom: Spacing.md,
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  emptyMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
  },
  retryButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: "bold",
    fontSize: 14,
  },
  disconnectButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  disconnectText: {
    color: Colors.textSecondary,
    fontWeight: "600",
    fontSize: FontSizes.md,
  },
});
