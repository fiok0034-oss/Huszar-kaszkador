import type { Handler, HandlerResponse } from '@netlify/functions';
import rssParserHandler from '../../api/rss-parser.js';

export const handler: Handler = async (event, context) => {
  return new Promise<HandlerResponse>((resolve) => {
    const req: any = {
      url: event.rawUrl || event.path,
      method: event.httpMethod,
      headers: event.headers,
      query: event.queryStringParameters,
      body: event.body ? JSON.parse(event.body) : {},
    };

    const res: any = {
      statusCode: 200,
      headers: {},
      setHeader(key: string, value: string) {
        this.headers[key] = value;
      },
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        resolve({
          statusCode: this.statusCode,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            ...this.headers,
          },
          body: JSON.stringify(data),
        });
      },
    };

    rssParserHandler(req, res).catch((err: any) => {
      resolve({
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: err?.message }),
      });
    });
  });
};

export default async function (req: Request) {
  const url = new URL(req.url);
  const mockReq: any = {
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    query: Object.fromEntries(url.searchParams.entries()),
  };

  return new Promise<Response>((resolve) => {
    const mockRes: any = {
      statusCode: 200,
      headers: {},
      setHeader(key: string, value: string) {
        this.headers[key] = value;
      },
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        resolve(
          new Response(JSON.stringify(data), {
            status: this.statusCode,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              ...this.headers,
            },
          })
        );
      },
    };

    rssParserHandler(mockReq, mockRes).catch((err: any) => {
      resolve(
        new Response(JSON.stringify({ success: false, error: err?.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });
}
