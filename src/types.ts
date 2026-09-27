export type CategoryType = 
  | 'primary'
  | 'middle'
  | 'high'
  | 'stem'
  | 'language'
  | 'arts_sports'
  | 'olympiad'
  | 'general';

export interface CategoryItem {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  iconName: string;
  description: string;
  url?: string; // Subdomain URL e.g. "https://primary.eds.edu.mn" or "#programs"
  target?: '_blank' | '_self'; // Open in new tab or same tab
  badge?: string; // e.g. "Шинэ", "Портал", "LMS"
  order?: number;
  active?: boolean;
  count?: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  badge?: string;
  active: boolean;
  order: number;
}

export interface SchoolProgram {
  id: string;
  title: string;
  slug?: string;
  subtitle: string;
  categorySlug: string;
  categoryName: string;
  imageUrl: string;
  images?: string[]; // Up to 3 images gallery
  tags: string[];
  description: string;
  features: string[];
  curriculum?: string;
  ageRange?: string;
  schedule?: string;
  featured?: boolean;
  order: number;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  images?: string[]; // Up to 5 images gallery
  videoUrl?: string; // mp4 video link or upload
  audioUrl?: string; // mp3 audio link or upload
  author: string;
  views: number;
  featured: boolean;
  tags?: string[];
  createdAt: string;
}

export interface SchoolInfo {
  name: string;
  logoUrl?: string;
  defaultNewsImageUrl?: string;
  motto: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  workingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  
  // 1. Students Count & Metadata
  studentsCount: number;
  studentsLabel?: string;
  studentsDesc?: string;
  studentsSuffix?: string;

  // 2. Teachers Count & Metadata
  teachersCount: number;
  teachersLabel?: string;
  teachersDesc?: string;
  teachersSuffix?: string;

  // 3. College Acceptance / University Entrance & Metadata (Default suffix is '+')
  collegeAcceptanceRate: number;
  collegeLabel?: string;
  collegeDesc?: string;
  collegeSuffix?: string;

  // 4. Clubs Count & Metadata
  clubsCount: number;
  clubsLabel?: string;
  clubsDesc?: string;
  clubsSuffix?: string;
}

export type FeedbackType = 'feedback' | 'bullying' | 'question' | 'risk' | 'admission' | 'complaint';

export type RiskLevel = 'high' | 'medium' | 'low';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
  enabled: boolean;
}

export interface FeedbackEmailSetting {
  tabKey: FeedbackType | string;
  tabTitle: string;
  teacherName: string;
  teacherRole: string;
  teacherEmail: string;
  description?: string;
  phone?: string;
}

export interface AdmissionInquiry {
  id: string;
  name: string; // sender name
  phone: string;
  email?: string;
  type: FeedbackType; // төрөл
  subject?: string;
  message: string; // санал хүсэлтийн агуулга
  studentName?: string;
  parentName?: string;
  gradeLevel?: string;
  programInterest?: string;
  notes?: string;
  isAnonymous?: boolean; // Нэрээ нууцалсан эсэх
  // Risk assessment fields
  riskLevel?: RiskLevel; // 'high' | 'medium' | 'low'
  riskCategory?: string; // Эрсдэлийн бүртгэл / чиглэл
  location?: string; // Эрсдэл илэрсэн байршил
  imageUrl?: string; // Эрсдлийн гэрэл зураг
  createdAt: string;
  status: 'new' | 'contacted' | 'approved' | 'rejected';
  recipientName?: string; // Хүлээн авсан багшийн нэр
  recipientEmail?: string; // Хүлээн авсан багшийн имэйл
  recipientRole?: string; // Багшийн албан тушаал
  emailDeliveryStatus?: 'delivered' | 'relay_sent' | 'activation_needed' | 'pending' | 'failed';
  deliveryNote?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  month: string; // e.g. "2025-03"
  monthName: string; // e.g. "3-р сар"
  day: string; // e.g. "15" or "20-22"
  dateRange: string; // e.g. "2025.03.15"
  category: 'exam' | 'event' | 'holiday' | 'meeting' | 'olympiad' | 'admission';
  categoryName: string; // "Улирлын шалгалт", "Сургуулийн арга хэмжээ", "Амралт", "Хурал", "Олимпиад", "Элсэлт"
  targetGroup: string; // "Бүх анги", "1-5-р анги", "6-9-р анги", "10-12-р анги", "Эцэг эхчүүд"
  description?: string;
  location?: string;
  isImportant?: boolean;
}

export interface InstitutionalArticle {
  id: string;
  slug: string; // 'greeting' | 'team' | 'history' | 'achievements' | 'symbolism' | 'curriculum' | 'environment' | 'rules' | 'clubs'
  category: 'about' | 'education';
  title: string;
  subtitle: string;
  iconName: string;
  coverImage: string;
  images?: string[]; // Up to 5 images gallery
  videoUrl?: string; // mp4 video link or upload
  audioUrl?: string; // mp3 audio link or upload
  articleUrl?: string; // Optional direct article or external link
  target?: '_blank' | '_self';
  badge?: string;
  highlights?: string[];
  content: string;
  author?: string;
  updatedAt?: string;
  order: number;
}

export interface AboutValueItem {
  id: string;
  iconName: string; // 'shield' | 'globe' | 'stem' | 'award' | 'star' | 'book' | 'heart' | 'users'
  title: string;
  description: string;
}

export interface SectionTexts {
  topAnnouncement?: string;
  programsTitle: string;
  programsSubtitle: string;
  newsTitle: string;
  newsSubtitle: string;
  aboutBadge: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutMissionQuote: string;
  aboutMissionSubtitle?: string;
  aboutImageUrl?: string;
  aboutStatValue: string;
  aboutStatLabel: string;
  aboutButtonText?: string;
  aboutValues?: AboutValueItem[];
  footerDescription: string;
  admissionModalTitle: string;
  admissionModalSubtitle: string;
}

