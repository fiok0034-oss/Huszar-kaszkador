import type { Handler } from '@netlify/functions';
import { rssParserUtility, OFFICIAL_FILM_FEEDS } from '../../src/server/rssParser.js';

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

async function handleStuntJobsRequest(method: string, pathname: string) {
  if (method === 'OPTIONS') {
    return { statusCode: 204, data: {} };
  }

  const isRefresh = method === 'POST' || pathname.includes('/refresh');
  const isSources = pathname.includes('/sources');

  if (isSources) {
    return {
      statusCode: 200,
      data: {
        success: true,
        sources: OFFICIAL_FILM_FEEDS,
      },
    };
  }

  const parseResult = await rssParserUtility.fetchAllOfficialFeeds(OFFICIAL_FILM_FEEDS, {
    forceRefresh: isRefresh,
  });

  return {
    statusCode: 200,
    data: {
      success: true,
      data: parseResult,
    },
  };
}

export const handler: Handler = async (event) => {
  try {
    const result = await handleStuntJobsRequest(event.httpMethod, event.path);
    return {
      statusCode: result.statusCode,
      headers: CORS_HEADERS,
      body: JSON.stringify(result.data),
    };
  } catch (err: any) {
    console.error('[netlify/functions/stunt-jobs error]:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: err?.message || 'Hiba a hírfolyamok lekérdezésekor',
      }),
    };
  }
};

export default async function (req: Request) {
  try {
    const url = new URL(req.url);
    const result = await handleStuntJobsRequest(req.method, url.pathname);
    return new Response(JSON.stringify(result.data), {
      status: result.statusCode,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || 'Hiba a hírfolyamok lekérdezésekor',
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
