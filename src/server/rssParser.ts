import { XMLParser } from 'fast-xml-parser';

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: 'casting' | 'production' | 'industry';
  description: string;
  status: 'ONLINE' | 'ERROR' | 'CHECKING';
  lastChecked?: string;
  itemsRetrieved?: number;
  errorMessage?: string;
  latencyMs?: number;
  cached?: boolean;
}

export interface MonitoredJobItem {
  id: string;
  title: string;
  link: string;
  sourceId: string;
  sourceName: string;
  publishedAt?: string;
  detectedAt: string;
  summary: string;
  isStuntRelevant: boolean;
  stuntCategory?: 'pedestrian' | 'vehicle' | 'general';
  matchedKeywords: string[];
  isProductionRelevant?: boolean;
  productionType?: string; // pl. 'Játékfilm' | 'Sorozat' | 'Koprodukció' | 'Forgatás' | 'Nemzetközi stáb'
  deadline?: string | null; // ONLY if real explicit deadline found in text, else null
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

export interface ParserResult {
  lastCheck: string;
  isChecking: boolean;
  sources: FeedSource[];
  relevantCount: number;
  totalScannedCount: number;
  relevantItems: MonitoredJobItem[];
  productionItems: MonitoredJobItem[];
  recentScannedItems: MonitoredJobItem[];
  cached: boolean;
  cacheAgeSeconds: number;
  ttlSeconds: number;
}

// Official reputable Hungarian and international film industry news feeds
export const OFFICIAL_FILM_FEEDS: FeedSource[] = [
  {
    id: 'kultura-mti',
    name: 'Kultúra.hu (MTI Kultúra & Filmes Rovat)',
    url: 'https://kultura.hu/feed/',
    category: 'industry',
    description: 'Petőfi Kulturális Ügynökség és a Magyar Távirati Iroda (MTI) hivatalos magyar kulturális és filmes hírei.',
    status: 'ONLINE',
  },
  {
    id: 'filmneweurope',
    name: 'Film New Europe (Közép- és Kelet-Európa)',
    url: 'https://www.filmneweurope.com/?format=feed&type=rss',
    category: 'production',
    description: 'Közép- és kelet-európai, valamint magyarországi filmprodukciók, forgatási helyszínek és stábhírek.',
    status: 'ONLINE',
  },
  {
    id: 'filmtett',
    name: 'Filmtett Kárpát-medencei Filmes Portál',
    url: 'https://www.filmtett.ro/feed/',
    category: 'production',
    description: 'Magyar nyelvű filmes produkciós közlemények, fesztiválok, forgatási beszámolók és szakmai hírek.',
    status: 'ONLINE',
  },
  {
    id: 'telex-kultura',
    name: 'Telex Kultúra & Film',
    url: 'https://telex.hu/rss/archivum?temak=kultura',
    category: 'industry',
    description: 'Magyar és nemzetközi filmes és színházi beszámolók, kulturális produkciós hírek.',
    status: 'ONLINE',
  },
  {
    id: 'deadline',
    name: 'Deadline Hollywood Film Productions',
    url: 'https://deadline.com/v/film/feed/',
    category: 'production',
    description: 'Nemzetközi stúdiófilmek, akció- és kaszkadőrközpontú produkciók hivatalos bejelentései.',
    status: 'ONLINE',
  },
  {
    id: 'cchub',
    name: 'Casting Call Hub',
    url: 'https://www.castingcallhub.com/feed/',
    category: 'casting',
    description: 'Nyilvános nemzetközi és európai casting felhívások filmes szereplőknek és kaszkadőröknek.',
    status: 'ONLINE',
  },
];

// Exact non-hallucinatory keywords reflecting genuine stunt roles
const PEDESTRIAN_STUNT_KEYWORDS = [
  'stunt',
  'stunt performer',
  'stunt double',
  'stunt coordinator',
  'kaszkadőr',
  'kaszkadőrök',
  'action performer',
  'fight coordinator',
  'combat performer',
  'lovas kaszkadőr',
  'horse stunt',
  'wire work',
  'high fall',
  'küzdelmi jelenet',
];

const VEHICLE_STUNT_KEYWORDS = [
  'stunt driver',
  'precision driver',
  'precision driving',
  'car stunt',
  'autós kaszkadőr',
  'vehicle stunt',
];

// Production keywords for Film & Sorozat Figyelő (strict separate category)
const PRODUCTION_KEYWORDS = [
  { kw: 'filmforgatás', type: 'Forgatás / Gyártás' },
  { kw: 'forgatják', type: 'Forgatás alatt' },
  { kw: 'forgatás', type: 'Forgatás / Helyszín' },
  { kw: 'játékfilm', type: 'Játékfilm' },
  { kw: 'mozifilm', type: 'Mozifilm' },
  { kw: 'tévésorozat', type: 'Tévésorozat' },
  { kw: 'sorozat', type: 'Sorozat' },
  { kw: 'koprodukció', type: 'Nemzetközi koprodukció' },
  { kw: 'stúdió', type: 'Stúdióprodukció' },
  { kw: 'filmgyártás', type: 'Filmgyártás' },
  { kw: 'shooting', type: 'Forgatás' },
  { kw: 'filming', type: 'Forgatás' },
  { kw: 'feature film', type: 'Játékfilm' },
  { kw: 'production', type: 'Filmes Produkció' },
  { kw: 'principal photography', type: 'Fő forgatási szakasz' },
  { kw: 'korda', type: 'Stúdió forgatás' },
  { kw: 'mafilm', type: 'Stúdió forgatás' },
];

export class RssParserUtility {
  private xmlParser: XMLParser;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTtlMs: number = 15 * 60 * 1000; // 15 minutes TTL

  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      trimValues: true,
      parseTagValue: true,
    });
  }

  public cleanText(input: string): string {
    if (!input || typeof input !== 'string') return '';
    return input
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/&#8216;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#8211;/g, '–')
      .replace(/&#8212;/g, '—')
      .replace(/&#038;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public generateDeterministicId(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 24);
  }

  /**
   * Evaluates text against verified stunt keywords
   */
  public evaluateStuntRelevance(title: string, summary: string): {
    isStuntRelevant: boolean;
    stuntCategory?: 'pedestrian' | 'vehicle' | 'general';
    matchedKeywords: string[];
  } {
    const fullText = (title + ' ' + summary).toLowerCase();
    const matchedKeywords: string[] = [];
    let stuntCategory: 'pedestrian' | 'vehicle' | 'general' | undefined = undefined;

    // Check pedestrian stunt terms
    for (const kw of PEDESTRIAN_STUNT_KEYWORDS) {
      if (fullText.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
        stuntCategory = 'pedestrian';
      }
    }

    // Check vehicle stunt terms
    for (const kw of VEHICLE_STUNT_KEYWORDS) {
      if (fullText.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
        stuntCategory = stuntCategory === 'pedestrian' ? 'general' : 'vehicle';
      }
    }

    return {
      isStuntRelevant: matchedKeywords.length > 0,
      stuntCategory,
      matchedKeywords,
    };
  }

  /**
   * Evaluates text for Film & Sorozat Figyelő (publicly announced productions)
   */
  public evaluateProductionRelevance(title: string, summary: string): {
    isProductionRelevant: boolean;
    productionType?: string;
  } {
    const fullText = (title + ' ' + summary).toLowerCase();
    for (const item of PRODUCTION_KEYWORDS) {
      if (fullText.includes(item.kw.toLowerCase())) {
        return {
          isProductionRelevant: true,
          productionType: item.type,
        };
      }
    }
    return {
      isProductionRelevant: false,
    };
  }

  /**
   * Strict real deadline extractor.
   * NEVER invents dates. Only returns date if explicitly formatted with a deadline keyword.
   */
  public extractRealDeadline(title: string, summary: string): string | null {
    const fullText = `${title} ${summary}`;
    const deadlineRegex = /(?:jelentkezési\s+határidő|határidő|beadási\s+határidő|deadline|submission\s+deadline|apply\s+by)[:\s]+([0-9]{4}[.\-\/][0-9]{1,2}[.\-\/][0-9]{1,2}|[0-9]{1,2}\s+(?:január|február|március|április|május|június|július|augusztus|szeptember|október|november|december|[A-Za-z]+)(?:\s+[0-9]{4})?|[A-Za-z]+\s+[0-9]{1,2}(?:st|nd|rd|th)?,?\s+[0-9]{4})/i;
    const match = fullText.match(deadlineRegex);
    if (match && match[1]) {
      return match[1].trim();
    }
    return null;
  }

  /**
   * Parse XML string containing RSS 2.0, RSS 1.0/RDF or Atom 1.0 into normalized MonitoredJobItem[]
   */
  public parseFeedXml(xmlText: string, source: FeedSource, detectedAt: string): MonitoredJobItem[] {
    const parsed = this.xmlParser.parse(xmlText);
    const items: MonitoredJobItem[] = [];

    const rawItems =
      parsed.rss?.channel?.item ||
      parsed.feed?.entry ||
      parsed['rdf:RDF']?.item ||
      [];

    const itemsList = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

    for (const raw of itemsList) {
      let title = '';
      if (typeof raw.title === 'string') {
        title = raw.title;
      } else if (raw.title && typeof raw.title === 'object') {
        title = raw.title['#text'] || raw.title['@_label'] || '';
      }
      title = this.cleanText(title);

      let link = '';
      if (typeof raw.link === 'string') {
        link = raw.link;
      } else if (Array.isArray(raw.link)) {
        const altLink = raw.link.find((l: any) => l['@_rel'] === 'alternate') || raw.link[0];
        link = typeof altLink === 'string' ? altLink : altLink?.['@_href'] || '';
      } else if (raw.link?.['@_href']) {
        link = raw.link['@_href'];
      } else if (typeof raw.guid === 'string') {
        link = raw.guid;
      } else if (raw.guid?.['#text']) {
        link = raw.guid['#text'];
      }
      link = link.trim();

      if (!title || !link) continue;

      const rawDesc =
        raw.description ||
        raw.summary ||
        raw['content:encoded'] ||
        raw.content ||
        '';
      const descText = typeof rawDesc === 'string' ? rawDesc : rawDesc?.['#text'] || '';
      const summary = this.cleanText(descText).slice(0, 350);

      const pubDate = raw.pubDate || raw.published || raw.updated || raw['dc:date'] || undefined;

      const stuntEval = this.evaluateStuntRelevance(title, summary);
      const prodEval = this.evaluateProductionRelevance(title, summary);
      const realDeadline = this.extractRealDeadline(title, summary);

      const jobItem: MonitoredJobItem = {
        id: this.generateDeterministicId(link || title),
        title,
        link,
        sourceId: source.id,
        sourceName: source.name,
        publishedAt: pubDate ? String(pubDate) : undefined,
        detectedAt,
        summary,
        isStuntRelevant: stuntEval.isStuntRelevant,
        stuntCategory: stuntEval.stuntCategory,
        matchedKeywords: stuntEval.matchedKeywords,
        isProductionRelevant: prodEval.isProductionRelevant,
        productionType: prodEval.productionType,
        deadline: realDeadline,
      };

      items.push(jobItem);
    }

    return items;
  }

  public async fetchSingleFeed(
    source: FeedSource,
    options: { forceRefresh?: boolean; ttlMs?: number } = {}
  ): Promise<{ source: FeedSource; items: MonitoredJobItem[]; fromCache: boolean }> {
    const ttlMs = options.ttlMs || this.defaultTtlMs;
    const cacheKey = `feed_${source.id}`;
    const cachedEntry = this.cache.get(cacheKey);

    const now = Date.now();
    if (!options.forceRefresh && cachedEntry && now - cachedEntry.timestamp < cachedEntry.ttlMs) {
      return {
        source: {
          ...source,
          cached: true,
          status: 'ONLINE',
          lastChecked: new Date(cachedEntry.timestamp).toISOString(),
          itemsRetrieved: cachedEntry.data.length,
          latencyMs: 1,
        },
        items: cachedEntry.data,
        fromCache: true,
      };
    }

    const start = Date.now();
    const checkStartTime = new Date().toISOString();

    try {
      const response = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; StuntWorkspace-RssParser/2.0; +https://huszarattila.hu)',
          Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const xmlText = await response.text();
      const items = this.parseFeedXml(xmlText, source, checkStartTime);
      const latencyMs = Date.now() - start;

      this.cache.set(cacheKey, {
        data: items,
        timestamp: now,
        ttlMs,
      });

      const updatedSource: FeedSource = {
        ...source,
        status: 'ONLINE',
        itemsRetrieved: items.length,
        lastChecked: checkStartTime,
        latencyMs,
        errorMessage: undefined,
        cached: false,
      };

      return {
        source: updatedSource,
        items,
        fromCache: false,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - start;
      const updatedSource: FeedSource = {
        ...source,
        status: 'ERROR',
        errorMessage: err?.message || 'Forrás lekérése sikertelen',
        lastChecked: checkStartTime,
        latencyMs,
        cached: false,
      };

      if (cachedEntry) {
        return {
          source: { ...updatedSource, cached: true, status: 'ONLINE' },
          items: cachedEntry.data,
          fromCache: true,
        };
      }

      return {
        source: updatedSource,
        items: [],
        fromCache: false,
      };
    }
  }

  public async fetchAllOfficialFeeds(
    sources: FeedSource[] = OFFICIAL_FILM_FEEDS,
    options: { forceRefresh?: boolean; ttlMs?: number } = {}
  ): Promise<ParserResult> {
    const aggregateCacheKey = 'all_official_feeds';
    const cachedAggregate = this.cache.get(aggregateCacheKey);
    const now = Date.now();
    const ttlMs = options.ttlMs || this.defaultTtlMs;

    if (!options.forceRefresh && cachedAggregate && now - cachedAggregate.timestamp < cachedAggregate.ttlMs) {
      const ageSeconds = Math.round((now - cachedAggregate.timestamp) / 1000);
      return {
        ...cachedAggregate.data,
        cached: true,
        cacheAgeSeconds: ageSeconds,
        ttlSeconds: Math.round(ttlMs / 1000),
      };
    }

    const checkStartTime = new Date().toISOString();
    const results = await Promise.all(
      sources.map((src) => this.fetchSingleFeed(src, options))
    );

    const updatedSources: FeedSource[] = [];
    const allItems: MonitoredJobItem[] = [];

    for (const res of results) {
      updatedSources.push(res.source);
      allItems.push(...res.items);
    }

    const seenMap = new Map<string, MonitoredJobItem>();
    for (const item of allItems) {
      const cleanUrl = item.link.split('?')[0].replace(/\/$/, '');
      const key = cleanUrl || item.title.toLowerCase().trim();
      if (!seenMap.has(key)) {
        seenMap.set(key, item);
      }
    }

    const uniqueItems = Array.from(seenMap.values());
    const relevantItems = uniqueItems.filter((item) => item.isStuntRelevant);
    const productionItems = uniqueItems.filter((item) => item.isProductionRelevant && !item.isStuntRelevant);

    const resultData: ParserResult = {
      lastCheck: checkStartTime,
      isChecking: false,
      sources: updatedSources,
      relevantCount: relevantItems.length,
      totalScannedCount: uniqueItems.length,
      relevantItems,
      productionItems: productionItems.slice(0, 50),
      recentScannedItems: uniqueItems.slice(0, 40),
      cached: false,
      cacheAgeSeconds: 0,
      ttlSeconds: Math.round(ttlMs / 1000),
    };

    this.cache.set(aggregateCacheKey, {
      data: resultData,
      timestamp: now,
      ttlMs,
    });

    return resultData;
  }

  public invalidateCache(): void {
    this.cache.clear();
  }
}

export const rssParserUtility = new RssParserUtility();
