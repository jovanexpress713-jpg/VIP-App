import React from 'react';
import { VpnServer } from '../types';
import { Language } from '../data/translations';
import { MOCK_USER_REAL_IP } from '../data/servers';

interface WorldMapVisualizerProps {
  servers: VpnServer[];
  selectedServer: VpnServer;
  onSelectServer: (server: VpnServer) => void;
  isConnected: boolean;
  isConnecting: boolean;
  lang: Language;
}

export const WorldMapVisualizer: React.FC<WorldMapVisualizerProps> = ({
  servers,
  selectedServer,
  onSelectServer,
  isConnected,
  isConnecting,
  lang,
}) => {
  // Convert Lat/Lng to SVG Map Coordinates (width: 800, height: 400)
  const projectCoords = (lat: number, lng: number): [number, number] => {
    // Equirectangular projection mapping
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return [x, y];
  };

  const [originX, originY] = projectCoords(MOCK_USER_REAL_IP.coordinates[0], MOCK_USER_REAL_IP.coordinates[1]);
  const [targetX, targetY] = projectCoords(selectedServer.coordinates[0], selectedServer.coordinates[1]);

  // Curved quadratic Bezier control point
  const midX = (originX + targetX) / 2;
  const midY = Math.min(originY, targetY) - Math.abs(originX - targetX) * 0.2 - 20;

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950 border border-slate-800/80 p-4 sm:p-5 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="font-semibold text-slate-300">
            {lang === 'ar' ? 'الشبكة العالمية النشطة' : 'Global Encrypted Mesh'}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {servers.length} {lang === 'ar' ? 'عقدة نشطة' : 'Nodes Active'}
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            {lang === 'ar' ? 'موقعك' : 'Your ISP'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {lang === 'ar' ? 'خادم VYRO' : 'VPN Tunnel'}
          </span>
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="relative w-full aspect-[2/1] max-h-56 sm:max-h-72 rounded-xl bg-slate-950/80 border border-slate-800/50 overflow-hidden">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full object-contain select-none"
        >
          {/* Subtle Coordinate Grid Lines */}
          <g stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.5" strokeDasharray="3 3">
            <line x1="0" y1="100" x2="800" y2="100" />
            <line x1="0" y1="200" x2="800" y2="200" />
            <line x1="0" y1="300" x2="800" y2="300" />
            <line x1="200" y1="0" x2="200" y2="400" />
            <line x1="400" y1="0" x2="400" y2="400" />
            <line x1="600" y1="0" x2="600" y2="400" />
          </g>

          {/* Continents Simplified Geometric Stylized Silhouettes */}
          <g fill="rgba(30, 41, 59, 0.6)" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="1">
            {/* North America */}
            <path d="M120,70 L240,65 L270,110 L230,170 L190,190 L160,170 L130,130 Z" />
            {/* South America */}
            <path d="M230,210 L290,230 L270,330 L240,360 L210,290 L210,240 Z" />
            {/* Europe */}
            <path d="M390,70 L480,70 L470,130 L430,150 L380,130 L370,90 Z" />
            {/* Africa */}
            <path d="M380,160 L480,160 L490,240 L450,320 L400,320 L370,230 Z" />
            {/* Asia */}
            <path d="M490,65 L700,75 L730,160 L680,220 L580,210 L500,160 Z" />
            {/* Australia */}
            <path d="M640,260 L730,260 L740,320 L660,330 Z" />
          </g>

          {/* Encrypted Connection Arc Line when connected or connecting */}
          {(isConnected || isConnecting) && (
            <g>
              {/* Glow backdrop line */}
              <path
                d={`M ${originX} ${originY} Q ${midX} ${midY} ${targetX} ${targetY}`}
                fill="none"
                stroke={isConnected ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.4)"}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Sharp dash beam */}
              <path
                d={`M ${originX} ${originY} Q ${midX} ${midY} ${targetX} ${targetY}`}
                fill="none"
                stroke={isConnected ? "#10b981" : "#f59e0b"}
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
                className="animate-pulse"
              />

              {/* Animated data packet traveling from origin to server */}
              <circle r="4" fill={isConnected ? "#34d399" : "#fbbf24"}>
                <animateMotion
                  path={`M ${originX} ${originY} Q ${midX} ${midY} ${targetX} ${targetY}`}
                  dur={isConnected ? "1.5s" : "2.5s"}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )}

          {/* User Origin Location (Riyadh / Local) */}
          <g>
            <circle
              cx={originX}
              cy={originY}
              r="6"
              fill="#06b6d4"
              className="animate-ping opacity-60"
            />
            <circle
              cx={originX}
              cy={originY}
              r="4"
              fill="#0891b2"
              stroke="#67e8f9"
              strokeWidth="1.5"
            />
          </g>

          {/* All Server Nodes */}
          {servers.map((srv) => {
            const [sx, sy] = projectCoords(srv.coordinates[0], srv.coordinates[1]);
            const isSelected = srv.id === selectedServer.id;

            return (
              <g
                key={srv.id}
                className="cursor-pointer group"
                onClick={() => onSelectServer(srv)}
              >
                {/* Node outer pulsing ring if selected */}
                {isSelected && (
                  <circle
                    cx={sx}
                    cy={sy}
                    r="9"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Node core dot */}
                <circle
                  cx={sx}
                  cy={sy}
                  r={isSelected ? "5" : "3"}
                  fill={isSelected ? "#10b981" : "#475569"}
                  stroke={isSelected ? "#ecfdf5" : "#1e293b"}
                  strokeWidth={isSelected ? "1.5" : "1"}
                  className="transition-all duration-300 group-hover:scale-150 group-hover:fill-emerald-400"
                />

                {/* Server Label on Hover or Selected */}
                {isSelected && (
                  <g>
                    <rect
                      x={sx - 35}
                      y={sy - 22}
                      width="70"
                      height="16"
                      rx="4"
                      fill="rgba(15, 23, 42, 0.9)"
                      stroke="rgba(52, 211, 153, 0.5)"
                      strokeWidth="0.8"
                    />
                    <text
                      x={sx}
                      y={sy - 11}
                      textAnchor="middle"
                      fill="#ecfdf5"
                      fontSize="9"
                      fontWeight="bold"
                      className="select-none font-display"
                    >
                      {lang === 'ar' ? srv.cityAr : srv.city} • {srv.ping}ms
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Target Node Footnote */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedServer.flag}</span>
          <span className="font-bold text-slate-200">
            {lang === 'ar' ? selectedServer.cityAr : selectedServer.city}, {lang === 'ar' ? selectedServer.countryAr : selectedServer.country}
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            ({selectedServer.ip})
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span>
            {lang === 'ar' ? 'الاستجابة:' : 'Ping:'} <strong className="text-emerald-400 font-mono">{selectedServer.ping} ms</strong>
          </span>
          <span>
            {lang === 'ar' ? 'الضغط:' : 'Load:'} <strong className="text-cyan-400 font-mono">{selectedServer.load}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
