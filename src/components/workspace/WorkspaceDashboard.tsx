import React from 'react';
import {
  Sparkles,
  Bookmark,
  Send,
  Hourglass,
  Calendar,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Lock,
  Unlock,
  Radio,
  Layers,
} from 'lucide-react';
import type { DashboardStats } from '../../server/monitorService';

interface WorkspaceDashboardProps {
  stats: DashboardStats;
  isChecking: boolean;
  cached?: boolean;
  cacheAgeSeconds?: number;
  onRefresh: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (filter: any) => void;
  activeTab: 'jobs' | 'productions' | 'saved' | 'profile' | 'notifications' | 'sources';
  onTabChange: (tab: any) => void;
  isUnlocked: boolean;
  onToggleLock: () => void;
  unreadNotificationsCount: number;
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({
  stats,
  isChecking,
  cached,
  cacheAgeSeconds,
  onRefresh,
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  activeTab,
  onTabChange,
  isUnlocked,
  onToggleLock,
  unreadNotificationsCount,
}) => {
  const formatTime = (isoString?: string | null) => {
    if (!isoString) return 'Ismeretlen';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('hu-HU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const navTabs = [
    {
      id: 'jobs',
      label: 'KASZKADŐR FIGYELŐ',
      badge: stats.newOpportunitiesCount > 0 ? stats.newOpportunitiesCount : undefined,
      badgeColor: 'bg-[#10b981] text-black font-bold',
    },
    {
      id: 'productions',
      label: 'FILM & SOROZAT FIGYELŐ',
    },
    {
      id: 'saved',
      label: 'MENTETT PRODUKCIÓK',
      badge: stats.savedCount > 0 ? stats.savedCount : undefined,
      badgeColor: 'bg-[#374151] text-white',
    },
    {
      id: 'profile',
      label: 'SZAKMAI PROFIL & PDF',
    },
    {
      id: 'notifications',
      label: 'ÉRTESÍTÉSEK',
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeColor: 'bg-[#fbbf24] text-black font-bold',
    },
    {
      id: 'sources',
      label: 'ADATFORRÁSOK',
    },
  ];

  const filterOptions = [
    { id: 'all', label: 'ÖSSZES' },
    { id: 'new', label: 'ÚJ LEHETŐSÉGEK' },
    { id: 'saved', label: 'MENTETT' },
    { id: 'applied', label: 'JELENTKEZVE' },
    { id: 'pending', label: 'VISSZAJELZÉSRE VÁR' },
    { id: 'closed', label: 'LEZÁRT' },
    { id: 'pedestrian', label: 'GYALOGOS KASZKADŐR' },
    { id: 'vehicle', label: 'AUTÓS IRÁNY (FIGYELÉS)' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Workspace Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border border-[#232733] bg-[#0e1014]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="font-mono text-xs text-white font-bold tracking-widest uppercase">
              STUNT WORKSPACE
            </span>
          </div>
          <span className="text-[#4b5563]">|</span>
          <div className="font-mono text-[11px] text-[#9ca3af] flex items-center gap-2">
            <span>Huszár Attila Személyes Szakmai Rendszere</span>
            {cached && (
              <span className="hidden sm:inline text-[10px] text-[#10b981] px-1.5 py-0.2 border border-[#10b981]/40 bg-[#10b981]/10">
                ⚡ Cache ({cacheAgeSeconds ?? 0}s)
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Manual Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isChecking}
            className="px-3 py-1.5 border border-[#2b303c] bg-[#161a22] hover:bg-[#1f2430] hover:text-white text-[#9ca3af] font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
            title="Kényszerített frissítés a forrásokból"
          >
            <RefreshCw size={13} className={isChecking ? 'animate-spin text-[#10b981]' : ''} />
            <span>{isChecking ? 'PÁSZTÁZÁS...' : 'FRISSÍTÉS'}</span>
          </button>

          {/* Privacy Lock Toggle */}
          <button
            type="button"
            onClick={onToggleLock}
            className={`px-3 py-1.5 border font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
              isUnlocked
                ? 'border-[#10b981]/40 text-[#10b981] bg-[#10b981]/10 hover:bg-[#10b981]/20'
                : 'border-[#374151] text-[#9ca3af] bg-[#161a22] hover:text-white'
            }`}
          >
            {isUnlocked ? <Unlock size={13} /> : <Lock size={13} />}
            <span>{isUnlocked ? 'MUNKA FELOLDVA' : 'MUNKA ZÁROLVA'}</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD METRICS - EXACT SPECIFICATION REQUIREMENT 14 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {/* Metric 1: ÚJ LEHETŐSÉGEK */}
        <div className="p-3 sm:p-4 border border-[#232733] bg-[#0c0d10] flex flex-col justify-between">
          <div className="font-mono text-[10px] text-[#9ca3af] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>ÚJ LEHETŐSÉGEK</span>
            <Sparkles size={12} className={stats.newOpportunitiesCount > 0 ? 'text-[#10b981]' : 'text-[#4b5563]'} />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white">
            {stats.newOpportunitiesCount}
          </div>
          <div className="font-mono text-[10px] text-[#6b7280] mt-1">
            Valós új észlelés
          </div>
        </div>

        {/* Metric 2: MENTETT */}
        <div className="p-3 sm:p-4 border border-[#232733] bg-[#0c0d10] flex flex-col justify-between">
          <div className="font-mono text-[10px] text-[#9ca3af] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>MENTETT</span>
            <Bookmark size={12} className="text-[#38bdf8]" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white">
            {stats.savedCount}
          </div>
          <div className="font-mono text-[10px] text-[#6b7280] mt-1">
            Saját adatbázisban
          </div>
        </div>

        {/* Metric 3: JELENTKEZVE */}
        <div className="p-3 sm:p-4 border border-[#232733] bg-[#0c0d10] flex flex-col justify-between">
          <div className="font-mono text-[10px] text-[#9ca3af] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>JELENTKEZVE</span>
            <Send size={12} className="text-[#a78bfa]" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white">
            {stats.appliedCount}
          </div>
          <div className="font-mono text-[10px] text-[#6b7280] mt-1">
            Felhasználói státusz
          </div>
        </div>

        {/* Metric 4: VISSZAJELZÉSRE VÁR */}
        <div className="p-3 sm:p-4 border border-[#232733] bg-[#0c0d10] flex flex-col justify-between">
          <div className="font-mono text-[10px] text-[#9ca3af] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>VISSZAJELZÉSRE VÁR</span>
            <Hourglass size={12} className="text-[#fbbf24]" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white">
            {stats.pendingCount}
          </div>
          <div className="font-mono text-[10px] text-[#6b7280] mt-1">
            Folyamatban lévő
          </div>
        </div>

        {/* Metric 5: HATÁRIDŐK */}
        <div className="p-3 sm:p-4 border border-[#232733] bg-[#0c0d10] flex flex-col justify-between">
          <div className="font-mono text-[10px] text-[#9ca3af] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>HATÁRIDŐK</span>
            <Calendar size={12} className="text-[#f87171]" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white">
            {stats.deadlinesCount}
          </div>
          <div className="font-mono text-[10px] text-[#6b7280] mt-1">
            Aktív emlékeztetők
          </div>
        </div>

        {/* Metric 6: LAST CHECK */}
        <div className="p-3 sm:p-4 border border-[#232733] bg-[#0c0d10] flex flex-col justify-between">
          <div className="font-mono text-[10px] text-[#9ca3af] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>LAST CHECK</span>
            <Clock size={12} className="text-[#6b7280]" />
          </div>
          <div className="font-mono text-base sm:text-lg font-bold text-white truncate">
            {formatTime(stats.lastCheck)}
          </div>
          <div className="font-mono text-[10px] text-[#10b981] mt-1 truncate">
            ● Háttérfigyelő aktív
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Single clean horizontal bar) */}
      <div className="border-b border-[#232733] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 sm:gap-2 min-w-max">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`py-3 px-3 sm:px-4 font-mono text-xs tracking-wider uppercase transition-all cursor-pointer relative flex items-center gap-2 ${
                  isActive
                    ? 'text-white font-bold bg-[#161a22] border-t border-x border-[#232733]'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#12151b]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-none font-mono ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#10b981]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters Bar (Applicable across views) */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Keresés produkció, cím, munkatípus vagy forrás alapján..."
            className="w-full bg-[#0c0d10] border border-[#232733] pl-9 pr-4 py-2 text-white font-mono text-xs focus:border-[#4b5563] focus:outline-none placeholder-[#4b5563]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white font-mono text-[11px]"
            >
              TÖRLÉS
            </button>
          )}
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <Filter size={13} className="text-[#6b7280] shrink-0 ml-1" />
          {filterOptions.map((filter) => {
            const isSelected = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'border-white text-white bg-[#1e232d] font-semibold'
                    : 'border-[#22252c] text-[#858d9d] hover:border-[#383e4a] hover:text-[#d1d5db]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
