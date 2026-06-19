// src/utils/validation.ts

/**
 * Validates if a string is a valid IP address (IPv4)
 * @param ip - IP address string to validate
 * @returns true if valid IPv4 address
 */
export const isValidIP = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip.trim());
};

/**
 * Validates if a string is a valid URL
 * @param url - URL string to validate
 * @returns true if valid URL
 */
export const isValidURL = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates if a string is a valid endpoint (URL or IP with optional port)
 * @param input - Input string to validate
 * @returns true if valid endpoint
 */
export const isValidEndpoint = (input: string): boolean => {
  const trimmedInput = input.trim();
  
  // Check if it's a valid URL
  if (isValidURL(trimmedInput)) {
    return true;
  }
  
  // Check if it's an IP address with optional port
  const ipWithPortRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\d{1,5})?$/;
  if (ipWithPortRegex.test(trimmedInput)) {
    return true;
  }
  
  // Check if it's localhost with optional port
  const localhostRegex = /^localhost(?::\d{1,5})?$/i;
  if (localhostRegex.test(trimmedInput)) {
    return true;
  }
  
  return false;
};

/**
 * Normalizes endpoint input to full URL
 * @param input - Input string (IP, URL, or localhost)
 * @returns Full URL string
 */
export const normalizeEndpoint = (input: string): string => {
  const trimmedInput = input.trim();
  
  // If already a valid URL, return as is
  if (isValidURL(trimmedInput)) {
    return trimmedInput;
  }
  
  // If it's an IP or localhost, add http:// prefix
  return `http://${trimmedInput}`;
};

/**
 * Extracts device ID from URL
 * @param url - URL string
 * @returns Device ID or null if not found
 */
export const extractDeviceIdFromUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    // Try to get device_id from query params
    const deviceId = parsedUrl.searchParams.get('device_id');
    if (deviceId) {
      return deviceId;
    }
    
    // Try to get from path segments
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      return pathSegments[pathSegments.length - 1];
    }
    
    // Fallback to hostname
    return parsedUrl.hostname;
  } catch {
    return null;
  }
};
