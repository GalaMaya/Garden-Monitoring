// src/services/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys, getDeviceNameKey } from '../constants/storageKeys';

/**
 * Gets custom device name from AsyncStorage
 * @param deviceId - Original device ID
 * @returns Custom name or null if not found
 */
export const getCustomDeviceName = async (deviceId: string): Promise<string | null> => {
  try {
    const key = getDeviceNameKey(deviceId);
    const name = await AsyncStorage.getItem(key);
    return name;
  } catch (error) {
    console.error('Error getting custom device name:', error);
    return null;
  }
};

/**
 * Saves custom device name to AsyncStorage
 * @param deviceId - Original device ID
 * @param customName - Custom name to save
 * @returns true if successful
 */
export const saveCustomDeviceName = async (
  deviceId: string,
  customName: string
): Promise<boolean> => {
  try {
    const key = getDeviceNameKey(deviceId);
    await AsyncStorage.setItem(key, customName);
    return true;
  } catch (error) {
    console.error('Error saving custom device name:', error);
    return false;
  }
};

/**
 * Removes custom device name from AsyncStorage
 * @param deviceId - Original device ID
 * @returns true if successful
 */
export const removeCustomDeviceName = async (deviceId: string): Promise<boolean> => {
  try {
    const key = getDeviceNameKey(deviceId);
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing custom device name:', error);
    return false;
  }
};

/**
 * Gets all custom device names
 * @returns Object with device IDs as keys and custom names as values
 */
export const getAllCustomDeviceNames = async (): Promise<Record<string, string>> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const deviceNameKeys = keys.filter((key) =>
      key.startsWith(StorageKeys.DEVICE_NAME_PREFIX)
    );
    
    const values = await AsyncStorage.multiGet(deviceNameKeys);
    const result: Record<string, string> = {};
    
    values.forEach(([key, value]) => {
      if (value !== null) {
        const deviceId = key.replace(StorageKeys.DEVICE_NAME_PREFIX, '');
        result[deviceId] = value;
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error getting all custom device names:', error);
    return {};
  }
};

/**
 * Saves last connected device URL
 * @param url - Device URL
 * @returns true if successful
 */
export const saveLastDeviceUrl = async (url: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(StorageKeys.LAST_DEVICE_URL, url);
    return true;
  } catch (error) {
    console.error('Error saving last device URL:', error);
    return false;
  }
};

/**
 * Gets last connected device URL
 * @returns Last device URL or null
 */
export const getLastDeviceUrl = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(StorageKeys.LAST_DEVICE_URL);
  } catch (error) {
    console.error('Error getting last device URL:', error);
    return null;
  }
};

/**
 * Removes last connected device URL
 * @returns true if successful
 */
export const removeLastDeviceUrl = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(StorageKeys.LAST_DEVICE_URL);
    return true;
  } catch (error) {
    console.error('Error removing last device URL:', error);
    return false;
  }
};

/**
 * Clears all stored data
 * @returns true if successful
 */
export const clearAllData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};
