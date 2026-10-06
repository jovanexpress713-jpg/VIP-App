import React, { useRef, useEffect } from 'react';
import { X, Terminal, Trash2, Shield, Activity, Copy, Check } from 'lucide-react';
import { LogEntry } from '../types';
import { translations, Language } from '../data/translations';

interface ConnectionLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  onClearLogs: () => void;
  lang: Language;
}

export const ConnectionLogsModal: React.FC<ConnectionLogsModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
  lang,
}) => {
  const t = translations[lang];
  const logsEndRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  if (!isOpen) return null;

  const handleCopyLogs = () => {
    const raw = logs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'success':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'warn':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'error':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden font-mono">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-slate-100 font-display">
              {t.connectionLogsTitle}
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
              title={t.copy}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-sans">{copied ? t.copied : t.copy}</span>
            </button>

            <button
              onClick={onClearLogs}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 text-xs transition-colors"
              title={t.clearLogs}
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950/90 text-[11px] sm:text-xs space-y-2 select-text">
          {logs.length === 0 ? (
            <div className="text-slate-600 text-center py-10">
              {lang === 'ar' ? 'لا توجد سجلات اتصال حتى الآن' : 'No connection logs generated yet'}
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2.5 hover:bg-slate-900/60 p-1 rounded transition-colors"
              >
                <span className="text-slate-600 shrink-0 select-none">
                  {log.timestamp}
                </span>

                <span
                  className={`px-1.5 py-0.2 rounded border uppercase font-bold text-[9px] shrink-0 ${getLevelBadge(
                    log.level
                  )}`}
                >
                  {log.level}
                </span>

                <span className="text-slate-300 break-all">
                  {lang === 'ar' ? log.messageAr : log.message}
                </span>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>

        {/* Status bar footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500 font-sans">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{t.liveLogs}</span>
          </div>
          <span className="font-mono text-slate-400">
            {logs.length} {lang === 'ar' ? 'سجل' : 'entries'}
          </span>
        </div>
      </div>
    </div>
  );
};
