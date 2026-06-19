// src/constants/storageKeys.ts

export const StorageKeys = {
  // Device custom names: device_name_{device_id}
  DEVICE_NAME_PREFIX: 'device_name_',
  
  // Last connected device
  LAST_DEVICE_URL: 'last_device_url',
  
  // App settings
  SIMULATION_MODE: 'simulation_mode',
};

// Helper function untuk generate key
export const getDeviceNameKey = (deviceId: string): string => {
  return `${StorageKeys.DEVICE_NAME_PREFIX}${deviceId}`;
};
