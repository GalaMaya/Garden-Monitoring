// src/hooks/useDeviceName.ts

import { useState, useEffect, useCallback } from 'react';
import { DeviceResponse } from '../types';
import {
  getCustomDeviceName,
  saveCustomDeviceName as saveCustomName,
} from '../services/storage';

interface UseDeviceNameReturn {
  displayName: string;
  isCustomName: boolean;
  updateName: (newName: string) => Promise<boolean>;
  resetToDefault: () => void;
  isLoading: boolean;
}

/**
 * Custom hook for managing device custom names with AsyncStorage persistence
 * @param device - Device data object
 * @returns Display name and management functions
 */
export const useDeviceName = (device: DeviceResponse | null): UseDeviceNameReturn => {
  const [customName, setCustomName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine the default display name based on priority
  const getDefaultName = (): string => {
    if (!device) return 'Unknown Device';
    return device.location_name || device.device_id || 'Unknown Device';
  };

  // The final display name (custom or default)
  const displayName = customName !== null ? customName : getDefaultName();
  const isCustomName = customName !== null && customName !== getDefaultName();

  /**
   * Load custom name from storage when device changes
   */
  useEffect(() => {
    const loadCustomName = async () => {
      if (!device?.device_id) {
        setCustomName(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const savedName = await getCustomDeviceName(device.device_id);
        setCustomName(savedName);
      } catch (error) {
        console.error('Error loading custom name:', error);
        setCustomName(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomName();
  }, [device?.device_id]);

  /**
   * Updates the custom name and saves to AsyncStorage
   */
  const updateName = useCallback(async (newName: string): Promise<boolean> => {
    if (!device?.device_id) {
      return false;
    }

    try {
      const success = await saveCustomName(device.device_id, newName);
      if (success) {
        setCustomName(newName);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating name:', error);
      return false;
    }
  }, [device?.device_id]);

  /**
   * Resets to default name by removing custom name from storage
   */
  const resetToDefault = useCallback(() => {
    setCustomName(null);
    // Note: We don't delete from storage here to allow undo functionality
    // If you want to permanently delete, call removeCustomDeviceName from services
  }, []);

  return {
    displayName,
    isCustomName,
    updateName,
    resetToDefault,
    isLoading,
  };
};
