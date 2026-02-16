export interface DeviceInfo {
  userAgent: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  deviceBrand: string;
  deviceModel: string;
  os: string;
  browser: string;
  screenResolution: string;
  language: string;
  timezone: string;
  connectionType: string;
}

export const detectDevice = (): DeviceInfo => {
  const ua = navigator.userAgent;
  const screen = window.screen;
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(ua);
  const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';
  
  let os = 'Unknown';
  if (/Windows NT 10/.test(ua)) os = 'Windows 11';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/Android/.test(ua)) {
    const match = ua.match(/Android\s([0-9.]+)/);
    os = match ? `Android ${match[1]}` : 'Android';
  }
  else if (/iPhone|iPad|iPod/.test(ua)) {
    const match = ua.match(/OS\s(\d+)[_\d]+/);
    os = match ? `iOS ${match[1]}` : 'iOS';
  }
  
  let browser = 'Unknown';
  if (/Chrome\/(\d+)/.test(ua) && !/Edg\/|OPR\//.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari\//.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox\//.test(ua)) {
    browser = 'Firefox';
  }
  
  let deviceBrand = 'Unknown';
  if (/iPhone/.test(ua)) deviceBrand = 'Apple';
  else if (/Samsung/.test(ua)) deviceBrand = 'Samsung';
  else if (/Xiaomi/.test(ua)) deviceBrand = 'Xiaomi';
  
  const connection = (navigator as any).connection;
  
  return {
    userAgent: ua,
    deviceType,
    deviceBrand,
    deviceModel: 'Unknown',
    os,
    browser,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connectionType: connection?.effectiveType || 'unknown'
  };
};

export const generateFingerprint = (device: DeviceInfo): string => {
  const str = [device.userAgent, device.screenResolution, device.language, device.timezone].join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
};

export const getGPSLocation = (): Promise<GeolocationPosition | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
};

export const getIPLocation = async (): Promise<any> => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    return await res.json();
  } catch { return null; }
};