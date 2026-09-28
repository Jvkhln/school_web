import {
  AdmissionInquiry,
  NewsArticle,
  SchoolProgram,
  CalendarEvent,
  HeroSlide,
  SchoolInfo,
  CategoryItem,
  InstitutionalArticle
} from '../types';
import { uploadDataUrlToDrive, formatGoogleDriveImageUrl } from './googleDrive';

export interface SheetSyncData {
  inquiries: AdmissionInquiry[];
  news: NewsArticle[];
  programs: SchoolProgram[];
  calendarEvents: CalendarEvent[];
  heroSlides: HeroSlide[];
  schoolInfo: SchoolInfo;
  categories?: CategoryItem[];
  institutionalArticles?: InstitutionalArticle[];
}

export const SHEET_TAB_NAMES = {
  INQUIRIES: 'Хүсэлт ба Элсэлт',
  NEWS: 'Мэдээ мэдээлэл',
  PROGRAMS: 'Сургалтын хөтөлбөр',
  CALENDAR: 'Календар төлөвлөгөө',
  INFO: 'Сургуулийн танилцуулга',
  SLIDES: 'Баатар Слайдер',
  CATEGORIES: 'Sub-домайн & Холбоос',
  ARTICLES: 'Дэд цэсийн нийтлэл'
};

const INQUIRY_HEADERS = [
  'Бүртгэсэн огноо',
  'Хүсэлтийн төрөл',
  'Сурагчийн нэр',
  'Илгээгч / Эцэг эхийн нэр',
  'Утасны дугаар',
  'Имэйл хаяг',
  'Анги / Түвшин',
  'Хөтөлбөр / Сонирхол',
  'Эрсдлийн зэрэг',
  'Эрсдлийн ангилал / Байршил',
  'Зургийн холбоос',
  'Дэлгэрэнгүй агуулга / Зурвас',
  'Төлөв'
];

const NEWS_HEADERS = [
  'ID',
  'Гарчиг',
  'Ангилал',
  'Нийтэлсэн огноо',
  'Зохиогч / Эх сурвалж',
  'Үзсэн тоо',
  'Нүүр зураг',
  'Товч тайлбар',
  'Дэлгэрэнгүй агуулга',
  'Нэмэлт зургууд (JSON / Links)'
];

const PROGRAM_HEADERS = [
  'ID',
  'Хөтөлбөрийн нэр',
  'Ангилал',
  'Насны ангилал / Дэд тайлбар',
  'Зураг',
  'Товч тайлбар'
];

const CALENDAR_HEADERS = [
  'ID',
  'Сар / Хугацаа',
  'Огноо / Хүрээ',
  'Арга хэмжээ, ажлын төлөвлөгөө',
  'Хамрах хүрээ',
  'Төрөл'
];

const SLIDE_HEADERS = [
  'ID',
  'Үндсэн гарчиг',
  'Дэд тайлбар',
  'Товчны текст',
  'Холбоос',
  'Зургийн хаяг'
];

const INFO_HEADERS = [
  'Параметр / Түлхүүр',
  'Утга'
];

const CATEGORY_HEADERS = [
  'ID',
  'Системийн нэр (MN)',
  'Англи нэр (EN)',
  'Slug код',
  'Икон',
  'Дэлгэрэнгүй тайлбар',
  'Sub-domain URL / Холбоос',
  'Нээх хэлбэр (Таб)',
  'Шошго (Badge)',
  'Дараалал',
  'Идэвхтэй эсэх'
];

const ARTICLE_HEADERS = [
  'ID',
  'Slug код',
  'Ангилал (about / education)',
  'Нийтлэлийн гарчиг',
  'Дэд тайлбар',
  'Икон',
  'Нүүр зураг',
  'Шууд холбоос / URL',
  'Нээх хэлбэр',
  'Шошго (Badge)',
  'Зохиогч',
  'Дараалал',
  'Нийтлэлийн агуулга'
];

export class GoogleAuthExpiredError extends Error {
  isAuthError = true;
  statusCode = 401;
  constructor(message = 'Google хандалтын эрхийн хугацаа дууссан байна. "Google-ээр холбогдох" товчоор дахин нэвтэрнэ үү.') {
    super(message);
    this.name = 'GoogleAuthExpiredError';
  }
}

export function handleGoogleApiResponseError(res: Response, errorJson: any, defaultMsg: string) {
  const errMsg = errorJson?.error?.message || '';
  const status = errorJson?.error?.status || '';
  if (
    res.status === 401 ||
    status === 'UNAUTHENTICATED' ||
    errMsg.includes('invalid authentication credentials') ||
    errMsg.includes('Invalid Credentials') ||
    errMsg.includes('OAuth 2 access token')
  ) {
    throw new GoogleAuthExpiredError();
  }
  throw new Error(errMsg || defaultMsg);
}

/**
 * Validates or fetches spreadsheet metadata
 */
export async function getSpreadsheetDetails(accessToken: string, spreadsheetId: string) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=properties.title,sheets.properties`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    handleGoogleApiResponseError(res, errorJson, `Google Sheets олдсонгүй (Статус: ${res.status})`);
  }

  const data = await res.json();
  const sheets: string[] = (data.sheets || []).map((s: any) => s.properties?.title || '');
  return {
    title: data.properties?.title || 'Google Sheet',
    sheets,
    spreadsheetId,
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  };
}

/**
 * Creates a brand new school spreadsheet with all configured tabs and styled headers
 */
export async function createSchoolSpreadsheet(accessToken: string, schoolName = 'Эрдмийн Далай Цогцолбор Сургууль') {
  const title = `${schoolName} — Мэдээллийн Бааз (Google Sheets)`;

  const createBody = {
    properties: {
      title
    },
    sheets: [
      {
        properties: {
          title: SHEET_TAB_NAMES.INQUIRIES,
          gridProperties: { frozenRowCount: 1, columnCount: 15 }
        }
      },
      {
        properties: {
          title: SHEET_TAB_NAMES.NEWS,
          gridProperties: { frozenRowCount: 1, columnCount: 12 }
        }
      },
      {
        properties: {
          title: SHEET_TAB_NAMES.PROGRAMS,
          gridProperties: { frozenRowCount: 1, columnCount: 10 }
        }
      },
      {
        properties: {
          title: SHEET_TAB_NAMES.CALENDAR,
          gridProperties: { frozenRowCount: 1, columnCount: 10 }
        }
      },
      {
        properties: {
          title: SHEET_TAB_NAMES.INFO,
          gridProperties: { frozenRowCount: 1, columnCount: 5 }
        }
      },
      {
        properties: {
          title: SHEET_TAB_NAMES.SLIDES,
          gridProperties: { frozenRowCount: 1, columnCount: 8 }
        }
      },
      {
        properties: {
          title: SHEET_TAB_NAMES.CATEGORIES,
          gridProperties: { frozenRowCount: 1, columnCount: 12 }
        }
      },
      {
        properties: {
          title: SHEET_TAB_NAMES.ARTICLES,
          gridProperties: { frozenRowCount: 1, columnCount: 15 }
        }
      }
    ]
  };

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createBody)
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    handleGoogleApiResponseError(res, errorJson, 'Google Sheets хүснэгт үүсгэхэд алдаа гарлаа.');
  }

  const result = await res.json();
  const spreadsheetId = result.spreadsheetId;

  // Initialize all headers
  await initializeSheetHeaders(accessToken, spreadsheetId);

  return {
    spreadsheetId,
    title,
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  };
}

/**
 * Initializes header rows for all tabs
 */
export async function initializeSheetHeaders(accessToken: string, spreadsheetId: string) {
  const updates = [
    {
      range: `'${SHEET_TAB_NAMES.INQUIRIES}'!A1:M1`,
      values: [INQUIRY_HEADERS]
    },
    {
      range: `'${SHEET_TAB_NAMES.NEWS}'!A1:J1`,
      values: [NEWS_HEADERS]
    },
    {
      range: `'${SHEET_TAB_NAMES.PROGRAMS}'!A1:F1`,
      values: [PROGRAM_HEADERS]
    },
    {
      range: `'${SHEET_TAB_NAMES.CALENDAR}'!A1:F1`,
      values: [CALENDAR_HEADERS]
    },
    {
      range: `'${SHEET_TAB_NAMES.INFO}'!A1:B1`,
      values: [INFO_HEADERS]
    },
    {
      range: `'${SHEET_TAB_NAMES.SLIDES}'!A1:F1`,
      values: [SLIDE_HEADERS]
    },
    {
      range: `'${SHEET_TAB_NAMES.CATEGORIES}'!A1:K1`,
      values: [CATEGORY_HEADERS]
    },
    {
      range: `'${SHEET_TAB_NAMES.ARTICLES}'!A1:M1`,
      values: [ARTICLE_HEADERS]
    }
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: updates
    })
  });
}

/**
 * Safely sanitizes cell values before submitting to Google Sheets:
 * 1. Replaces massive base64 strings with compact summaries if Drive upload wasn't available
 * 2. Strictly limits any cell length to 45,000 characters to comply with Google Sheets 50,000 max character limit
 */
export function sanitizeCell(val: any): string | number {
  if (val === null || val === undefined) return '';
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (typeof val === 'boolean') return val ? 'Тийм' : 'Үгүй';

  let str = String(val);

  // If a raw data URL was not uploaded to Drive or is still an inline base64 string:
  if (str.startsWith('data:image/') || str.startsWith('data:application/')) {
    if (str.length > 500) {
      const approxKb = Math.round((str.length * 0.75) / 1024);
      return `[Зураг хавсаргасан: ~${approxKb} KB]`;
    }
  }

  // Google Sheets cell limit is 50,000 characters.
  // We clamp at 45,000 to leave a comfortable safety margin.
  if (str.length > 45000) {
    return str.slice(0, 44900) + '... [Тэмдэгтийн хязгаар 50,000 хэтэрсэн тул товчлов]';
  }

  return str;
}

/**
 * Appends a new inquiry / admission / bullying / risk row into the Google Sheet
 */
export async function appendInquiryToSheet(
  accessToken: string,
  spreadsheetId: string,
  inquiry: AdmissionInquiry
) {
  const timestamp = inquiry.createdAt
    ? new Date(inquiry.createdAt).toLocaleString('mn-MN')
    : new Date().toLocaleString('mn-MN');

  const typeLabel =
    inquiry.type === 'risk'
      ? 'Эрсдлийн үнэлгээ'
      : inquiry.type === 'bullying'
      ? 'Үе тэнгийн дээрэлхэлт'
      : inquiry.type === 'admission'
      ? 'Элсэлтийн хүсэлт'
      : inquiry.type === 'question'
      ? 'Асуулт лавлагаа'
      : 'Санал хүсэлт';

  const riskLabel = inquiry.riskLevel
    ? inquiry.riskLevel === 'high'
      ? 'ӨНДӨР'
      : inquiry.riskLevel === 'medium'
      ? 'Дунд'
      : 'Бага'
    : '';

  const locationCategory = [inquiry.riskCategory, inquiry.location].filter(Boolean).join(' | ');

  const statusLabel =
    inquiry.status === 'approved'
      ? 'Зөвшөөрсөн'
      : inquiry.status === 'contacted'
      ? 'Холбогдсон'
      : inquiry.status === 'rejected'
      ? 'Татгалзсан'
      : 'Шинэ';

  let imgLink = inquiry.imageUrl || '';
  if (imgLink.startsWith('data:')) {
    try {
      const driveUrl = await uploadDataUrlToDrive(accessToken, imgLink, `inquiry_${Date.now()}.jpg`);
      if (driveUrl) {
        imgLink = driveUrl;
      }
    } catch (e) {
      console.warn('Inquiry image drive upload notice:', e);
    }
  }

  const rowData = [
    timestamp,
    typeLabel,
    inquiry.studentName || inquiry.name || (inquiry.isAnonymous ? 'Нэрээ нууцалсан' : ''),
    inquiry.parentName || inquiry.name || '',
    inquiry.phone || (inquiry.isAnonymous ? 'Нууцалсан' : ''),
    inquiry.email || (inquiry.isAnonymous ? 'Нууцалсан' : ''),
    inquiry.gradeLevel || '',
    inquiry.programInterest || '',
    riskLabel,
    locationCategory,
    imgLink,
    inquiry.message || inquiry.notes || '',
    statusLabel
  ].map(sanitizeCell);

  const range = `'${SHEET_TAB_NAMES.INQUIRIES}'!A:M`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [rowData]
    })
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    handleGoogleApiResponseError(res, errorJson, 'Google Sheets рүү хүсэлт нэмэхэд алдаа гарлаа.');
  }

  return await res.json();
}

/**
 * Synchronizes all school data to the Google Spreadsheet (Overwriting/Updating content)
 */
export async function syncAllDataToSheet(
  accessToken: string,
  spreadsheetId: string,
  data: SheetSyncData
) {
  // Ensure headers and sheets exist
  try {
    const meta = await getSpreadsheetDetails(accessToken, spreadsheetId);
    const existingSheets = meta.sheets || [];

    // Add any missing sheets
    const missingSheets = Object.values(SHEET_TAB_NAMES).filter(name => !existingSheets.includes(name));
    if (missingSheets.length > 0) {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: missingSheets.map(title => ({
            addSheet: { properties: { title, gridProperties: { frozenRowCount: 1 } } }
          }))
        })
      });
    }
  } catch (e) {
    console.warn('Metadata verify notice:', e);
  }

  // Helper to upload data URLs to Drive when available
  const resolveImageToDriveOrSummary = async (imgUrl: string | undefined, title: string): Promise<string> => {
    if (!imgUrl) return '';
    if (imgUrl.startsWith('data:')) {
      try {
        const driveUrl = await uploadDataUrlToDrive(accessToken, imgUrl, `${title || 'зураг'}.jpg`);
        if (driveUrl) return driveUrl;
      } catch (e) {
        console.warn('Drive upload notice:', e);
      }
      const approxKb = Math.round((imgUrl.length * 0.75) / 1024);
      return `[Зураг хавсаргасан: ~${approxKb} KB]`;
    }
    return imgUrl;
  };

  // 1. Inquiries rows
  const inquiriesRows: (string | number)[][] = [
    INQUIRY_HEADERS,
    ...(await Promise.all(
      data.inquiries.map(async inq => {
        const img = await resolveImageToDriveOrSummary(inq.imageUrl, inq.studentName || inq.name || 'хүсэлтийн_зураг');
        return [
          inq.createdAt ? new Date(inq.createdAt).toLocaleString('mn-MN') : '',
          inq.type === 'risk' ? 'Эрсдэл' : inq.type === 'bullying' ? 'Дээрэлхэлт' : inq.type === 'admission' ? 'Элсэлт' : 'Санал хүсэлт',
          inq.studentName || inq.name || (inq.isAnonymous ? 'Нууцалсан' : ''),
          inq.parentName || inq.name || '',
          inq.phone || '',
          inq.email || '',
          inq.gradeLevel || '',
          inq.programInterest || '',
          inq.riskLevel || '',
          [inq.riskCategory, inq.location].filter(Boolean).join(' | '),
          img,
          inq.message || inq.notes || '',
          inq.status || 'new'
        ].map(sanitizeCell);
      })
    ))
  ];

  // 2. News rows
  const newsRows: (string | number)[][] = [
    NEWS_HEADERS,
    ...(await Promise.all(
      data.news.map(async item => {
        const rawImg = item.imageUrl || (item.images && item.images[0]) || '';
        const img = await resolveImageToDriveOrSummary(rawImg, item.title || item.id);
        const imagesList = Array.isArray(item.images) && item.images.length > 0
          ? item.images
          : (rawImg ? [rawImg] : []);
        return [
          item.id,
          item.title || '',
          item.categoryName || item.categorySlug || 'Мэдээ, мэдээлэл',
          item.date || '',
          item.author || 'Админ',
          item.views || 0,
          img,
          item.excerpt || (item.content ? item.content.slice(0, 200) : ''),
          item.content || item.excerpt || '',
          JSON.stringify(imagesList)
        ].map(sanitizeCell);
      })
    ))
  ];

  // 3. Programs rows
  const programsRows: (string | number)[][] = [
    PROGRAM_HEADERS,
    ...(await Promise.all(
      data.programs.map(async prog => {
        const rawImg = prog.imageUrl || (prog.images && prog.images[0]) || '';
        const img = await resolveImageToDriveOrSummary(rawImg, prog.title || prog.id);
        return [
          prog.id,
          prog.title,
          prog.categoryName || prog.categorySlug || '',
          prog.ageRange || prog.subtitle || '',
          img,
          prog.description || ''
        ].map(sanitizeCell);
      })
    ))
  ];

  // 4. Calendar rows
  const calendarRows: (string | number)[][] = [
    CALENDAR_HEADERS,
    ...data.calendarEvents.map(cal => [
      cal.id,
      cal.month || '',
      cal.dateRange || '',
      cal.title || '',
      cal.targetGroup || '',
      cal.categoryName || cal.category || ''
    ].map(sanitizeCell))
  ];

  // 5. Hero Slides rows
  const slidesRows: (string | number)[][] = [
    SLIDE_HEADERS,
    ...(await Promise.all(
      data.heroSlides.map(async slide => {
        const img = await resolveImageToDriveOrSummary(slide.imageUrl, slide.title || slide.id);
        return [
          slide.id,
          slide.title || '',
          slide.subtitle || '',
          slide.buttonText || '',
          slide.buttonLink || '',
          img
        ].map(sanitizeCell);
      })
    ))
  ];

  // 6. School Info rows
  const logo = await resolveImageToDriveOrSummary(data.schoolInfo.logoUrl, 'school_logo');
  const infoRows: (string | number)[][] = [
    INFO_HEADERS,
    ['Нэр', data.schoolInfo.name || ''],
    ['Уриа үг', data.schoolInfo.motto || ''],
    ['Утас', data.schoolInfo.phone || ''],
    ['Имэйл', data.schoolInfo.email || ''],
    ['Хаяг', data.schoolInfo.address || ''],
    ['Лого', logo],
    ['Ажиллах цаг', data.schoolInfo.workingHours || ''],
    ['Нийт сурагчийн тоо', data.schoolInfo.studentsCount || 0],
    ['Нийт багшийн тоо', data.schoolInfo.teachersCount || 0],
    ['Их дээд сургуульд элсэлт', `${data.schoolInfo.collegeAcceptanceRate || 0}%`],
    ['Синхрончлогдсон хугацаа', new Date().toLocaleString('mn-MN')]
  ].map(row => row.map(sanitizeCell));

  // 7. Categories rows (Sub-domains & Links)
  const categoriesRows: (string | number)[][] = [
    CATEGORY_HEADERS,
    ...(data.categories || []).map(cat => [
      cat.id,
      cat.name || '',
      cat.nameEn || '',
      cat.slug || '',
      cat.iconName || '',
      cat.description || '',
      cat.url || '',
      cat.target || '_blank',
      cat.badge || '',
      cat.order ?? 0,
      cat.active !== false ? 'Тийм' : 'Үгүй'
    ].map(sanitizeCell))
  ];

  // 8. Institutional Articles rows (Submenu Articles & Links)
  const articlesRows: (string | number)[][] = [
    ARTICLE_HEADERS,
    ...(await Promise.all(
      (data.institutionalArticles || []).map(async art => {
        const coverImg = await resolveImageToDriveOrSummary(art.coverImage, art.title || art.slug);
        return [
          art.id,
          art.slug || '',
          art.category || 'about',
          art.title || '',
          art.subtitle || '',
          art.iconName || '',
          coverImg,
          art.articleUrl || '',
          art.target || '_self',
          art.badge || '',
          art.author || '',
          art.order ?? 0,
          art.content || ''
        ].map(sanitizeCell);
      })
    ))
  ];

  // Clear existing content and write new
  const updatePayload = [
    { range: `'${SHEET_TAB_NAMES.INQUIRIES}'!A1:M${Math.max(inquiriesRows.length, 100)}`, values: inquiriesRows },
    { range: `'${SHEET_TAB_NAMES.NEWS}'!A1:J${Math.max(newsRows.length, 100)}`, values: newsRows },
    { range: `'${SHEET_TAB_NAMES.PROGRAMS}'!A1:F${Math.max(programsRows.length, 50)}`, values: programsRows },
    { range: `'${SHEET_TAB_NAMES.CALENDAR}'!A1:F${Math.max(calendarRows.length, 50)}`, values: calendarRows },
    { range: `'${SHEET_TAB_NAMES.SLIDES}'!A1:F${Math.max(slidesRows.length, 20)}`, values: slidesRows },
    { range: `'${SHEET_TAB_NAMES.INFO}'!A1:B${infoRows.length}`, values: infoRows },
    { range: `'${SHEET_TAB_NAMES.CATEGORIES}'!A1:K${Math.max(categoriesRows.length, 30)}`, values: categoriesRows },
    { range: `'${SHEET_TAB_NAMES.ARTICLES}'!A1:M${Math.max(articlesRows.length, 30)}`, values: articlesRows }
  ];

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: updatePayload
    })
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    handleGoogleApiResponseError(res, errorJson, 'Google Sheets рүү өгөгдөл синк хийхэд алдаа гарлаа.');
  }

  return await res.json();
}

/**
 * Loads / reads data from Google Spreadsheet (Supports authenticated API v4 and public GViz fallback)
 */
export async function loadDataFromSheet(
  accessToken: string | null | undefined,
  spreadsheetId: string
): Promise<Partial<SheetSyncData>> {
  if (!spreadsheetId) return {};

  const cleanId = spreadsheetId.trim().replace(/\/edit.*$/, '').replace(/^.*\/d\//, '');
  if (!cleanId) return {};

  const rowsByKey: Record<string, string[][]> = {};
  let existingSheetTitles: string[] = [];

  // Attempt 1: Authenticated API v4
  if (accessToken) {
    try {
      // Step A: Discover existing sheets metadata first
      const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(cleanId)}?fields=sheets.properties.title`;
      const metaRes = await fetch(metaUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      });

      if (metaRes.status === 401) {
        throw new GoogleAuthExpiredError();
      }

      if (metaRes.ok) {
        const metaData = await metaRes.json();
        existingSheetTitles = (metaData.sheets || [])
          .map((s: any) => s.properties?.title || '')
          .filter(Boolean);
      }
    } catch (metaErr: any) {
      if (metaErr instanceof GoogleAuthExpiredError || metaErr.isAuthError) throw metaErr;
      console.warn('Metadata discovery notice in loadDataFromSheet:', metaErr);
    }

    // Step B: Match each entity to actual existing sheets
    const findMatchingTitle = (pattern: RegExp, defaultName: string): string | null => {
      if (existingSheetTitles.length === 0) return defaultName;
      // 1. Exact match
      const exact = existingSheetTitles.find(t => t.trim().toLowerCase() === defaultName.toLowerCase());
      if (exact) return exact;
      // 2. Pattern match
      const matched = existingSheetTitles.find(t => pattern.test(t));
      if (matched) return matched;
      return null;
    };

    const sheetTargets = [
      { key: 'news', pattern: /мэдээ|news/i, defaultName: SHEET_TAB_NAMES.NEWS },
      { key: 'programs', pattern: /хөтөлбөр|програм|program/i, defaultName: SHEET_TAB_NAMES.PROGRAMS },
      { key: 'calendar', pattern: /календар|хуанли|calendar/i, defaultName: SHEET_TAB_NAMES.CALENDAR },
      { key: 'info', pattern: /танилцуулга|мэдээлэл|сургууль|info/i, defaultName: SHEET_TAB_NAMES.INFO },
      { key: 'slides', pattern: /слайд|баатар|slide/i, defaultName: SHEET_TAB_NAMES.SLIDES },
      { key: 'categories', pattern: /sub|домайн|портал|систем|холбоос/i, defaultName: SHEET_TAB_NAMES.CATEGORIES },
      { key: 'articles', pattern: /дэд|нийтлэл|цэс|article/i, defaultName: SHEET_TAB_NAMES.ARTICLES },
      { key: 'inquiries', pattern: /хүсэлт|элсэлт|бүртгэл|inquir/i, defaultName: SHEET_TAB_NAMES.INQUIRIES }
    ];

    const matchedTargets = sheetTargets
      .map(st => ({ key: st.key, title: findMatchingTitle(st.pattern, st.defaultName) }))
      .filter(item => Boolean(item.title)) as { key: string; title: string }[];

    // Step C: Batch query only the sheets that actually exist
    if (matchedTargets.length > 0) {
      try {
        const ranges = matchedTargets.map(t => `'${t.title}'!A1:Z`);
        const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(cleanId)}/values:batchGet?${ranges.map(r => `ranges=${encodeURIComponent(r)}`).join('&')}`;

        const batchRes = await fetch(batchUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
          }
        });

        if (batchRes.status === 401) {
          throw new GoogleAuthExpiredError();
        }

        if (batchRes.ok) {
          const result = await batchRes.json();
          (result.valueRanges || []).forEach((vr: any, idx: number) => {
            const key = matchedTargets[idx]?.key;
            if (key && vr.values) {
              rowsByKey[key] = vr.values;
            }
          });
        }
      } catch (batchErr: any) {
        if (batchErr instanceof GoogleAuthExpiredError || batchErr.isAuthError) throw batchErr;
        console.warn('batchGet notice in loadDataFromSheet:', batchErr);
      }

      // Step D: Individual sheet fallback for any missing sheet
      for (const target of matchedTargets) {
        if (rowsByKey[target.key]) continue;
        try {
          const singleUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(cleanId)}/values/'${encodeURIComponent(target.title)}'!A1:Z`;
          const sRes = await fetch(singleUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json'
            }
          });
          if (sRes.ok) {
            const sJson = await sRes.json();
            if (sJson.values) rowsByKey[target.key] = sJson.values;
          }
        } catch {}
      }
    }
  }

  // Attempt 2: Public GViz endpoint fallback if rowsByKey is still empty
  if (Object.keys(rowsByKey).length === 0) {
    const fallbackTabs = [
      { key: 'news', title: SHEET_TAB_NAMES.NEWS },
      { key: 'programs', title: SHEET_TAB_NAMES.PROGRAMS },
      { key: 'calendar', title: SHEET_TAB_NAMES.CALENDAR },
      { key: 'info', title: SHEET_TAB_NAMES.INFO },
      { key: 'slides', title: SHEET_TAB_NAMES.SLIDES },
      { key: 'categories', title: SHEET_TAB_NAMES.CATEGORIES },
      { key: 'articles', title: SHEET_TAB_NAMES.ARTICLES }
    ];

    await Promise.all(
      fallbackTabs.map(async tab => {
        try {
          const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(cleanId)}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tab.title)}`;
          const res = await fetch(url);
          if (!res.ok) return;
          const text = await res.text();
          const jsonMatch = text.match(/setResponse\(([\s\S]*)\);/);
          if (!jsonMatch || !jsonMatch[1]) return;
          const json = JSON.parse(jsonMatch[1]);
          const rows = json.table?.rows || [];
          const values: string[][] = rows.map((r: any) =>
            (r.c || []).map((cell: any) =>
              cell?.v !== undefined && cell?.v !== null ? String(cell.v) : ''
            )
          );
          if (values.length > 0) {
            rowsByKey[tab.key] = values;
          }
        } catch {}
      })
    );
  }

  // Helper to filter out headers and empty rows
  const filterDataRows = (rows: string[][] | undefined, headerMarkers: string[]): string[][] => {
    if (!rows || rows.length === 0) return [];
    return rows.filter((row, idx) => {
      if (!row || row.length === 0) return false;
      const isAllBlank = row.every(cell => String(cell || '').trim() === '');
      if (isAllBlank) return false;

      // Filter header row at index 0
      if (idx === 0) {
        const c0 = String(row[0] || '').trim().toUpperCase();
        const c1 = String(row[1] || '').trim();
        if (c0 === 'ID' || headerMarkers.some(m => c0.includes(m) || c1.includes(m))) {
          return false;
        }
      }
      return true;
    });
  };

  const parsedData: Partial<SheetSyncData> = {};

  // 1. News
  const newsRows = filterDataRows(rowsByKey.news, ['Гарчиг', 'Title', 'Нэр']);
  if (newsRows.length > 0) {
    parsedData.news = newsRows.map((row, idx) => {
      const id = row[0] && row[0].trim() !== '' ? row[0].trim() : `news-sheet-${idx + 1}`;
      const title = row[1] && row[1].trim() !== '' ? row[1].trim() : `Мэдээ ${idx + 1}`;
      const catName = row[2] && row[2].trim() !== '' ? row[2].trim() : 'Мэдээ, мэдээлэл';

      let catSlug = 'news-info';
      if (/онцлох|featured/i.test(catName)) catSlug = 'featured';
      else if (/амжилт|achievement/i.test(catName)) catSlug = 'achievements';
      else if (/зарлал|announcement/i.test(catName)) catSlug = 'announcements';
      else if (/зөвлөгөө|advice|tip/i.test(catName)) catSlug = 'parent-tips';
      else if (/сургалт|training|event/i.test(catName)) catSlug = 'events';

      const dateStr = row[3] && row[3].trim() !== '' ? row[3].trim() : new Date().toISOString().slice(0, 10);
      const author = row[4] && row[4].trim() !== '' ? row[4].trim() : 'Админ';
      const views = Number(row[5]) || 0;
      const mainImg = formatGoogleDriveImageUrl(row[6] || '');
      const excerpt = row[7] || '';
      const fullContent = row[8] || excerpt || '';

      let images: string[] = [];
      if (row[9]) {
        try {
          const parsed = JSON.parse(row[9]);
          if (Array.isArray(parsed)) {
            images = parsed.map(formatGoogleDriveImageUrl).filter(Boolean);
          }
        } catch {
          images = row[9].split(',').map(s => formatGoogleDriveImageUrl(s.trim())).filter(Boolean);
        }
      }
      if (images.length === 0 && mainImg) {
        images = [mainImg];
      }

      const slug = title.toLowerCase().replace(/[^a-zA-Z0-9\u0400-\u04FF]+/g, '-').slice(0, 60);

      return {
        id,
        title,
        slug: slug || `news-${idx + 1}`,
        categorySlug: catSlug,
        categoryName: catName,
        date: dateStr,
        author,
        views,
        imageUrl: mainImg || images[0] || '',
        images,
        excerpt: excerpt || fullContent.slice(0, 200),
        content: fullContent,
        featured: catSlug === 'featured',
        createdAt: new Date().toISOString()
      };
    });
  }

  // 2. Categories (Sub-domains)
  const catRows = filterDataRows(rowsByKey.categories, ['Систем', 'Нэр', 'Name', 'Slug']);
  if (catRows.length > 0) {
    parsedData.categories = catRows.map((row, idx) => ({
      id: row[0] && row[0].trim() !== '' ? row[0].trim() : `cat-sheet-${idx + 1}`,
      name: row[1] || `Систем ${idx + 1}`,
      nameEn: row[2] || '',
      slug: row[3] || `subdomain-${idx + 1}`,
      iconName: row[4] || 'Database',
      description: row[5] || '',
      url: row[6] || '',
      target: (row[7] === '_self' ? '_self' : '_blank') as '_self' | '_blank',
      badge: row[8] || '',
      order: Number(row[9]) || (idx + 1),
      active: row[10] === 'Тийм' || row[10] === 'true' || row[10] === 'TRUE' || !row[10]
    }));
  }

  // 3. Institutional Articles
  const artRows = filterDataRows(rowsByKey.articles, ['Нийтлэл', 'Slug', 'Гарчиг']);
  if (artRows.length > 0) {
    parsedData.institutionalArticles = artRows.map((row, idx) => ({
      id: row[0] && row[0].trim() !== '' ? row[0].trim() : `art-sheet-${idx + 1}`,
      slug: row[1] || `article-${idx + 1}`,
      category: (row[2] === 'education' ? 'education' : 'about') as 'about' | 'education',
      title: row[3] || `Нийтлэл ${idx + 1}`,
      subtitle: row[4] || '',
      iconName: row[5] || 'BookOpen',
      coverImage: formatGoogleDriveImageUrl(row[6] || ''),
      articleUrl: row[7] || '',
      target: (row[8] === '_blank' ? '_blank' : '_self') as '_self' | '_blank',
      badge: row[9] || '',
      author: row[10] || 'Сургуулийн захиргаа',
      order: Number(row[11]) || (idx + 1),
      content: row[12] || '',
      updatedAt: new Date().toISOString()
    }));
  }

  // 4. Programs
  const progRows = filterDataRows(rowsByKey.programs, ['Хөтөлбөр', 'Нэр']);
  if (progRows.length > 0) {
    parsedData.programs = progRows.map((row, idx) => ({
      id: row[0] && row[0].trim() !== '' ? row[0].trim() : `prog-sheet-${idx + 1}`,
      title: row[1] || 'Хөтөлбөр',
      subtitle: row[3] || '',
      categorySlug: 'primary',
      categoryName: row[2] || 'Бага боловсрол',
      ageRange: row[3] || 'Бүх нас',
      imageUrl: formatGoogleDriveImageUrl(row[4] || ''),
      tags: [],
      description: row[5] || '',
      features: [],
      order: idx,
      createdAt: new Date().toISOString()
    }));
  }

  // 5. Calendar
  const calRows = filterDataRows(rowsByKey.calendar, ['Сар', 'Хугацаа', 'Огноо']);
  if (calRows.length > 0) {
    parsedData.calendarEvents = calRows.map((row, idx) => ({
      id: row[0] && row[0].trim() !== '' ? row[0].trim() : `cal-sheet-${idx + 1}`,
      month: row[1] || '',
      monthName: row[1] || '',
      day: '1',
      dateRange: row[2] || '',
      title: row[3] || '',
      targetGroup: row[4] || 'Нийт сурагчид',
      category: 'event',
      categoryName: row[5] || 'Сургуулийн арга хэмжээ'
    }));
  }

  // 6. Hero Slides
  const slideRows = filterDataRows(rowsByKey.slides, ['Гарчиг', 'Title']);
  if (slideRows.length > 0) {
    parsedData.heroSlides = slideRows.map((row, idx) => ({
      id: row[0] && row[0].trim() !== '' ? row[0].trim() : `slide-sheet-${idx + 1}`,
      title: row[1] || '',
      subtitle: row[2] || '',
      buttonText: row[3] || '',
      buttonLink: row[4] || '',
      imageUrl: formatGoogleDriveImageUrl(row[5] || ''),
      active: true,
      order: idx
    }));
  }

  // 7. School Info
  const infoRows = rowsByKey.info || [];
  if (infoRows.length > 0) {
    const infoMap: Record<string, string> = {};
    for (const row of infoRows) {
      if (row[0]) infoMap[String(row[0]).trim()] = String(row[1] || '').trim();
    }
    parsedData.schoolInfo = {
      ...(infoMap['Нэр'] ? { name: infoMap['Нэр'] } : {}),
      ...(infoMap['Уриа үг'] ? { motto: infoMap['Уриа үг'] } : {}),
      ...(infoMap['Утас'] ? { phone: infoMap['Утас'] } : {}),
      ...(infoMap['Имэйл'] ? { email: infoMap['Имэйл'] } : {}),
      ...(infoMap['Хаяг'] ? { address: infoMap['Хаяг'] } : {}),
      ...(infoMap['Лого'] ? { logoUrl: formatGoogleDriveImageUrl(infoMap['Лого']) } : {}),
      ...(infoMap['Ажиллах цаг'] ? { workingHours: infoMap['Ажиллах цаг'] } : {}),
      ...(infoMap['Нийт сурагчийн тоо'] ? { studentsCount: Number(infoMap['Нийт сурагчийн тоо']) } : {}),
      ...(infoMap['Нийт багшийн тоо'] ? { teachersCount: Number(infoMap['Нийт багшийн тоо']) } : {})
    } as any;
  }

  return parsedData;
}
