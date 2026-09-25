import type { Handler } from '@netlify/functions';
import { OFFICIAL_FILM_FEEDS } from '../../src/server/rssParser.js';

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ success: true, sources: OFFICIAL_FILM_FEEDS }),
  };
};

export default async function () {
  return new Response(JSON.stringify({ success: true, sources: OFFICIAL_FILM_FEEDS }), {
    status: 200,
    headers: CORS_HEADERS,
  });
}
