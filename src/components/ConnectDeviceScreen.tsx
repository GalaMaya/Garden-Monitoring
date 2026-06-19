import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from "../constants/colors";
import { isValidEndpoint, normalizeEndpoint } from "../utils/validation";

interface ConnectDeviceScreenProps {
  onConnect: (url: string) => void;
  onSimulation: () => void;
  isLoading?: boolean;
}

/**
 * Screen for connecting to a device via manual input or QR scan
 */
export const ConnectDeviceScreen: React.FC<ConnectDeviceScreenProps> = ({
  onConnect,
  onSimulation,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const validateAndConnect = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim();
      if (!trimmed) {
        setInputError("Masukkan IP atau URL endpoint device");
        return;
      }

      if (!isValidEndpoint(trimmed)) {
        setInputError("Format IP/URL tidak valid");
        return;
      }

      setInputError(null);
      const url = normalizeEndpoint(trimmed);
      onConnect(url);
    },
    [onConnect]
  );

  const handleManualConnect = () => {
    validateAndConnect(inputValue);
  };

  const handleBarCodeScanned = useCallback(
    ({ data }: { data: string }) => {
      setShowScanner(false);
      if (isValidEndpoint(data)) {
        const url = normalizeEndpoint(data);
        onConnect(url);
      } else {
        Alert.alert(
          "QR Tidak Valid",
          "Konten QR code bukan endpoint yang valid. Coba scan lagi atau masukkan manual.",
          [
            { text: "Coba Lagi", onPress: () => setShowScanner(true) },
            { text: "Batal", style: "cancel" },
          ]
        );
      }
    },
    [onConnect]
  );

  const openScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Izin Kamera Diperlukan",
          "Aplikasi membutuhkan akses kamera untuk scan QR code.",
          [{ text: "OK", style: "cancel" }]
        );
        return;
      }
    }
    setShowScanner(true);
  };

  // QR Scanner view
  if (showScanner) {
    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
        />
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerFrame} />
          <Text style={styles.scannerText}>
            Arahkan kamera ke QR code perangkat
          </Text>
          <TouchableOpacity
            style={styles.scannerCancelButton}
            onPress={() => setShowScanner(false)}
          >
            <Text style={styles.scannerCancelText}>BATAL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo & Branding */}
      <View style={styles.branding}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>🌿</Text>
        </View>
        <Text style={styles.title}>AgroSense</Text>
        <Text style={styles.subtitle}>Sistem Monitoring Perkebunan IoT</Text>
      </View>

      {/* Scan QR Card */}
      <TouchableOpacity
        style={[styles.qrCard, isLoading && styles.disabled]}
        onPress={openScanner}
        activeOpacity={0.85}
        disabled={isLoading}
      >
        <View style={styles.qrIconContainer}>
          <Text style={styles.qrIcon}>⬜</Text>
        </View>
        <Text style={styles.qrTitle}>Scan QR Code</Text>
        <Text style={styles.qrSubtitle}>Arahkan kamera ke QR perangkat.</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>atau</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Manual Input Card */}
      <View style={styles.manualCard}>
        <View style={styles.manualHeader}>
          <Text style={styles.wifiIcon}>📶</Text>
          <Text style={styles.manualLabel}>MASUKKAN IP MANUAL</Text>
        </View>

        <TextInput
          style={[styles.input, inputError && styles.inputError]}
          value={inputValue}
          onChangeText={(text) => {
            setInputValue(text);
            if (inputError) setInputError(null);
          }}
          placeholder="Contoh: 192.168.1.100"
          placeholderTextColor={Colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numbers-and-punctuation"
          editable={!isLoading}
        />
        {inputError && (
          <Text style={styles.errorText}>{inputError}</Text>
        )}

        <TouchableOpacity
          style={[styles.connectButton, isLoading && styles.buttonDisabled]}
          onPress={handleManualConnect}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.textOnPrimary} size="small" />
          ) : (
            <View style={styles.connectButtonContent}>
              <Text style={styles.connectButtonText}>Hubungkan</Text>
              <Text style={styles.connectButtonArrow}> ›</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Simulation Link */}
      <TouchableOpacity
        style={styles.simButton}
        onPress={onSimulation}
        disabled={isLoading}
      >
        <Text style={styles.simButtonText}>🧪 Gunakan Mode Simulasi</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        Pastikan perangkat dan ponsel terhubung ke jaringan WiFi yang sama
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    padding: Spacing.lg,
  },
  branding: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  logoIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  qrCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  disabled: {
    opacity: 0.7,
  },
  qrIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  qrIcon: {
    fontSize: 24,
    color: Colors.textOnPrimary,
  },
  qrTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textOnPrimary,
    marginBottom: Spacing.xs,
  },
  qrSubtitle: {
    fontSize: FontSizes.sm,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.md,
  },
  manualCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  manualHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  wifiIcon: {
    fontSize: FontSizes.md,
    marginRight: Spacing.sm,
  },
  manualLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    minHeight: 48,
    marginBottom: Spacing.md,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  connectButton: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  connectButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  connectButtonArrow: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  simButton: {
    alignSelf: "center",
    marginTop: Spacing.xl,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  simButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  footer: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
  // Scanner styles
  scannerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: Spacing.lg,
  },
  scannerFrame: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    backgroundColor: "transparent",
    marginBottom: Spacing.xl,
  },
  scannerText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    textAlign: "center",
    marginBottom: Spacing.xl,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  scannerCancelButton: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scannerCancelText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
});

export default ConnectDeviceScreen;
