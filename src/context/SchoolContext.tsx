import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { db, auth } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Note: ', JSON.stringify(errInfo));
}

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
  isFirebaseConnected: boolean;
  isInitialLoading: boolean;
  isDedicatedNewsView: boolean;
  isProgramsPortalView: boolean;

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

// Clear legacy cached data keys on first load to prevent flash of old template
try {
  const CACHE_VERSION_KEY = 'school_cache_version_key';
  const CURRENT_VERSION = 'v4';
  if (typeof window !== 'undefined') {
    const savedVer = localStorage.getItem(CACHE_VERSION_KEY);
    if (savedVer !== CURRENT_VERSION) {
      const keysToClean = [
        'school_categories_v1', 'school_categories_v2', 'school_categories_v3',
        'school_slides_v1', 'school_slides_v2', 'school_slides_v3',
        'school_programs_v1', 'school_programs_v2', 'school_programs_v3',
        'school_news_v1', 'school_news_v2', 'school_news_v3',
        'school_info_v1', 'school_info_v2', 'school_info_v3',
        'school_section_texts_v1', 'school_section_texts_v2', 'school_section_texts_v3',
        'school_calendar_events_v1', 'school_calendar_events_v2', 'school_calendar_events_v3',
        'school_data_synced_v3'
      ];
      keysToClean.forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });
      localStorage.setItem(CACHE_VERSION_KEY, CURRENT_VERSION);
    }
  }
} catch (e) {
  // ignore
}

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
  ADMIN_PASS: 'school_admin_password_v1'
};

const ALLOWED_CATEGORY_SLUGS = new Set(['news-info', 'olympiad', 'sports-arts', 'primary', 'admission-exam']);

// Helper to ensure no undefined values are sent to Firestore
function cleanForFirestore<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = cleanForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Loading state for initial cold load to avoid flash of content
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('school_data_synced_v4');
    } catch {
      return false;
    }
  });

  // Load initial states from localStorage with default fallbacks
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
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
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_SCHOOL_INFO;
  });

  const [sectionTexts, setSectionTexts] = useState<SectionTexts>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SECTION_TEXTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_SECTION_TEXTS;
  });

  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>([]);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasCurrentYear = parsed.some((ev: CalendarEvent) =>
            ev.month?.startsWith('2026') || ev.month?.startsWith('2027') || ev.dateRange?.includes('2026')
          );
          if (!hasCurrentYear) {
            return INITIAL_CALENDAR_EVENTS;
          }
          return parsed;
        }
      } catch (e) {
        // fallback
      }
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
            if (found && def.tabKey === 'bullying' && (found.tabKey === 'admission' || found.tabTitle === 'Элсэлт бүртгэл')) {
              return { ...def, teacherEmail: found.teacherEmail || def.teacherEmail };
            }
            return found ? { ...def, ...found, tabKey: def.tabKey } : def;
          });
        }
      } catch (e) {
        // fallback
      }
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
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_SMTP_CONFIG;
  });

  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    return saved === 'true';
  });

  const [adminUsername, setAdminUsername] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    return saved || 'admin';
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_EMAIL);
    return saved || 'jvkhln1@gmail.com';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS);
    return saved || 'admin123';
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

  const openProgramsPortal = (categorySlugOrAll?: string) => {
    if (categorySlugOrAll && categorySlugOrAll !== 'all') {
      setActiveCategory(categorySlugOrAll);
    }
    setIsProgramsPortalView(true);
    window.location.hash = '#programs-portal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to increment views and open news modal
  const openNewsArticle = (articleOrId: NewsArticle | string) => {
    let target: NewsArticle | undefined;
    if (typeof articleOrId === 'string') {
      target = news.find(n => n.id === articleOrId || n.slug === articleOrId) ||
               INITIAL_NEWS.find(n => n.id === articleOrId || n.slug === articleOrId);
    } else {
      target = articleOrId;
    }

    if (!target) return;

    // View counter increment logic per session
    const sessionKey = `viewed_news_${target.id}`;
    const alreadyViewed = sessionStorage.getItem(sessionKey);

    let updatedViews = target.views || 0;
    if (!alreadyViewed) {
      sessionStorage.setItem(sessionKey, 'true');
      updatedViews += 1;

      // Update state locally
      setNews(prev => prev.map(item => item.id === target!.id ? { ...item, views: updatedViews } : item));

      // Persist to Firestore
      try {
        setDoc(doc(db, 'news', target.id), { views: updatedViews }, { merge: true }).catch(err => {
          console.warn('Firestore view counter update notice:', err);
        });
      } catch (e) {
        console.warn('View counter sync error:', e);
      }
    }

    const modalArticle = { ...target, views: updatedViews };
    setSelectedNewsModal(modalArticle);

    // Update browser URL hash/permalink for direct sharing
    try {
      const newHash = `news/${target.slug || target.id}`;
      if (window.location.hash !== `#${newHash}`) {
        window.history.replaceState(null, '', `${window.location.pathname}#${newHash}`);
      }
    } catch (e) {
      // ignore in iframe
    }
  };

  const closeNewsModal = () => {
    setSelectedNewsModal(null);
    try {
      if (window.location.hash.startsWith('#news/') || window.location.hash === '#news') {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch (e) {
      // ignore
    }
  };

  // Firestore Real-Time Subscriptions & Initialization
  useEffect(() => {
    let unsubSchoolInfo: (() => void) | undefined;
    let unsubSectionTexts: (() => void) | undefined;
    let unsubPrograms: (() => void) | undefined;
    let unsubNews: (() => void) | undefined;
    let unsubCategories: (() => void) | undefined;
    let unsubSlides: (() => void) | undefined;
    let unsubCalendar: (() => void) | undefined;
    let unsubArticles: (() => void) | undefined;
    let unsubFeedbackEmails: (() => void) | undefined;
    let unsubSmtp: (() => void) | undefined;
    let unsubAdminProfile: (() => void) | undefined;

    // Safety timeout: Never keep the loading splash screen longer than 400ms
    const safetyTimer = setTimeout(() => {
      setIsInitialLoading(false);
      try { localStorage.setItem('school_data_synced_v4', 'true'); } catch (e) {}
    }, 400);

    const loadedKeys = {
      info: false,
      slides: false,
      news: false,
      categories: false,
    };

    const markLoaded = (key: keyof typeof loadedKeys) => {
      loadedKeys[key] = true;
      if (loadedKeys.info && loadedKeys.slides && loadedKeys.news && loadedKeys.categories) {
        setIsInitialLoading(false);
        try { localStorage.setItem('school_data_synced_v4', 'true'); } catch (e) {}
      }
    };

    try {
      // 1. School Info listener
      unsubSchoolInfo = onSnapshot(doc(db, 'settings', 'schoolInfo'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SchoolInfo;
          if (!data.defaultNewsImageUrl || data.defaultNewsImageUrl.includes('photo-1523240795612-9a054b0db644')) {
            data.defaultNewsImageUrl = FALLBACK_IMAGE_URL;
          }
          setSchoolInfo(data);
          setIsFirebaseConnected(true);
        }
        markLoaded('info');
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'settings/schoolInfo');
        markLoaded('info');
      });

      // 2. Section Texts listener
      unsubSectionTexts = onSnapshot(doc(db, 'settings', 'sectionTexts'), (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as Partial<SectionTexts>;
          setSectionTexts(prev => ({ ...INITIAL_SECTION_TEXTS, ...prev, ...remoteData }));
          setIsFirebaseConnected(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/sectionTexts'));

      // 3. Programs listener
      unsubPrograms = onSnapshot(collection(db, 'programs'), (snapshot) => {
        if (!snapshot.empty) {
          const progs = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as SchoolProgram[];
          setPrograms(progs);
          setIsFirebaseConnected(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'programs'));

      // 4. News listener
      unsubNews = onSnapshot(collection(db, 'news'), (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as NewsArticle[];
          setNews(items);
          setIsFirebaseConnected(true);
        }
        markLoaded('news');
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'news');
        markLoaded('news');
      });

      // 5. Categories listener
      unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
        if (!snapshot.empty) {
          const cats = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as CategoryItem[];
          setCategories(cats);
          setIsFirebaseConnected(true);
        }
        markLoaded('categories');
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'categories');
        markLoaded('categories');
      });

      // 6. Slides listener
      unsubSlides = onSnapshot(collection(db, 'slides'), (snapshot) => {
        if (!snapshot.empty) {
          const s = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as HeroSlide[];
          setHeroSlides(s);
          setIsFirebaseConnected(true);
        }
        markLoaded('slides');
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'slides');
        markLoaded('slides');
      });

      // 7. Calendar listener
      unsubCalendar = onSnapshot(collection(db, 'calendar'), (snapshot) => {
        if (!snapshot.empty) {
          const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as CalendarEvent[];
          setCalendarEvents(events);
          setIsFirebaseConnected(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'calendar'));

      // 8. Institutional Articles listener
      unsubArticles = onSnapshot(collection(db, 'institutional_articles'), (snapshot) => {
        if (!snapshot.empty) {
          const arts = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as InstitutionalArticle[];
          setInstitutionalArticles(arts);
          setIsFirebaseConnected(true);
        }
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'institutional_articles'));

      // 10. Feedback Email Routing Settings listener
      unsubFeedbackEmails = onSnapshot(doc(db, 'settings', 'feedbackEmails'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            const merged = DEFAULT_FEEDBACK_EMAIL_SETTINGS.map(def => {
              const found = data.items.find((it: any) => 
                it.tabKey === def.tabKey || 
                (def.tabKey === 'risk' && it.tabKey === 'complaint') ||
                (def.tabKey === 'bullying' && it.tabKey === 'admission')
              );
              if (found && def.tabKey === 'bullying' && (found.tabKey === 'admission' || found.tabTitle === 'Элсэлт бүртгэл')) {
                return { ...def, teacherEmail: found.teacherEmail || def.teacherEmail };
              }
              return found ? { ...def, ...found, tabKey: def.tabKey } : def;
            });
            setFeedbackEmailSettings(merged);
            setIsFirebaseConnected(true);
          }
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/feedbackEmails'));

      // 11. SMTP Config Settings listener
      unsubSmtp = onSnapshot(doc(db, 'settings', 'smtpConfig'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && typeof data === 'object') {
            setSmtpConfig(prev => ({ ...prev, ...data }));
            setIsFirebaseConnected(true);
          }
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/smtpConfig'));

      // 12. Admin Profile listener (Username & Email)
      unsubAdminProfile = onSnapshot(doc(db, 'settings', 'adminProfile'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && typeof data === 'object') {
            if (data.username) setAdminUsername(data.username);
            if (data.email) setAdminEmail(data.email);
            setIsFirebaseConnected(true);
          }
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/adminProfile'));

    } catch (e) {
      console.warn('Firestore subscription initialized with offline fallback', e);
    }

    return () => {
      clearTimeout(safetyTimer);
      if (unsubSchoolInfo) unsubSchoolInfo();
      if (unsubSectionTexts) unsubSectionTexts();
      if (unsubPrograms) unsubPrograms();
      if (unsubNews) unsubNews();
      if (unsubCategories) unsubCategories();
      if (unsubSlides) unsubSlides();
      if (unsubCalendar) unsubCalendar();
      if (unsubArticles) unsubArticles();
      if (unsubFeedbackEmails) unsubFeedbackEmails();
      if (unsubSmtp) unsubSmtp();
      if (unsubAdminProfile) unsubAdminProfile();
    };
  }, []);

  // Persist to localStorage as instant cache
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
    try {
      localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(heroSlides));
    } catch (e) {
      console.warn('LocalStorage error saving slides', e);
    }
  }, [heroSlides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
    } catch (e) {
      console.warn('LocalStorage error saving programs', e);
    }
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    } catch (e) {
      console.warn('LocalStorage error saving news', e);
    }
  }, [news]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECTION_TEXTS, JSON.stringify(sectionTexts));
  }, [sectionTexts]);

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

  // URL Hash and Direct Sub-domain / Permalink Routing Listener
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
          if (newsSlugOrId) {
            openNewsArticle(newsSlugOrId);
          }
        } else if (hash.startsWith('#article/')) {
          const artSlugOrId = hash.replace('#article/', '').trim();
          if (artSlugOrId) {
            const foundArt = institutionalArticles.find(a => a.id === artSlugOrId || a.slug === artSlugOrId);
            if (foundArt) {
              setSelectedArticleModal(foundArt);
            }
          }
        } else if (hash.startsWith('#program/')) {
          const progSlugOrId = hash.replace('#program/', '').trim();
          if (progSlugOrId) {
            const foundProg = programs.find(p => p.id === progSlugOrId || p.slug === progSlugOrId);
            if (foundProg) {
              setSelectedProgramModal(foundProg);
            }
          }
        } else if (hash === '#programs-portal' || hash === '#programs-subdomain' || hash === '#programs-all' || hash === '#programs-hub') {
          setIsProgramsPortalView(true);
        } else if (hash === '#all-news' || hash === '#news-all') {
          setIsDedicatedNewsView(true);
        } else if (hash === '#news') {
          // Normal news section scroll
          const el = document.getElementById('news');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === '#programs') {
          const el = document.getElementById('programs');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (e) {
        console.warn('URL routing parse notice:', e);
      }
    };

    // Run once on load and listen to hashchange
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

    try {
      await setDoc(doc(db, 'settings', 'adminProfile'), {
        username: trimmedUser,
        email: trimmedEmail,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Could not sync adminProfile to Firestore', e);
    }

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

    try {
      setDoc(doc(db, 'settings', 'adminProfile'), {
        username: updatedUser,
        email: updatedEmail,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    } catch (e) {}

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
  const addNewsArticle = async (newArt: Omit<NewsArticle, 'id' | 'createdAt' | 'views'>) => {
    const newId = 'news-' + Date.now();
    const primaryImg = newArt.imageUrl || (newArt.images && newArt.images[0]) || schoolInfo.defaultNewsImageUrl || FALLBACK_IMAGE_URL;
    const finalImages = Array.isArray(newArt.images) && newArt.images.length > 0 ? newArt.images : [primaryImg];

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
    setNews(prev => [newItem, ...prev]);
    try {
      const sanitized = cleanForFirestore(newItem);
      await setDoc(doc(db, 'news', newId), sanitized);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `news/${newId}`);
    }
  };

  const updateNewsArticle = async (id: string, updated: Partial<NewsArticle>) => {
    setNews(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
    try {
      const existing = news.find(n => n.id === id);
      if (existing) {
        const merged = cleanForFirestore({ ...existing, ...updated });
        await setDoc(doc(db, 'news', id), merged, { merge: true });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `news/${id}`);
    }
  };

  const deleteNewsArticle = async (id: string) => {
    setNews(prev => prev.filter(item => item.id !== id));
    try {
      await deleteDoc(doc(db, 'news', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `news/${id}`);
    }
  };

  // Programs CRUD Actions
  const addProgram = async (newProg: Omit<SchoolProgram, 'id' | 'createdAt'>) => {
    const newId = 'prog-' + Date.now();
    const newItem: SchoolProgram = {
      ...newProg,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setPrograms(prev => [...prev, newItem]);
    try {
      await setDoc(doc(db, 'programs', newId), newItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `programs/${newId}`);
    }
  };

  const updateProgram = async (id: string, updated: Partial<SchoolProgram>) => {
    setPrograms(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
    try {
      const existing = programs.find(p => p.id === id);
      if (existing) {
        await setDoc(doc(db, 'programs', id), { ...existing, ...updated }, { merge: true });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `programs/${id}`);
    }
  };

  const deleteProgram = async (id: string) => {
    setPrograms(prev => prev.filter(item => item.id !== id));
    try {
      await deleteDoc(doc(db, 'programs', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `programs/${id}`);
    }
  };

  // Hero Slides CRUD
  const addHeroSlide = async (slide: Omit<HeroSlide, 'id'>) => {
    const newId = 'slide-' + Date.now();
    const newItem: HeroSlide = {
      ...slide,
      id: newId
    };
    setHeroSlides(prev => [...prev, newItem]);
    try {
      await setDoc(doc(db, 'slides', newId), newItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `slides/${newId}`);
    }
  };

  const updateHeroSlide = async (id: string, updated: Partial<HeroSlide>) => {
    setHeroSlides(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
    try {
      const existing = heroSlides.find(s => s.id === id);
      if (existing) {
        await setDoc(doc(db, 'slides', id), { ...existing, ...updated }, { merge: true });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `slides/${id}`);
    }
  };

  const deleteHeroSlide = async (id: string) => {
    setHeroSlides(prev => prev.filter(item => item.id !== id));
    try {
      await deleteDoc(doc(db, 'slides', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `slides/${id}`);
    }
  };

  // Categories CRUD
  const addCategory = async (cat: Omit<CategoryItem, 'id'>) => {
    const newId = 'cat-' + Date.now();
    const newItem: CategoryItem = {
      ...cat,
      id: newId
    };
    setCategories(prev => [...prev, newItem]);
    try {
      await setDoc(doc(db, 'categories', newId), newItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `categories/${newId}`);
    }
  };

  const updateCategory = async (id: string, updated: Partial<CategoryItem>) => {
    setCategories(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
    try {
      const existing = categories.find(c => c.id === id);
      if (existing) {
        await setDoc(doc(db, 'categories', id), { ...existing, ...updated }, { merge: true });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(item => item.id !== id));
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `categories/${id}`);
    }
  };

  // School Info & Section Texts
  const updateSchoolInfo = async (info: Partial<SchoolInfo>) => {
    const updated = { ...schoolInfo, ...info };
    setSchoolInfo(updated);
    try {
      const sanitized = cleanForFirestore(updated);
      await setDoc(doc(db, 'settings', 'schoolInfo'), sanitized, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings/schoolInfo');
    }
  };

  const updateSectionTexts = async (texts: Partial<SectionTexts>) => {
    const updated = { ...sectionTexts, ...texts };
    setSectionTexts(updated);
    try {
      await setDoc(doc(db, 'settings', 'sectionTexts'), updated, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings/sectionTexts');
    }
  };

  // Admission & Feedback Direct Email Dispatch (Only sent to designated email, not saved to admin)
  const submitAdmissionInquiry = async (inquiry: Omit<AdmissionInquiry, 'id' | 'createdAt' | 'status'>) => {
    const targetRecipient = feedbackEmailSettings.find(f => f.tabKey === inquiry.type)
      || feedbackEmailSettings.find(f => f.tabKey === 'feedback')
      || DEFAULT_FEEDBACK_EMAIL_SETTINGS[0];

    const recipientEmail = (inquiry.recipientEmail || targetRecipient?.teacherEmail || '').trim();
    const recipientName = inquiry.recipientName || targetRecipient?.teacherName || 'Хариуцсан ажилтан';
    const recipientRole = inquiry.recipientRole || targetRecipient?.teacherRole || 'Ажилтан';

    if (!recipientEmail) {
      return {
        success: false,
        error: 'Энэхүү чиглэлд хүлээн авах хариуцсан багш, ажилтны имэйл хаяг тохируулаагүй байна. Админ тохиргооноос имэйл хаяг оруулна уу.'
      };
    }

    // Call server email dispatch API directly to the assigned user/staff
    try {
      const resp = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          recipientName,
          recipientRole,
          senderName: inquiry.name,
          studentName: inquiry.studentName || inquiry.name,
          senderPhone: inquiry.phone,
          senderEmail: inquiry.email,
          type: inquiry.type,
          typeTitle: targetRecipient?.tabTitle || (inquiry.type === 'risk' ? 'Эрсдлийн үнэлгээ' : inquiry.type === 'bullying' ? 'Үе тэнгийн дээрэлхэлт' : 'Санал хүсэлт'),
          message: inquiry.message,
          gradeLevel: inquiry.gradeLevel,
          programInterest: inquiry.programInterest,
          riskLevel: inquiry.riskLevel,
          riskCategory: inquiry.riskCategory,
          location: inquiry.location,
          imageUrl: inquiry.imageUrl,
          isAnonymous: inquiry.isAnonymous,
          smtpConfig: smtpConfig?.enabled ? smtpConfig : undefined
        })
      });

      const resJson = await resp.json();
      return resJson;
    } catch (sendErr: any) {
      console.warn('Failed to dispatch /api/send-email:', sendErr);
      return { success: false, error: sendErr.message || 'Имэйл илгээхэд сүлжээний алдаа гарлаа' };
    }
  };

  const updateSmtpConfig = async (newConfig: SmtpConfig) => {
    setSmtpConfig(newConfig);
    try {
      await setDoc(doc(db, 'settings', 'smtpConfig'), newConfig);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings/smtpConfig');
    }
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
    try {
      await setDoc(doc(db, 'settings', 'feedbackEmails'), { items: settings });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings/feedbackEmails');
    }
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

  const updateInquiryStatus = async (id: string, status: AdmissionInquiry['status']) => {
    setInquiries(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));
    try {
      await setDoc(doc(db, 'inquiries', id), { status }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiries(prev => prev.filter(item => item.id !== id));
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  // Academic Calendar Plan CRUD
  const addCalendarEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    const newId = 'cal-' + Date.now();
    const newItem: CalendarEvent = {
      ...event,
      id: newId
    };
    setCalendarEvents(prev => [...prev, newItem]);
    try {
      await setDoc(doc(db, 'calendar', newId), newItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `calendar/${newId}`);
    }
  };

  const updateCalendarEvent = async (id: string, updated: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
    try {
      const existing = calendarEvents.find(c => c.id === id);
      if (existing) {
        await setDoc(doc(db, 'calendar', id), { ...existing, ...updated }, { merge: true });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `calendar/${id}`);
    }
  };

  const deleteCalendarEvent = async (id: string) => {
    setCalendarEvents(prev => prev.filter(item => item.id !== id));
    try {
      await deleteDoc(doc(db, 'calendar', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `calendar/${id}`);
    }
  };

  // Institutional Articles CRUD & Helpers
  const openArticleBySlug = (slug: string) => {
    const found = institutionalArticles.find(a => a.slug === slug) || INITIAL_INSTITUTIONAL_ARTICLES.find(a => a.slug === slug);
    if (found) {
      setSelectedArticleModal(found);
    }
  };

  const addInstitutionalArticle = async (newArt: Omit<InstitutionalArticle, 'id'>) => {
    const newId = 'art-' + (newArt.slug || Date.now());
    const newItem: InstitutionalArticle = {
      ...newArt,
      id: newId
    };
    setInstitutionalArticles(prev => [...prev, newItem]);
    try {
      await setDoc(doc(db, 'institutional_articles', newId), newItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `institutional_articles/${newId}`);
    }
  };

  const updateInstitutionalArticle = async (id: string, updated: Partial<InstitutionalArticle>) => {
    setInstitutionalArticles(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
    if (selectedArticleModal && selectedArticleModal.id === id) {
      setSelectedArticleModal(prev => (prev ? { ...prev, ...updated } : null));
    }
    try {
      const existing = institutionalArticles.find(n => n.id === id);
      if (existing) {
        await setDoc(doc(db, 'institutional_articles', id), { ...existing, ...updated }, { merge: true });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `institutional_articles/${id}`);
    }
  };

  const deleteInstitutionalArticle = async (id: string) => {
    setInstitutionalArticles(prev => prev.filter(item => item.id !== id));
    try {
      await deleteDoc(doc(db, 'institutional_articles', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `institutional_articles/${id}`);
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
        isFirebaseConnected,
        isInitialLoading,
        isDedicatedNewsView,
        isProgramsPortalView,
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

