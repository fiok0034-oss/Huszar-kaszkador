import type { Request, Response } from 'express';
import { rssParserUtility, OFFICIAL_FILM_FEEDS } from '../src/server/rssParser.js';

/**
 * Serverless function handler for RSS parsing of official film industry news feeds.
 * Compatible with serverless environments (Vercel / Cloud Functions / AWS Lambda)
 * and Express middleware.
 *
 * Query Parameters:
 *  - forceRefresh: boolean ('true' / '1' to bypass cache)
 *  - category: 'all' | 'pedestrian' | 'vehicle'
 *  - source: optional source ID (e.g., 'kultura-mti', 'filmneweurope')
 *  - filter: 'stunt' (default) | 'all'
 */
export default async function handler(req: Request | any, res: Response | any) {
  try {
    const url = new URL(req.url || '', `http://${req.headers?.host || 'localhost'}`);
    const forceRefresh =
      req.query?.forceRefresh === 'true' ||
      req.query?.forceRefresh === '1' ||
      url.searchParams.get('forceRefresh') === 'true';

    const category =
      req.query?.category ||
      url.searchParams.get('category') ||
      'all';

    const sourceFilter =
      req.query?.source ||
      url.searchParams.get('source') ||
      'all';

    const filterMode =
      req.query?.filter ||
      url.searchParams.get('filter') ||
      'stunt';

    let targetSources = OFFICIAL_FILM_FEEDS;
    if (sourceFilter !== 'all') {
      const matched = OFFICIAL_FILM_FEEDS.filter((s) => s.id === sourceFilter);
      if (matched.length > 0) {
        targetSources = matched;
      }
    }

    const parseResult = await rssParserUtility.fetchAllOfficialFeeds(targetSources, {
      forceRefresh: Boolean(forceRefresh),
    });

    // Apply category filtering if requested
    let relevantItems = parseResult.relevantItems;
    if (category === 'pedestrian') {
      relevantItems = relevantItems.filter((item) => item.stuntCategory === 'pedestrian');
    } else if (category === 'vehicle') {
      relevantItems = relevantItems.filter((item) => item.stuntCategory === 'vehicle');
    }

    // Set serverless caching headers
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    res.setHeader('X-Cache', parseResult.cached ? 'HIT' : 'MISS');
    res.setHeader('X-Cache-Age', String(parseResult.cacheAgeSeconds));

    return res.status(200).json({
      success: true,
      data: {
        ...parseResult,
        relevantItems,
        relevantCount: relevantItems.length,
        filterApplied: {
          category,
          source: sourceFilter,
          filterMode,
          forceRefresh: Boolean(forceRefresh),
        },
      },
    });
  } catch (error: any) {
    console.error('[rss-parser serverless function error]:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Hiba a hivatalos RSS hírfolyamok feldolgozásakor',
    });
  }
}
