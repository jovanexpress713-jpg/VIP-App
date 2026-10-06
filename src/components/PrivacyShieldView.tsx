import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Globe,
  Radio,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { AppSettings, ConnectionStatus, VpnServer } from '../types';
import { translations, Language } from '../data/translations';
import { MOCK_USER_REAL_IP } from '../data/servers';

interface PrivacyShieldViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  status: ConnectionStatus;
  selectedServer: VpnServer;
  lang: Language;
}

export const PrivacyShieldView: React.FC<PrivacyShieldViewProps> = ({
  settings,
  onUpdateSettings,
  status,
  selectedServer,
  lang,
}) => {
  const t = translations[lang];
  const [isDnsTesting, setIsDnsTesting] = useState(false);
  const [dnsTestDone, setDnsTestDone] = useState(false);
  const [trackersCount, setTrackersCount] = useState(1482);

  const isConnected = status === 'connected';

  const runDnsLeakTest = () => {
    setIsDnsTesting(true);
    setDnsTestDone(false);
    setTimeout(() => {
      setIsDnsTesting(false);
      setDnsTestDone(true);
    }, 1800);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Privacy Shield Card */}
      <div className="w-full rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950 border border-slate-800/80 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
        {/* Title */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                {t.privacyShieldTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'حماية كاملة من تعقب المواقع والتنصت وتسريب الهوية'
                  : 'Total defense against ISP surveillance and tracking leaks'}
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Zero-Log Verified</span>
          </span>
        </div>

        {/* 4 Core Privacy Shields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Shield 1: Real IP Cloaking */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-slate-200">
                    {t.ipMaskingStatus}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isConnected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {isConnected ? (lang === 'ar' ? 'محجوب تماماً' : 'Masked') : (lang === 'ar' ? 'مكشوف' : 'Exposed')}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 mt-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t.realIp}:</span>
                  <span className={isConnected ? 'line-through text-slate-600' : 'text-rose-400 font-bold'}>
                    {MOCK_USER_REAL_IP.ip}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t.currentIp}:</span>
                  <span className="text-emerald-400 font-bold">
                    {isConnected ? selectedServer.ip : '---'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shield 2: DNS & WebRTC Leak Test */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-slate-200">
                    {t.dnsLeakStatus}
                  </span>
                </div>

                <button
                  id="btn-run-dns-test"
                  onClick={runDnsLeakTest}
                  disabled={isDnsTesting}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isDnsTesting ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>{lang === 'ar' ? 'فحص الآن' : 'Test Leaks'}</span>
                </button>
              </div>

              <div className="mt-3 text-xs">
                {isDnsTesting ? (
                  <div className="flex items-center gap-2 text-cyan-400 font-mono">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>{lang === 'ar' ? 'جاري فحص 24 خادم DNS...' : 'Scanning 24 DNS resolvers...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-[11px] font-semibold">
                      {isConnected
                        ? t.dnsProtected
                        : (lang === 'ar' ? 'قم بالاتصال لتشفير استعلامات DNS' : 'Connect to encrypt DNS queries')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shield 3: Kill Switch */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="max-w-[80%]">
              <div className="flex items-center gap-2 mb-1">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-slate-200">
                  {t.killSwitchTitle}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.killSwitchDesc}
              </p>
            </div>

            <button
              id="btn-toggle-kill-switch"
              onClick={() => onUpdateSettings({ killSwitch: !settings.killSwitch })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.killSwitch ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.killSwitch
                    ? lang === 'ar'
                      ? '-translate-x-5'
                      : 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Shield 4: AdBlock & Trackers Blocker */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="max-w-[80%]">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-slate-200">
                  {t.trackerBlocker}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                <strong className="text-emerald-400 font-bold">{trackersCount.toLocaleString()}</strong> {t.trackersBlockedCount}
              </p>
            </div>

            <button
              id="btn-toggle-adblocker"
              onClick={() => onUpdateSettings({ adBlocker: !settings.adBlocker })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.adBlocker ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.adBlocker
                    ? lang === 'ar'
                      ? '-translate-x-5'
                      : 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
