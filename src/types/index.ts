// src/types/index.ts

export interface SensorData {
  soil_moisture: number;     // Percentage 0-100
  temperature: number;        // Celsius
  humidity: number;           // Percentage 0-100
}

export interface DeviceResponse {
  device_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  sensors: SensorData;
}

export interface DeviceWithCustomName extends DeviceResponse {
  displayName: string;       // Custom name dari localStorage atau fallback
}

export type ScanResult = {
  type: 'qr' | 'manual';
  url: string;
};

export interface DeviceDataState {
  data: DeviceResponse | null;
  loading: boolean;
  error: string | null;
}
