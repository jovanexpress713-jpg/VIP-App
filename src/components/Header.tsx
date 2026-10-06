import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Globe, Settings, Activity, Sparkles, Terminal, Download } from 'lucide-react';
import { ConnectionStatus, ProtocolType } from '../types';
import { translations, Language } from '../data/translations';

interface HeaderProps {
  status: ConnectionStatus;
  lang: Language;
  onToggleLang: () => void;
  protocol: ProtocolType;
  onOpenSettings: () => void;
  onOpenLogs: () => void;
  onOpenSpeedTest: () => void;
  onOpenDownloadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  lang,
  onToggleLang,
  protocol,
  onOpenSettings,
  onOpenLogs,
  onOpenSpeedTest,
  onOpenDownloadModal,
}) => {
  const t = translations[lang];

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]',
          icon: ShieldCheck,
          text: t.connected
        };
      case 'connecting':
      case 'reconnecting':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400 animate-ping',
          icon: ShieldAlert,
          text: status === 'connecting' ? t.connecting : t.reconnecting
        };
      case 'disconnecting':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-400',
          icon: ShieldAlert,
          text: t.disconnecting
        };
      default:
        return {
          bg: 'bg-slate-800/60 border-slate-700/60 text-slate-400',
          dot: 'bg-slate-500',
          icon: Shield,
          text: t.disconnected
        };
    }
  };

  const badge = getStatusBadge();
  const IconComp = badge.icon;

  return (
    <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md sticky top-0 z-40 transition-all">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="relative group flex items-center justify-center">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <Shield className="w-5 h-5 text-emerald-400 transition-transform group-hover:scale-110" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'connected' ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status === 'connected' ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent font-display">
              {t.appName}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              VPN PRO
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            {t.appTagline}
          </p>
        </div>
      </div>

      {/* Center Status Badge (Desktop) */}
      <div className="hidden md:flex items-center gap-2">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold backdrop-blur-sm transition-all duration-300 ${badge.bg}`}>
          <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
          <IconComp className="w-3.5 h-3.5" />
          <span>{badge.text}</span>
          <span className="mx-1 text-slate-600">|</span>
          <span className="text-[11px] uppercase tracking-wide opacity-80 font-mono">
            {protocol.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Speed Test Button */}
        <button
          id="btn-speed-test"
          onClick={onOpenSpeedTest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 text-xs font-semibold transition-all shadow-sm"
          title={t.tabSpeed}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">{t.tabSpeed}</span>
        </button>

        {/* Live Logs Terminal */}
        <button
          id="btn-terminal-logs"
          onClick={onOpenLogs}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all shadow-sm"
          title={t.tabLogs}
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Download Project ZIP Archive */}
        <button
          id="btn-header-download-zip"
          onClick={onOpenDownloadModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 text-xs font-semibold transition-all shadow-sm group cursor-pointer"
          title={t.exportFilesTitle}
        >
          <Download className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="hidden lg:inline">{t.downloadZipBtn}</span>
        </button>

        {/* Language Switcher */}
        <button
          id="btn-toggle-language"
          onClick={onToggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition-all shadow-sm"
          title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
        </button>

        {/* Settings Button */}
        <button
          id="btn-open-settings"
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 transition-all shadow-sm"
          title={t.tabSettings}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
