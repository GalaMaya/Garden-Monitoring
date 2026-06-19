// src/hooks/useDeviceData.ts

import { useState, useCallback } from 'react';
import { DeviceResponse, DeviceDataState } from '../types';
import { fetchDeviceDataWithLatency } from '../services/api';

interface UseDeviceDataReturn extends DeviceDataState {
  fetchDevice: (url: string) => Promise<void>;
  refreshDevice: () => Promise<void>;
  clearData: () => void;
  loadDummyData: () => void;
}

/**
 * Custom hook for managing device data fetching with loading states
 * @returns Device data state and control functions
 */
export const useDeviceData = (): UseDeviceDataReturn => {
  const [state, setState] = useState<DeviceDataState>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Fetches device data from the given URL with simulated latency
   */
  const fetchDevice = useCallback(async (url: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch with simulated 1-2 second latency
      const data = await fetchDeviceDataWithLatency(url, 1500);
      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  }, []);

  /**
   * Refreshes current device data if available
   */
  const refreshDevice = useCallback(async () => {
    if (state.data) {
      // In a real scenario, you would have the URL stored
      // For now, this is a placeholder
      console.log('Refresh not implemented without URL');
    }
  }, [state.data]);

  /**
   * Clears all device data
   */
  const clearData = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Loads dummy/simulation data for offline testing
   */
  const loadDummyData = useCallback(() => {
    const dummyDevice: DeviceResponse = {
      device_id: 'AgroSense-001',
      location_name: 'Kebun Blok A-12',
      latitude: -6.9147,
      longitude: 107.6098,
      sensors: {
        soil_moisture: 62,
        temperature: 34,
        humidity: 45,
      },
    };

    setState({
      data: dummyDevice,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchDevice,
    refreshDevice,
    clearData,
    loadDummyData,
  };
};
