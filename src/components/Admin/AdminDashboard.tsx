import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AdminNewsManager } from './AdminNewsManager';
import { AdminProgramManager } from './AdminProgramManager';
import { AdminSlideManager } from './AdminSlideManager';
import { AdminAboutManager } from './AdminAboutManager';
import { AdminCategoryManager } from './AdminCategoryManager';
import { AdminSettingsManager } from './AdminSettingsManager';
import { AdminSectionTextsManager } from './AdminSectionTextsManager';
import { AdminCalendarManager } from './AdminCalendarManager';
import { AdminInstitutionalArticlesManager } from './AdminInstitutionalArticlesManager';
import {
  FileText,
  GraduationCap,
  Image as ImageIcon,
  LayoutGrid,
  Mail,
  Settings,
  ArrowLeft,
  ShieldCheck,
  Type,
  LogOut,
  User,
  Sparkles,
  AlertCircle,
  CalendarDays,
  Globe,
  BookOpen,
  Compass,
  Target,
  X
} from 'lucide-react';

type AdminTab = 'news' | 'programs' | 'slides' | 'about' | 'categories' | 'articles' | 'calendar' | 'texts' | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    schoolInfo,
    news,
    programs,
    categories,
    heroSlides,
    calendarEvents,
    institutionalArticles,
    adminUsername,
    logoutAdmin,
    setIsAdminOpen
  } = useSchool();

  const [activeTab, setActiveTab] = useState<AdminTab>('news');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logoutAdmin();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Admin Navigation Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-sm sm:text-base leading-tight flex items-center gap-2">
                  <span>Админ Удирдлагын Систем (CMS)</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/30 hidden sm:inline-block">
                    Идэвхтэй
                  </span>
                </h1>
                <span className="text-[11px] text-slate-400 font-medium">
                  {schoolInfo.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Firebase Database Status Badge */}
              <div className="hidden lg:flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-xs text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold">Firebase Firestore</span>
              </div>

              {/* User indicator & Quick Settings link */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/80'
                }`}
                title="Үндсэн тохиргоо & Нууц үг солих"
              >
                <Settings className={`w-3.5 h-3.5 ${activeTab === 'settings' ? 'text-slate-950' : 'text-amber-400'}`} />
                <span className="font-semibold">{adminUsername} (Тохиргоо)</span>
              </button>

              {/* Back to site button */}
              <button
                id="admin-back-home-btn"
                onClick={() => setIsAdminOpen(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Нүүр хуудас үзэх</span>
              </button>

              {/* Logout button */}
              <button
                id="admin-logout-btn"
                onClick={() => setShowLogoutConfirm(true)}
                className="bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-200 border border-slate-700 hover:border-red-700 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Админаас гарах"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Гарах</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* Quick Stats overview bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5 sm:gap-3 mb-6">
          <div
            onClick={() => setActiveTab('news')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'news'
                ? 'bg-white border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                : 'bg-white/80 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Нийт мэдээ</span>
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{news.length}</div>
          </div>

          <div
            onClick={() => setActiveTab('programs')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'programs'
                ? 'bg-white border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                : 'bg-white/80 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Хөтөлбөрүүд</span>
              <GraduationCap className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{programs.length}</div>
          </div>

          <div
            onClick={() => setActiveTab('slides')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'slides'
                ? 'bg-white border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                : 'bg-white/80 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Слайдер</span>
              <ImageIcon className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{heroSlides.length}</div>
          </div>

          <div
            onClick={() => setActiveTab('about')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-white border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                : 'bg-white/80 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Бидний тухай</span>
              <Compass className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xs font-bold text-amber-700 mt-2 flex items-center gap-0.5">
              <span>Зураг & Текст</span>
              <span>→</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('categories')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-white border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                : 'bg-white/80 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Экосистем</span>
              <Globe className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{categories.length}</div>
          </div>

          <div
            onClick={() => setActiveTab('articles')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-white border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                : 'bg-white/80 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Дэд нийтлэл</span>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{institutionalArticles.length}</div>
          </div>

          <div
            onClick={() => setActiveTab('calendar')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-white border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                : 'bg-white/80 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Хуанли</span>
              <CalendarDays className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">{calendarEvents.length}</div>
          </div>

          <div
            onClick={() => setActiveTab('texts')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'texts'
                ? 'bg-white border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                : 'bg-white/80 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Вэб текст</span>
              <Type className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xs font-bold text-amber-700 mt-2 flex items-center gap-0.5">
              <span>Засах</span>
              <span>→</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('settings')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                : 'bg-white/80 border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Тохиргоо</span>
              <Settings className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xs font-bold text-amber-700 mt-2 flex items-center gap-0.5">
              <span>Нууц үг & Бааз</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar - Wrap or Smooth Scroll */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 mb-6 flex flex-wrap items-center gap-2 shadow-2xs">
          <button
            id="tab-btn-news"
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'news'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Мэдээ нийтлэл</span>
          </button>

          <button
            id="tab-btn-programs"
            onClick={() => setActiveTab('programs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'programs'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Хөтөлбөрүүд</span>
          </button>

          <button
            id="tab-btn-slides"
            onClick={() => setActiveTab('slides')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'slides'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Слайдер баннер</span>
          </button>

          <button
            id="tab-btn-about"
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Бидний тухай & Эрхэм зорилго</span>
          </button>

          <button
            id="tab-btn-categories"
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-500" />
            <span>Sub-домайн & Холбоос</span>
          </button>

          <button
            id="tab-btn-articles"
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Дэд цэсийн нийтлэл & Холбоос</span>
          </button>

          <button
            id="tab-btn-calendar"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-amber-500" />
            <span>Хуанли / Төлөвлөгөө</span>
          </button>

          <button
            id="tab-btn-texts"
            onClick={() => setActiveTab('texts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'texts'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Type className="w-4 h-4 text-amber-500" />
            <span>Вэб Текст</span>
          </button>

          <button
            id="tab-btn-settings"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer sm:ml-auto ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-600" />
            <span>Үндсэн тохиргоо & Нууц үг</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {activeTab === 'news' && <AdminNewsManager />}
          {activeTab === 'programs' && <AdminProgramManager />}
          {activeTab === 'slides' && <AdminSlideManager />}
          {activeTab === 'about' && <AdminAboutManager />}
          {activeTab === 'categories' && <AdminCategoryManager />}
          {activeTab === 'articles' && <AdminInstitutionalArticlesManager />}
          {activeTab === 'calendar' && <AdminCalendarManager />}
          {activeTab === 'texts' && <AdminSectionTextsManager />}
          {activeTab === 'settings' && <AdminSettingsManager />}
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Админ хэсэгт оруулсан бүх өөрчлөлт нүүр хуудас дээр бодит цагт шууд шинэчлэгдэнэ.</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="text-amber-600 font-semibold hover:underline cursor-pointer"
            >
              Нүүр хуудас руу шилжих →
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-red-600 hover:text-red-700 font-semibold hover:underline cursor-pointer"
            >
              Системээс гарах
            </button>
          </div>
        </div>
      </footer>

      {/* Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Админ системээс гарах уу?
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Та гарвал админ эрх цуцлагдаж, дахин орохын тулд нууц үгээ оруулах шаардлагатай болно.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Болих
              </button>
              <button
                id="confirm-logout-btn"
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Тийм, гарах</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
