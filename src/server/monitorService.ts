import {
  rssParserUtility,
  OFFICIAL_FILM_FEEDS,
  type FeedSource,
  type MonitoredJobItem,
  type ParserResult,
} from './rssParser.js';
import {
  workspaceStorage,
  type SavedProductionItem,
  type WorkspaceNotification,
} from './workspaceStorage.js';

export type { FeedSource, MonitoredJobItem, SavedProductionItem, WorkspaceNotification };

export interface DashboardStats {
  newOpportunitiesCount: number;
  savedCount: number;
  appliedCount: number;
  pendingCount: number;
  closedCount: number;
  rejectedCount: number;
  deadlinesCount: number;
  lastCheck: string | null;
}

export interface MonitorState {
  lastCheck: string | null;
  isChecking: boolean;
  sources: FeedSource[];
  relevantCount: number;
  totalScannedCount: number;
  relevantItems: MonitoredJobItem[];
  productionItems: MonitoredJobItem[];
  recentScannedItems: MonitoredJobItem[];
  cached?: boolean;
  cacheAgeSeconds?: number;
  ttlSeconds?: number;
  stats: DashboardStats;
}

class StuntJobMonitorService {
  private state: MonitorState = {
    lastCheck: null,
    isChecking: false,
    sources: [...OFFICIAL_FILM_FEEDS],
    relevantCount: 0,
    totalScannedCount: 0,
    relevantItems: [],
    productionItems: [],
    recentScannedItems: [],
    cached: false,
    cacheAgeSeconds: 0,
    ttlSeconds: 900,
    stats: {
      newOpportunitiesCount: 0,
      savedCount: 0,
      appliedCount: 0,
      pendingCount: 0,
      closedCount: 0,
      rejectedCount: 0,
      deadlinesCount: 0,
      lastCheck: null,
    },
  };

  private activeCheckPromise: Promise<MonitorState> | null = null;

  constructor() {
    // Initial fetch on server start
    this.refresh(false).catch((err) => {
      console.error('[StuntJobMonitorService] Initial feed parse error:', err);
    });

    // Scheduled background update every 20 minutes to maintain fresh cache
    const intervalTimer = setInterval(() => {
      this.refresh(true).catch((err) => {
        console.error('[StuntJobMonitorService] Background update error:', err);
      });
    }, 20 * 60 * 1000);

    if (intervalTimer && typeof intervalTimer.unref === 'function') {
      intervalTimer.unref();
    }
  }

  public getState(): MonitorState {
    // Refresh stats from workspaceStorage to ensure live counts of saved, applied, etc.
    const stats = workspaceStorage.getDashboardStats(
      this.state.stats.newOpportunitiesCount,
      this.state.lastCheck
    );
    return {
      ...this.state,
      stats,
    };
  }

  public async refresh(forceRefresh: boolean = true): Promise<MonitorState> {
    if (this.activeCheckPromise) {
      return this.activeCheckPromise;
    }

    this.activeCheckPromise = this.performRefresh(forceRefresh).finally(() => {
      this.activeCheckPromise = null;
    });

    return this.activeCheckPromise;
  }

  private async performRefresh(forceRefresh: boolean): Promise<MonitorState> {
    this.state.isChecking = true;

    try {
      const parsed: ParserResult = await rssParserUtility.fetchAllOfficialFeeds(
        OFFICIAL_FILM_FEEDS,
        { forceRefresh }
      );

      // Track newly detected items into workspaceStorage to get true newOpportunitiesCount
      const tracking = workspaceStorage.trackNewItems(
        parsed.recentScannedItems.map((item) => ({
          id: item.id,
          title: item.title,
          link: item.link,
          sourceName: item.sourceName,
          isStuntRelevant: item.isStuntRelevant,
        }))
      );

      const stats = workspaceStorage.getDashboardStats(
        tracking.newOpportunitiesCount,
        parsed.lastCheck
      );

      this.state = {
        lastCheck: parsed.lastCheck,
        isChecking: false,
        sources: parsed.sources,
        relevantCount: parsed.relevantCount,
        totalScannedCount: parsed.totalScannedCount,
        relevantItems: parsed.relevantItems,
        productionItems: parsed.productionItems,
        recentScannedItems: parsed.recentScannedItems,
        cached: parsed.cached,
        cacheAgeSeconds: parsed.cacheAgeSeconds,
        ttlSeconds: parsed.ttlSeconds,
        stats,
      };
    } catch (err: any) {
      console.error('[StuntJobMonitorService] Failed to execute RSS parser:', err);
      this.state.isChecking = false;
    }

    return this.state;
  }
}

export const monitorService = new StuntJobMonitorService();
