import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'workspace-db.json');

export type JobStatus = 'ÉRDEKEL' | 'JELENTKEZVE' | 'VISSZAJELZÉSRE VÁR' | 'LEZÁRVA' | 'ELUTASÍTVA';

export interface SavedProductionItem {
  id: string;
  title: string;
  link: string;
  sourceName: string;
  sourceId: string;
  publishedAt?: string;
  detectedAt: string;
  summary: string;
  itemType: 'stunt' | 'production';
  stuntCategory?: 'pedestrian' | 'vehicle' | 'general';
  matchedKeywords?: string[];
  status: JobStatus;
  savedAt: string;
  userNotes: string;
  deadline: string | null;
  reminderActive: boolean;
  reminderDate: string | null;
  productionType?: string;
}

export interface WorkspaceNotification {
  id: string;
  type: 'NEW_STUNT_OPPORTUNITY' | 'UPCOMING_DEADLINE' | 'SOURCE_UPDATE' | 'PRODUCTION_UPDATE';
  title: string;
  message: string;
  sourceName?: string;
  sourceUrl?: string;
  timestamp: string;
  read: boolean;
}

export interface WorkspaceDB {
  savedItems: SavedProductionItem[];
  seenItemIds: string[];
  acknowledgedNewItemIds: string[];
  notifications: WorkspaceNotification[];
  settings: {
    lastSavedCheck?: string;
    unlockedSessionToken?: string;
  };
}

const DEFAULT_DB: WorkspaceDB = {
  savedItems: [],
  seenItemIds: [],
  acknowledgedNewItemIds: [],
  notifications: [],
  settings: {},
};

export class WorkspaceStorageService {
  private db: WorkspaceDB = { ...DEFAULT_DB };
  private initialized = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (this.initialized) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.db = {
          savedItems: Array.isArray(parsed.savedItems) ? parsed.savedItems : [],
          seenItemIds: Array.isArray(parsed.seenItemIds) ? parsed.seenItemIds : [],
          acknowledgedNewItemIds: Array.isArray(parsed.acknowledgedNewItemIds) ? parsed.acknowledgedNewItemIds : [],
          notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
          settings: parsed.settings || {},
        };
      } else {
        this.persist();
      }
      this.initialized = true;
    } catch (err) {
      console.error('[WorkspaceStorage] Initialization error:', err);
      this.db = { ...DEFAULT_DB };
      this.initialized = true;
    }
  }

  private persist(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_FILE);
    } catch (err) {
      console.error('[WorkspaceStorage] Persist error:', err);
    }
  }

  public getSavedItems(): SavedProductionItem[] {
    this.ensureInitialized();
    return [...this.db.savedItems];
  }

  public getSavedItemById(id: string): SavedProductionItem | undefined {
    this.ensureInitialized();
    return this.db.savedItems.find((item) => item.id === id);
  }

  public saveItem(item: Omit<SavedProductionItem, 'savedAt' | 'status' | 'userNotes' | 'reminderActive' | 'reminderDate'> & {
    status?: JobStatus;
    userNotes?: string;
    reminderActive?: boolean;
    reminderDate?: string | null;
  }): SavedProductionItem {
    this.ensureInitialized();
    const existingIndex = this.db.savedItems.findIndex((s) => s.id === item.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = this.db.savedItems[existingIndex];
      const updated: SavedProductionItem = {
        ...existing,
        ...item,
        status: item.status || existing.status,
        userNotes: item.userNotes !== undefined ? item.userNotes : existing.userNotes,
        reminderActive: item.reminderActive !== undefined ? item.reminderActive : existing.reminderActive,
        reminderDate: item.reminderDate !== undefined ? item.reminderDate : existing.reminderDate,
      };
      this.db.savedItems[existingIndex] = updated;
      this.persist();
      return updated;
    }

    const newItem: SavedProductionItem = {
      ...item,
      status: item.status || 'ÉRDEKEL',
      savedAt: now,
      userNotes: item.userNotes || '',
      deadline: item.deadline || null,
      reminderActive: Boolean(item.reminderActive),
      reminderDate: item.reminderDate || null,
    };

    this.db.savedItems.unshift(newItem);
    this.persist();
    return newItem;
  }

  public removeSavedItem(id: string): boolean {
    this.ensureInitialized();
    const prevLen = this.db.savedItems.length;
    this.db.savedItems = this.db.savedItems.filter((item) => item.id !== id);
    if (this.db.savedItems.length !== prevLen) {
      this.persist();
      return true;
    }
    return false;
  }

  public updateItemStatus(id: string, status: JobStatus): SavedProductionItem | null {
    this.ensureInitialized();
    const item = this.db.savedItems.find((s) => s.id === id);
    if (!item) return null;
    item.status = status;
    this.persist();
    return item;
  }

  public updateItemNotes(id: string, userNotes: string): SavedProductionItem | null {
    this.ensureInitialized();
    const item = this.db.savedItems.find((s) => s.id === id);
    if (!item) return null;
    item.userNotes = userNotes;
    this.persist();
    return item;
  }

  public toggleReminder(id: string, reminderActive: boolean, reminderDate?: string | null): SavedProductionItem | null {
    this.ensureInitialized();
    const item = this.db.savedItems.find((s) => s.id === id);
    if (!item) return null;
    item.reminderActive = reminderActive;
    if (reminderDate !== undefined) {
      item.reminderDate = reminderDate;
    }
    this.persist();
    return item;
  }

  public getNotifications(): WorkspaceNotification[] {
    this.ensureInitialized();
    return [...this.db.notifications].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addNotification(notification: Omit<WorkspaceNotification, 'id' | 'timestamp' | 'read'>): WorkspaceNotification {
    this.ensureInitialized();
    const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newNotif: WorkspaceNotification = {
      ...notification,
      id,
      timestamp: new Date().toISOString(),
      read: false,
    };
    // Keep max 100 real notifications
    this.db.notifications.unshift(newNotif);
    if (this.db.notifications.length > 100) {
      this.db.notifications = this.db.notifications.slice(0, 100);
    }
    this.persist();
    return newNotif;
  }

  public markNotificationAsRead(id: string): void {
    this.ensureInitialized();
    const notif = this.db.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.persist();
    }
  }

  public markAllNotificationsAsRead(): void {
    this.ensureInitialized();
    this.db.notifications.forEach((n) => {
      n.read = true;
    });
    this.persist();
  }

  /**
   * Tracks genuinely newly detected items and calculates newOpportunitiesCount accurately
   */
  public trackNewItems(detectedItems: { id: string; title: string; link: string; sourceName: string; isStuntRelevant: boolean }[]): {
    newStuntItems: typeof detectedItems;
    newOpportunitiesCount: number;
  } {
    this.ensureInitialized();
    const seenSet = new Set(this.db.seenItemIds);
    const ackSet = new Set(this.db.acknowledgedNewItemIds);
    const newStuntItems: typeof detectedItems = [];

    let hasChanges = false;
    for (const item of detectedItems) {
      if (!seenSet.has(item.id)) {
        seenSet.add(item.id);
        this.db.seenItemIds.push(item.id);
        hasChanges = true;

        if (item.isStuntRelevant) {
          newStuntItems.push(item);
          // Create a genuine notification for newly detected stunt job
          this.addNotification({
            type: 'NEW_STUNT_OPPORTUNITY',
            title: `Új kaszkadőri észlelés: ${item.title.slice(0, 70)}`,
            message: `Hivatalos forrásból észlelt kaszkadőri lehetőség: ${item.sourceName}`,
            sourceName: item.sourceName,
            sourceUrl: item.link,
          });
        }
      }
    }

    // Limit seenItemIds to prevent unbounded growth over years (keep last 5000)
    if (this.db.seenItemIds.length > 5000) {
      this.db.seenItemIds = this.db.seenItemIds.slice(-4000);
      hasChanges = true;
    }

    if (hasChanges) {
      this.persist();
    }

    // Count unacknowledged stunt items
    const unacknowledgedStunt = detectedItems.filter(
      (item) => item.isStuntRelevant && !ackSet.has(item.id)
    );

    return {
      newStuntItems,
      newOpportunitiesCount: unacknowledgedStunt.length,
    };
  }

  public acknowledgeNewItem(id: string): void {
    this.ensureInitialized();
    if (!this.db.acknowledgedNewItemIds.includes(id)) {
      this.db.acknowledgedNewItemIds.push(id);
      this.persist();
    }
  }

  public getDashboardStats(totalNewlyDetectedStuntCount: number, lastCheck: string | null) {
    this.ensureInitialized();
    const saved = this.db.savedItems;
    const savedCount = saved.length;
    const appliedCount = saved.filter((s) => s.status === 'JELENTKEZVE').length;
    const pendingCount = saved.filter((s) => s.status === 'VISSZAJELZÉSRE VÁR').length;
    const closedCount = saved.filter((s) => s.status === 'LEZÁRVA').length;
    const rejectedCount = saved.filter((s) => s.status === 'ELUTASÍTVA').length;

    // Count saved items that have a real, upcoming deadline or active reminder
    const deadlinesCount = saved.filter((s) => s.deadline !== null || s.reminderActive).length;

    return {
      newOpportunitiesCount: totalNewlyDetectedStuntCount,
      savedCount,
      appliedCount,
      pendingCount,
      closedCount,
      rejectedCount,
      deadlinesCount,
      lastCheck: lastCheck || this.db.settings.lastSavedCheck || new Date().toISOString(),
    };
  }
}

export const workspaceStorage = new WorkspaceStorageService();
