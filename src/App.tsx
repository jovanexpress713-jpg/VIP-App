import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Globe,
  Activity,
  Wifi,
  Lock,
  Settings as SettingsIcon,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Heart
} from 'lucide-react';
import {
  ConnectionStatus,
  ConnectionStats,
  VpnServer,
  AppSettings,
  LogEntry
} from './types';
import { SERVERS_LIST, PROTOCOLS_LIST, MOCK_USER_REAL_IP } from './data/servers';
import { translations, Language } from './data/translations';
import { sounds } from './utils/audio';

import { Header } from './components/Header';
import { MainConnectView } from './components/MainConnectView';
import { WorldMapVisualizer } from './components/WorldMapVisualizer';
import { ServerListModal } from './components/ServerListModal';
import { SpeedTestModal } from './components/SpeedTestModal';
import { WifiProtectionCard } from './components/WifiProtectionCard';
import { PrivacyShieldView } from './components/PrivacyShieldView';
import { SettingsModal } from './components/SettingsModal';
import { ConnectionLogsModal } from './components/ConnectionLogsModal';
import { ProjectDownloadModal } from './components/ProjectDownloadModal';

export default function App() {
  // App state
  const [lang, setLang] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<'home' | 'servers' | 'privacy' | 'wifi' | 'speed'>('home');
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [selectedServer, setSelectedServer] = useState<VpnServer>(SERVERS_LIST[0]);

  // Modals state
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    autoConnectOnWifi: true,
    killSwitch: true,
    autoReconnect: true,
    protocol: 'vyroturbo',
    customDns: 'vyro_zero_log',
    dnsProtection: true,
    adBlocker: true,
    malwareShield: true,
    splitTunnelingEnabled: false,
    soundEffects: true,
    hapticFeedback: true,
    theme: 'cyber-dark',
    splitTunnelingApps: [
      { id: 'banking', name: 'Al Rajhi Bank / Local Banking', icon: '🏦', enabled: true },
      { id: 'delivery', name: 'Hungerstation & Jahez', icon: '🍔', enabled: true },
      { id: 'gov', name: 'Absher / Tawakkalna Services', icon: '🏛️', enabled: true }
    ]
  });

  // Performance & connection telemetry stats
  const [stats, setStats] = useState<ConnectionStats>({
    durationSeconds: 0,
    downloadBytes: 1024 * 1024 * 45, // 45MB
    uploadBytes: 1024 * 1024 * 12, // 12MB
    downloadSpeedKbps: 0,
    uploadSpeedKbps: 0,
    packetLoss: 0.0,
    jitter: 1.2,
    currentPing: selectedServer.ping
  });

  // Diagnostic live logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: 'VYRO VPN Engine v2.5.4 initialized.',
      messageAr: 'تم تهيئة محرك VYRO VPN بنجاح.'
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: 'Hardware acceleration & Post-Quantum KEM cipher modules ready.',
      messageAr: 'تسريع العتاد ووحدات التشفير الكمومي جاهزة للعمل.'
    }
  ]);

  const addLog = (level: LogEntry['level'], message: string, messageAr: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      messageAr
    };
    setLogs((prev) => [...prev.slice(-80), newLog]);
  };

  // Sync sounds state
  useEffect(() => {
    sounds.setEnabled(settings.soundEffects);
  }, [settings.soundEffects]);

  // Update HTML direction when language toggles
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Stats ticking interval when connected
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === 'connected') {
      interval = setInterval(() => {
        setStats((prev) => {
          // Dynamic realistic speed fluctuation
          const downSpeed = Math.floor(Math.random() * 45000) + 75000; // ~75 - 120 MB/s
          const upSpeed = Math.floor(Math.random() * 20000) + 35000; // ~35 - 55 MB/s
          const addedDown = Math.floor((downSpeed * 1024) / 8);
          const addedUp = Math.floor((upSpeed * 1024) / 8);

          return {
            ...prev,
            durationSeconds: prev.durationSeconds + 1,
            downloadBytes: prev.downloadBytes + addedDown,
            uploadBytes: prev.uploadBytes + addedUp,
            downloadSpeedKbps: downSpeed,
            uploadSpeedKbps: upSpeed,
            currentPing: Math.max(8, selectedServer.ping + Math.floor(Math.random() * 4) - 2),
            jitter: +(Math.random() * 1.5 + 0.8).toFixed(1)
          };
        });
      }, 1000);
    } else {
      setStats((prev) => ({
        ...prev,
        downloadSpeedKbps: 0,
        uploadSpeedKbps: 0
      }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, selectedServer.ping]);

  // Handle Connect / Disconnect Action
  const handleToggleConnect = () => {
    if (settings.soundEffects) {
      sounds.playClick();
    }

    if (status === 'connected') {
      // Initiate Disconnect
      setStatus('disconnecting');
      addLog(
        'warn',
        `Terminating tunnel with ${selectedServer.city} (${selectedServer.ip})...`,
        `جاري إنهاء النفق المشفر مع خادم ${selectedServer.cityAr} (${selectedServer.ip})...`
      );

      setTimeout(() => {
        setStatus('disconnected');
        if (settings.soundEffects) sounds.playDisconnect();
        addLog(
          'info',
          'VPN tunnel safely closed. Traffic returned to standard route.',
          'تم إغلاق نفق VPN بأمان وعادت حركة المرور للمسار المعتاد.'
        );
      }, 800);
    } else if (status === 'disconnected') {
      // Initiate Connect
      setStatus('connecting');
      if (settings.soundEffects) sounds.playConnecting();

      addLog(
        'info',
        `Initiating ${settings.protocol.toUpperCase()} handshake with ${selectedServer.city} (${selectedServer.ip})...`,
        `بدء المصافحة الأمنية عبر بروتوكول ${settings.protocol.toUpperCase()} مع خادم ${selectedServer.cityAr}...`
      );

      setTimeout(() => {
        addLog(
          'info',
          'Diffie-Hellman Key Exchange verified (256-bit entropy). Negotiating cipher...',
          'تم التحقق من تبادل المفاتيح وتأمين مسار البيانات بالتشفير الكامل...'
        );
      }, 700);

      setTimeout(() => {
        addLog(
          'info',
          `Tunnel established. Virtual IP assigned: ${selectedServer.ip}. DNS leak protection active.`,
          `تم إنشاء النفق بنجاح. الـ IP الافتراضي: ${selectedServer.ip}. حماية DNS مفعلة.`
        );
      }, 1400);

      setTimeout(() => {
        setStatus('connected');
        if (settings.soundEffects) sounds.playConnected();
        addLog(
          'success',
          `Connected & fully shielded via ${selectedServer.country} node. Latency: ${selectedServer.ping}ms`,
          `تم الاتصال والحماية الكاملة عبر خادم ${selectedServer.countryAr}. الاستجابة: ${selectedServer.ping}ms`
        );
      }, 1900);
    }
  };

  const handleSelectServer = (server: VpnServer) => {
    if (server.id === selectedServer.id) return;

    if (settings.soundEffects) sounds.playClick();
    setSelectedServer(server);

    addLog(
      'info',
      `Target server updated to ${server.city} (${server.country}).`,
      `تم تغيير الخادم المستهدف إلى ${server.cityAr} (${server.countryAr}).`
    );

    // If already connected, do a seamless instant hot-swap reconnect
    if (status === 'connected') {
      setStatus('reconnecting');
      addLog(
        'info',
        `Seamlessly migrating active tunnel to ${server.city} (${server.ip})...`,
        `جاري نقل النفق المشفر فوراً إلى خادم ${server.cityAr} (${server.ip})...`
      );

      setTimeout(() => {
        setStatus('connected');
        if (settings.soundEffects) sounds.playConnected();
        addLog(
          'success',
          `Hot-swap successful! Now routed via ${server.country}.`,
          `تم التبديل بنجاح! الاتصال يعمل الآن عبر ${server.countryAr}.`
        );
      }, 1200);
    }
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Background Subtle Cyber Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 start-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 end-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px]"></div>
        <div className="absolute -bottom-20 start-1/3 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Top Header */}
      <Header
        status={status}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
        protocol={settings.protocol}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenLogs={() => setIsLogsModalOpen(true)}
        onOpenSpeedTest={() => setIsSpeedModalOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 z-10 flex flex-col gap-6">
        {/* Navigation Tabs Bar */}
        <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto pb-1 no-scrollbar gap-2">
          <div className="p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex items-center gap-1.5 shadow-lg">
            {/* Tab 1: Home Dashboard */}
            <button
              id="tab-home"
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{t.tabHome}</span>
            </button>

            {/* Tab 2: Global Map & Servers */}
            <button
              id="tab-servers"
              onClick={() => setActiveTab('servers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'servers'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{t.tabServers}</span>
            </button>

            {/* Tab 3: Privacy & Zero-Leak Shield */}
            <button
              id="tab-privacy"
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{t.tabPrivacy}</span>
            </button>

            {/* Tab 4: Wi-Fi Guard */}
            <button
              id="tab-wifi"
              onClick={() => setActiveTab('wifi')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'wifi'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span>{t.tabWifi}</span>
            </button>

            {/* Tab 5: Speed Benchmark */}
            <button
              id="tab-speed"
              onClick={() => setActiveTab('speed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'speed'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{t.tabSpeed}</span>
            </button>
          </div>
        </div>

        {/* View Switcher based on Active Tab */}
        {activeTab === 'home' && (
          <div className="w-full flex flex-col gap-6 animate-fadeIn">
            {/* World Map Visualizer */}
            <WorldMapVisualizer
              servers={SERVERS_LIST}
              selectedServer={selectedServer}
              onSelectServer={handleSelectServer}
              isConnected={status === 'connected'}
              isConnecting={status === 'connecting' || status === 'reconnecting'}
              lang={lang}
            />

            {/* Central Power Controller & Metrics */}
            <MainConnectView
              status={status}
              stats={stats}
              selectedServer={selectedServer}
              settings={settings}
              lang={lang}
              onToggleConnect={handleToggleConnect}
              onOpenServerModal={() => setIsServerModalOpen(true)}
              onOpenSpeedTest={() => setIsSpeedModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'servers' && (
          <div className="w-full flex flex-col gap-6 animate-fadeIn">
            <WorldMapVisualizer
              servers={SERVERS_LIST}
              selectedServer={selectedServer}
              onSelectServer={handleSelectServer}
              isConnected={status === 'connected'}
              isConnecting={status === 'connecting' || status === 'reconnecting'}
              lang={lang}
            />

            <div className="w-full rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 font-display">
                    {lang === 'ar' ? 'شبكة خوادم VYRO العالمية (10 Gbps)' : 'VYRO Global High-Speed Fleet (10 Gbps)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'ar'
                      ? 'اختر أي موقع للاتصال الفوري وتخطي القيود الجغرافية'
                      : 'Choose any server node to route your encrypted tunnel'}
                  </p>
                </div>

                <button
                  onClick={() => setIsServerModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                >
                  {t.searchServers}
                </button>
              </div>

              {/* Grid of Recommended Top Servers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SERVERS_LIST.slice(0, 6).map((server) => (
                  <div
                    key={server.id}
                    onClick={() => handleSelectServer(server)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      server.id === selectedServer.id
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/60'
                        : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl select-none">{server.flag}</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {lang === 'ar' ? server.cityAr : server.city}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {lang === 'ar' ? server.countryAr : server.country}
                        </span>
                      </div>
                    </div>

                    <div className="text-end">
                      <span className="text-xs font-bold text-emerald-400 font-mono block">
                        {server.ping} ms
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {server.load}% load
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="w-full animate-fadeIn">
            <PrivacyShieldView
              settings={settings}
              onUpdateSettings={(newS) => setSettings((p) => ({ ...p, ...newS }))}
              status={status}
              selectedServer={selectedServer}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'wifi' && (
          <div className="w-full animate-fadeIn">
            <WifiProtectionCard
              settings={settings}
              onUpdateSettings={(newS) => setSettings((p) => ({ ...p, ...newS }))}
              status={status}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'speed' && (
          <div className="w-full flex flex-col items-center gap-6 animate-fadeIn">
            <div className="w-full max-w-2xl">
              <SpeedTestModal
                isOpen={true}
                onClose={() => setActiveTab('home')}
                selectedServer={selectedServer}
                isConnected={status === 'connected'}
                lang={lang}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ServerListModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        servers={SERVERS_LIST}
        selectedServer={selectedServer}
        onSelectServer={handleSelectServer}
        lang={lang}
      />

      {isSpeedModalOpen && activeTab !== 'speed' && (
        <SpeedTestModal
          isOpen={isSpeedModalOpen}
          onClose={() => setIsSpeedModalOpen(false)}
          selectedServer={selectedServer}
          isConnected={status === 'connected'}
          lang={lang}
        />
      )}

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newS) => setSettings((p) => ({ ...p, ...newS }))}
        lang={lang}
      />

      <ConnectionLogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
        lang={lang}
      />

      <ProjectDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 z-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs font-display">
            V
          </div>
          <span className="font-bold text-slate-400">
            VYRO — {t.appSubtext}
          </span>
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            id="btn-footer-download-zip"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px] transition-all cursor-pointer"
          >
            <span>📦 {lang === 'ar' ? 'تحميل كود المشروع (ZIP)' : 'Download Source ZIP'}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 flex-wrap text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.noLogsPolicy}
          </span>
          <span>•</span>
          <span className="font-mono text-slate-400">{t.quantumReadyBadge}</span>
          <span>•</span>
          <span className="font-mono">{t.version}</span>
        </div>
      </footer>
    </div>
  );
}
