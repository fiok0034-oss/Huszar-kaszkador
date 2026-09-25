export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: 'casting' | 'production' | 'industry';
  description: string;
  status: 'ONLINE' | 'ERROR' | 'CHECKING' | 'UNAVAILABLE';
  statusLabel?: string;
  lastChecked?: string;
  itemsRetrieved?: number;
  errorMessage?: string;
  latencyMs?: number;
  cached?: boolean;
  isAvailableForMonitoring?: boolean;
  notes?: string;
}

// Reputable Hungarian and international film industry news feeds with strict audit
export const OFFICIAL_FILM_FEEDS: FeedSource[] = [
  {
    id: 'kultura-hu',
    name: 'Kultúra.hu (Filmes & Kulturális Rovat)',
    url: 'https://kultura.hu/feed',
    category: 'industry',
    description: 'Petőfi Kulturális Ügynökség hivatalos magyar kulturális és filmes hírei, hazai produkciók.',
    status: 'ONLINE',
    isAvailableForMonitoring: true,
  },
  {
    id: 'mti-direct',
    name: 'MTI (Magyar Távirati Iroda)',
    url: 'https://mti.hu',
    category: 'industry',
    description: 'Magyar Távirati Iroda – Közvetlen nyílt RSS/API nem áll rendelkezésre; a szakmai filmes hírek a Kultúra.hu felületén keresztül követhetők.',
    status: 'UNAVAILABLE',
    statusLabel: 'SOURCE NOT AVAILABLE FOR AUTOMATIC MONITORING',
    isAvailableForMonitoring: false,
    notes: 'Közvetlen nyílt RSS/API hiányában automatikus gépi pásztázásra nem alkalmas.',
  },
  {
    id: 'filmneweurope',
    name: 'Film New Europe (Közép- és Kelet-Európa)',
    url: 'https://www.filmneweurope.com/?format=feed&type=rss',
    category: 'production',
    description: 'Közép- és kelet-európai, valamint magyarországi filmprodukciók, forgatási helyszínek és stábhírek.',
    status: 'ONLINE',
    isAvailableForMonitoring: true,
  },
  {
    id: 'filmtett',
    name: 'Filmtett Kárpát-medencei Filmes Portál',
    url: 'https://filmtett.ro/feed/',
    category: 'production',
    description: 'Magyar nyelvű filmes produkciós közlemények, fesztiválok, forgatási beszámolók és szakmai hírek.',
    status: 'ONLINE',
    isAvailableForMonitoring: true,
  },
  {
    id: 'telex-kultura',
    name: 'Telex Kultúra & Film',
    url: 'https://telex.hu/rss/archivum?temak=kultura',
    category: 'industry',
    description: 'Magyar és nemzetközi filmes és színházi beszámolók, kulturális produkciós hírek.',
    status: 'ONLINE',
    isAvailableForMonitoring: true,
  },
  {
    id: 'deadline',
    name: 'Deadline Hollywood Film Productions',
    url: 'https://deadline.com/v/film/feed/',
    category: 'production',
    description: 'Nemzetközi stúdiófilmek, akció- és kaszkadőrközpontú produkciók hivatalos bejelentései.',
    status: 'ONLINE',
    isAvailableForMonitoring: true,
  },
  {
    id: 'cchub',
    name: 'Casting Call Hub',
    url: 'https://www.castingcallhub.com/feed/',
    category: 'casting',
    description: 'Inaktív archívum – a hírfolyam 2018 óta nem frissült, élő casting figyelésre jelenleg nem alkalmas.',
    status: 'UNAVAILABLE',
    statusLabel: 'SOURCE NOT AVAILABLE FOR AUTOMATIC MONITORING',
    isAvailableForMonitoring: false,
    notes: 'Archivált feed, élő adatok hiányában nem alkalmas valós idejű figyelésre.',
  },
];
