import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Activity,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  Gauge,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { VpnServer, ConnectionStatus } from '../types';
import { translations, Language } from '../data/translations';
import confetti from 'canvas-confetti';

interface SpeedTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServer: VpnServer;
  isConnected: boolean;
  lang: Language;
}

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({
  isOpen,
  onClose,
  selectedServer,
  isConnected,
  lang,
}) => {
  const t = translations[lang];
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [finalDownload, setFinalDownload] = useState<number | null>(null);
  const [finalUpload, setFinalUpload] = useState<number | null>(null);
  const [testPing, setTestPing] = useState<number | null>(null);
  const [testJitter, setTestJitter] = useState<number | null>(null);

  if (!isOpen) return null;

  const startTest = () => {
    setIsRunning(true);
    setPhase('ping');
    setCurrentSpeed(0);
    setFinalDownload(null);
    setFinalUpload(null);

    // Step 1: Ping phase
    const basePing = isConnected ? selectedServer.ping : selectedServer.ping + 45;
    setTimeout(() => {
      setTestPing(basePing);
      setTestJitter(Math.floor(Math.random() * 3) + 1);
      setPhase('download');

      // Step 2: Download phase
      let progress = 0;
      const targetDown = Math.floor(Math.random() * 150) + (isConnected ? 350 : 180);
      const interval = setInterval(() => {
        progress += 1;
        const cur = Math.min(targetDown, Math.floor(Math.sin((progress / 30) * Math.PI) * targetDown + Math.random() * 20));
        setCurrentSpeed(cur);

        if (progress >= 30) {
          clearInterval(interval);
          setFinalDownload(targetDown);
          setPhase('upload');

          // Step 3: Upload phase
          let upProgress = 0;
          const targetUp = Math.floor(targetDown * 0.45 + Math.random() * 40);
          const upInterval = setInterval(() => {
            upProgress += 1;
            const upCur = Math.min(targetUp, Math.floor(Math.sin((upProgress / 25) * Math.PI) * targetUp + Math.random() * 15));
            setCurrentSpeed(upCur);

            if (upProgress >= 25) {
              clearInterval(upInterval);
              setFinalUpload(targetUp);
              setPhase('complete');
              setIsRunning(false);
              setCurrentSpeed(0);

              // Celebration confetti
              try {
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.6 }
                });
              } catch {}
            }
          }, 80);
        }
      }, 80);
    }, 1200);
  };

  // Calculate needle rotation (-90deg to +90deg based on 0 - 600 Mbps)
  const maxScale = 600;
  const needleRotation = -90 + (Math.min(currentSpeed, maxScale) / maxScale) * 180;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 flex flex-col items-center overflow-hidden">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-100 font-display">
              {t.speedTestTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Target Display */}
        <div className="w-full mt-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedServer.flag}</span>
            <div>
              <span className="font-bold text-slate-200 block">
                {lang === 'ar' ? selectedServer.cityAr : selectedServer.city}
              </span>
              <span className="text-slate-500 font-mono text-[10px]">
                {selectedServer.ip}
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
            {isConnected ? (lang === 'ar' ? 'نفق مشفر نشط' : 'Encrypted Tunnel') : (lang === 'ar' ? 'اتصال مباشر' : 'Direct Route')}
          </span>
        </div>

        {/* Circular Speed Gauge */}
        <div className="relative my-6 w-60 h-44 flex flex-col items-center justify-end">
          <svg className="w-60 h-36 overflow-visible" viewBox="0 0 200 110">
            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1e293b"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Active Glow Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gauge-gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (Math.min(currentSpeed, maxScale) / maxScale) * 251.2}
              className="transition-all duration-150"
            />
            {/* Needle */}
            <g transform={`rotate(${needleRotation}, 100, 100)`} className="transition-transform duration-150">
              <line x1="100" y1="100" x2="100" y2="30" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="100" r="6" fill="#10b981" />
            </g>

            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Real-Time Speed Value */}
          <div className="absolute bottom-2 flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-black text-slate-100 font-mono tracking-tight">
              {currentSpeed}
            </span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Mbps
            </span>
          </div>
        </div>

        {/* Test Phase Subtext */}
        <div className="text-center h-6 mb-4">
          <span className="text-xs font-semibold text-emerald-400 animate-pulse">
            {phase === 'ping' && t.testingPing}
            {phase === 'download' && t.testingDownload}
            {phase === 'upload' && t.testingUpload}
            {phase === 'complete' && t.speedTestComplete}
          </span>
        </div>

        {/* Results Matrix */}
        <div className="w-full grid grid-cols-3 gap-3">
          {/* Download result */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.downloadSpeed}</span>
            </div>
            <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
              {finalDownload !== null ? `${finalDownload}` : '--'}{' '}
              <span className="text-[10px] text-slate-500 font-normal">Mbps</span>
            </span>
          </div>

          {/* Upload result */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
              <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.uploadSpeed}</span>
            </div>
            <span className="text-base sm:text-lg font-black text-cyan-400 font-mono">
              {finalUpload !== null ? `${finalUpload}` : '--'}{' '}
              <span className="text-[10px] text-slate-500 font-normal">Mbps</span>
            </span>
          </div>

          {/* Ping result */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.ping}</span>
            </div>
            <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
              {testPing !== null ? `${testPing}` : '--'}{' '}
              <span className="text-[10px] text-slate-500 font-normal">ms</span>
            </span>
          </div>
        </div>

        {/* Start Button */}
        <button
          id="btn-run-speed-benchmark"
          onClick={startTest}
          disabled={isRunning}
          className="w-full mt-6 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{lang === 'ar' ? 'جاري القياس...' : 'Benchmarking...'}</span>
            </>
          ) : (
            <>
              <Gauge className="w-4 h-4" />
              <span>{t.startSpeedTest}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
