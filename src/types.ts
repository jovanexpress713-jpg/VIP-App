export type ProtocolType = 'wireguard' | 'openvpn_udp' | 'openvpn_tcp' | 'ikev2' | 'shadowsocks' | 'vyroturbo';

export type ServerCategory = 'all' | 'fastest' | 'gaming' | 'streaming' | 'privacy' | 'p2p';

export interface VpnServer {
  id: string;
  country: string;
  countryAr: string;
  city: string;
  cityAr: string;
  countryCode: string;
  flag: string;
  ip: string;
  ping: number;
  load: number; // 0 - 100%
  score: number;
  category: ('fastest' | 'gaming' | 'streaming' | 'privacy' | 'p2p')[];
  premiumOnly?: boolean;
  coordinates: [number, number]; // [lat, lng]
  features: string[];
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'disconnecting' | 'reconnecting';

export interface ConnectionStats {
  durationSeconds: number;
  downloadBytes: number;
  uploadBytes: number;
  downloadSpeedKbps: number;
  uploadSpeedKbps: number;
  packetLoss: number;
  jitter: number;
  currentPing: number;
}

export interface AppSettings {
  autoConnectOnWifi: boolean;
  killSwitch: boolean;
  autoReconnect: boolean;
  protocol: ProtocolType;
  customDns: string;
  dnsProtection: boolean;
  adBlocker: boolean;
  malwareShield: boolean;
  splitTunnelingEnabled: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  theme: 'cyber-dark' | 'midnight' | 'emerald-glow';
  splitTunnelingApps: { id: string; name: string; icon: string; enabled: boolean }[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  messageAr: string;
}

export interface WifiNetworkInfo {
  ssid: string;
  bssid: string;
  isPublic: boolean;
  securityType: 'WPA3' | 'WPA2' | 'Open (Unsecured)' | 'WEP';
  isSafe: boolean;
  signalStrength: number; // 1-100
  threatsDetected: string[];
}
