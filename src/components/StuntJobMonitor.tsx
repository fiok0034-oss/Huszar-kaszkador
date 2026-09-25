import React, { useState, useEffect, useMemo } from 'react';
import {
  Radio,
  RefreshCw,
  ExternalLink,
  Bell,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  Clock,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { FeedSource, MonitoredJobItem, DashboardStats } from '../server/monitorService';
import type { SavedProductionItem, WorkspaceNotification, JobStatus } from '../server/workspaceStorage';
import { WorkspaceDashboard } from './workspace/WorkspaceDashboard';
import { StuntJobsTab } from './workspace/StuntJobsTab';
import { ProductionMonitorTab } from './workspace/ProductionMonitorTab';
import { SavedItemsTab } from './workspace/SavedItemsTab';
import { ProfessionalProfileTab } from './workspace/ProfessionalProfileTab';
import { NotificationsTab } from './workspace/NotificationsTab';
import { SourcesDiagnosticsTab } from './workspace/SourcesDiagnosticsTab';
import { ApplicationModal } from './workspace/ApplicationModal';
import { ReminderModal } from './workspace/ReminderModal';
import { WorkspaceAuthModal } from './workspace/WorkspaceAuthModal';
import {
  getLocalSavedItems,
  saveLocalItem,
  updateLocalItemStatus,
  removeLocalItem,
} from '../utils/localJobStorage';

interface WorkspaceResponseData {
  savedItems: SavedProductionItem[];
  notifications: WorkspaceNotification[];
  stats: DashboardStats;
  sources: FeedSource[];
  productionItems: MonitoredJobItem[];
  relevantItems: MonitoredJobItem[];
  recentScannedItems: MonitoredJobItem[];
  lastCheck: string | null;
  isChecking: boolean;
  cached?: boolean;
  cacheAgeSeconds?: number;
}

export const StuntJobMonitor: React.FC = () => {
  const [data, setData] = useState<WorkspaceResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Workspace View Controls
  const [activeTab, setActiveTab] = useState<
    'jobs' | 'productions' | 'saved' | 'profile' | 'notifications' | 'sources'
  >('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'new' | 'saved' | 'applied' | 'pending' | 'closed' | 'pedestrian' | 'vehicle'
  >('all');
  const [showRecentFeed, setShowRecentFeed] = useState(false);

  // Modals & Authorization
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [appModalItem, setAppModalItem] = useState<any | null>(null);
  const [reminderModalItem, setReminderModalItem] = useState<any | null>(null);

  // Native Browser Notification Permission State
  const [browserNotificationStatus, setBrowserNotificationStatus] = useState<
    'default' | 'granted' | 'denied'
  >('default');

  // Check saved session auth on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('stunt_workspace_unlocked');
      if (stored === 'true') {
        setIsUnlocked(true);
      }
      if ('Notification' in window) {
        setBrowserNotificationStatus(Notification.permission as any);
      }
    }
  }, []);

  const fetchWorkspaceData = async () => {
    try {
      setError(null);
      const res = await fetch('/api/workspace');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        // Merge with client-side localStorage saved items
        const localSaved = getLocalSavedItems();
        const mergedSavedMap = new Map<string, SavedProductionItem>();

        // First populate from server
        (json.data.savedItems || []).forEach((item: SavedProductionItem) => {
          mergedSavedMap.set(item.id, item);
        });

        // Overlay with client localStorage (preserving user-selected statuses)
        localSaved.forEach((localItem) => {
          const existing = mergedSavedMap.get(localItem.id);
          if (existing) {
            mergedSavedMap.set(localItem.id, {
              ...existing,
              status: localItem.status || existing.status,
              userNotes: localItem.userNotes || existing.userNotes,
            });
          } else {
            mergedSavedMap.set(localItem.id, localItem);
          }
        });

        const mergedSavedList = Array.from(mergedSavedMap.values());

        // Recalculate quick stats based on merged state
        const calculatedStats: DashboardStats = {
          ...json.data.stats,
          savedCount: mergedSavedList.length,
          appliedCount: mergedSavedList.filter((i) => i.status === 'JELENTKEZVE').length,
          pendingCount: mergedSavedList.filter((i) => i.status === 'VISSZAJELZÉSRE VÁR').length,
          closedCount: mergedSavedList.filter((i) => i.status === 'LEZÁRVA').length,
          rejectedCount: mergedSavedList.filter((i) => i.status === 'ELUTASÍTVA').length,
        };

        setData({
          ...json.data,
          savedItems: mergedSavedList,
          stats: calculatedStats,
        });
      } else {
        throw new Error(json.error || 'Ismeretlen hiba');
      }
    } catch (err: any) {
      setError(err?.message || 'Nem sikerült elérni a Stunt Workspace API-t.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
    // Auto-refresh stats every 2 minutes
    const interval = setInterval(fetchWorkspaceData, 120000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const res = await fetch('/api/stunt-jobs/refresh', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        await fetchWorkspaceData();
      }
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('stunt_workspace_unlocked', 'true');
    }
  };

  const handleToggleLock = () => {
    if (isUnlocked) {
      setIsUnlocked(false);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('stunt_workspace_unlocked');
      }
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleSaveItem = async (item: MonitoredJobItem, customStatus: JobStatus = 'ÉRDEKEL') => {
    // 1. Immediately persist to localStorage
    const updatedLocal = saveLocalItem(item, customStatus);

    // 2. Optimistically update local React state
    if (data) {
      const existingIdx = data.savedItems.findIndex((s) => s.id === item.id);
      let newSaved: SavedProductionItem[];
      if (existingIdx >= 0) {
        newSaved = [...data.savedItems];
        newSaved[existingIdx] = { ...newSaved[existingIdx], status: customStatus };
      } else {
        const now = new Date().toISOString();
        const newEntry: SavedProductionItem = {
          id: item.id,
          title: item.title,
          link: item.link,
          sourceName: item.sourceName,
          sourceId: item.sourceId,
          publishedAt: item.publishedAt,
          detectedAt: item.detectedAt,
          summary: item.summary,
          itemType: item.isStuntRelevant ? 'stunt' : 'production',
          stuntCategory: item.stuntCategory,
          matchedKeywords: item.matchedKeywords,
          status: customStatus,
          savedAt: now,
          userNotes: '',
          deadline: item.deadline || null,
          reminderActive: false,
          reminderDate: null,
          productionType: item.productionType,
        };
        newSaved = [newEntry, ...data.savedItems];
      }

      setData({
        ...data,
        savedItems: newSaved,
        stats: {
          ...data.stats,
          savedCount: newSaved.length,
          appliedCount: newSaved.filter((i) => i.status === 'JELENTKEZVE').length,
          pendingCount: newSaved.filter((i) => i.status === 'VISSZAJELZÉSRE VÁR').length,
        },
      });
    }

    // 3. Sync to server in background
    try {
      await fetch('/api/workspace/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          title: item.title,
          link: item.link,
          sourceName: item.sourceName,
          sourceId: item.sourceId,
          publishedAt: item.publishedAt,
          detectedAt: item.detectedAt,
          summary: item.summary,
          itemType: item.isStuntRelevant ? 'stunt' : 'production',
          stuntCategory: item.stuntCategory,
          matchedKeywords: item.matchedKeywords,
          status: customStatus,
          deadline: item.deadline || null,
          productionType: item.productionType,
        }),
      });
    } catch (err) {
      console.warn('Background server save sync failed (saved in localStorage):', err);
    }
  };

  const handleRemoveItem = async (id: string) => {
    // 1. Immediately update localStorage
    removeLocalItem(id);

    // 2. Optimistically update local React state
    if (data) {
      const filtered = data.savedItems.filter((i) => i.id !== id);
      setData({
        ...data,
        savedItems: filtered,
        stats: {
          ...data.stats,
          savedCount: filtered.length,
          appliedCount: filtered.filter((i) => i.status === 'JELENTKEZVE').length,
          pendingCount: filtered.filter((i) => i.status === 'VISSZAJELZÉSRE VÁR').length,
        },
      });
    }

    // 3. Sync to server in background
    try {
      await fetch(`/api/workspace/saved/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Background server remove sync failed:', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: JobStatus) => {
    // 1. Immediately update client localStorage
    updateLocalItemStatus(id, status);

    // 2. Optimistically update local React state
    if (data) {
      const updated = data.savedItems.map((item) => {
        if (item.id === id) {
          return { ...item, status };
        }
        return item;
      });
      setData({
        ...data,
        savedItems: updated,
        stats: {
          ...data.stats,
          appliedCount: updated.filter((i) => i.status === 'JELENTKEZVE').length,
          pendingCount: updated.filter((i) => i.status === 'VISSZAJELZÉSRE VÁR').length,
          closedCount: updated.filter((i) => i.status === 'LEZÁRVA').length,
          rejectedCount: updated.filter((i) => i.status === 'ELUTASÍTVA').length,
        },
      });
    }

    // 3. Sync to server in background
    try {
      await fetch(`/api/workspace/saved/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('Background server status sync failed (persisted in localStorage):', err);
    }
  };

  const handleUpdateNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/workspace/saved/${id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userNotes: notes }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchWorkspaceData();
      }
    } catch (err) {
      console.error('Update notes error:', err);
    }
  };

  const handleSaveReminder = async (id: string, reminderActive: boolean, reminderDate?: string | null) => {
    try {
      const res = await fetch(`/api/workspace/saved/${id}/reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminderActive, reminderDate }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchWorkspaceData();
      }
    } catch (err) {
      console.error('Save reminder error:', err);
    }
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      await fetch(`/api/workspace/notifications/${id}/read`, { method: 'POST' });
      await fetchWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllNotifsRead = async () => {
    try {
      await fetch('/api/workspace/notifications/read-all', { method: 'POST' });
      await fetchWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmApplied = async (id: string, notes?: string) => {
    // If not already in saved items, save it with status 'JELENTKEZVE'
    const foundInSaved = data?.savedItems.find((s) => s.id === id);
    if (foundInSaved) {
      await handleUpdateStatus(id, 'JELENTKEZVE');
      if (notes) {
        await handleUpdateNotes(id, `${foundInSaved.userNotes ? `${foundInSaved.userNotes}\n` : ''}${notes}`);
      }
    } else {
      // Find in relevant items or production items
      const itemToSave =
        data?.relevantItems.find((r) => r.id === id) ||
        data?.productionItems.find((p) => p.id === id);
      if (itemToSave) {
        await handleSaveItem(itemToSave, 'JELENTKEZVE');
      }
    }
  };

  const requestBrowserNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('A böngésző nem támogatja a natív értesítéseket.');
      return;
    }
    const perm = await Notification.requestPermission();
    setBrowserNotificationStatus(perm);
    if (perm === 'granted') {
      new Notification('Stunt Workspace // Huszár Attila', {
        body: 'A valós idejű figyelés aktív. Értesítést kapsz, amint új kaszkadőri felhívást észlel a rendszer.',
      });
    }
  };

  // Filtered stunt jobs
  const filteredStuntJobs = useMemo(() => {
    const list = data?.relevantItems || [];
    return list.filter((item) => {
      // Text search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.sourceName.toLowerCase().includes(query);
        if (!matches) return false;
      }
      // Filter tab
      if (activeFilter === 'pedestrian') return item.stuntCategory === 'pedestrian';
      if (activeFilter === 'vehicle') return item.stuntCategory === 'vehicle';
      return true;
    });
  }, [data?.relevantItems, searchTerm, activeFilter]);

  // Filtered productions
  const filteredProductions = useMemo(() => {
    const list = data?.productionItems || [];
    return list.filter((item) => {
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.sourceName.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [data?.productionItems, searchTerm]);

  // Filtered saved items
  const filteredSavedItems = useMemo(() => {
    const list = data?.savedItems || [];
    return list.filter((item) => {
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.sourceName.toLowerCase().includes(query) ||
          item.userNotes.toLowerCase().includes(query);
        if (!matches) return false;
      }
      if (activeFilter === 'applied') return item.status === 'JELENTKEZVE';
      if (activeFilter === 'pending') return item.status === 'VISSZAJELZÉSRE VÁR';
      if (activeFilter === 'closed') return item.status === 'LEZÁRVA';
      return true;
    });
  }, [data?.savedItems, searchTerm, activeFilter]);

  const unreadNotificationsCount = (data?.notifications || []).filter((n) => !n.read).length;

  return (
    <section
      id="workspace"
      className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#1d2026] relative"
    >
      {/* Anchor for backward compatibility with #figyelo */}
      <span id="figyelo" className="absolute -top-24 pointer-events-none" />

      {/* Section Title Header */}
      <div className="flex items-baseline gap-4 mb-8 border-b border-[#22252c] pb-4">
        <span className="font-mono text-xs text-[#6b7280]">06</span>
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#f3f4f6] uppercase">
            MUNKA FIGYELŐ
          </h2>
          <p className="font-mono text-xs text-[#9ca3af] mt-1">
            Valós idejű nyilvános produkció- és kaszkadőr felhívás figyelő.
          </p>
        </div>
      </div>

      {/* Error notification if API is unreachable */}
      {error && (
        <div className="mb-6 p-4 border border-[#451e1e] bg-[#221010] text-[#f87171] text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchWorkspaceData}
            className="underline hover:text-white"
          >
            Újrapróbálás
          </button>
        </div>
      )}

      {/* Main Workspace Dashboard Header & Navigation */}
      {data && (
        <WorkspaceDashboard
          stats={data.stats}
          isChecking={data.isChecking || refreshing}
          cached={data.cached}
          cacheAgeSeconds={data.cacheAgeSeconds}
          onRefresh={handleRefresh}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={(filter) => {
            setActiveFilter(filter);
            // Auto switch tab if clicking specific status filter
            if (filter === 'saved' || filter === 'applied' || filter === 'pending' || filter === 'closed') {
              setActiveTab('saved');
            } else if (filter === 'new' || filter === 'pedestrian' || filter === 'vehicle') {
              setActiveTab('jobs');
            }
          }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isUnlocked={isUnlocked}
          onToggleLock={handleToggleLock}
          unreadNotificationsCount={unreadNotificationsCount}
        />
      )}

      {/* Main Tab Content Display */}
      <div className="mt-6">
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-[#9ca3af] flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-[#10b981]" />
            <span>Stunt Workspace adatok és források betöltése...</span>
          </div>
        ) : (
          <>
            {activeTab === 'jobs' && (
              <StuntJobsTab
                items={filteredStuntJobs}
                savedItems={data?.savedItems || []}
                onSaveItem={handleSaveItem}
                onUpdateStatus={handleUpdateStatus}
                onOpenApplication={(item) => setAppModalItem(item)}
                onOpenReminder={(item) => setReminderModalItem(item)}
                onOpenRecentFeed={() => setShowRecentFeed(!showRecentFeed)}
                showRecentFeed={showRecentFeed}
                recentItems={data?.recentScannedItems || []}
                isUnlocked={isUnlocked}
              />
            )}

            {activeTab === 'productions' && (
              <ProductionMonitorTab
                productions={filteredProductions}
                savedItems={data?.savedItems || []}
                onSaveProduction={(item) => handleSaveItem(item)}
                onUpdateStatus={handleUpdateStatus}
                onOpenApplication={(item) => setAppModalItem(item)}
              />
            )}

            {activeTab === 'saved' && (
              <SavedItemsTab
                savedItems={filteredSavedItems}
                onUpdateStatus={handleUpdateStatus}
                onUpdateNotes={handleUpdateNotes}
                onRemoveItem={handleRemoveItem}
                onOpenApplication={(item) => setAppModalItem(item)}
                onOpenReminder={(item) => setReminderModalItem(item)}
              />
            )}

            {activeTab === 'profile' && <ProfessionalProfileTab />}

            {activeTab === 'notifications' && (
              <NotificationsTab
                notifications={data?.notifications || []}
                onMarkRead={handleMarkNotifRead}
                onMarkAllRead={handleMarkAllNotifsRead}
                browserNotificationStatus={browserNotificationStatus}
                onRequestBrowserNotification={requestBrowserNotificationPermission}
              />
            )}

            {activeTab === 'sources' && (
              <SourcesDiagnosticsTab sources={data?.sources || []} />
            )}
          </>
        )}
      </div>

      {/* Application Preparation Modal (Strict requirement: Never send automatically) */}
      <ApplicationModal
        isOpen={Boolean(appModalItem)}
        onClose={() => setAppModalItem(null)}
        item={appModalItem}
        onConfirmApplied={handleConfirmApplied}
      />

      {/* Reminder Setting Modal */}
      <ReminderModal
        isOpen={Boolean(reminderModalItem)}
        onClose={() => setReminderModalItem(null)}
        item={reminderModalItem}
        onSaveReminder={handleSaveReminder}
      />

      {/* Workspace Authentication & Privacy Modal */}
      <WorkspaceAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onUnlock={handleUnlock}
      />
    </section>
  );
};
