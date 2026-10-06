import React, { useState } from 'react';
import {
  X,
  Search,
  Zap,
  Gamepad2,
  Tv,
  Lock,
  ArrowDownUp,
  Star,
  Check,
  Shield,
  SlidersHorizontal
} from 'lucide-react';
import { VpnServer, ServerCategory } from '../types';
import { translations, Language } from '../data/translations';

interface ServerListModalProps {
  isOpen: boolean;
  onClose: () => void;
  servers: VpnServer[];
  selectedServer: VpnServer;
  onSelectServer: (server: VpnServer) => void;
  lang: Language;
}

export const ServerListModal: React.FC<ServerListModalProps> = ({
  isOpen,
  onClose,
  servers,
  selectedServer,
  onSelectServer,
  lang,
}) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ServerCategory>('all');
  const [sortBy, setSortBy] = useState<'ping' | 'load' | 'name'>('ping');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['sa-riyadh-01', 'de-frankfurt-01']);

  if (!isOpen) return null;

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter and sort servers
  const filteredServers = servers
    .filter((s) => {
      const matchSearch =
        s.country.toLowerCase().includes(search.toLowerCase()) ||
        s.countryAr.includes(search) ||
        s.city.toLowerCase().includes(search.toLowerCase()) ||
        s.cityAr.includes(search) ||
        s.ip.includes(search);

      const matchCat =
        activeCategory === 'all' ? true : s.category.includes(activeCategory as any);

      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      // Favorites first
      const aFav = favoriteIds.includes(a.id);
      const bFav = favoriteIds.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      if (sortBy === 'ping') return a.ping - b.ping;
      if (sortBy === 'load') return a.load - b.load;
      return a.country.localeCompare(b.country);
    });

  const getPingColor = (ping: number) => {
    if (ping < 35) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (ping < 80) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    if (ping < 120) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-100 font-display">
              {lang === 'ar' ? 'اختر خادم VPN' : 'Select VPN Server'}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {filteredServers.length} {lang === 'ar' ? 'خادم' : 'Servers'}
            </span>
          </div>

          <button
            id="btn-close-server-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex flex-col gap-3">
          {/* Search Box */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchServers}
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm text-slate-200 placeholder-slate-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                {t.cancel}
              </button>
            )}
          </div>

          {/* Categories Pill Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {t.catAll}
            </button>

            <button
              onClick={() => setActiveCategory('fastest')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'fastest'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t.catFastest}</span>
            </button>

            <button
              onClick={() => setActiveCategory('gaming')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'gaming'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{t.catGaming}</span>
            </button>

            <button
              onClick={() => setActiveCategory('streaming')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'streaming'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{t.catStreaming}</span>
            </button>

            <button
              onClick={() => setActiveCategory('privacy')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'privacy'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.catPrivacy}</span>
            </button>
          </div>
        </div>

        {/* Server List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredServers.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              {lang === 'ar' ? 'لم يتم العثور على خوادم مطابقة' : 'No servers found matching your query'}
            </div>
          ) : (
            filteredServers.map((server) => {
              const isSelected = server.id === selectedServer.id;
              const isFav = favoriteIds.includes(server.id);

              return (
                <div
                  key={server.id}
                  id={`server-item-${server.id}`}
                  onClick={() => {
                    onSelectServer(server);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Left: Flag & Details */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl select-none">
                      {server.flag}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {lang === 'ar' ? server.cityAr : server.city}
                        </h4>
                        <span className="text-xs text-slate-400">
                          ({lang === 'ar' ? server.countryAr : server.country})
                        </span>
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            {lang === 'ar' ? 'المحدد حالياً' : 'Selected'}
                          </span>
                        )}
                      </div>

                      {/* Server features tags */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {server.features.slice(0, 2).map((feat, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Ping, Load & Favorite */}
                  <div className="flex items-center gap-3">
                    {/* Ping Badge */}
                    <div
                      className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 ${getPingColor(
                        server.ping
                      )}`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>{server.ping} ms</span>
                    </div>

                    {/* Load indicator */}
                    <div className="hidden sm:flex flex-col items-end w-16">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {server.load}% {lang === 'ar' ? 'ضغط' : 'Load'}
                      </span>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            server.load < 40
                              ? 'bg-emerald-500'
                              : server.load < 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${server.load}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Favorite Star */}
                    <button
                      onClick={(e) => toggleFavorite(e, server.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFav
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
