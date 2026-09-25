import type { Handler } from '@netlify/functions';
import { rssParserUtility, OFFICIAL_FILM_FEEDS } from '../../src/server/rssParser.js';

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  try {
    const parseResult = await rssParserUtility.fetchAllOfficialFeeds(OFFICIAL_FILM_FEEDS, {
      forceRefresh: true,
    });
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true, data: parseResult }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, error: err?.message || 'Frissítési hiba' }),
    };
  }
};

export default async function () {
  try {
    const parseResult = await rssParserUtility.fetchAllOfficialFeeds(OFFICIAL_FILM_FEEDS, {
      forceRefresh: true,
    });
    return new Response(JSON.stringify({ success: true, data: parseResult }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Frissítési hiba' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
