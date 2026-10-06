import React from 'react';
import {
  X,
  Settings,
  Shield,
  Cpu,
  Layers,
  Globe,
  Volume2,
  VolumeX,
  Vibrate,
  Zap,
  Check,
  ToggleLeft,
  ToggleRight,
  Info,
  Download,
  FolderArchive
} from 'lucide-react';
import { AppSettings, ProtocolType } from '../types';
import { PROTOCOLS_LIST } from '../data/servers';
import { translations, Language } from '../data/translations';
import { downloadProjectZipClientSide } from '../utils/downloadProject';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  lang: Language;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  lang,
}) => {
  const t = translations[lang];
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = () => {
    const ok = downloadProjectZipClientSide();
    if (ok) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    }
  };

  const dnsOptions = [
    { id: '1.1.1.1', label: 'Cloudflare (1.1.1.1 - Ultra Fast)' },
    { id: '8.8.8.8', label: 'Google Public DNS (8.8.8.8)' },
    { id: '9.9.9.9', label: 'Quad9 Privacy DNS (9.9.9.9)' },
    { id: 'adguard', label: 'AdGuard DNS (Blocks Ads & Trackers)' },
    { id: 'vyro_zero_log', label: 'VYRO Zero-Log Private Resolver (Recommended)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-100 font-display">
              {t.settingsTitle}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section 1: Protocol Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>{t.protocolSelection}</span>
              </label>
              <span className="text-xs text-slate-400">
                {lang === 'ar' ? 'اختر البروتوكول الأنسب لاحتياجك' : 'Choose optimal crypto protocol'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROTOCOLS_LIST.map((proto) => {
                const isSelected = settings.protocol === proto.id;

                return (
                  <div
                    key={proto.id}
                    id={`proto-card-${proto.id}`}
                    onClick={() => onUpdateSettings({ protocol: proto.id })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-950/50'
                        : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-100">
                          {lang === 'ar' ? proto.nameAr : proto.name}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {lang === 'ar' ? proto.descriptionAr : proto.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{proto.cipher}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                        {proto.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Split Tunneling */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-slate-200">
                  {t.splitTunnelingTitle}
                </span>
              </div>

              <button
                id="btn-toggle-split-tunneling"
                onClick={() =>
                  onUpdateSettings({
                    splitTunnelingEnabled: !settings.splitTunnelingEnabled,
                  })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.splitTunnelingEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.splitTunnelingEnabled
                      ? lang === 'ar'
                        ? '-translate-x-5'
                        : 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              {t.splitTunnelingDesc}
            </p>

            {settings.splitTunnelingEnabled && (
              <div className="space-y-2 mt-2 pt-2 border-t border-slate-800/80">
                {settings.splitTunnelingApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{app.icon}</span>
                      <span className="font-semibold text-slate-300">{app.name}</span>
                    </div>

                    <button
                      onClick={() => {
                        const updated = settings.splitTunnelingApps.map((a) =>
                          a.id === app.id ? { ...a, enabled: !a.enabled } : a
                        );
                        onUpdateSettings({ splitTunnelingApps: updated });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        app.enabled
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {app.enabled ? (lang === 'ar' ? 'مستثنى (مباشر)' : 'Bypassed') : (lang === 'ar' ? 'عبر VPN' : 'Tunnel')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Connection & Self-Healing Automation */}
          <div className="space-y-3">
            {/* Auto Reconnect */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-200 block">
                  {t.autoReconnectLabel}
                </span>
                <span className="text-xs text-slate-400">
                  {lang === 'ar'
                    ? 'استعادة الاتصال بالخادم تلقائياً دون انقطاع عند تقلبات الشبكة'
                    : 'Automatically re-establish connection if network hiccups occur'}
                </span>
              </div>

              <button
                id="btn-toggle-auto-reconnect"
                onClick={() =>
                  onUpdateSettings({ autoReconnect: !settings.autoReconnect })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoReconnect ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.autoReconnect
                      ? lang === 'ar'
                        ? '-translate-x-5'
                        : 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Custom DNS */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-slate-200">
                  {t.customDnsTitle}
                </span>
              </div>

              <select
                id="select-dns"
                value={settings.customDns}
                onChange={(e) => onUpdateSettings({ customDns: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {dnsOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tactile Audio Sound Effects */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {settings.soundEffects ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <div>
                  <span className="text-sm font-bold text-slate-200 block">
                    {t.soundEffectsLabel}
                  </span>
                  <span className="text-xs text-slate-500">
                    {lang === 'ar'
                      ? 'مؤثرات صوتية تفاعلية عند الاتصال وقطع الاتصال'
                      : 'Tactile chimes on connect/disconnect'}
                  </span>
                </div>
              </div>

              <button
                id="btn-toggle-sound-effects"
                onClick={() =>
                  onUpdateSettings({ soundEffects: !settings.soundEffects })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.soundEffects ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.soundEffects
                      ? lang === 'ar'
                        ? '-translate-x-5'
                        : 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Export / Download Complete Files */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mt-0.5">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-100 block">
                    {t.exportFilesTitle}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5 leading-relaxed">
                    {t.exportFilesDesc}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/90 mt-1.5 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <Check className="w-3 h-3 text-emerald-400" />
                    vyro-vpn-full-project.zip (React + Vite + Tailwind + TypeScript)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadZip}
                id="btn-download-project-zip"
                className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloadSuccess
                    ? (lang === 'ar' ? 'تم الحفظ والتحميل!' : 'Saved to Downloads!')
                    : t.downloadZipBtn}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>{t.noLogsPolicy}</span>
          <span className="font-mono font-bold text-slate-400">{t.version}</span>
        </div>
      </div>
    </div>
  );
};
