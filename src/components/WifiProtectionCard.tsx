import React, { useState } from 'react';
import {
  Wifi,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Lock,
  Unlock,
  RefreshCw,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { WifiNetworkInfo, AppSettings, ConnectionStatus } from '../types';
import { translations, Language } from '../data/translations';

interface WifiProtectionCardProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  status: ConnectionStatus;
  lang: Language;
}

export const WifiProtectionCard: React.FC<WifiProtectionCardProps> = ({
  settings,
  onUpdateSettings,
  status,
  lang,
}) => {
  const t = translations[lang];
  const [isScanning, setIsScanning] = useState(false);
  const [wifiInfo, setWifiInfo] = useState<WifiNetworkInfo>({
    ssid: 'Costa_Coffee_Guest_WiFi',
    bssid: 'a4:2b:8c:19:e4:50',
    isPublic: true,
    securityType: 'Open (Unsecured)',
    isSafe: false,
    signalStrength: 88,
    threatsDetected: ['Unencrypted Traffic', 'Potential ARP Spoofing Vulnerability']
  });

  const isVpnActive = status === 'connected';

  const handleScanNetwork = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setWifiInfo({
        ssid: 'Airport_Free_HighSpeed_WiFi',
        bssid: '8c:fe:74:9a:11:32',
        isPublic: true,
        securityType: 'Open (Unsecured)',
        isSafe: false,
        signalStrength: 94,
        threatsDetected: ['Captive Portal Detected', 'No 802.11w Protection']
      });
    }, 1500);
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950 border border-slate-800/80 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              {t.wifiTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'حماية مشددة على شبكات المقاهي والمطارات والفنادق'
                : 'Proactive protection on cafe, airport, and hotel Wi-Fi'}
            </p>
          </div>
        </div>

        <button
          id="btn-scan-wifi"
          onClick={handleScanNetwork}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-purple-400' : ''}`} />
          <span>{lang === 'ar' ? 'إعادة الفحص' : 'Rescan'}</span>
        </button>
      </div>

      {/* Current Wi-Fi Status Banner */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isVpnActive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {isVpnActive ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-200">
                {wifiInfo.ssid}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {wifiInfo.signalStrength}% Signal
              </span>
            </div>
            <p
              className={`text-xs font-semibold mt-0.5 ${
                isVpnActive ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isVpnActive ? t.wifiSafe : t.wifiUnsafe}
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono flex items-center gap-1">
            {wifiInfo.securityType.includes('Open') ? (
              <Unlock className="w-3 h-3 text-rose-400" />
            ) : (
              <Lock className="w-3 h-3 text-emerald-400" />
            )}
            <span>{wifiInfo.securityType}</span>
          </span>
        </div>
      </div>

      {/* Security Analysis Details */}
      <div className="mt-4 space-y-2.5">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
          {isVpnActive ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          )}
          <div className="text-xs">
            <span className="font-bold text-slate-200 block mb-0.5">
              {t.wifiThreatScan}
            </span>
            <p className="text-slate-400 leading-relaxed">
              {isVpnActive
                ? t.wifiNoThreats
                : lang === 'ar'
                ? 'تحذير: البيانات غير مشفرة على نقطة الوصول هذه ويمكن اعتراضها. فعّل VYRO فوراً.'
                : 'Warning: Network packets are unencrypted at access point layer. Enable VYRO VPN.'}
            </p>
          </div>
        </div>
      </div>

      {/* Auto-Protect Switch */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="text-xs">
          <span className="font-bold text-slate-200 block">
            {t.wifiAutoProtect}
          </span>
          <span className="text-slate-500 text-[11px]">
            {lang === 'ar'
              ? 'تشغيل الـ VPN تلقائياً بمجرد اكتشاف شبكة واي فاي غير موثوقة'
              : 'Automatically engage VPN tunnel upon connecting to open networks'}
          </span>
        </div>

        <button
          id="btn-toggle-auto-wifi"
          onClick={() =>
            onUpdateSettings({
              autoConnectOnWifi: !settings.autoConnectOnWifi,
            })
          }
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            settings.autoConnectOnWifi ? 'bg-emerald-500' : 'bg-slate-800'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              settings.autoConnectOnWifi
                ? lang === 'ar'
                  ? '-translate-x-5'
                  : 'translate-x-5'
                : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
