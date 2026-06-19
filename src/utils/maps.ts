// src/utils/maps.ts

import * as Linking from "expo-linking";
import { Platform, Alert } from "react-native";

/**
 * Result type for map opening operations
 */
export interface MapOpenResult {
  success: boolean;
  message: string;
  platform?: string;
}

/**
 * Opens location in Google Maps, Apple Maps, or fallback based on platform
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param onError - Optional callback for error handling
 * @returns Promise<MapOpenResult>
 */
export const openInMaps = async (
  latitude: number,
  longitude: number,
  onError?: (result: MapOpenResult) => void,
): Promise<MapOpenResult> => {
  if (!isValidCoordinates(latitude, longitude)) {
    const errorResult: MapOpenResult = {
      success: false,
      message: "Koordinat tidak valid",
      platform: Platform.OS,
    };
    onError?.(errorResult);
    return errorResult;
  }

  try {
    // Try platform-specific maps apps first
    if (Platform.OS === "ios") {
      return await openAppleMaps(latitude, longitude, onError);
    } else if (Platform.OS === "android") {
      return await openGoogleMapsAndroid(latitude, longitude, onError);
    } else {
      // Web fallback
      return await openGoogleMapsWeb(latitude, longitude, onError);
    }
  } catch (error) {
    const errorResult: MapOpenResult = {
      success: false,
      message: `Gagal membuka peta: ${error instanceof Error ? error.message : "Unknown error"}`,
      platform: Platform.OS,
    };
    onError?.(errorResult);
    return errorResult;
  }
};

/**
 * Opens Apple Maps on iOS
 */
const openAppleMaps = async (
  latitude: number,
  longitude: number,
  onError?: (result: MapOpenResult) => void,
): Promise<MapOpenResult> => {
  const appleMapsUrl = getAppleMapsUrl(latitude, longitude);

  try {
    const canOpen = await Linking.canOpenURL(appleMapsUrl);
    if (canOpen) {
      await Linking.openURL(appleMapsUrl);
      return {
        success: true,
        message: "Apple Maps terbuka",
        platform: "ios-native",
      };
    } else {
      // Fallback to Google Maps web
      return await openGoogleMapsWeb(latitude, longitude, onError);
    }
  } catch (error) {
    console.warn("Failed to open Apple Maps, trying fallback:", error);
    // Fallback to Google Maps web
    return await openGoogleMapsWeb(latitude, longitude, onError);
  }
};

/**
 * Opens Google Maps on Android using native intent
 */
const openGoogleMapsAndroid = async (
  latitude: number,
  longitude: number,
  onError?: (result: MapOpenResult) => void,
): Promise<MapOpenResult> => {
  const androidMapsUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;

  try {
    await Linking.openURL(androidMapsUrl);
    return {
      success: true,
      message: "Google Maps terbuka",
      platform: "android-native",
    };
  } catch (error) {
    console.warn("Failed to open Android Maps, trying web fallback:", error);
    // Fallback to Google Maps web
    return await openGoogleMapsWeb(latitude, longitude, onError);
  }
};

/**
 * Opens Google Maps in web/browser (fallback for all platforms)
 */
const openGoogleMapsWeb = async (
  latitude: number,
  longitude: number,
  onError?: (result: MapOpenResult) => void,
): Promise<MapOpenResult> => {
  const googleMapsUrl = getGoogleMapsUrl(latitude, longitude);

  try {
    const canOpen = await Linking.canOpenURL(googleMapsUrl);
    if (canOpen) {
      await Linking.openURL(googleMapsUrl);
      return {
        success: true,
        message: "Google Maps (web) terbuka",
        platform: `${Platform.OS}-web`,
      };
    } else {
      const errorResult: MapOpenResult = {
        success: false,
        message: "Tidak dapat membuka Google Maps. Pastikan browser tersedia.",
        platform: Platform.OS,
      };
      onError?.(errorResult);
      return errorResult;
    }
  } catch (error) {
    const errorResult: MapOpenResult = {
      success: false,
      message: `Gagal membuka Google Maps: ${error instanceof Error ? error.message : "Unknown error"}`,
      platform: Platform.OS,
    };
    onError?.(errorResult);
    return errorResult;
  }
};

/**
 * Generates Google Maps URL with proper encoding
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param zoom - Optional zoom level (1-21)
 * @returns Google Maps URL string
 */
export const getGoogleMapsUrl = (
  latitude: number,
  longitude: number,
  zoom: number = 15,
): string => {
  // Ensure coordinates are properly formatted
  const lat = parseFloat(latitude.toFixed(6));
  const lng = parseFloat(longitude.toFixed(6));
  return `https://www.google.com/maps/@${lat},${lng},${zoom}z`;
};

/**
 * Generates Apple Maps URL (iOS specific)
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Apple Maps URL string
 */
export const getAppleMapsUrl = (
  latitude: number,
  longitude: number,
): string => {
  const lat = parseFloat(latitude.toFixed(6));
  const lng = parseFloat(longitude.toFixed(6));
  return `maps://maps.apple.com/?ll=${lat},${lng}&z=15`;
};

/**
 * Generates Android geo URI
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Android geo URI string
 */
export const getAndroidGeoUri = (
  latitude: number,
  longitude: number,
): string => {
  const lat = parseFloat(latitude.toFixed(6));
  const lng = parseFloat(longitude.toFixed(6));
  return `geo:${lat},${lng}?q=${lat},${lng}`;
};

/**
 * Validates if coordinates are valid
 * @param latitude - Latitude to validate (-90 to 90)
 * @param longitude - Longitude to validate (-180 to 180)
 * @returns true if valid
 */
export const isValidCoordinates = (
  latitude: unknown,
  longitude: unknown,
): boolean => {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return false;
  }
  if (!isFinite(latitude) || !isFinite(longitude)) {
    return false;
  }
  return (
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
  );
};

/**
 * Formats coordinates for display
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Formatted coordinate string
 */
export const formatCoordinates = (
  latitude: number,
  longitude: number,
): string => {
  const lat = latitude.toFixed(6);
  const lng = longitude.toFixed(6);
  return `${lat}, ${lng}`;
};

/**
 * Gets map URL based on platform
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Platform-specific map URL
 */
export const getPlatformMapUrl = (
  latitude: number,
  longitude: number,
): string => {
  if (Platform.OS === "ios") {
    return getAppleMapsUrl(latitude, longitude);
  } else if (Platform.OS === "android") {
    return getAndroidGeoUri(latitude, longitude);
  } else {
    return getGoogleMapsUrl(latitude, longitude);
  }
};
