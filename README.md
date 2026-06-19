# AgroSense - Sistem Monitoring Perkebunan IoT

AgroSense adalah aplikasi mobile React Native berbasis Expo untuk monitoring kondisi perkebunan secara real-time menggunakan perangkat IoT. Aplikasi ini menampilkan data sensor seperti kelembaban tanah, suhu, dan kelembaban udara, serta memberikan notifikasi status kondisi tanaman.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Project](#struktur-project)
- [Komponen Utama](#komponen-utama)
- [Hooks Custom](#hooks-custom)
- [Services](#services)
- [Tipe Data](#tipe-data)
- [Utils](#utils)
- [Konstanta](#konstanta)
- [API Endpoint Format](#api-endpoint-format)
- [Mode Simulasi](#mode-simulasi)
- [Penyimpanan Lokal](#penyimpanan-lokal)
- [Lisensi](#lisensi)

---

## ✨ Fitur

### 1. **Koneksi Device**
   - **Scan QR Code**: Scan QR code pada perangkat IoT untuk terhubung otomatis
   - **Input Manual**: Masukkan IP address atau URL endpoint secara manual
   - **Auto-reconnect**: Menyimpan device terakhir yang terhubung

### 2. **Monitoring Sensor Real-time**
   - **Kelembaban Tanah** (Soil Moisture): 0-100%
   - **Suhu** (Temperature): °C
   - **Kelembaban Udara** (Humidity): 0-100%

### 3. **Status Indikator**
   - **Normal** ✓: Kondisi optimal (hijau)
   - **Perhatian** ⚠: Kondisi di luar optimal tapi masih aman (kuning)
   - **Bahaya** ✕: Kondisi berbahaya (merah)

### 4. **Fitur Tambahan**
   - **Custom Device Name**: Ubah nama perangkat sesuai keinginan
   - **Lokasi Device**: Tampilkan lokasi device dengan koordinat GPS
   - **Integrasi Maps**: Buka lokasi di Google Maps / Apple Maps
   - **Mode Simulasi**: Test aplikasi tanpa device fisik

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **React Native** | 0.83.4 | Framework mobile development |
| **Expo** | ~54.0.8 | Platform development tools |
| **TypeScript** | ~6.0.3 | Type-safe JavaScript |
| **React** | 19.2.3 | UI library |
| **AsyncStorage** | ^1.23.1 | Local storage |
| **expo-camera** | ~17.0.10 | Camera access untuk QR scan |
| **react-native-maps** | 1.20.1 | Map integration |
| **expo-linking** | ~55.0.8 | Deep linking & URL handling |

---

## 💻 Persyaratan Sistem

- **Node.js**: v16 atau lebih baru
- **npm** atau **yarn**
- **Expo CLI**: Terinstall global (opsional)
- **Expo Go App**: Di smartphone untuk testing
- **Simulator/Emulator**: iOS Simulator atau Android Emulator (opsional)

### Permission yang Diperlukan

#### Android
- Kamera: Untuk scan QR code
- Lokasi: Untuk menampilkan maps

#### iOS
- Kamera: Untuk scan QR code
- Info.plist sudah dikonfigurasi dengan `NSCameraUsageDescription`

---

## 📦 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd iot-plantation-app
```

### 2. Install Dependencies

```bash
npm install
```

atau

```bash
yarn install
```

### 3. Konfigurasi Awal

Pastikan semua dependencies terinstall dengan benar. Tidak ada konfigurasi tambahan yang diperlukan.

---

## 🚀 Menjalankan Aplikasi

### Start Development Server

```bash
npm start
```

atau

```bash
npx expo start
```

### Jalankan di Platform Spesifik

#### Android
```bash
npm run android
# atau
npx expo start --android
```

#### iOS
```bash
npm run ios
# atau
npx expo start --ios
```

#### Web Browser
```bash
npm run web
# atau
npx expo start --web
```

### Scan QR Code dari Expo DevTools

1. Jalankan `npm start`
2. Scan QR code yang muncul di terminal menggunakan **Expo Go** app
3. Aplikasi akan loading di smartphone Anda

---

## 📁 Struktur Project

```
iot-plantation-app/
├── assets/                          # Asset gambar & icon
│   ├── android-icon-background.png
│   ├── android-icon-foreground.png
│   ├── android-icon-monochrome.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── src/                             # Source code utama
│   ├── components/                  # UI Components
│   │   ├── ConnectDeviceScreen.tsx  # Screen koneksi device
│   │   ├── EditNameModal.tsx        # Modal edit nama device
│   │   ├── Header.tsx               # Header dashboard
│   │   ├── LocationButton.tsx       # Button & display lokasi
│   │   ├── MapModal.tsx             # Modal peta fullscreen
│   │   ├── SensorCard.tsx           # Card display sensor
│   │   ├── SkeletonLoader.tsx       # Loading skeleton
│   │   └── index.ts                 # Export semua components
│   ├── constants/                   # Konstanta aplikasi
│   │   ├── colors.ts                # Color palette & design tokens
│   │   ├── storageKeys.ts           # Keys untuk AsyncStorage
│   │   └── index.ts                 # Export constants
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useDeviceData.ts         # Hook untuk fetch device data
│   │   ├── useDeviceName.ts         # Hook untuk manage custom name
│   │   └── index.ts                 # Export hooks
│   ├── services/                    # Business logic & API
│   │   ├── api.ts                   # API calls & HTTP requests
│   │   ├── storage.ts               # AsyncStorage operations
│   │   └── index.ts                 # Export services
│   ├── types/                       # TypeScript type definitions
│   │   └── index.ts                 # Semua type interfaces
│   └── utils/                       # Utility functions
│       ├── maps.ts                  # Helper functions untuk maps
│       ├── validation.ts            # Validation helpers
│       └── index.ts                 # Export utils
├── App.tsx                          # Main application component
├── index.ts                         # Entry point aplikasi
├── app.json                         # Expo configuration
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # Dokumentasi ini
```

---

## 🧩 Komponen Utama

### App.tsx
Komponen utama aplikasi yang mengatur:
- State management untuk screen navigation (connect vs dashboard)
- Integrasi semua hooks dan components
- Logic untuk connect/disconnect device
- Status sensor evaluation (normal/warning/danger)

### ConnectDeviceScreen
Screen untuk koneksi device dengan fitur:
- Input manual IP/URL
- QR Code scanner
- Validasi endpoint
- Tombol mode simulasi

**Props:**
```typescript
interface ConnectDeviceScreenProps {
  onConnect: (url: string) => void;
  onSimulation: () => void;
  isLoading?: boolean;
}
```

### SensorCard
Card untuk menampilkan data sensor dengan status indicator.

**Props:**
```typescript
interface SensorCardProps {
  icon: string;
  title: string;
  value: number;
  unit: string;
  optimalRange: string;
  status: 'normal' | 'warning' | 'danger';
  statusLabel: string;
  message: string;
}
```

### Header
Header dashboard dengan badge simulasi dan tombol edit nama.

### MapModal
Modal fullscreen untuk menampilkan lokasi device di peta interaktif.

### EditNameModal
Modal untuk mengedit nama custom device.

### LocationDisplay
Card display lokasi dengan koordinat dan button untuk membuka maps.

### SkeletonLoader
Loading states:
- `SkeletonLine`: Single line skeleton
- `SkeletonCard`: Card skeleton
- `FullScreenLoader`: Full screen loading indicator
- `SkeletonDashboard`: Complete dashboard skeleton

---

## 🎣 Hooks Custom

### useDeviceData
Hook untuk mengelola fetching data device.

**Return Value:**
```typescript
{
  data: DeviceResponse | null;
  loading: boolean;
  error: string | null;
  fetchDevice: (url: string) => Promise<void>;
  refreshDevice: () => Promise<void>;
  clearData: () => void;
  loadDummyData: () => void;
}
```

**Contoh Penggunaan:**
```typescript
const { data, loading, error, fetchDevice, loadDummyData } = useDeviceData();
```

### useDeviceName
Hook untuk mengelola custom name device dengan persistence.

**Return Value:**
```typescript
{
  displayName: string;
  isCustomName: boolean;
  updateName: (newName: string) => Promise<boolean>;
  resetToDefault: () => void;
  isLoading: boolean;
}
```

**Contoh Penggunaan:**
```typescript
const { displayName, updateName } = useDeviceName(device);
```

---

## 🔧 Services

### api.ts
Functions untuk HTTP requests ke device IoT.

**Functions:**

#### `fetchDeviceData(url: string)`
Fetch data dari endpoint device.
- **Returns**: `Promise<DeviceResponse>`
- **Throws**: Error jika request gagal

#### `fetchDeviceDataWithLatency(url: string, delayMs?: number)`
Fetch dengan simulated latency untuk testing.
- **Parameters**: 
  - `url`: Endpoint URL
  - `delayMs`: Delay dalam ms (default: 1500)
- **Returns**: `Promise<DeviceResponse>`

#### `testEndpoint(url: string)`
Test apakah endpoint reachable.
- **Returns**: `Promise<boolean>`

### storage.ts
Functions untuk AsyncStorage operations.

**Functions:**

#### Device Name Management
- `getCustomDeviceName(deviceId: string)`: Get custom name
- `saveCustomDeviceName(deviceId, customName)`: Save custom name
- `removeCustomDeviceName(deviceId)`: Remove custom name
- `getAllCustomDeviceNames()`: Get all saved names

#### Last Device URL
- `saveLastDeviceUrl(url: string)`: Save last connected URL
- `getLastDeviceUrl()`: Get last connected URL
- `removeLastDeviceUrl()`: Clear last URL

#### Utility
- `clearAllData()`: Clear semua AsyncStorage

---

## 📐 Tipe Data

### SensorData
```typescript
interface SensorData {
  soil_moisture: number;     // 0-100%
  temperature: number;        // Celsius
  humidity: number;           // 0-100%
}
```

### DeviceResponse
```typescript
interface DeviceResponse {
  device_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  sensors: SensorData;
}
```

### DeviceWithCustomName
```typescript
interface DeviceWithCustomName extends DeviceResponse {
  displayName: string;       // Custom name dari localStorage
}
```

### DeviceDataState
```typescript
interface DeviceDataState {
  data: DeviceResponse | null;
  loading: boolean;
  error: string | null;
}
```

### ScanResult
```typescript
type ScanResult = {
  type: 'qr' | 'manual';
  url: string;
};
```

---

## 🛠️ Utils

### validation.ts
Helper functions untuk validasi input.

**Functions:**

#### `isValidIP(ip: string): boolean`
Validasi IPv4 address.

#### `isValidURL(url: string): boolean`
Validasi URL format.

#### `isValidEndpoint(input: string): boolean`
Validasi endpoint (URL atau IP dengan optional port).

#### `normalizeEndpoint(input: string): string`
Normalize input menjadi full URL dengan `http://` prefix.

#### `extractDeviceIdFromUrl(url: string): string | null`
Extract device ID dari URL query params atau path.

### maps.ts
Helper functions untuk map integration.

**Functions:**

#### `openInMaps(latitude, longitude, onError?)`
Buka lokasi di Google Maps / Apple Maps berdasarkan platform.
- **Returns**: `Promise<MapOpenResult>`

#### `getGoogleMapsUrl(latitude, longitude, zoom?)`
Generate Google Maps URL.

#### `getAppleMapsUrl(latitude, longitude)`
Generate Apple Maps URL (iOS).

#### `getAndroidGeoUri(latitude, longitude)`
Generate Android geo URI.

#### `isValidCoordinates(latitude, longitude): boolean`
Validasi koordinat (-90 ≤ lat ≤ 90, -180 ≤ lng ≤ 180).

#### `formatCoordinates(latitude, longitude): string`
Format koordinat untuk display.

#### `getPlatformMapUrl(latitude, longitude): string`
Get map URL berdasarkan platform.

---

## 🎨 Konstanta

### colors.ts
Design tokens untuk konsistensi UI.

**Color Palette:**
```typescript
Colors = {
  // Background - Dark green theme
  background: '#0D1F14',
  surface: '#142C1B',
  surfaceLight: '#1A3A24',
  
  // Primary - Bright green
  primary: '#22C55E',
  primaryDark: '#16A34A',
  primaryLight: '#4ADE80',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  
  // Status Colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Sensor Status (berdasarkan status, bukan jenis sensor)
  sensorNormal: '#22C55E',
  sensorWarning: '#F59E0B',
  sensorDanger: '#EF4444',
}
```

**Design Tokens:**
- `FontSizes`: xs (12) → xxxl (32)
- `FontWeights`: regular (400) → bold (700)
- `Spacing`: xs (4) → xxxl (32)
- `BorderRadius`: sm (6) → round (9999)

### storageKeys.ts
Keys untuk AsyncStorage:
```typescript
StorageKeys = {
  DEVICE_NAME_PREFIX: 'device_name_',
  LAST_DEVICE_URL: 'last_device_url',
  SIMULATION_MODE: 'simulation_mode',
}
```

---

## 🌐 API Endpoint Format

Device IoT harus mengembalikan JSON dengan format berikut:

### Request
```
GET http://<device-ip>:<port>/
Content-Type: application/json
```

### Response Format
```json
{
  "device_id": "AgroSense-001",
  "location_name": "Kebun Blok A-12",
  "latitude": -6.9147,
  "longitude": 107.6098,
  "sensors": {
    "soil_moisture": 62,
    "temperature": 34,
    "humidity": 45
  }
}
```

### Required Fields
- `device_id` (string): Unique identifier device
- `sensors` (object): Object berisi data sensor

### Optional Fields
- `location_name` (string): Nama lokasi
- `latitude` (number): Koordinat latitude
- `longitude` (number): Koordinat longitude

### Sensor Ranges

#### Soil Moisture (Kelembaban Tanah)
- **Optimal**: 40-75%
- **Safe**: 20-90%
- **Status**:
  - Normal: 40-75%
  - Warning: 20-40% atau 75-90%
  - Danger: <20% atau >90%

#### Temperature (Suhu)
- **Optimal**: 20-32°C
- **Safe**: 15-40°C
- **Status**:
  - Normal: 20-32°C
  - Warning: 15-20°C atau 32-40°C
  - Danger: <15°C atau >40°C

#### Humidity (Kelembaban Udara)
- **Optimal**: 50-85%
- **Safe**: 30-95%
- **Status**:
  - Normal: 50-85%
  - Warning: 30-50% atau 85-95%
  - Danger: <30% atau >95%

---

## 🧪 Mode Simulasi

Mode simulasi memungkinkan testing aplikasi tanpa device fisik.

### Cara Menggunakan
1. Di screen koneksi, klik **"🧪 Gunakan Mode Simulasi"**
2. Aplikasi akan load dummy data:
   ```json
   {
     "device_id": "AgroSense-001",
     "location_name": "Kebun Blok A-12",
     "latitude": -6.9147,
     "longitude": 107.6098,
     "sensors": {
       "soil_moisture": 62,
       "temperature": 34,
       "humidity": 45
     }
   }
   ```
3. Badge **"🛠️ MODE SIMULASI"** akan muncul di header

### Dummy Data Values
- Soil Moisture: 62% (Normal)
- Temperature: 34°C (Warning - di atas optimal)
- Humidity: 45% (Warning - di bawah optimal)

---

## 💾 Penyimpanan Lokal

Aplikasi menggunakan AsyncStorage untuk persist data:

### Data yang Disimpan

1. **Custom Device Names**
   - Key format: `device_name_{device_id}`
   - Value: Custom name string
   - Purpose: User dapat rename device

2. **Last Connected Device URL**
   - Key: `last_device_url`
   - Value: Full URL string
   - Purpose: Auto-reconnect saat app dibuka

3. **Simulation Mode**
   - Key: `simulation_mode`
   - Value: Boolean string
   - Purpose: Track simulation state

### Storage Operations

Semua operasi storage ada di `src/services/storage.ts`:

```typescript
// Save custom name
await saveCustomDeviceName('AgroSense-001', 'Kebun Saya');

// Get custom name
const name = await getCustomDeviceName('AgroSense-001');

// Save last URL
await saveLastDeviceUrl('http://192.168.1.100');

// Get last URL
const url = await getLastDeviceUrl();

// Clear all
await clearAllData();
```

---

## 🎯 Flow Aplikasi

### 1. Initial Load
```
App Start
  ↓
Check AsyncStorage for last_device_url
  ↓
If exists → Fetch device data → Dashboard
If not exists → Connect Screen
```

### 2. Connect to Device
```
User Input IP/URL or Scan QR
  ↓
Validate Endpoint
  ↓
Fetch Device Data (with 1.5s latency simulation)
  ↓
Success → Save URL → Dashboard
Error → Show Alert → Retry or Simulation
```

### 3. Dashboard Display
```
Load Device Data
  ↓
Evaluate Sensor Status (normal/warning/danger)
  ↓
Display Sensor Cards with Status Indicators
  ↓
Show Location (if coordinates available)
```

### 4. Edit Device Name
```
Tap Edit Icon
  ↓
Open Edit Modal
  ↓
Input New Name
  ↓
Save to AsyncStorage
  ↓
Update Display Name
```

---

## 🔒 Error Handling

### Network Errors
- Timeout setelah 10 detik
- Retry option tersedia
- Fallback ke mode simulasi

### Invalid Data
- Validasi required fields (`device_id`, `sensors`)
- Error message informatif
- Kembali ke connect screen

### Permission Denied
- Alert untuk camera permission
- Fallback ke manual input
- Graceful degradation

---

## 📱 Supported Platforms

- ✅ **iOS**: iPhone & iPad (iOS 13+)
- ✅ **Android**: Phone & Tablet (Android 6+)
- ✅ **Web**: Modern browsers (Chrome, Firefox, Safari)

---

## 🤝 Kontribusi

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 Lisensi

Distributed under the license. See `LICENSE` for more information.

---

## 📞 Support

Untuk pertanyaan atau issue:
- Buat issue di repository
- Email: support@agrosense.example.com

---

## 🙏 Acknowledgments

- Design inspired by Figma AgroSense
- Built with Expo and React Native
- Icons and assets from community resources

---

**AgroSense** - Monitoring Perkebunan IoT Made Simple 🌿 
