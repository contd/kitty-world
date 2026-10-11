/**
 * Platform Detection & Runtime Environment Abstraction
 * Detects whether running inside Tauri v2 (Desktop or Mobile) or Web Browser,
 * touch capabilities, operating system, and safe area insets.
 */

export interface PlatformInfo {
  isTauri: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  os: 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'browser';
  offlineReady: boolean;
}

export function detectPlatform(): PlatformInfo {
  // Check for Tauri v2 presence in window
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
  
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
    (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(userAgent);
  const isMobile = isIOS || isAndroid || (typeof window !== 'undefined' && window.innerWidth <= 768);
  const hasTouch = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  let os: PlatformInfo['os'] = 'browser';
  if (isIOS) os = 'ios';
  else if (isAndroid) os = 'android';
  else if (/macintosh|mac os x/.test(userAgent)) os = 'macos';
  else if (/windows/.test(userAgent)) os = 'windows';
  else if (/linux/.test(userAgent)) os = 'linux';

  return {
    isTauri,
    isMobile,
    isIOS,
    isAndroid,
    isDesktop: !isMobile,
    hasTouch,
    os,
    offlineReady: true,
  };
}

export const currentPlatform = detectPlatform();
