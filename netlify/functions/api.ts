import type { Handler } from '@netlify/functions';
import { handler as workspaceHandler } from './workspace.js';
import { handler as stuntJobsHandler } from './stunt-jobs.js';
import { handler as rssHandler } from './rss-parser.js';

export const handler: Handler = async (event, context) => {
  const path = event.path || '';

  if (path.includes('/workspace')) {
    return workspaceHandler(event, context) as any;
  }

  if (path.includes('/stunt-jobs')) {
    return stuntJobsHandler(event, context) as any;
  }

  if (path.includes('/rss-parser')) {
    return rssHandler(event, context) as any;
  }

  // Default fallback to workspace
  return workspaceHandler(event, context) as any;
};

export default async function (req: Request, context: any) {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path.includes('/workspace')) {
    const { default: ws } = await import('./workspace.js');
    return ws(req);
  }

  if (path.includes('/stunt-jobs')) {
    const { default: sj } = await import('./stunt-jobs.js');
    return sj(req);
  }

  if (path.includes('/rss-parser')) {
    const { default: rp } = await import('./rss-parser.js');
    return rp(req);
  }

  const { default: ws } = await import('./workspace.js');
  return ws(req);
}
