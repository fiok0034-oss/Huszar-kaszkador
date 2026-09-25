export type MonitoringMode = 'AUTOMATIC' | 'MANUAL';

export interface TechnicalAudit {
  hasOfficialApi: boolean;
  hasFeed: boolean;
  machineReadable: boolean;
  automatedAllowed: boolean;
  loginRequired: boolean;
  captchaOrProtection: boolean;
  auditSummary: string;
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  directUrl: string;
  category: 'casting' | 'production' | 'industry';
  description: string;
  status: 'ONLINE' | 'ERROR' | 'CHECKING' | 'MANUAL' | 'UNAVAILABLE';
  statusLabel: 'ELÉRHETŐ' | 'MANUÁLISAN ELLENŐRIZHETŐ' | 'HIBA' | 'ELLENŐRZÉS...';
  monitoringMode: MonitoringMode;
  technicalAudit: TechnicalAudit;
  lastChecked?: string;
  itemsRetrieved?: number;
  errorMessage?: string;
  latencyMs?: number;
  cached?: boolean;
  isAvailableForMonitoring: boolean;
  notes?: string;
}

// 1. FÁZIS: Elsődleges casting források és hiteles filmes produkciós adatforrások
export const OFFICIAL_FILM_FEEDS: FeedSource[] = [
  // --- ELSŐDLEGES CASTING FORRÁSOK ---
  {
    id: 'opencasting',
    name: 'Open Casting',
    url: 'https://opencasting.hu/feed/',
    directUrl: 'https://opencasting.hu/',
    category: 'casting',
    description: 'Nyilvános szereplőválogatási és casting ügynökségi felület. Hivatalos nyílt RSS hírfolyam és nyilvános WordPress REST API elérhető; a backend automatikusan pásztázza.',
    status: 'ONLINE',
    statusLabel: 'ELÉRHETŐ',
    monitoringMode: 'AUTOMATIC',
    isAvailableForMonitoring: true,
    technicalAudit: {
      hasOfficialApi: true,
      hasFeed: true,
      machineReadable: true,
      automatedAllowed: true,
      loginRequired: false,
      captchaOrProtection: false,
      auditSummary: 'Hivatalos RSS (/feed/) és WP REST API elérhető. Robots.txt engedélyezi a nyilvános elérést. Automatikusan monitorozva.',
    },
  },
  {
    id: 'procasting',
    name: 'ProCasting',
    url: 'https://procasting.hu/',
    directUrl: 'https://procasting.hu/',
    category: 'casting',
    description: 'Szereplőszervezés és online forgatáskezelés. Zárt egyoldalas webalkalmazás (SPA), nem rendelkezik nyílt géppel olvasható RSS-sel vagy publikus API-val.',
    status: 'MANUAL',
    statusLabel: 'MANUÁLISAN ELLENŐRIZHETŐ',
    monitoringMode: 'MANUAL',
    isAvailableForMonitoring: false,
    notes: 'A felhívások és szereplői adatlapok zárt felületen találhatók. Nyílt API/RSS hiányában manuális ellenőrzést igényel.',
    technicalAudit: {
      hasOfficialApi: false,
      hasFeed: false,
      machineReadable: false,
      automatedAllowed: true,
      loginRequired: true,
      captchaOrProtection: false,
      auditSummary: 'Zárt SPA alkalmazás. Nincs nyilvános géppel olvasható API/feed. Manuális ellenőrzés szükséges az eredeti felületen.',
    },
  },
  {
    id: 'playground',
    name: 'Playground Casting',
    url: 'https://playgroundcasting.com/',
    directUrl: 'https://playgroundcasting.com/',
    category: 'casting',
    description: 'Színész- és modellügynökség. Közvetlen nyílt RSS/API nem áll rendelkezésre, az aktuális felhívások az ügynökségi portálon és közösségi csatornákon érhetők el.',
    status: 'MANUAL',
    statusLabel: 'MANUÁLISAN ELLENŐRIZHETŐ',
    monitoringMode: 'MANUAL',
    isAvailableForMonitoring: false,
    notes: 'Közvetlen nyílt RSS vagy publikus REST végpont nem érhető el. A felhívások az ügynökség hivatalos felületein követhetők.',
    technicalAudit: {
      hasOfficialApi: false,
      hasFeed: false,
      machineReadable: false,
      automatedAllowed: true,
      loginRequired: false,
      captchaOrProtection: false,
      auditSummary: 'Nincs nyilvános feed vagy API. Jogszerűen és biztonságosan csak manuálisan ellenőrizhető.',
    },
  },
  {
    id: 'ninecasting',
    name: 'Nine Casting',
    url: 'https://ninecasting.hu/',
    directUrl: 'https://ninecasting.hu/jelentkezes/',
    category: 'casting',
    description: 'Casting és modellügynökség. A szereplőválogatások közvetlen adatbázis-regisztrációhoz kötöttek. Nyílt kaszkadőri hirdetőtábla hiányában manuális ellenőrzést igényel.',
    status: 'MANUAL',
    statusLabel: 'MANUÁLISAN ELLENŐRIZHETŐ',
    monitoringMode: 'MANUAL',
    isAvailableForMonitoring: false,
    notes: 'A jelentkezés saját adatbázison keresztül történik (/jelentkezes/). Nincs nyílt casting hirdetőtábla API.',
    technicalAudit: {
      hasOfficialApi: false,
      hasFeed: false,
      machineReadable: false,
      automatedAllowed: true,
      loginRequired: true,
      captchaOrProtection: false,
      auditSummary: 'Adatbázis-alapú regisztrációs rendszer. Nincs géppel olvasható nyílt casting feed. Manuális ellenőrzés szükséges.',
    },
  },

  // --- HIVATALOS FILMES ÉS KULTURÁLIS PRODUKCIÓS HÍRFORRÁSOK ---
  {
    id: 'kultura-hu',
    name: 'Kultúra.hu (Filmes & Kulturális Rovat)',
    url: 'https://kultura.hu/feed',
    directUrl: 'https://kultura.hu',
    category: 'production',
    description: 'Petőfi Kulturális Ügynökség hivatalos magyar kulturális és filmes hírei, hazai produkciók és forgatási beszámolók.',
    status: 'ONLINE',
    statusLabel: 'ELÉRHETŐ',
    monitoringMode: 'AUTOMATIC',
    isAvailableForMonitoring: true,
    technicalAudit: {
      hasOfficialApi: false,
      hasFeed: true,
      machineReadable: true,
      automatedAllowed: true,
      loginRequired: false,
      captchaOrProtection: false,
      auditSummary: 'Nyilvános XML RSS feed elérhető és rendszeresen frissül.',
    },
  },
  {
    id: 'filmneweurope',
    name: 'Film New Europe (Közép- és Kelet-Európa)',
    url: 'https://www.filmneweurope.com/?format=feed&type=rss',
    directUrl: 'https://www.filmneweurope.com',
    category: 'production',
    description: 'Közép- és kelet-európai, valamint magyarországi filmprodukciók, forgatási helyszínek és nemzetközi stábhírek.',
    status: 'ONLINE',
    statusLabel: 'ELÉRHETŐ',
    monitoringMode: 'AUTOMATIC',
    isAvailableForMonitoring: true,
    technicalAudit: {
      hasOfficialApi: false,
      hasFeed: true,
      machineReadable: true,
      automatedAllowed: true,
      loginRequired: false,
      captchaOrProtection: false,
      auditSummary: 'Hivatalos nemzetközi filmes RSS csatorna, automatikusan ellenőrizhető.',
    },
  },
  {
    id: 'filmtett',
    name: 'Filmtett Kárpát-medencei Filmes Portál',
    url: 'https://filmtett.ro/feed/',
    directUrl: 'https://filmtett.ro',
    category: 'production',
    description: 'Magyar nyelvű filmes produkciós közlemények, fesztiválok, forgatási beszámolók és szakmai hírek.',
    status: 'ONLINE',
    statusLabel: 'ELÉRHETŐ',
    monitoringMode: 'AUTOMATIC',
    isAvailableForMonitoring: true,
    technicalAudit: {
      hasOfficialApi: false,
      hasFeed: true,
      machineReadable: true,
      automatedAllowed: true,
      loginRequired: false,
      captchaOrProtection: false,
      auditSummary: 'Szabványos WordPress RSS feed, stabilan elérhető.',
    },
  },
  {
    id: 'telex-kultura',
    name: 'Telex Kultúra & Film',
    url: 'https://telex.hu/rss/archivum?temak=kultura',
    directUrl: 'https://telex.hu/rovat/kultura',
    category: 'industry',
    description: 'Magyar és nemzetközi filmes és színházi beszámolók, kulturális produkciós hírek.',
    status: 'ONLINE',
    statusLabel: 'ELÉRHETŐ',
    monitoringMode: 'AUTOMATIC',
    isAvailableForMonitoring: true,
    technicalAudit: {
      hasOfficialApi: false,
      hasFeed: true,
      machineReadable: true,
      automatedAllowed: true,
      loginRequired: false,
      captchaOrProtection: false,
      auditSummary: 'Nyilvános média RSS hírfolyam.',
    },
  },
  {
    id: 'deadline',
    name: 'Deadline Hollywood Film Productions',
    url: 'https://deadline.com/v/film/feed/',
    directUrl: 'https://deadline.com/v/film/',
    category: 'production',
    description: 'Nemzetközi stúdiófilmek, akció- és kaszkadőrközpontú produkciók hivatalos bejelentései.',
    status: 'ONLINE',
    statusLabel: 'ELÉRHETŐ',
    monitoringMode: 'AUTOMATIC',
    isAvailableForMonitoring: true,
    technicalAudit: {
      hasOfficialApi: false,
      hasFeed: true,
      machineReadable: true,
      automatedAllowed: true,
      loginRequired: false,
      captchaOrProtection: false,
      auditSummary: 'Globális filmes RSS hírfolyam.',
    },
  },
];
