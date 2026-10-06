import React from 'react';
import {
  Power,
  ShieldCheck,
  ShieldAlert,
  ArrowDown,
  ArrowUp,
  Clock,
  Zap,
  Globe,
  ChevronRight,
  ChevronLeft,
  Lock,
  Wifi,
  Radio,
  Cpu,
  Sparkles,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { ConnectionStatus, ConnectionStats, VpnServer, AppSettings } from '../types';
import { translations, Language } from '../data/translations';
import { MOCK_USER_REAL_IP } from '../data/servers';

interface MainConnectViewProps {
  status: ConnectionStatus;
  stats: ConnectionStats;
  selectedServer: VpnServer;
  settings: AppSettings;
  lang: Language;
  onToggleConnect: () => void;
  onOpenServerModal: () => void;
  onOpenSpeedTest: () => void;
}

export const MainConnectView: React.FC<MainConnectViewProps> = ({
  status,
  stats,
  selectedServer,
  settings,
  lang,
  onToggleConnect,
  onOpenServerModal,
  onOpenSpeedTest,
}) => {
  const t = translations[lang];
  const [copied, setCopied] = React.useState(false);

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting' || status === 'reconnecting';
  const isDisconnecting = status === 'disconnecting';

  // Format seconds to HH:MM:SS
  const formatDuration = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format bytes to MB/GB
  const formatData = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const handleCopyIp = () => {
    const ipToCopy = isConnected ? selectedServer.ip : MOCK_USER_REAL_IP.ip;
    navigator.clipboard.writeText(ipToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Central Connect Card */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950 border border-slate-800/80 p-6 sm:p-8 flex flex-col items-center shadow-2xl backdrop-blur-2xl overflow-hidden">
        {/* Glow ambient background aura */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${
            isConnected
              ? 'bg-emerald-500/20'
              : isConnecting
              ? 'bg-amber-500/20'
              : 'bg-slate-700/10'
          }`}
        ></div>

        {/* Top Status Header */}
        <div className="w-full flex items-center justify-between z-10 mb-6">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected
                  ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]'
                  : isConnecting
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-slate-600'
              }`}
            ></span>
            <span className="text-xs sm:text-sm font-bold text-slate-300">
              {isConnected
                ? t.connected
                : isConnecting
                ? t.connecting
                : isDisconnecting
                ? t.disconnecting
                : t.disconnected}
            </span>
          </div>

          {/* Quick Protocol Tag */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-emerald-400">
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>{settings.protocol.toUpperCase()}</span>
          </div>
        </div>

        {/* Central Power Button Area */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Animated Wave Rings when Connected or Connecting */}
          {(isConnected || isConnecting) && (
            <>
              <div
                className={`absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-dashed transition-all duration-1000 ${
                  isConnected
                    ? 'border-emerald-500/20 animate-pulse-ring'
                    : 'border-amber-500/20 animate-spin'
                }`}
              ></div>
              <div
                className={`absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border transition-all duration-700 ${
                  isConnected
                    ? 'border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                    : 'border-amber-500/30'
                }`}
              ></div>
            </>
          )}

          {/* Main Tactile Button */}
          <button
            id="btn-main-connect-power"
            onClick={onToggleConnect}
            disabled={isConnecting || isDisconnecting}
            className={`relative group w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center p-4 transition-all duration-500 transform active:scale-95 z-20 ${
              isConnected
                ? 'bg-gradient-to-tr from-emerald-950 via-slate-900 to-emerald-900 border-2 border-emerald-400/80 shadow-[0_0_50px_rgba(16,185,129,0.4)] text-emerald-300'
                : isConnecting
                ? 'bg-gradient-to-tr from-amber-950 via-slate-900 to-amber-900 border-2 border-amber-400/80 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-amber-300 cursor-wait'
                : 'bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-700/80 hover:border-emerald-500/50 shadow-2xl text-slate-400 hover:text-emerald-400'
            }`}
          >
            {/* Inner Metallic Bevel */}
            <div className="absolute inset-1.5 rounded-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

            {/* Center Icon */}
            <div className="relative flex flex-col items-center justify-center gap-1">
              {isConnecting ? (
                <RefreshCw className="w-12 h-12 sm:w-14 sm:h-14 animate-spin text-amber-400" />
              ) : (
                <Power
                  className={`w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110 ${
                    isConnected ? 'text-emerald-400 drop-shadow-[0_0_12px_#34d399]' : 'text-slate-400'
                  }`}
                />
              )}
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase mt-1 font-display">
                {isConnected ? t.disconnect : isConnecting ? t.connecting : t.connect}
              </span>
            </div>
          </button>
        </div>

        {/* Duration Timer (if connected) */}
        {isConnected ? (
          <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm font-mono font-bold animate-fadeIn">
            <Clock className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{formatDuration(stats.durationSeconds)}</span>
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-400 text-center font-medium">
            {lang === 'ar'
              ? 'اضغط على الزر لبدء نفق VPN مشفر وفائق السرعة'
              : 'Tap to initiate high-speed encrypted VPN tunnel'}
          </p>
        )}

        {/* Selected Server Selector Card */}
        <div className="w-full mt-6">
          <div
            id="card-select-server"
            onClick={onOpenServerModal}
            className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all duration-300 flex items-center justify-between group shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl select-none filter drop-shadow-sm">
                {selectedServer.flag}
              </span>
              <div className="text-start">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {lang === 'ar' ? selectedServer.cityAr : selectedServer.city}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {selectedServer.countryCode}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? selectedServer.countryAr : selectedServer.country}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-end hidden sm:block">
                <div className="flex items-center gap-1 justify-end text-xs font-bold text-emerald-400 font-mono">
                  <Zap className="w-3 h-3" />
                  <span>{selectedServer.ping} ms</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {t.serverLoad}: {selectedServer.load}%
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-700 transition-all">
                {lang === 'ar' ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Grid (Visible when Connected) */}
        {isConnected && (
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 animate-fadeIn">
            {/* Download Speed */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.downloadSpeed}</span>
              </div>
              <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                {(stats.downloadSpeedKbps / 1024).toFixed(1)}{' '}
                <span className="text-xs font-normal text-slate-400">MB/s</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                {t.totalDownloaded}: {formatData(stats.downloadBytes)}
              </span>
            </div>

            {/* Upload Speed */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.uploadSpeed}</span>
              </div>
              <span className="text-base sm:text-lg font-black text-cyan-400 font-mono">
                {(stats.uploadSpeedKbps / 1024).toFixed(1)}{' '}
                <span className="text-xs font-normal text-slate-400">MB/s</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                {t.totalUploaded}: {formatData(stats.uploadBytes)}
              </span>
            </div>

            {/* Real-time Ping */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.ping}</span>
              </div>
              <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                {stats.currentPing}{' '}
                <span className="text-xs font-normal text-slate-400">ms</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                {t.jitter}: {stats.jitter} ms
              </span>
            </div>

            {/* Packet Loss */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{t.packetLoss}</span>
              </div>
              <span className="text-base sm:text-lg font-black text-teal-400 font-mono">
                {stats.packetLoss.toFixed(1)}%
              </span>
              <span className="text-[10px] text-emerald-400 font-bold mt-0.5">
                {lang === 'ar' ? 'استقرار 100%' : '100% Stable'}
              </span>
            </div>
          </div>
        )}

        {/* IP & Location Info Badge */}
        <div className="w-full mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 text-[11px] block">
                {isConnected ? t.currentIp : t.realIp}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-200">
                  {isConnected ? selectedServer.ip : MOCK_USER_REAL_IP.ip}
                </span>
                <button
                  id="btn-copy-ip"
                  onClick={handleCopyIp}
                  className="text-slate-500 hover:text-emerald-400 transition-colors"
                  title={t.copy}
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-start">
            <div>
              <span className="text-slate-400 text-[11px] block">{t.isp}</span>
              <span className="font-semibold text-slate-300">
                {isConnected ? 'VYRO Quantum Shield' : MOCK_USER_REAL_IP.isp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 Feature Highlights Grid (Translating user prompt core features) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Feature 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all group">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 mb-1">
            {t.feature1Title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.feature1Desc}
          </p>
        </div>

        {/* Feature 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 mb-1">
            {t.feature2Title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.feature2Desc}
          </p>
        </div>

        {/* Feature 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all group">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 mb-1">
            {t.feature3Title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.feature3Desc}
          </p>
        </div>

        {/* Feature 4 */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/30 transition-all group">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 mb-1">
            {t.feature4Title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.feature4Desc}
          </p>
        </div>

        {/* Feature 5 */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 transition-all group">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 mb-1">
            {t.feature5Title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.feature5Desc}
          </p>
        </div>

        {/* Feature 6 */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/30 transition-all group">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Wifi className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 mb-1">
            {t.feature6Title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.feature6Desc}
          </p>
        </div>
      </div>
    </div>
  );
};
