import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  CategoryItem,
  HeroSlide,
  SchoolProgram,
  NewsArticle,
  SchoolInfo,
  AdmissionInquiry,
  SectionTexts,
  CalendarEvent,
  InstitutionalArticle,
  FeedbackEmailSetting,
  SmtpConfig
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_HERO_SLIDES,
  INITIAL_PROGRAMS,
  INITIAL_NEWS,
  INITIAL_SCHOOL_INFO,
  INITIAL_INQUIRIES,
  INITIAL_SECTION_TEXTS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_INSTITUTIONAL_ARTICLES,
  DEFAULT_FEEDBACK_EMAIL_SETTINGS,
  DEFAULT_SMTP_CONFIG
} from '../data/initialData';
import { FALLBACK_IMAGE_URL } from '../components/Admin/ImagePresetPicker';
import { initAuth, googleSignIn, logoutGoogle, getAccessToken, invalidateAccessToken, trySilentTokenRefresh } from '../lib/firebase';
import { formatGoogleDriveImageUrl } from '../lib/googleDrive';
import {
  createSchoolSpreadsheet,
  appendInquiryToSheet,
  syncAllDataToSheet,
  loadDataFromSheet,
  getSpreadsheetDetails,
  SheetSyncData,
  GoogleAuthExpiredError
} from '../lib/googleSheets';

interface SchoolContextType {
  // State
  categories: CategoryItem[];
  heroSlides: HeroSlide[];
  programs: SchoolProgram[];
  news: NewsArticle[];
  schoolInfo: SchoolInfo;
  sectionTexts: SectionTexts;
  inquiries: AdmissionInquiry[];
  calendarEvents: CalendarEvent[];
  institutionalArticles: InstitutionalArticle[];
  activeCategory: string | 'all';
  selectedProgramModal: SchoolProgram | null;
  selectedNewsModal: NewsArticle | null;
  selectedArticleModal: InstitutionalArticle | null;
  isAdmissionModalOpen: boolean;
  isAdminOpen: boolean;
  isAdminLoginModalOpen: boolean;
  isAdminAuthenticated: boolean;
  adminUsername: string;
  adminEmail: string;
  searchQuery: string;
  isInitialLoading: boolean;
  isDedicatedNewsView: boolean;
  isProgramsPortalView: boolean;

  // Google Sheets Integration State
  googleUser: User | null;
  googleToken: string | null;
  isGoogleConnected: boolean;
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  isSheetsSyncing: boolean;
  lastSheetsSyncTime: string | null;
  autoSyncToSheets: boolean;

  // Google Sheets Actions
  loginWithGoogle: () => Promise<{ success: boolean; user?: User; error?: string; cancelled?: boolean; isUnauthorizedDomain?: boolean }>;
  logoutFromGoogle: () => Promise<void>;
  updateSpreadsheetId: (id: string) => Promise<{ success: boolean; title?: string; message: string }>;
  setAutoSyncToSheets: (val: boolean) => void;
  createNewSchoolSpreadsheet: () => Promise<{ success: boolean; spreadsheetId?: string; url?: string; message: string; isAuthExpired?: boolean }>;
  syncAllToGoogleSheets: () => Promise<{ success: boolean; message: string; isAuthExpired?: boolean }>;
  syncToSheetsWithData: (customData?: Partial<SheetSyncData>) => Promise<{ success: boolean; message: string; notConnected?: boolean; isAuthExpired?: boolean }>;
  loadAllFromGoogleSheets: () => Promise<{ success: boolean; message: string }>;

  // Setters & Triggers
  setIsDedicatedNewsView: (val: boolean) => void;
  setIsProgramsPortalView: (val: boolean) => void;
  openProgramsPortal: (categorySlugOrAll?: string) => void;
  setActiveCategory: (categorySlug: string | 'all') => void;
  setSelectedProgramModal: (program: SchoolProgram | null) => void;
  setSelectedNewsModal: (article: NewsArticle | null) => void;
  openNewsArticle: (articleOrId: NewsArticle | string) => void;
  closeNewsModal: () => void;
  setSelectedArticleModal: (article: InstitutionalArticle | null) => void;
  openArticleBySlug: (slug: string) => void;
  setIsAdmissionModalOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  openAdmin: () => void;
  setSearchQuery: (query: string) => void;

  // Institutional Articles CRUD
  addInstitutionalArticle: (article: Omit<InstitutionalArticle, 'id'>) => void;
  updateInstitutionalArticle: (id: string, updated: Partial<InstitutionalArticle>) => void;
  deleteInstitutionalArticle: (id: string) => void;

  // Authentication
  loginAdmin: (username: string, pass: string) => { success: boolean; message?: string };
  logoutAdmin: () => void;
  updateAdminCredentials: (oldPass: string, newPass: string, newUsername?: string, newEmail?: string) => { success: boolean; message: string };
  updateAdminProfile: (username: string, email: string) => Promise<{ success: boolean; message: string }>;

  // News CRUD
  addNewsArticle: (article: Omit<NewsArticle, 'id' | 'createdAt' | 'views'>) => void;
  updateNewsArticle: (id: string, updated: Partial<NewsArticle>) => void;
  deleteNewsArticle: (id: string) => void;

  // Programs CRUD
  addProgram: (program: Omit<SchoolProgram, 'id' | 'createdAt'>) => void;
  updateProgram: (id: string, updated: Partial<SchoolProgram>) => void;
  deleteProgram: (id: string) => void;

  // Hero Slides CRUD
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  updateHeroSlide: (id: string, updated: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;

  // Categories CRUD
  addCategory: (category: Omit<CategoryItem, 'id'>) => void;
  updateCategory: (id: string, updated: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;

  // School Info & Section Texts
  updateSchoolInfo: (info: Partial<SchoolInfo>) => void;
  updateSectionTexts: (texts: Partial<SectionTexts>) => void;

  // Admission & Inquiries
  submitAdmissionInquiry: (inquiry: Omit<AdmissionInquiry, 'id' | 'createdAt' | 'status'>) => Promise<any>;
  updateInquiryStatus: (id: string, status: AdmissionInquiry['status']) => void;
  deleteInquiry: (id: string) => void;
  feedbackEmailSettings: FeedbackEmailSetting[];
  updateFeedbackEmailSettings: (settings: FeedbackEmailSetting[]) => Promise<void>;
  updateFeedbackTabEmail: (tabKey: string, updated: Partial<FeedbackEmailSetting>) => Promise<void>;
  smtpConfig: SmtpConfig;
  updateSmtpConfig: (config: SmtpConfig) => Promise<void>;
  sendDirectEmail: (data: any) => Promise<{ success: boolean; method: string; message: string; error?: string }>;

  // Academic Calendar Plan CRUD
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updated: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Backup & Reset
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CATEGORIES: 'school_categories_v4',
  SLIDES: 'school_slides_v4',
  PROGRAMS: 'school_programs_v4',
  NEWS: 'school_news_v4',
  INFO: 'school_info_v4',
  SECTION_TEXTS: 'school_section_texts_v4',
  INQUIRIES: 'school_inquiries_v4',
  CALENDAR: 'school_calendar_events_v4',
  INSTITUTIONAL_ARTICLES: 'school_institutional_articles_v4',
  FEEDBACK_EMAILS: 'school_feedback_emails_v4',
  SMTP_CONFIG: 'school_smtp_config_v4',
  ADMIN_AUTH: 'school_admin_auth_v1',
  ADMIN_USER: 'school_admin_username_v1',
  ADMIN_EMAIL: 'school_admin_email_v1',
  ADMIN_PASS: 'school_admin_password_v1',
  SPREADSHEET_ID: 'school_google_spreadsheet_id_v1',
  SPREADSHEET_TITLE: 'school_google_spreadsheet_title_v1',
  LAST_SHEETS_SYNC: 'school_last_sheets_sync_v1',
  AUTO_SHEETS_SYNC: 'school_auto_sheets_sync_v1'
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(false);

  // Google Sheets state
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isSheetsSyncing, setIsSheetsSyncing] = useState<boolean>(false);

  const [spreadsheetId, setSpreadsheetIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SPREADSHEET_ID) || '';
  });

  const [spreadsheetTitle, setSpreadsheetTitle] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SPREADSHEET_TITLE) || 'Эрдмийн Далай Цогцолбор Сургууль - Хүснэгт';
  });

  const [lastSheetsSyncTime, setLastSheetsSyncTime] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.LAST_SHEETS_SYNC);
  });

  const [autoSyncToSheets, setAutoSyncToSheetsState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTO_SHEETS_SYNC) !== 'false';
  });

  const isGoogleConnected = Boolean(googleUser && googleToken);
  const spreadsheetUrl = spreadsheetId
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
    : '';

  // Initialize Auth state listener
  useEffect(() => {
    const unsub = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Load initial states from localStorage with default fallbacks
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_CATEGORIES;
  });

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SLIDES);
    return saved ? JSON.parse(saved) : INITIAL_HERO_SLIDES;
  });

  const [programs, setPrograms] = useState<SchoolProgram[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [institutionalArticles, setInstitutionalArticles] = useState<InstitutionalArticle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INSTITUTIONAL_ARTICLES);
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONAL_ARTICLES;
  });

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INFO);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.defaultNewsImageUrl || parsed.defaultNewsImageUrl.includes('photo-1523240795612-9a054b0db644')) {
          parsed.defaultNewsImageUrl = FALLBACK_IMAGE_URL;
        }
        return parsed;
      } catch (e) {}
    }
    return INITIAL_SCHOOL_INFO;
  });

  const [sectionTexts, setSectionTexts] = useState<SectionTexts>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SECTION_TEXTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_SECTION_TEXTS;
  });

  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return INITIAL_INQUIRIES;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_CALENDAR_EVENTS;
  });

  const [feedbackEmailSettings, setFeedbackEmailSettings] = useState<FeedbackEmailSetting[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK_EMAILS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return DEFAULT_FEEDBACK_EMAIL_SETTINGS.map(def => {
            const found = parsed.find((item: any) =>
              item.tabKey === def.tabKey ||
              (def.tabKey === 'risk' && item.tabKey === 'complaint') ||
              (def.tabKey === 'bullying' && item.tabKey === 'admission')
            );
            return found ? { ...def, ...found, tabKey: def.tabKey } : def;
          });
        }
      } catch (e) {}
    }
    return DEFAULT_FEEDBACK_EMAIL_SETTINGS;
  });

  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SMTP_CONFIG);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_SMTP_CONFIG, ...parsed };
        }
      } catch (e) {}
    }
    return DEFAULT_SMTP_CONFIG;
  });

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  const [adminUsername, setAdminUsername] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_USER) || 'admin';
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_EMAIL) || 'jvkhln1@gmail.com';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || 'admin123';
  });

  // UI States
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [selectedProgramModal, setSelectedProgramModal] = useState<SchoolProgram | null>(null);
  const [selectedNewsModal, setSelectedNewsModal] = useState<NewsArticle | null>(null);
  const [selectedArticleModal, setSelectedArticleModal] = useState<InstitutionalArticle | null>(null);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDedicatedNewsView, setIsDedicatedNewsView] = useState(false);
  const [isProgramsPortalView, setIsProgramsPortalView] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK_EMAILS, JSON.stringify(feedbackEmailSettings));
  }, [feedbackEmailSettings]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SMTP_CONFIG, JSON.stringify(smtpConfig));
  }, [smtpConfig]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTITUTIONAL_ARTICLES, JSON.stringify(institutionalArticles));
  }, [institutionalArticles]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(heroSlides));
  }, [heroSlides]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
  }, [programs]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  }, [news]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(schoolInfo));
  }, [schoolInfo]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECTION_TEXTS, JSON.stringify(sectionTexts));
  }, [sectionTexts]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  }, [inquiries]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendarEvents));
  }, [calendarEvents]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, adminUsername);
  }, [adminUsername]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, adminEmail);
  }, [adminEmail]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, adminPassword);
  }, [adminPassword]);

  // Helper to detect Google API 401 / expired authentication credentials
  const isAuthError = (err: any): boolean => {
    if (!err) return false;
    if (err instanceof GoogleAuthExpiredError || err.isAuthError || err.statusCode === 401) return true;
    const msg = typeof err?.message === 'string' ? err.message : String(err);
    return (
      msg.includes('invalid authentication credentials') ||
      msg.includes('Invalid Credentials') ||
      msg.includes('UNAUTHENTICATED') ||
      msg.includes('OAuth 2 access token') ||
      msg.includes('401')
    );
  };

  // Debounced auto-sync to Google Sheets when enabled
  useEffect(() => {
    if (!autoSyncToSheets || !spreadsheetId || !googleToken) return;

    const timer = setTimeout(() => {
      syncAllDataToSheet(googleToken, spreadsheetId, {
        inquiries,
        news,
        programs,
        calendarEvents,
        heroSlides,
        schoolInfo,
        categories,
        institutionalArticles
      }).then(() => {
        const now = new Date().toLocaleString('mn-MN');
        setLastSheetsSyncTime(now);
        localStorage.setItem(STORAGE_KEYS.LAST_SHEETS_SYNC, now);
      }).catch(e => {
        if (isAuthError(e)) {
          setGoogleToken(null);
          invalidateAccessToken();
          console.warn('Auto-sync paused: Google credentials expired. Please re-authenticate.');
        } else {
          console.warn('Auto-sync to sheets notice:', e);
        }
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [categories, institutionalArticles, news, programs, calendarEvents, heroSlides, schoolInfo, autoSyncToSheets, spreadsheetId, googleToken]);

  // Automatic initial background fetch from Google Sheets if spreadsheetId is configured
  useEffect(() => {
    if (!spreadsheetId) return;

    let isMounted = true;
    const initialFetch = async () => {
      try {
        const token = googleToken || (await getAccessToken());
        const data = await loadDataFromSheet(token, spreadsheetId);
        if (!isMounted) return;

        if (data.news && data.news.length > 0) setNews(data.news);
        if (data.programs && data.programs.length > 0) setPrograms(data.programs);
        if (data.calendarEvents && data.calendarEvents.length > 0) setCalendarEvents(data.calendarEvents);
        if (data.heroSlides && data.heroSlides.length > 0) setHeroSlides(data.heroSlides);
        if (data.categories && data.categories.length > 0) setCategories(data.categories);
        if (data.institutionalArticles && data.institutionalArticles.length > 0) setInstitutionalArticles(data.institutionalArticles);
        if (data.schoolInfo) setSchoolInfo(prev => ({ ...prev, ...data.schoolInfo }));

        const now = new Date().toLocaleString('mn-MN');
        setLastSheetsSyncTime(now);
        localStorage.setItem(STORAGE_KEYS.LAST_SHEETS_SYNC, now);
      } catch (err) {
        console.warn('Google Sheets initial auto-load notice:', err);
      }
    };

    initialFetch();

    return () => {
      isMounted = false;
    };
  }, [spreadsheetId, googleToken]);

  // Google Sheets Handlers
  const loginWithGoogle = async () => {
    try {
      const result = await googleSignIn();
      if (!result || result.cancelled) {
        return { success: false, cancelled: true };
      }
      if (result.user && result.accessToken) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);

        // If spreadsheetId is saved, check details
        if (spreadsheetId) {
          try {
            const details = await getSpreadsheetDetails(result.accessToken, spreadsheetId);
            setSpreadsheetTitle(details.title);
          } catch (e) {
            console.warn('Could not fetch existing sheet title', e);
          }
        }
        return { success: true, user: result.user };
      }
      return { success: false, error: 'Нэвтрэлт цуцлагдсан', cancelled: true };
    } catch (err: any) {
      const isCancelled =
        err?.code === 'auth/cancelled-popup-request' ||
        err?.code === 'auth/popup-closed-by-user' ||
        err?.message?.includes('cancelled-popup-request') ||
        err?.message?.includes('popup-closed-by-user');

      if (isCancelled) {
        return { success: false, cancelled: true };
      }

      console.error('Google Sign in failed:', err);
      const isUnauthorizedDomain =
        err?.code === 'auth/unauthorized-domain' ||
        err?.message?.includes('unauthorized-domain');

      return {
        success: false,
        isUnauthorizedDomain,
        error: isUnauthorizedDomain
          ? `Энэ домэйн (${typeof window !== 'undefined' ? window.location.hostname : ''}) нь Firebase Authentication-д зөвшөөрөгдөөгүй байна (auth/unauthorized-domain).`
          : err.message || 'Google-ээр нэвтрэхэд алдаа гарлаа'
      };
    }
  };

  const logoutFromGoogle = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setGoogleToken(null);
  };

  const setAutoSyncToSheets = (val: boolean) => {
    setAutoSyncToSheetsState(val);
    localStorage.setItem(STORAGE_KEYS.AUTO_SHEETS_SYNC, String(val));
  };

  const updateSpreadsheetId = async (id: string) => {
    const trimmed = id.trim();
    // Extract ID if full URL was provided
    let extractedId = trimmed;
    const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      extractedId = match[1];
    }

    setSpreadsheetIdState(extractedId);
    localStorage.setItem(STORAGE_KEYS.SPREADSHEET_ID, extractedId);

    if (!extractedId) {
      return { success: true, message: 'Google Sheets ID цэвэрлэгдлээ.' };
    }

    const token = googleToken || (await getAccessToken());
    if (token) {
      try {
        const details = await getSpreadsheetDetails(token, extractedId);
        setSpreadsheetTitle(details.title);
        localStorage.setItem(STORAGE_KEYS.SPREADSHEET_TITLE, details.title);
        return { success: true, title: details.title, message: `Хүснэгт амжилттай холбогдлоо: "${details.title}"` };
      } catch (err: any) {
        return { success: false, message: `Хүснэгтийн эрх шалгахад алдаа: ${err.message}` };
      }
    }

    return { success: true, message: 'Google Sheets ID хадгалагдлаа. (Google-ээр нэвтэрч эрхээ шалгана уу)' };
  };

  const createNewSchoolSpreadsheet = async () => {
    const token = googleToken || (await getAccessToken());
    if (!token) {
      return {
        success: false,
        message: 'Google Sheets үүсгэхийн тулд эхлээд "Sign in with Google" товчоор нэвтэрнэ үү.'
      };
    }

    setIsSheetsSyncing(true);
    try {
      const res = await createSchoolSpreadsheet(token, schoolInfo.name || 'Эрдмийн Далай Цогцолбор Сургууль');
      setSpreadsheetIdState(res.spreadsheetId);
      setSpreadsheetTitle(res.title);
      localStorage.setItem(STORAGE_KEYS.SPREADSHEET_ID, res.spreadsheetId);
      localStorage.setItem(STORAGE_KEYS.SPREADSHEET_TITLE, res.title);

      // Immediately sync current data
      await syncAllDataToSheet(token, res.spreadsheetId, {
        inquiries,
        news,
        programs,
        calendarEvents,
        heroSlides,
        schoolInfo,
        categories,
        institutionalArticles
      });

      const now = new Date().toLocaleString('mn-MN');
      setLastSheetsSyncTime(now);
      localStorage.setItem(STORAGE_KEYS.LAST_SHEETS_SYNC, now);

      return {
        success: true,
        spreadsheetId: res.spreadsheetId,
        url: res.url,
        message: `Google Sheets хүснэгт амжилттай үүсэж, бүх өгөгдөл хуулагдлаа!`
      };
    } catch (err: any) {
      if (isAuthError(err)) {
        setGoogleToken(null);
        invalidateAccessToken();
        console.warn('Create sheet notice (Google credentials expired):', err?.message || err);
        return {
          success: false,
          isAuthExpired: true,
          message: 'Google хандалтын эрхийн хугацаа дууссан байна. "Google-ээр холбогдох" товчоор дахин нэвтэрнэ үү.'
        };
      }
      console.warn('Create sheet notice:', err);
      return { success: false, message: err?.message || 'Хүснэгт үүсгэхэд алдаа гарлаа' };
    } finally {
      setIsSheetsSyncing(false);
    }
  };

  const syncAllToGoogleSheets = async () => {
    let token = googleToken || (await getAccessToken());
    if (!token) {
      return {
        success: false,
        isAuthExpired: true,
        message: 'Google Sheets рүү илгээхийн тулд "Google-ээр холбогдох" товчоор нэвтэрнэ үү.'
      };
    }

    let targetSheetId = spreadsheetId;
    if (!targetSheetId) {
      // Auto create if not exist
      const createRes = await createNewSchoolSpreadsheet();
      if (!createRes.success || !createRes.spreadsheetId) {
        return { success: false, message: createRes.message };
      }
      targetSheetId = createRes.spreadsheetId;
    }

    setIsSheetsSyncing(true);
    try {
      await syncAllDataToSheet(token, targetSheetId, {
        inquiries,
        news,
        programs,
        calendarEvents,
        heroSlides,
        schoolInfo,
        categories,
        institutionalArticles
      });

      const now = new Date().toLocaleString('mn-MN');
      setLastSheetsSyncTime(now);
      localStorage.setItem(STORAGE_KEYS.LAST_SHEETS_SYNC, now);

      return {
        success: true,
        message: 'Сургуулийн бүх мэдээлэл (хүсэлт, мэдээ, хөтөлбөр, хуанли, слайдер, танилцуулга, дэд цэсийн нийтлэл, sub-домайн холбоосууд) Google Sheets хүснэгтэд амжилттай хадгалагдлаа!'
      };
    } catch (err: any) {
      if (isAuthError(err)) {
        // Attempt silent token refresh
        try {
          const silentRes = await trySilentTokenRefresh();
          if (silentRes?.accessToken) {
            setGoogleToken(silentRes.accessToken);
            if (silentRes.user) setGoogleUser(silentRes.user);
            await syncAllDataToSheet(silentRes.accessToken, targetSheetId, {
              inquiries,
              news,
              programs,
              calendarEvents,
              heroSlides,
              schoolInfo,
              categories,
              institutionalArticles
            });
            const now = new Date().toLocaleString('mn-MN');
            setLastSheetsSyncTime(now);
            localStorage.setItem(STORAGE_KEYS.LAST_SHEETS_SYNC, now);
            return {
              success: true,
              message: 'Google Sheets хүснэгтэд амжилттай хадгалагдлаа!'
            };
          }
        } catch (silentErr) {
          console.warn('Silent refresh attempt notice:', silentErr);
        }

        setGoogleToken(null);
        invalidateAccessToken();
        console.warn('Sync to sheets auth notice (credentials expired):', err?.message || err);
        return {
          success: false,
          isAuthExpired: true,
          message: 'Google хандалтын эрхийн хугацаа дууссан байна. "Google-ээр холбогдох" товчоор дахин нэвтэрнэ үү.'
        };
      }
      console.warn('Sync to sheets notice:', err);
      return { success: false, message: err?.message || 'Google Sheets рүү синк хийхэд алдаа гарлаа' };
    } finally {
      setIsSheetsSyncing(false);
    }
  };

  const syncToSheetsWithData = async (customData?: Partial<SheetSyncData>) => {
    let token = googleToken || (await getAccessToken());
    if (!token) {
      return {
        success: false,
        notConnected: true,
        isAuthExpired: true,
        message: 'Google Sheets рүү шууд хадгалахын тулд "Google-ээр холбогдох" товчоор нэвтэрнэ үү.'
      };
    }

    const targetSheetId = spreadsheetId;
    if (!targetSheetId) {
      return {
        success: false,
        message: 'Google Sheets ID тохируулаагүй байна.'
      };
    }

    setIsSheetsSyncing(true);
    try {
      await syncAllDataToSheet(token, targetSheetId, {
        inquiries,
        news,
        programs,
        calendarEvents,
        heroSlides,
        schoolInfo,
        categories,
        institutionalArticles,
        ...(customData || {})
      });

      const now = new Date().toLocaleString('mn-MN');
      setLastSheetsSyncTime(now);
      localStorage.setItem(STORAGE_KEYS.LAST_SHEETS_SYNC, now);

      return {
        success: true,
        message: 'Google Sheets баазад амжилттай хадгалагдлаа!'
      };
    } catch (err: any) {
      if (isAuthError(err)) {
        // Attempt silent token refresh
        try {
          const silentRes = await trySilentTokenRefresh();
          if (silentRes?.accessToken) {
            setGoogleToken(silentRes.accessToken);
            if (silentRes.user) setGoogleUser(silentRes.user);
            await syncAllDataToSheet(silentRes.accessToken, targetSheetId, {
              inquiries,
              news,
              programs,
              calendarEvents,
              heroSlides,
              schoolInfo,
              categories,
              institutionalArticles,
              ...(customData || {})
            });
            const now = new Date().toLocaleString('mn-MN');
            setLastSheetsSyncTime(now);
            localStorage.setItem(STORAGE_KEYS.LAST_SHEETS_SYNC, now);
            return {
              success: true,
              message: 'Google Sheets баазад амжилттай хадгалагдлаа!'
            };
          }
        } catch (silentErr) {
          console.warn('Silent refresh attempt notice:', silentErr);
        }

        setGoogleToken(null);
        invalidateAccessToken();
        console.warn('Save to sheets auth notice (credentials expired):', err?.message || err);
        return {
          success: false,
          isAuthExpired: true,
          message: 'Google хандалтын эрхийн хугацаа дууссан байна. "Google-ээр холбогдох" товчоор дахин нэвтэрнэ үү.'
        };
      }
      console.warn('Save to sheets notice:', err);
      return { success: false, message: err?.message || 'Google Sheets хадгалалт амжилтгүй боллоо' };
    } finally {
      setIsSheetsSyncing(false);
    }
  };

  const loadAllFromGoogleSheets = async () => {
    const token = googleToken || (await getAccessToken());
    if (!spreadsheetId) {
      return { success: false, message: 'Google Sheets ID тохируулаагүй байна.' };
    }

    setIsSheetsSyncing(true);
    try {
      const data = await loadDataFromSheet(token, spreadsheetId);
      let count = 0;
      if (data.news && data.news.length > 0) { setNews(data.news); count += data.news.length; }
      if (data.programs && data.programs.length > 0) { setPrograms(data.programs); count += data.programs.length; }
      if (data.calendarEvents && data.calendarEvents.length > 0) { setCalendarEvents(data.calendarEvents); count += data.calendarEvents.length; }
      if (data.heroSlides && data.heroSlides.length > 0) { setHeroSlides(data.heroSlides); count += data.heroSlides.length; }
      if (data.categories && data.categories.length > 0) { setCategories(data.categories); count += data.categories.length; }
      if (data.institutionalArticles && data.institutionalArticles.length > 0) { setInstitutionalArticles(data.institutionalArticles); count += data.institutionalArticles.length; }
      if (data.schoolInfo) setSchoolInfo(prev => ({ ...prev, ...data.schoolInfo }));

      const now = new Date().toLocaleString('mn-MN');
      setLastSheetsSyncTime(now);
      localStorage.setItem(STORAGE_KEYS.LAST_SHEETS_SYNC, now);

      return {
        success: true,
        message: `Google Sheets хүснэгтээс нийт ${count} өгөгдлийг амжилттай татаж вэбсайтыг шинэчиллээ!`
      };
    } catch (err: any) {
      if (isAuthError(err)) {
        setGoogleToken(null);
        invalidateAccessToken();
        console.warn('Load from sheets auth notice:', err?.message || err);
        // Fallback to loading via public GViz without token
        try {
          const fallbackData = await loadDataFromSheet(null, spreadsheetId);
          if (fallbackData.news || fallbackData.categories || fallbackData.programs) {
            if (fallbackData.news && fallbackData.news.length > 0) setNews(fallbackData.news);
            if (fallbackData.programs && fallbackData.programs.length > 0) setPrograms(fallbackData.programs);
            if (fallbackData.calendarEvents && fallbackData.calendarEvents.length > 0) setCalendarEvents(fallbackData.calendarEvents);
            if (fallbackData.heroSlides && fallbackData.heroSlides.length > 0) setHeroSlides(fallbackData.heroSlides);
            if (fallbackData.categories && fallbackData.categories.length > 0) setCategories(fallbackData.categories);
            if (fallbackData.institutionalArticles && fallbackData.institutionalArticles.length > 0) setInstitutionalArticles(fallbackData.institutionalArticles);
            if (fallbackData.schoolInfo) setSchoolInfo(prev => ({ ...prev, ...fallbackData.schoolInfo }));
            return {
              success: true,
              message: 'Google Sheets-ээс нийтийн холболтоор амжилттай уншлаа.'
            };
          }
        } catch {
          // ignore
        }
        return {
          success: false,
          message: 'Google хандалтын эрхийн хугацаа дууссан тул дахин нэвтэрнэ үү.'
        };
      }
      console.warn('Load from sheets notice:', err);
      return { success: false, message: err?.message || 'Google Sheets-ээс өгөгдөл татахад алдаа гарлаа' };
    } finally {
      setIsSheetsSyncing(false);
    }
  };

  const openProgramsPortal = (categorySlugOrAll?: string) => {
    if (categorySlugOrAll && categorySlugOrAll !== 'all') {
      setActiveCategory(categorySlugOrAll);
    }
    setIsProgramsPortalView(true);
    window.location.hash = '#programs-portal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openNewsArticle = (articleOrId: NewsArticle | string) => {
    let target: NewsArticle | undefined;
    if (typeof articleOrId === 'string') {
      target = news.find(n => n.id === articleOrId || n.slug === articleOrId) ||
               INITIAL_NEWS.find(n => n.id === articleOrId || n.slug === articleOrId);
    } else {
      target = articleOrId;
    }

    if (!target) return;

    const sessionKey = `viewed_news_${target.id}`;
    const alreadyViewed = sessionStorage.getItem(sessionKey);
    let updatedViews = target.views || 0;
    if (!alreadyViewed) {
      sessionStorage.setItem(sessionKey, 'true');
      updatedViews += 1;
      setNews(prev => prev.map(item => item.id === target!.id ? { ...item, views: updatedViews } : item));
    }

    const modalArticle = { ...target, views: updatedViews };
    setSelectedNewsModal(modalArticle);

    try {
      const newHash = `news/${target.slug || target.id}`;
      if (window.location.hash !== `#${newHash}`) {
        window.history.replaceState(null, '', `${window.location.pathname}#${newHash}`);
      }
    } catch (e) {}
  };

  const closeNewsModal = () => {
    setSelectedNewsModal(null);
    try {
      if (window.location.hash.startsWith('#news/') || window.location.hash === '#news') {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch (e) {}
  };

  // URL Hash routing
  useEffect(() => {
    const handleUrlRouting = () => {
      try {
        const hash = window.location.hash;
        const searchParams = new URLSearchParams(window.location.search);
        const queryNewsId = searchParams.get('news');

        if (queryNewsId) {
          openNewsArticle(queryNewsId);
          return;
        }

        const queryPortal = searchParams.get('portal') || searchParams.get('subdomain');
        if (queryPortal === 'programs') {
          setIsProgramsPortalView(true);
        }

        if (hash.startsWith('#news/')) {
          const newsSlugOrId = hash.replace('#news/', '').trim();
          if (newsSlugOrId) openNewsArticle(newsSlugOrId);
        } else if (hash.startsWith('#article/')) {
          const artSlugOrId = hash.replace('#article/', '').trim();
          if (artSlugOrId) {
            const foundArt = institutionalArticles.find(a => a.id === artSlugOrId || a.slug === artSlugOrId);
            if (foundArt) setSelectedArticleModal(foundArt);
          }
        } else if (hash.startsWith('#program/')) {
          const progSlugOrId = hash.replace('#program/', '').trim();
          if (progSlugOrId) {
            const foundProg = programs.find(p => p.id === progSlugOrId || p.slug === progSlugOrId);
            if (foundProg) setSelectedProgramModal(foundProg);
          }
        } else if (hash === '#programs-portal' || hash === '#programs-subdomain' || hash === '#programs-all') {
          setIsProgramsPortalView(true);
        } else if (hash === '#all-news' || hash === '#news-all') {
          setIsDedicatedNewsView(true);
        } else if (hash === '#news') {
          const el = document.getElementById('news');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === '#programs') {
          const el = document.getElementById('programs');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (e) {}
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    return () => window.removeEventListener('hashchange', handleUrlRouting);
  }, [news, programs, institutionalArticles]);

  // Authentication Handlers
  const loginAdmin = (usernameOrEmail: string, pass: string) => {
    const normalizedInput = usernameOrEmail.trim().toLowerCase();
    const currentAdminUser = adminUsername.trim().toLowerCase();
    const currentAdminEmail = adminEmail.trim().toLowerCase();

    const isUserValid =
      normalizedInput === currentAdminUser ||
      (currentAdminEmail && normalizedInput === currentAdminEmail) ||
      normalizedInput === 'admin' ||
      normalizedInput === 'admin@eds.edu.mn' ||
      normalizedInput === 'admin@school.edu.mn' ||
      normalizedInput === 'jvkhln1@gmail.com';

    if (isUserValid && pass === adminPassword) {
      setIsAdminAuthenticated(true);
      setIsAdminLoginModalOpen(false);
      setIsAdminOpen(true);
      return { success: true };
    } else {
      return { success: false, message: 'Нэвтрэх нэр/имэйл эсвэл нууц үг буруу байна!' };
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const updateAdminProfile = async (newUsername: string, newEmail: string) => {
    const trimmedUser = newUsername.trim() || adminUsername;
    const trimmedEmail = newEmail.trim();

    setAdminUsername(trimmedUser);
    setAdminEmail(trimmedEmail);
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, trimmedUser);
    localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, trimmedEmail);

    return { success: true, message: 'Админ хэрэглэгчийн нэр болон имэйл амжилттай хадгалагдлаа!' };
  };

  const updateAdminCredentials = (oldPass: string, newPass: string, newUsername?: string, newEmail?: string) => {
    if (oldPass !== adminPassword) {
      return { success: false, message: 'Одоогийн нууц үг тохирохгүй байна!' };
    }
    if (!newPass || newPass.length < 4) {
      return { success: false, message: 'Шинэ нууц үг хамгийн багадаа 4 тэмдэгттэй байх ёстой!' };
    }
    setAdminPassword(newPass);
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, newPass);

    const updatedUser = newUsername && newUsername.trim() ? newUsername.trim() : adminUsername;
    const updatedEmail = newEmail !== undefined ? newEmail.trim() : adminEmail;

    if (newUsername && newUsername.trim()) {
      setAdminUsername(updatedUser);
      localStorage.setItem(STORAGE_KEYS.ADMIN_USER, updatedUser);
    }
    if (newEmail !== undefined) {
      setAdminEmail(updatedEmail);
      localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, updatedEmail);
    }

    return { success: true, message: 'Админы мэдээлэл болон нууц үг амжилттай солигдлоо!' };
  };

  const openAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminLoginModalOpen(false);
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  // News CRUD Actions
  const addNewsArticle = (newArt: Omit<NewsArticle, 'id' | 'createdAt' | 'views'>) => {
    const newId = 'news-' + Date.now();
    const primaryImg = formatGoogleDriveImageUrl(newArt.imageUrl || (newArt.images && newArt.images[0]) || schoolInfo.defaultNewsImageUrl || FALLBACK_IMAGE_URL);
    const finalImages = Array.isArray(newArt.images) && newArt.images.length > 0 
      ? newArt.images.map(img => formatGoogleDriveImageUrl(img)) 
      : [primaryImg];

    const newItem: NewsArticle = {
      ...newArt,
      id: newId,
      imageUrl: primaryImg,
      images: finalImages,
      videoUrl: newArt.videoUrl || '',
      audioUrl: newArt.audioUrl || '',
      views: 0,
      createdAt: new Date().toISOString()
    };
    const updatedNews = [newItem, ...news];
    setNews(updatedNews);

    // Auto-save to Google Sheets database immediately
    if (spreadsheetId) {
      syncToSheetsWithData({ news: updatedNews }).catch(e => console.warn('Auto news sync notice:', e));
    }
  };

  const updateNewsArticle = (id: string, updated: Partial<NewsArticle>) => {
    const sanitizedUpdated: Partial<NewsArticle> = {
      ...updated,
      ...(updated.imageUrl ? { imageUrl: formatGoogleDriveImageUrl(updated.imageUrl) } : {}),
      ...(updated.images ? { images: updated.images.map(img => formatGoogleDriveImageUrl(img)) } : {})
    };
    const updatedNews = news.map(item => (item.id === id ? { ...item, ...sanitizedUpdated } : item));
    setNews(updatedNews);

    // Auto-save to Google Sheets database immediately
    if (spreadsheetId) {
      syncToSheetsWithData({ news: updatedNews }).catch(e => console.warn('Auto news sync notice:', e));
    }
  };

  const deleteNewsArticle = (id: string) => {
    const updatedNews = news.filter(item => item.id !== id);
    setNews(updatedNews);

    // Auto-save to Google Sheets database immediately
    if (spreadsheetId) {
      syncToSheetsWithData({ news: updatedNews }).catch(e => console.warn('Auto news sync notice:', e));
    }
  };

  // Programs CRUD Actions
  const addProgram = (newProg: Omit<SchoolProgram, 'id' | 'createdAt'>) => {
    const newId = 'prog-' + Date.now();
    const newItem: SchoolProgram = {
      ...newProg,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setPrograms(prev => [...prev, newItem]);
  };

  const updateProgram = (id: string, updated: Partial<SchoolProgram>) => {
    setPrograms(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const deleteProgram = (id: string) => {
    setPrograms(prev => prev.filter(item => item.id !== id));
  };

  // Hero Slides CRUD
  const addHeroSlide = (slide: Omit<HeroSlide, 'id'>) => {
    const newId = 'slide-' + Date.now();
    const newItem: HeroSlide = {
      ...slide,
      id: newId
    };
    setHeroSlides(prev => [...prev, newItem]);
  };

  const updateHeroSlide = (id: string, updated: Partial<HeroSlide>) => {
    setHeroSlides(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides(prev => prev.filter(item => item.id !== id));
  };

  // Categories CRUD
  const addCategory = (cat: Omit<CategoryItem, 'id'>) => {
    const newId = 'cat-' + Date.now();
    const newItem: CategoryItem = {
      ...cat,
      id: newId
    };
    const updatedCats = [...categories, newItem];
    setCategories(updatedCats);

    // Auto-save to Google Sheets database immediately
    if (spreadsheetId) {
      syncToSheetsWithData({ categories: updatedCats }).catch(e => console.warn('Auto cat sync notice:', e));
    }
  };

  const updateCategory = (id: string, updated: Partial<CategoryItem>) => {
    const updatedCats = categories.map(item => (item.id === id ? { ...item, ...updated } : item));
    setCategories(updatedCats);

    // Auto-save to Google Sheets database immediately
    if (spreadsheetId) {
      syncToSheetsWithData({ categories: updatedCats }).catch(e => console.warn('Auto cat sync notice:', e));
    }
  };

  const deleteCategory = (id: string) => {
    const updatedCats = categories.filter(item => item.id !== id);
    setCategories(updatedCats);

    // Auto-save to Google Sheets database immediately
    if (spreadsheetId) {
      syncToSheetsWithData({ categories: updatedCats }).catch(e => console.warn('Auto cat sync notice:', e));
    }
  };

  // School Info & Section Texts
  const updateSchoolInfo = (info: Partial<SchoolInfo>) => {
    setSchoolInfo(prev => ({ ...prev, ...info }));
  };

  const updateSectionTexts = (texts: Partial<SectionTexts>) => {
    setSectionTexts(prev => ({ ...prev, ...texts }));
  };

  // Admission & Feedback Direct Submission & Google Sheets dispatch
  const submitAdmissionInquiry = async (inquiryData: Omit<AdmissionInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newId = 'inq-' + Date.now();
    const newInquiry: AdmissionInquiry = {
      ...inquiryData,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    // 1. Add to local inquiries list
    setInquiries(prev => [newInquiry, ...prev]);

    // 2. If Google Sheets is connected, write to spreadsheet immediately
    let sheetAppendSuccess = false;
    const token = googleToken || (await getAccessToken());
    if (token && spreadsheetId) {
      try {
        await appendInquiryToSheet(token, spreadsheetId, newInquiry);
        sheetAppendSuccess = true;
      } catch (sheetErr) {
        console.warn('Google Sheets append notice:', sheetErr);
      }
    }

    // 3. Dispatch direct email notification to responsible staff/teacher
    const targetRecipient = feedbackEmailSettings.find(f => f.tabKey === inquiryData.type)
      || feedbackEmailSettings.find(f => f.tabKey === 'feedback')
      || DEFAULT_FEEDBACK_EMAIL_SETTINGS[0];

    const recipientEmail = (inquiryData.recipientEmail || targetRecipient?.teacherEmail || '').trim();
    const recipientName = inquiryData.recipientName || targetRecipient?.teacherName || 'Хариуцсан ажилтан';
    const recipientRole = inquiryData.recipientRole || targetRecipient?.teacherRole || 'Ажилтан';

    try {
      const emailResp = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          recipientName,
          recipientRole,
          senderName: inquiryData.name,
          studentName: inquiryData.studentName || inquiryData.name,
          senderPhone: inquiryData.phone,
          senderEmail: inquiryData.email,
          type: inquiryData.type,
          typeTitle: targetRecipient?.tabTitle || (inquiryData.type === 'risk' ? 'Эрсдлийн үнэлгээ' : inquiryData.type === 'bullying' ? 'Үе тэнгийн дээрэлхэлт' : 'Санал хүсэлт'),
          message: inquiryData.message,
          gradeLevel: inquiryData.gradeLevel,
          programInterest: inquiryData.programInterest,
          riskLevel: inquiryData.riskLevel,
          riskCategory: inquiryData.riskCategory,
          location: inquiryData.location,
          imageUrl: inquiryData.imageUrl,
          isAnonymous: inquiryData.isAnonymous,
          smtpConfig: smtpConfig?.enabled ? smtpConfig : undefined
        })
      });

      const resJson = await emailResp.json().catch(() => ({ success: true }));
      return {
        ...resJson,
        sheetRecorded: sheetAppendSuccess,
        spreadsheetUrl: spreadsheetUrl || undefined
      };
    } catch (e: any) {
      return {
        success: true,
        sheetRecorded: sheetAppendSuccess,
        spreadsheetUrl: spreadsheetUrl || undefined,
        message: 'Хүсэлт амжилттай бүртгэгдлээ.'
      };
    }
  };

  const updateSmtpConfig = async (newConfig: SmtpConfig) => {
    setSmtpConfig(newConfig);
  };

  const sendDirectEmail = async (payload: any) => {
    try {
      const resp = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          smtpConfig: smtpConfig?.enabled ? smtpConfig : payload.smtpConfig
        })
      });
      return await resp.json();
    } catch (e: any) {
      return { success: false, method: 'error', error: e.message || 'Сүлжээний алдаа' };
    }
  };

  const updateFeedbackEmailSettings = async (settings: FeedbackEmailSetting[]) => {
    setFeedbackEmailSettings(settings);
  };

  const updateFeedbackTabEmail = async (tabKey: string, updated: Partial<FeedbackEmailSetting>) => {
    const exists = feedbackEmailSettings.some(item => item.tabKey === tabKey);
    let updatedList: FeedbackEmailSetting[];
    if (exists) {
      updatedList = feedbackEmailSettings.map(item =>
        item.tabKey === tabKey ? { ...item, ...updated } : item
      );
    } else {
      const fallback = DEFAULT_FEEDBACK_EMAIL_SETTINGS.find(d => d.tabKey === tabKey) || {
        tabKey,
        tabTitle: tabKey === 'risk' ? 'Эрсдэлийн үнэлгээ' : tabKey,
        teacherName: '',
        teacherRole: '',
        teacherEmail: '',
        description: ''
      };
      updatedList = [...feedbackEmailSettings, { ...fallback, ...updated }];
    }
    await updateFeedbackEmailSettings(updatedList);
  };

  const updateInquiryStatus = (id: string, status: AdmissionInquiry['status']) => {
    setInquiries(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(item => item.id !== id));
  };

  // Academic Calendar Plan CRUD
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newId = 'cal-' + Date.now();
    const newItem: CalendarEvent = {
      ...event,
      id: newId
    };
    setCalendarEvents(prev => [...prev, newItem]);
  };

  const updateCalendarEvent = (id: string, updated: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(item => item.id !== id));
  };

  // Institutional Articles CRUD & Helpers
  const openArticleBySlug = (slug: string) => {
    const found = institutionalArticles.find(a => a.slug === slug) || INITIAL_INSTITUTIONAL_ARTICLES.find(a => a.slug === slug);
    if (found) {
      setSelectedArticleModal(found);
    }
  };

  const addInstitutionalArticle = (newArt: Omit<InstitutionalArticle, 'id'>) => {
    const newId = 'art-' + (newArt.slug || Date.now());
    const primaryCover = formatGoogleDriveImageUrl(newArt.coverImage);
    const finalImages = Array.isArray(newArt.images) && newArt.images.length > 0
      ? newArt.images.map(img => formatGoogleDriveImageUrl(img))
      : (primaryCover ? [primaryCover] : undefined);

    const newItem: InstitutionalArticle = {
      ...newArt,
      id: newId,
      coverImage: primaryCover,
      images: finalImages
    };
    const updatedArts = [...institutionalArticles, newItem];
    setInstitutionalArticles(updatedArts);

    // Auto-save to Google Sheets database immediately
    if (spreadsheetId) {
      syncToSheetsWithData({ institutionalArticles: updatedArts }).catch(e => console.warn('Auto art sync notice:', e));
    }
  };

  const updateInstitutionalArticle = (id: string, updated: Partial<InstitutionalArticle>) => {
    const sanitizedUpdated: Partial<InstitutionalArticle> = {
      ...updated,
      ...(updated.coverImage ? { coverImage: formatGoogleDriveImageUrl(updated.coverImage) } : {}),
      ...(updated.images ? { images: updated.images.map(img => formatGoogleDriveImageUrl(img)) } : {})
    };
    const updatedArts = institutionalArticles.map(item => (item.id === id ? { ...item, ...sanitizedUpdated } : item));
    setInstitutionalArticles(updatedArts);

    if (selectedArticleModal && selectedArticleModal.id === id) {
      setSelectedArticleModal(prev => (prev ? { ...prev, ...sanitizedUpdated } : null));
    }

    // Auto-save to Google Sheets database immediately
    if (spreadsheetId) {
      syncToSheetsWithData({ institutionalArticles: updatedArts }).catch(e => console.warn('Auto art sync notice:', e));
    }
  };

  const deleteInstitutionalArticle = (id: string) => {
    const updatedArts = institutionalArticles.filter(item => item.id !== id);
    setInstitutionalArticles(updatedArts);

    // Auto-save to Google Sheets database immediately
    if (spreadsheetId) {
      syncToSheetsWithData({ institutionalArticles: updatedArts }).catch(e => console.warn('Auto art sync notice:', e));
    }
  };

  // Reset & Backup
  const resetToDefaults = () => {
    setCategories(INITIAL_CATEGORIES);
    setHeroSlides(INITIAL_HERO_SLIDES);
    setPrograms(INITIAL_PROGRAMS);
    setNews(INITIAL_NEWS);
    setSchoolInfo(INITIAL_SCHOOL_INFO);
    setSectionTexts(INITIAL_SECTION_TEXTS);
    setInquiries(INITIAL_INQUIRIES);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setInstitutionalArticles(INITIAL_INSTITUTIONAL_ARTICLES);
    setFeedbackEmailSettings(DEFAULT_FEEDBACK_EMAIL_SETTINGS);
  };

  const exportDataJson = () => {
    const fullData = {
      categories,
      heroSlides,
      programs,
      news,
      schoolInfo,
      sectionTexts,
      inquiries,
      calendarEvents,
      institutionalArticles,
      feedbackEmailSettings,
      spreadsheetId,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(fullData, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.heroSlides) setHeroSlides(parsed.heroSlides);
      if (parsed.programs) setPrograms(parsed.programs);
      if (parsed.news) setNews(parsed.news);
      if (parsed.schoolInfo) setSchoolInfo(parsed.schoolInfo);
      if (parsed.sectionTexts) setSectionTexts(parsed.sectionTexts);
      if (parsed.inquiries) setInquiries(parsed.inquiries);
      if (parsed.calendarEvents) setCalendarEvents(parsed.calendarEvents);
      if (parsed.institutionalArticles) setInstitutionalArticles(parsed.institutionalArticles);
      if (parsed.feedbackEmailSettings) setFeedbackEmailSettings(parsed.feedbackEmailSettings);
      if (parsed.spreadsheetId) setSpreadsheetIdState(parsed.spreadsheetId);
      return true;
    } catch (e) {
      console.error('Failed to parse import JSON', e);
      return false;
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        categories,
        heroSlides,
        programs,
        news,
        schoolInfo,
        sectionTexts,
        inquiries,
        calendarEvents,
        institutionalArticles,
        feedbackEmailSettings,
        activeCategory,
        selectedProgramModal,
        selectedNewsModal,
        selectedArticleModal,
        isAdmissionModalOpen,
        isAdminOpen,
        isAdminLoginModalOpen,
        isAdminAuthenticated,
        adminUsername,
        adminEmail,
        searchQuery,
        isInitialLoading,
        isDedicatedNewsView,
        isProgramsPortalView,

        // Google Sheets Integration
        googleUser,
        googleToken,
        isGoogleConnected,
        spreadsheetId,
        spreadsheetTitle,
        spreadsheetUrl,
        isSheetsSyncing,
        lastSheetsSyncTime,
        autoSyncToSheets,
        loginWithGoogle,
        logoutFromGoogle,
        updateSpreadsheetId,
        setAutoSyncToSheets,
        createNewSchoolSpreadsheet,
        syncAllToGoogleSheets,
        syncToSheetsWithData,
        loadAllFromGoogleSheets,

        // Triggers
        setIsDedicatedNewsView,
        setIsProgramsPortalView,
        openProgramsPortal,
        setActiveCategory,
        setSelectedProgramModal,
        setSelectedNewsModal,
        openNewsArticle,
        closeNewsModal,
        setSelectedArticleModal,
        openArticleBySlug,
        setIsAdmissionModalOpen,
        setIsAdminOpen,
        setIsAdminLoginModalOpen,
        openAdmin,
        setSearchQuery,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        updateAdminProfile,
        addNewsArticle,
        updateNewsArticle,
        deleteNewsArticle,
        addProgram,
        updateProgram,
        deleteProgram,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        addCategory,
        updateCategory,
        deleteCategory,
        addInstitutionalArticle,
        updateInstitutionalArticle,
        deleteInstitutionalArticle,
        updateSchoolInfo,
        updateSectionTexts,
        submitAdmissionInquiry,
        updateInquiryStatus,
        deleteInquiry,
        updateFeedbackEmailSettings,
        updateFeedbackTabEmail,
        smtpConfig,
        updateSmtpConfig,
        sendDirectEmail,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        resetToDefaults,
        exportDataJson,
        importDataJson
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
