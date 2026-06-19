// src/services/api.ts

import { DeviceResponse } from '../types';

/**
 * Fetches device data from the given URL
 * @param url - Endpoint URL
 * @returns Device data or throws error
 */
export const fetchDeviceData = async (url: string): Promise<DeviceResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Timeout after 10 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DeviceResponse = await response.json();
    
    // Validate required fields
    if (!data.device_id || !data.sensors) {
      throw new Error('Invalid data format: missing required fields');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch device data: ${error.message}`);
    }
    throw new Error('Failed to fetch device data: Unknown error');
  }
};

/**
 * Fetches device data with simulated latency (for development/testing)
 * @param url - Endpoint URL
 * @param delayMs - Delay in milliseconds (default: 1500ms)
 * @returns Device data or throws error
 */
export const fetchDeviceDataWithLatency = async (
  url: string,
  delayMs: number = 1500
): Promise<DeviceResponse> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  
  return fetchDeviceData(url);
};

/**
 * Tests if an endpoint is reachable
 * @param url - Endpoint URL
 * @returns true if reachable
 */
export const testEndpoint = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};
