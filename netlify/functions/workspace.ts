import type { Handler } from '@netlify/functions';
import { rssParserUtility, OFFICIAL_FILM_FEEDS } from '../../src/server/rssParser.js';
import { workspaceStorage } from '../../src/server/workspaceStorage.js';

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
};

async function handleWorkspaceRequest(
  method: string,
  pathname: string,
  bodyObj: any
): Promise<{ statusCode: number; data: any }> {
  if (method === 'OPTIONS') {
    return { statusCode: 204, data: {} };
  }

  // GET /api/workspace
  if (method === 'GET' && (pathname === '/api/workspace' || pathname.endsWith('/workspace'))) {
    const parseResult = await rssParserUtility.fetchAllOfficialFeeds(OFFICIAL_FILM_FEEDS, {
      forceRefresh: false,
    });

    const tracking = workspaceStorage.trackNewItems(
      parseResult.recentScannedItems.map((item) => ({
        id: item.id,
        title: item.title,
        link: item.link,
        sourceName: item.sourceName,
        isStuntRelevant: item.isStuntRelevant,
      }))
    );

    const savedItems = workspaceStorage.getSavedItems();
    const notifications = workspaceStorage.getNotifications();
    const stats = workspaceStorage.getDashboardStats(
      tracking.newOpportunitiesCount,
      parseResult.lastCheck
    );

    return {
      statusCode: 200,
      data: {
        success: true,
        data: {
          savedItems,
          notifications,
          stats,
          sources: parseResult.sources,
          productionItems: parseResult.productionItems,
          relevantItems: parseResult.relevantItems,
          recentScannedItems: parseResult.recentScannedItems,
          lastCheck: parseResult.lastCheck,
          isChecking: false,
          cached: parseResult.cached,
          cacheAgeSeconds: parseResult.cacheAgeSeconds,
          statusSummary: parseResult.statusSummary,
          availableSourcesCount: parseResult.availableSourcesCount,
          activeOnlineSourcesCount: parseResult.activeOnlineSourcesCount,
          unavailableSourcesCount: parseResult.unavailableSourcesCount,
        },
      },
    };
  }

  // POST /api/workspace/save
  if (method === 'POST' && pathname.includes('/save')) {
    if (!bodyObj || !bodyObj.id || !bodyObj.title || !bodyObj.link) {
      return {
        statusCode: 400,
        data: { success: false, error: 'Hiányzó kötelező mezők (id, title, link)' },
      };
    }
    const saved = workspaceStorage.saveItem({
      id: bodyObj.id,
      title: bodyObj.title,
      link: bodyObj.link,
      sourceName: bodyObj.sourceName || 'Ismeretlen forrás',
      sourceId: bodyObj.sourceId || 'custom',
      publishedAt: bodyObj.publishedAt,
      detectedAt: bodyObj.detectedAt || new Date().toISOString(),
      summary: bodyObj.summary || '',
      itemType: bodyObj.itemType || 'stunt',
      stuntCategory: bodyObj.stuntCategory,
      matchedKeywords: bodyObj.matchedKeywords || [],
      status: bodyObj.status || 'ÉRDEKEL',
      userNotes: bodyObj.userNotes || '',
      deadline: bodyObj.deadline || null,
      reminderActive: Boolean(bodyObj.reminderActive),
      reminderDate: bodyObj.reminderDate || null,
      productionType: bodyObj.productionType,
    });
    return { statusCode: 200, data: { success: true, data: saved } };
  }

  // DELETE /api/workspace/saved/:id
  if (method === 'DELETE' && pathname.includes('/saved/')) {
    const parts = pathname.split('/');
    const id = parts[parts.indexOf('saved') + 1];
    const removed = workspaceStorage.removeSavedItem(id);
    return { statusCode: 200, data: { success: true, removed } };
  }

  // PATCH /api/workspace/saved/:id/status
  if (method === 'PATCH' && pathname.includes('/status')) {
    const parts = pathname.split('/');
    const id = parts[parts.indexOf('saved') + 1];
    const validStatuses = ['ÉRDEKEL', 'JELENTKEZVE', 'VISSZAJELZÉSRE VÁR', 'LEZÁRVA', 'ELUTASÍTVA'];
    if (!validStatuses.includes(bodyObj?.status)) {
      return {
        statusCode: 400,
        data: { success: false, error: `Érvénytelen státusz: ${bodyObj?.status}` },
      };
    }
    const updated = workspaceStorage.updateItemStatus(id, bodyObj.status);
    return {
      statusCode: updated ? 200 : 404,
      data: updated ? { success: true, data: updated } : { success: false, error: 'Nem található' },
    };
  }

  // PATCH /api/workspace/saved/:id/notes
  if (method === 'PATCH' && pathname.includes('/notes')) {
    const parts = pathname.split('/');
    const id = parts[parts.indexOf('saved') + 1];
    const updated = workspaceStorage.updateItemNotes(id, String(bodyObj?.userNotes || ''));
    return {
      statusCode: updated ? 200 : 404,
      data: updated ? { success: true, data: updated } : { success: false, error: 'Nem található' },
    };
  }

  // POST /api/workspace/saved/:id/reminder
  if (method === 'POST' && pathname.includes('/reminder')) {
    const parts = pathname.split('/');
    const id = parts[parts.indexOf('saved') + 1];
    const updated = workspaceStorage.toggleReminder(
      id,
      Boolean(bodyObj?.reminderActive),
      bodyObj?.reminderDate
    );
    return {
      statusCode: updated ? 200 : 404,
      data: updated ? { success: true, data: updated } : { success: false, error: 'Nem található' },
    };
  }

  // GET /api/workspace/notifications
  if (method === 'GET' && pathname.includes('/notifications')) {
    const notifications = workspaceStorage.getNotifications();
    return { statusCode: 200, data: { success: true, data: notifications } };
  }

  // POST /api/workspace/notifications/:id/read
  if (method === 'POST' && pathname.includes('/notifications/') && pathname.includes('/read')) {
    const parts = pathname.split('/');
    const id = parts[parts.indexOf('notifications') + 1];
    workspaceStorage.markNotificationAsRead(id);
    return { statusCode: 200, data: { success: true } };
  }

  // POST /api/workspace/notifications/read-all
  if (method === 'POST' && pathname.includes('/read-all')) {
    workspaceStorage.markAllNotificationsAsRead();
    return { statusCode: 200, data: { success: true } };
  }

  // POST /api/workspace/acknowledge-new/:id
  if (method === 'POST' && pathname.includes('/acknowledge-new/')) {
    const parts = pathname.split('/');
    const id = parts[parts.indexOf('acknowledge-new') + 1];
    workspaceStorage.acknowledgeNewItem(id);
    return { statusCode: 200, data: { success: true } };
  }

  return {
    statusCode: 404,
    data: { success: false, error: `Endpoint nem található: ${method} ${pathname}` },
  };
}

export const handler: Handler = async (event) => {
  try {
    let bodyObj = null;
    if (event.body) {
      try {
        bodyObj = JSON.parse(event.body);
      } catch {
        bodyObj = {};
      }
    }
    const result = await handleWorkspaceRequest(event.httpMethod, event.path, bodyObj);
    return {
      statusCode: result.statusCode,
      headers: CORS_HEADERS,
      body: JSON.stringify(result.data),
    };
  } catch (err: any) {
    console.error('[netlify/functions/workspace error]:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: err?.message || 'Szerveroldali hiba a munkaterület kiszolgálásakor',
      }),
    };
  }
};

export default async function (req: Request) {
  try {
    const url = new URL(req.url);
    let bodyObj = null;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
      try {
        bodyObj = await req.json();
      } catch {
        bodyObj = {};
      }
    }
    const result = await handleWorkspaceRequest(req.method, url.pathname, bodyObj);
    return new Response(JSON.stringify(result.data), {
      status: result.statusCode,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    console.error('[netlify/functions/workspace web-standard error]:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || 'Szerveroldali hiba a munkaterület kiszolgálásakor',
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
