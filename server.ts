import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { monitorService } from './src/server/monitorService.js';
import { workspaceStorage } from './src/server/workspaceStorage.js';
import rssParserHandler from './api/rss-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API Route: Get current monitoring state
  app.get('/api/stunt-jobs', (req, res) => {
    try {
      const state = monitorService.getState();
      res.json({
        success: true,
        data: state,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Hiba a figyelő állapotának lekérdezésekor',
      });
    }
  });

  // API Route: Trigger manual refresh of monitored feeds
  app.post('/api/stunt-jobs/refresh', async (req, res) => {
    try {
      const updatedState = await monitorService.refresh(true);
      res.json({
        success: true,
        data: updatedState,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Hiba a források frissítésekor',
      });
    }
  });

  // API Route: Get configured sources and their health status
  app.get('/api/stunt-jobs/sources', (req, res) => {
    try {
      const state = monitorService.getState();
      res.json({
        success: true,
        sources: state.sources,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Hiba a forráslista lekérdezésekor',
      });
    }
  });

  // --- WORKSPACE PERSISTENT DATABASE API ---

  // Get all workspace saved items, stats, and notifications
  app.get('/api/workspace', (req, res) => {
    try {
      const monitorState = monitorService.getState();
      const savedItems = workspaceStorage.getSavedItems();
      const notifications = workspaceStorage.getNotifications();
      const stats = workspaceStorage.getDashboardStats(
        monitorState.stats.newOpportunitiesCount,
        monitorState.lastCheck
      );

      res.json({
        success: true,
        data: {
          savedItems,
          notifications,
          stats,
          sources: monitorState.sources,
          productionItems: monitorState.productionItems,
          relevantItems: monitorState.relevantItems,
          recentScannedItems: monitorState.recentScannedItems,
          lastCheck: monitorState.lastCheck,
          isChecking: monitorState.isChecking,
          cached: monitorState.cached,
          cacheAgeSeconds: monitorState.cacheAgeSeconds,
        },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Hiba a workspace lekérdezésekor',
      });
    }
  });

  // Save an item to the persistent database
  app.post('/api/workspace/save', (req, res) => {
    try {
      const itemData = req.body;
      if (!itemData || !itemData.id || !itemData.title || !itemData.link) {
        return res.status(400).json({
          success: false,
          error: 'Hiányzó kötelező mezők (id, title, link)',
        });
      }

      const saved = workspaceStorage.saveItem({
        id: itemData.id,
        title: itemData.title,
        link: itemData.link,
        sourceName: itemData.sourceName || 'Ismeretlen forrás',
        sourceId: itemData.sourceId || 'custom',
        publishedAt: itemData.publishedAt,
        detectedAt: itemData.detectedAt || new Date().toISOString(),
        summary: itemData.summary || '',
        itemType: itemData.itemType || 'stunt',
        stuntCategory: itemData.stuntCategory,
        matchedKeywords: itemData.matchedKeywords || [],
        status: itemData.status || 'ÉRDEKEL',
        userNotes: itemData.userNotes || '',
        deadline: itemData.deadline || null,
        reminderActive: Boolean(itemData.reminderActive),
        reminderDate: itemData.reminderDate || null,
        productionType: itemData.productionType,
      });

      res.json({
        success: true,
        data: saved,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Hiba a mentés során',
      });
    }
  });

  // Remove an item from the database
  app.delete('/api/workspace/saved/:id', (req, res) => {
    try {
      const { id } = req.params;
      const removed = workspaceStorage.removeSavedItem(id);
      res.json({
        success: true,
        removed,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Hiba az elem törlésekor',
      });
    }
  });

  // Update item status ('ÉRDEKEL' | 'JELENTKEZVE' | 'VISSZAJELZÉSRE VÁR' | 'LEZÁRVA' | 'ELUTASÍTVA')
  app.patch('/api/workspace/saved/:id/status', (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ['ÉRDEKEL', 'JELENTKEZVE', 'VISSZAJELZÉSRE VÁR', 'LEZÁRVA', 'ELUTASÍTVA'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Érvénytelen státusz. Megengedett: ${validStatuses.join(', ')}`,
        });
      }

      const updated = workspaceStorage.updateItemStatus(id, status);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'A mentett tétel nem található',
        });
      }

      res.json({
        success: true,
        data: updated,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Hiba a státusz frissítésekor',
      });
    }
  });

  // Update personal notes on a saved item
  app.patch('/api/workspace/saved/:id/notes', (req, res) => {
    try {
      const { id } = req.params;
      const { userNotes } = req.body;
      const updated = workspaceStorage.updateItemNotes(id, String(userNotes || ''));
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'A mentett tétel nem található',
        });
      }

      res.json({
        success: true,
        data: updated,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Hiba a jegyzet mentésekor',
      });
    }
  });

  // Toggle or update deadline reminder
  app.post('/api/workspace/saved/:id/reminder', (req, res) => {
    try {
      const { id } = req.params;
      const { reminderActive, reminderDate } = req.body;
      const updated = workspaceStorage.toggleReminder(
        id,
        Boolean(reminderActive),
        reminderDate !== undefined ? reminderDate : undefined
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'A mentett tétel nem található',
        });
      }

      // Add a notification if reminder is activated
      if (reminderActive) {
        workspaceStorage.addNotification({
          type: 'UPCOMING_DEADLINE',
          title: `Emlékeztető beállítva: ${updated.title.slice(0, 50)}`,
          message: updated.deadline
            ? `Határidő: ${updated.deadline}`
            : 'Saját emlékeztető rögzítve a munkához',
          sourceName: updated.sourceName,
          sourceUrl: updated.link,
        });
      }

      res.json({
        success: true,
        data: updated,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Hiba az emlékeztető beállításakor',
      });
    }
  });

  // Notifications API
  app.get('/api/workspace/notifications', (req, res) => {
    try {
      const notifications = workspaceStorage.getNotifications();
      res.json({
        success: true,
        data: notifications,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Hiba az értesítések lekérdezésekor',
      });
    }
  });

  app.post('/api/workspace/notifications/:id/read', (req, res) => {
    try {
      const { id } = req.params;
      workspaceStorage.markNotificationAsRead(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/workspace/notifications/read-all', (req, res) => {
    try {
      workspaceStorage.markAllNotificationsAsRead();
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // Acknowledge new item (reduces "ÚJ LEHETŐSÉGEK" counter)
  app.post('/api/workspace/acknowledge-new/:id', (req, res) => {
    try {
      const { id } = req.params;
      workspaceStorage.acknowledgeNewItem(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // API Route: Serverless RSS Parser endpoint
  app.all('/api/rss-parser', rssParserHandler);

  // Setup Vite in development or serve static build in production
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[StuntWorkspace] Fullstack server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[StuntWorkspace] Fatal server error:', err);
  process.exit(1);
});
