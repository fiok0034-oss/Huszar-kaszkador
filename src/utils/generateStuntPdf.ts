import { jsPDF } from 'jspdf';

export interface StuntProfileData {
  name: string;
  location: string;
  currentStatus: string;
  membership: string;
  training: string;
  nextStep: string;
  project: string;
  gym: string;
  films: {
    title: string;
    type: string;
    role: string;
  }[];
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  summary: string;
}

export const VERIFIED_STUNT_PROFILE: StuntProfileData = {
  name: 'Huszár Attila',
  location: 'Páty, Magyarország',
  currentStatus: 'Gyalogos kaszkadőr',
  membership: 'Független Magyar Kaszkadőrök Szövetsége (FMKSZ tag)',
  training: 'Lovas képzés',
  nextStep: 'Autós kaszkadőr továbbképzés',
  project: 'BMW E30 sport- és versenyautó (saját kezű műszaki építés)',
  gym: 'Saját kezűleg épített konditerem és funkcionális edzésbázis fejlesztése',
  films: [
    {
      title: 'Napszállta',
      type: 'Játékfilm · Magyar produkció',
      role: 'Kaszkadőri és játékakciós feladatok',
    },
    {
      title: 'Hadik',
      type: 'Történelmi játékfilm · Magyar produkció',
      role: 'Történelmi és gyalogos kaszkadőri feladatok',
    },
  ],
  contact: {
    email: 'huszar.attila.stunt@gmail.com',
    phone: '+36 20 448 3737',
    website: 'https://huszarattila.hu',
  },
  summary:
    'Pátyon élő gyalogos kaszkadőr, a Független Magyar Kaszkadőrök Szövetségének aktív tagja. ' +
    'Több hazai játékfilmben (Napszállta, Hadik) végzett kaszkadőri és játékakciós feladatokat. ' +
    'Elvégzett lovas képzéssel rendelkezik, jelenleg az autós kaszkadőri továbbképzés felé halad, ' +
    'melyhez technikai alapként egy BMW E30 sport- és versenyautó építésén dolgozik.',
};

/**
 * Normalizes characters to ensure 100% clean rendering in standard jsPDF helvetica font
 */
export function cleanPdfText(text: string): string {
  if (!text) return '';
  return text
    .replace(/ő/g, 'ö')
    .replace(/Ő/g, 'Ö')
    .replace(/ű/g, 'ü')
    .replace(/Ű/g, 'Ü');
}

/**
 * Generates a clean, professional, publication-grade downloadable PDF resume (CV)
 * based strictly on verified existing personal information without adding artificial data.
 */
export function generateStuntResumePdf(profile: StuntProfileData = VERIFIED_STUNT_PROFILE): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // 1. Clean Top Header Bar (Graphite / Dark Technical)
  doc.setFillColor(20, 23, 29);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Emerald hairline bottom accent
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 42, pageWidth, 1.2, 'F');

  // Name (Large, crisp, authoritative)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(cleanPdfText(profile.name.toUpperCase()), margin, 18);

  // Subtitle / Title Bar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(52, 211, 153); // Emerald
  doc.text(cleanPdfText(`${profile.currentStatus.toUpperCase()}  //  FMKSZ TAG`), margin, 26);

  // Contact Strip in Header
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(190, 196, 208);
  const contactText = `${cleanPdfText(profile.location)}   |   ${profile.contact.phone}   |   ${profile.contact.email}   |   ${profile.contact.website.replace('https://', '')}`;
  doc.text(contactText, margin, 34);

  let currentY = 54;

  // Helper for Section Titles
  const renderSectionHeader = (title: string, sectionNumber: string) => {
    // Top fine line
    doc.setDrawColor(215, 220, 228);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY - 2, margin + contentWidth, currentY - 2);

    // Section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 25, 35);
    doc.text(`${sectionNumber}.  ${cleanPdfText(title.toUpperCase())}`, margin, currentY + 3);

    currentY += 8;
  };

  // --- SECTION 1: SZAKMAI BEMUTATÁS & ÖSSZEFOGLALÓ ---
  renderSectionHeader('Szakmai Bemutatas es Profil', '1');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 55, 65);
  const summaryLines = doc.splitTextToSize(cleanPdfText(profile.summary), contentWidth);
  doc.text(summaryLines, margin, currentY);
  currentY += summaryLines.length * 4.6 + 6;

  // --- SECTION 2: SZAKMAI STÁTUSZ & SZERVEZET ---
  renderSectionHeader('Szakmai Besorolas es Tagsag', '2');

  const statusCards = [
    { label: 'Jelenlegi szakmai statusz:', value: profile.currentStatus, note: 'Aktiv filmes kaszkadör statusz' },
    { label: 'Szakmai szervezet:', value: profile.membership, note: 'Hivatalos szövetsegi tagsag' },
    { label: 'Szakmai bazis / Lakhely:', value: profile.location, note: 'Pest varmegye, Magyarorszag' },
  ];

  statusCards.forEach((card) => {
    doc.setFillColor(248, 249, 251);
    doc.setDrawColor(225, 228, 235);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, currentY - 3.5, contentWidth, 9.5, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 85, 95);
    doc.text(cleanPdfText(card.label), margin + 4, currentY + 2.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(20, 25, 35);
    doc.text(cleanPdfText(card.value), margin + 58, currentY + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(110, 115, 125);
    doc.text(cleanPdfText(card.note), margin + contentWidth - 4, currentY + 2.5, { align: 'right' });

    currentY += 12;
  });

  currentY += 2;

  // --- SECTION 3: IGAZOLT FILMOGRÁFIA ---
  renderSectionHeader('Igazolt Filmes Referenciak', '3');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 105, 115);
  doc.text('Kizarolag a valos, leigazolt es leforgatott filmes szereplesek:', margin, currentY);
  currentY += 4.5;

  profile.films.forEach((film, index) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(210, 215, 225);
    doc.setLineWidth(0.25);
    doc.roundedRect(margin, currentY, contentWidth, 14, 1.2, 1.2, 'FD');

    // Left Accent Marker
    doc.setFillColor(16, 185, 129);
    doc.rect(margin, currentY, 2.5, 14, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(20, 25, 35);
    doc.text(`0${index + 1}.  ${cleanPdfText(film.title.toUpperCase())}`, margin + 6, currentY + 5.5);

    // Type
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 95, 105);
    doc.text(cleanPdfText(film.type), margin + 6, currentY + 10.5);

    // Role / Duties
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(cleanPdfText(film.role), margin + contentWidth - 5, currentY + 8, { align: 'right' });

    currentY += 17;
  });

  currentY += 1;

  // --- SECTION 4: KÉPZÉS & TOVÁBBKÉPZÉSI ÚT ---
  renderSectionHeader('Szakmai Kepzettseg es Fejlodesi Irany', '4');

  const trainingItems = [
    { title: 'Elozetes kepzes:', detail: profile.training, desc: 'Lovas kaszkadör es tortenelmi filmes alapok.' },
    { title: 'Kovetkezo lepes:', detail: profile.nextStep, desc: 'Tervezett tovabbkepzes autotechnikai iranyba.' },
  ];

  trainingItems.forEach((t) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(70, 75, 85);
    doc.text(cleanPdfText(t.title), margin, currentY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(cleanPdfText(t.detail), margin + 42, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 105, 115);
    doc.text(cleanPdfText(t.desc), margin + 115, currentY);

    currentY += 6.5;
  });

  currentY += 4;

  // --- SECTION 5: MŰSZAKI & FIZIKAI HÁTTÉR ---
  renderSectionHeader('Muszaki es Fizikai Felkeszultseg', '5');

  const bgItems = [
    { title: 'Muszaki projekt:', text: profile.project },
    { title: 'Fizikai bazis:', text: profile.gym },
  ];

  bgItems.forEach((b) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(70, 75, 85);
    doc.text(cleanPdfText(b.title), margin, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 40, 50);
    const bLines = doc.splitTextToSize(cleanPdfText(b.text), contentWidth - 42);
    doc.text(bLines, margin + 42, currentY);
    currentY += bLines.length * 4.4 + 2;
  });

  currentY += 3;

  // --- SECTION 6: HITELESSÉGI NYILATKOZAT ---
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(215, 220, 228);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, currentY, contentWidth, 17, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('HITELESSEGI NYILATKOZAT (VERIFIED RESUME CLAUSE):', margin + 4, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(90, 95, 105);
  const declaration =
    'A jelen szakmai oneletrajz kizarolag ellenorzott, valos referenciakat es adatokat tartalmaz. ' +
    'Nem tartalmaz fiktiv specializaciot, kitalalt kepzettseget vagy mesterseges intelligencia altal generalt adatokat. ' +
    'Rendelkezesre allas filmes es jatekakcios produkciok szamara szakmai egyeztetest kovetoen.';
  const decLines = doc.splitTextToSize(cleanPdfText(declaration), contentWidth - 8);
  doc.text(decLines, margin + 4, currentY + 8.5);

  // --- FOOTER ---
  const footerY = pageHeight - 12;
  doc.setDrawColor(220, 225, 230);
  doc.setLineWidth(0.2);
  doc.line(margin, footerY - 2, margin + contentWidth, footerY - 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(130, 135, 145);
  const dateStr = new Date().toISOString().split('T')[0];
  doc.text(`Huszar Attila // Szakmai Oneletrajz (CV) // Datum: ${dateStr} // ${profile.contact.website}`, margin, footerY + 2);
  doc.text('Oldal: 1 / 1', margin + contentWidth, footerY + 2, { align: 'right' });

  return doc;
}

/**
 * Backward compatibility alias for generateStuntProfilePdf
 */
export function generateStuntProfilePdf(profile: StuntProfileData = VERIFIED_STUNT_PROFILE): jsPDF {
  return generateStuntResumePdf(profile);
}
