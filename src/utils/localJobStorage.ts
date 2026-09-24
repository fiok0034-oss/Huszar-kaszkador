import type { SavedProductionItem, JobStatus } from '../server/workspaceStorage';
import type { MonitoredJobItem } from '../server/monitorService';

const LOCAL_STORAGE_KEY = 'stunt_workspace_saved_items_v1';
const LOCAL_STATUSES_KEY = 'stunt_workspace_item_statuses_v1';

/**
 * Retrieves all saved items stored in client-side localStorage.
 */
export function getLocalSavedItems(): SavedProductionItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[localJobStorage] Failed to read from localStorage:', err);
    return [];
  }
}

/**
 * Saves or updates an item in client-side localStorage.
 */
export function saveLocalItem(
  item: MonitoredJobItem | SavedProductionItem,
  status: JobStatus = 'ÉRDEKEL'
): SavedProductionItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const currentItems = getLocalSavedItems();
    const existingIndex = currentItems.findIndex((i) => i.id === item.id);

    const now = new Date().toISOString();
    const savedEntry: SavedProductionItem = {
      id: item.id,
      title: item.title,
      link: item.link,
      sourceName: item.sourceName,
      sourceId: (item as any).sourceId || 'custom',
      publishedAt: item.publishedAt || undefined,
      detectedAt: (item as any).detectedAt || now,
      summary: (item as any).summary || '',
      itemType: (item as any).isStuntRelevant ? 'stunt' : (item as any).itemType || 'stunt',
      stuntCategory: (item as any).stuntCategory,
      matchedKeywords: (item as any).matchedKeywords || [],
      savedAt: existingIndex >= 0 ? currentItems[existingIndex].savedAt : now,
      status,
      userNotes: existingIndex >= 0 ? currentItems[existingIndex].userNotes : '',
      deadline: item.deadline || null,
      reminderActive: existingIndex >= 0 ? currentItems[existingIndex].reminderActive : false,
      reminderDate: existingIndex >= 0 ? currentItems[existingIndex].reminderDate : null,
      productionType: (item as any).productionType,
    };

    let updatedList: SavedProductionItem[];
    if (existingIndex >= 0) {
      updatedList = [...currentItems];
      updatedList[existingIndex] = savedEntry;
    } else {
      updatedList = [savedEntry, ...currentItems];
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

    // Also update fast key-value status dictionary
    updateLocalStatusMap(item.id, status);

    return updatedList;
  } catch (err) {
    console.warn('[localJobStorage] Failed to save to localStorage:', err);
    return [];
  }
}

/**
 * Updates the user-selected status (Érdekel, Jelentkezve, Visszajelzésre vár) in localStorage.
 */
export function updateLocalItemStatus(id: string, status: JobStatus): SavedProductionItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const currentItems = getLocalSavedItems();
    const updated = currentItems.map((item) => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    updateLocalStatusMap(id, status);
    return updated;
  } catch (err) {
    console.warn('[localJobStorage] Failed to update status in localStorage:', err);
    return [];
  }
}

/**
 * Removes a saved item from localStorage.
 */
export function removeLocalItem(id: string): SavedProductionItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const currentItems = getLocalSavedItems();
    const filtered = currentItems.filter((i) => i.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));

    // Remove from status map
    const map = getLocalStatusMap();
    delete map[id];
    localStorage.setItem(LOCAL_STATUSES_KEY, JSON.stringify(map));

    return filtered;
  } catch (err) {
    console.warn('[localJobStorage] Failed to remove item from localStorage:', err);
    return [];
  }
}

/**
 * Fast status dictionary mapping itemId -> JobStatus
 */
export function getLocalStatusMap(): Record<string, JobStatus> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_STATUSES_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function updateLocalStatusMap(id: string, status: JobStatus) {
  try {
    const map = getLocalStatusMap();
    map[id] = status;
    localStorage.setItem(LOCAL_STATUSES_KEY, JSON.stringify(map));
  } catch (e) {
    // ignore
  }
}
