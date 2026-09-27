import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  School,
  Search,
  Menu,
  X,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  LogOut,
  BookOpen,
  Calendar,
  Utensils,
  ShieldAlert,
  GraduationCap,
  Award,
  Users,
  Building2,
  Trophy,
  Palette,
  FileText,
  Sparkles,
  Trophy as TrophyIcon,
  Palette as ArtsIcon,
  BookOpenCheck,
  ClipboardList
} from 'lucide-react';
import { ParentsModal, ParentModalTab } from './Modals/ParentsModal';

export const Header: React.FC = () => {
  const {
    schoolInfo,
    sectionTexts,
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    openAdmin,
    logoutAdmin,
    setIsAdmissionModalOpen,
    searchQuery,
    setSearchQuery,
    news,
    openArticleBySlug,
    activeCategory,
    setActiveCategory,
    setIsDedicatedNewsView,
    setIsProgramsPortalView
  } = useSchool();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);

  // Dropdown states for Desktop
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [educationDropdownOpen, setEducationDropdownOpen] = useState(false);
  const [newsDropdownOpen, setNewsDropdownOpen] = useState(false);
  const [parentsDropdownOpen, setParentsDropdownOpen] = useState(false);

  // Mobile accordion toggles
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileEducationOpen, setMobileEducationOpen] = useState(false);
  const [mobileNewsOpen, setMobileNewsOpen] = useState(false);
  const [mobileParentsOpen, setMobileParentsOpen] = useState(false);

  // Parents modal state
  const [parentsModalOpen, setParentsModalOpen] = useState(false);
  const [activeParentTab, setActiveParentTab] = useState<ParentModalTab>('schedule');

  const closeAllDropdowns = () => {
    setAboutDropdownOpen(false);
    setEducationDropdownOpen(false);
    setNewsDropdownOpen(false);
    setParentsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    closeAllDropdowns();
    if (isAdminOpen) {
      setIsAdminOpen(false);
    }
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCategoryNav = (slug: string, sectionId: string) => {
    setActiveCategory(slug);
    closeAllDropdowns();
    if (isAdminOpen) {
      setIsAdminOpen(false);
    }

    if (slug === 'admission-exam') {
      const el = document.getElementById('admission');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setIsAdmissionModalOpen(true);
      }
      return;
    }

    scrollToSection(sectionId);
  };

  const handleAdminClick = () => {
    if (isAdminOpen) {
      setIsAdminOpen(false);
    } else {
      openAdmin();
    }
  };

  const handleFeedbackClick = () => {
    setIsAdmissionModalOpen(true);
  };

  const openParentModalWithTab = (tab: ParentModalTab) => {
    setActiveParentTab(tab);
    setParentsModalOpen(true);
    closeAllDropdowns();
  };

  const handleArticleClick = (slug: string) => {
    closeAllDropdowns();
    if (isAdminOpen) {
      setIsAdminOpen(false);
    }
    openArticleBySlug(slug);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        {/* Top micro bar for phone, email, flowing announcement ticker, and admin link */}
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Phone & Email contacts */}
            <div className="flex items-center space-x-4 sm:space-x-6 text-slate-300 shrink-0">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{schoolInfo.phone}</span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{schoolInfo.email}</span>
              </span>
            </div>

            {/* Continuous flowing (marquee) ticker from right to left */}
            <div className="hidden md:flex flex-1 items-center overflow-hidden mx-4 relative">
              <div className="w-full overflow-hidden whitespace-nowrap mask-gradient">
                <div className="animate-marquee inline-block text-amber-300 font-medium tracking-wide">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>
                      {sectionTexts.topAnnouncement ||
                        'Цахим систем: 2025-2026 Оны сургалт & санал хүсэлт нээлттэй • Олимпиад, урлаг спортын амжилт • Бага боловсрол & Элсэлтийн шалгалтын бүртгэл'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Admin entry in top micro bar */}
              <button
                id="admin-top-toggle-btn"
                onClick={handleAdminClick}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  isAdminOpen
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs ring-2 ring-amber-400/50'
                    : isAdminAuthenticated
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700'
                }`}
                title="Админ удирдлагын систем"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isAdminOpen
                    ? '← Нүүр хуудас'
                    : isAdminAuthenticated
                    ? 'Админ систем'
                    : 'Админ'}
                </span>
              </button>

              {isAdminAuthenticated && (
                <button
                  id="header-logout-btn"
                  onClick={() => logoutAdmin()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 transition-all cursor-pointer"
                  title="Админ эрхээс гарах"
                >
                  <LogOut className="w-3 h-3 text-red-400" />
                  <span>Гарах</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & School Name */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                setIsAdminOpen(false);
                setIsDedicatedNewsView(false);
                setIsProgramsPortalView(false);
                if (window.location.hash) {
                  try {
                    window.history.replaceState(null, '', window.location.pathname);
                  } catch (e) {
                    // ignore
                  }
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {schoolInfo.logoUrl ? (
                <div className="h-11 sm:h-12 w-auto max-w-[140px] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <img
                    src={schoolInfo.logoUrl}
                    alt={schoolInfo.name}
                    className="max-h-11 sm:max-h-12 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                  <School className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 leading-tight">
                    {schoolInfo.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium tracking-wide block">
                  Хөвсгөл аймаг, Мөрөн сумын ЕБС
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-700">
              
              {/* 1. БИДНИЙ ТУХАЙ - Урсдаг цэс (Hover Dropdown) */}
              <div
                className="relative py-2 group"
                onMouseEnter={() => {
                  setAboutDropdownOpen(true);
                  setEducationDropdownOpen(false);
                  setNewsDropdownOpen(false);
                  setParentsDropdownOpen(false);
                }}
                onMouseLeave={() => setAboutDropdownOpen(false)}
              >
                <button
                  id="nav-about-dropdown-btn"
                  onClick={() => scrollToSection('about')}
                  className={`px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold relative ${
                    aboutDropdownOpen
                      ? 'text-amber-700'
                      : 'text-slate-700 hover:text-amber-600'
                  }`}
                >
                  <span>Бидний тухай</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      aboutDropdownOpen ? 'rotate-180 text-amber-600' : 'group-hover:text-amber-600'
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-amber-500 transition-all duration-300 origin-left ${
                      aboutDropdownOpen
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                    }`}
                  />
                </button>

                {/* About Us Dropdown Panel */}
                {aboutDropdownOpen && (
                  <div className="absolute left-0 top-full pt-1.5 w-76 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 space-y-1 ring-1 ring-black/5">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                            Сургуулийн танилцуулга
                          </span>
                          <span className="text-xs text-slate-500">
                            Түүх, хамт олон, үнэт зүйлс
                          </span>
                        </div>
                        <button
                          onClick={() => scrollToSection('about')}
                          className="text-[11px] font-semibold text-amber-600 hover:underline cursor-pointer"
                        >
                          Ерөнхий
                        </button>
                      </div>

                      {/* Захирлын мэндчилгээ */}
                      <button
                        id="nav-about-greeting"
                        onClick={() => handleArticleClick('greeting')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 flex items-center justify-between">
                            <span>Захирлын мэндчилгээ</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Боловсролын алсын хараа, мэндчилгээ
                          </div>
                        </div>
                      </button>

                      {/* Манай хамт олон */}
                      <button
                        id="nav-about-team"
                        onClick={() => handleArticleClick('team')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-800 flex items-center justify-between">
                            <span>Манай хамт олон</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Мэргэшсэн багш, сурган хүмүүжүүлэгчид
                          </div>
                        </div>
                      </button>

                      {/* Түүхэн замнал */}
                      <button
                        id="nav-about-history"
                        onClick={() => handleArticleClick('history')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-800 flex items-center justify-between">
                            <span>Түүхэн замнал</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            2012 оноос хойших хөгжил, ололт
                          </div>
                        </div>
                      </button>

                      {/* Бидний амжилт */}
                      <button
                        id="nav-about-achievements"
                        onClick={() => handleArticleClick('achievements')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 flex items-center justify-between">
                            <span>Бидний амжилт</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Олимпиад, тэмцээн, төгсөгчдийн амжилт
                          </div>
                        </div>
                      </button>

                      {/* Лого, бэлэгдэл */}
                      <button
                        id="nav-about-symbolism"
                        onClick={() => handleArticleClick('symbolism')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Palette className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-purple-800 flex items-center justify-between">
                            <span>Лого, бэлэгдэл</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Сүлд тэмдэг, үндсэн өнгө, бэлэгдлийн утга
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. СУРГАЛТ - Урсдаг цэс (Hover Dropdown) */}
              <div
                className="relative py-2 group"
                onMouseEnter={() => {
                  setEducationDropdownOpen(true);
                  setAboutDropdownOpen(false);
                  setNewsDropdownOpen(false);
                  setParentsDropdownOpen(false);
                }}
                onMouseLeave={() => setEducationDropdownOpen(false)}
              >
                <button
                  id="nav-education-dropdown-btn"
                  onClick={() => handleArticleClick('curriculum')}
                  className={`px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold relative ${
                    educationDropdownOpen
                      ? 'text-amber-700'
                      : 'text-slate-700 hover:text-amber-600'
                  }`}
                >
                  <span>Сургалт</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      educationDropdownOpen ? 'rotate-180 text-amber-600' : 'group-hover:text-amber-600'
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-amber-500 transition-all duration-300 origin-left ${
                      educationDropdownOpen
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                    }`}
                  />
                </button>

                {/* Education Dropdown Panel */}
                {educationDropdownOpen && (
                  <div className="absolute left-0 top-full pt-1.5 w-76 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 space-y-1 ring-1 ring-black/5">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                            Сургалтын үйл ажиллагаа
                          </span>
                          <span className="text-xs text-slate-500">
                            Хөтөлбөр, орчин, журам, секцүүд
                          </span>
                        </div>
                        <button
                          onClick={() => handleArticleClick('curriculum')}
                          className="text-[11px] font-semibold text-amber-600 hover:underline cursor-pointer"
                        >
                          Хөтөлбөрүүд
                        </button>
                      </div>

                      {/* Сургалтын хөтөлбөр */}
                      <button
                        id="nav-edu-curriculum"
                        onClick={() => handleArticleClick('curriculum')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-800 flex items-center justify-between">
                            <span>Сургалтын хөтөлбөр</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Үндэсний цөм ба олон улсын хөтөлбөр
                          </div>
                        </div>
                      </button>

                      {/* Сургалтын орчин */}
                      <button
                        id="nav-edu-environment"
                        onClick={() => handleArticleClick('environment')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <School className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
                            <span>Сургалтын орчин</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Ухаалаг анги, лаб, спорт цогцолбор
                          </div>
                        </div>
                      </button>

                      {/* Дүрэм журам */}
                      <button
                        id="nav-edu-rules"
                        onClick={() => handleArticleClick('rules')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950 flex items-center justify-between">
                            <span>Дүрэм журам</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Дотоод журам, сурагчийн ёс зүй
                          </div>
                        </div>
                      </button>

                      {/* Секц, дугуйлан */}
                      <button
                        id="nav-edu-clubs"
                        onClick={() => handleArticleClick('clubs')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 flex items-center justify-between">
                            <span>Секц, дугуйлан</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Авьяас, урлаг, спортын 30+ клуб
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. МЭДЭЭЛЭЛ - Урсдаг цэс (Hover Dropdown) */}
              <div
                className="relative py-2 group"
                onMouseEnter={() => {
                  setNewsDropdownOpen(true);
                  setAboutDropdownOpen(false);
                  setEducationDropdownOpen(false);
                  setParentsDropdownOpen(false);
                }}
                onMouseLeave={() => setNewsDropdownOpen(false)}
              >
                <button
                  id="nav-news-dropdown-btn"
                  onClick={() => handleCategoryNav('news-info', 'news')}
                  className={`px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold relative ${
                    newsDropdownOpen
                      ? 'text-amber-700'
                      : 'text-slate-700 hover:text-amber-600'
                  }`}
                >
                  <span>Мэдээлэл</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      newsDropdownOpen ? 'rotate-180 text-amber-600' : 'group-hover:text-amber-600'
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-amber-500 transition-all duration-300 origin-left ${
                      newsDropdownOpen
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                    }`}
                  />
                </button>

                {/* News & Information Dropdown Panel */}
                {newsDropdownOpen && (
                  <div className="absolute left-0 top-full pt-1.5 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 space-y-1 ring-1 ring-black/5">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                            Мэдээ, мэдээллийн төв
                          </span>
                          <span className="text-xs text-slate-500">
                            Зар мэдээ, олимпиад, арга хэмжээ
                          </span>
                        </div>
                        <button
                          onClick={() => handleCategoryNav('all', 'news')}
                          className="text-[11px] font-semibold text-amber-600 hover:underline cursor-pointer"
                        >
                          Бүгдийг харах
                        </button>
                      </div>

                      {/* Мэдээ, мэдээлэл */}
                      <button
                        id="nav-sub-news-info"
                        onClick={() => handleCategoryNav('news-info', 'news')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-800 flex items-center justify-between">
                            <span>Мэдээ, мэдээлэл</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Сургуулийн цаг үеийн зар, онцлох үйл явдал
                          </div>
                        </div>
                      </button>

                      {/* Олимпиад уралдаан */}
                      <button
                        id="nav-sub-olympiad"
                        onClick={() => handleCategoryNav('olympiad', 'news')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <TrophyIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 flex items-center justify-between">
                            <span>Олимпиад уралдаан</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Олимпиад, тэмцээн, сорилтын мэдээлэл
                          </div>
                        </div>
                      </button>

                      {/* Спорт, урлаг соёл */}
                      <button
                        id="nav-sub-sports-arts"
                        onClick={() => handleCategoryNav('sports-arts', 'news')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <ArtsIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
                            <span>Спорт, урлаг соёл</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Спортын наадам, урлагийн арга хэмжээнүүд
                          </div>
                        </div>
                      </button>

                      {/* Бага боловсрол */}
                      <button
                        id="nav-sub-primary"
                        onClick={() => handleCategoryNav('primary', 'news')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <BookOpenCheck className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-800 flex items-center justify-between">
                            <span>Бага боловсрол</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            1-5-р ангийн үндэсний суурь хөтөлбөр
                          </div>
                        </div>
                      </button>

                      {/* Элсэлтийн шалгалт */}
                      <button
                        id="nav-sub-admission-exam"
                        onClick={() => handleCategoryNav('admission-exam', 'admission')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <span>Элсэлтийн шалгалт</span>
                              <span className="text-[10px] bg-amber-200 text-amber-950 font-extrabold px-1.5 py-0.2 rounded-md">
                                2025
                              </span>
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Шинэ элсэлтийн сорилт ба бүртгэл
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. ЭЦЭГ ЭХ - Hover Dropdown */}
              <div
                className="relative py-2 group"
                onMouseEnter={() => {
                  setParentsDropdownOpen(true);
                  setAboutDropdownOpen(false);
                  setEducationDropdownOpen(false);
                  setNewsDropdownOpen(false);
                }}
                onMouseLeave={() => setParentsDropdownOpen(false)}
              >
                <button
                  id="nav-parents-dropdown-btn"
                  onClick={() => openParentModalWithTab('schedule')}
                  className={`px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold relative ${
                    parentsDropdownOpen
                      ? 'text-amber-700'
                      : 'text-slate-700 hover:text-amber-600'
                  }`}
                >
                  <span>Эцэг эх</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      parentsDropdownOpen ? 'rotate-180 text-amber-600' : 'group-hover:text-amber-600'
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-amber-500 transition-all duration-300 origin-left ${
                      parentsDropdownOpen
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                    }`}
                  />
                </button>

                {/* Dropdown Menu Panel */}
                {parentsDropdownOpen && (
                  <div className="absolute right-0 top-full pt-1.5 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 space-y-1 ring-1 ring-black/5">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                          Эцэг эхийн цахим үйлчилгээ
                        </span>
                        <span className="text-xs text-slate-500">
                          Хуваарь, хоол, дүрэм стандартын мэдээлэл
                        </span>
                      </div>

                      <button
                        onClick={() => openParentModalWithTab('schedule')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                            Хичээлийн хуваарь & Календарь
                          </div>
                          <div className="text-[11px] text-slate-500 leading-tight">
                            Ээлжийн цагийн бүтэц, улирлын амралт
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => openParentModalWithTab('menu')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                          <Utensils className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-orange-800">
                            Үдийн цай, хоолны цэс
                          </div>
                          <div className="text-[11px] text-slate-500 leading-tight">
                            7 хоногийн баталгаат шим тэжээлийн цэс
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => openParentModalWithTab('rules')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950">
                            Сургуулийн дүрэм & Стандарт
                          </div>
                          <div className="text-[11px] text-slate-500 leading-tight">
                            Дүрэмт хувцас, ёс зүйн дотоод журам
                          </div>
                        </div>
                      </button>

                      <div className="pt-1.5 border-t border-slate-100 mt-1">
                        <button
                          onClick={() => {
                            setParentsDropdownOpen(false);
                            handleFeedbackClick();
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>✍️ Санал, хүсэлт илгээх</span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Action buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Search Button */}
              <div className="relative">
                {showSearchBox ? (
                  <div className="flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-slate-300 w-52 sm:w-64 transition-all">
                    <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Мэдээ, хөтөлбөр хайх..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-800 focus:outline-hidden"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchBox(false);
                      }}
                      className="text-slate-400 hover:text-slate-600 ml-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearchBox(true)}
                    className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Хайлт хийх"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Clean Modern 'Санал хүсэлт' Button */}
              <button
                id="header-feedback-btn"
                onClick={handleFeedbackClick}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#1a3e88] hover:bg-[#153472] active:scale-95 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <span>Санал хүсэлт</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                id="mobile-header-feedback-btn"
                onClick={handleFeedbackClick}
                className="sm:hidden text-xs bg-[#1a3e88] hover:bg-[#153472] text-white font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <span>Санал хүсэлт</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
            {/* Mobile search */}
            <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2 border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Мэдээ, хөтөлбөр хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-hidden"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm font-medium text-slate-800">
              {/* 1. Бидний тухай (Mobile Accordion) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 bg-amber-50/70 text-amber-900 font-bold text-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-700" />
                    <span>Бидний тухай</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-700 transition-transform duration-200 ${
                      mobileAboutOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mobileAboutOpen && (
                  <div className="p-2 space-y-1 bg-white divide-y divide-slate-100 text-xs">
                    <button
                      onClick={() => handleArticleClick('greeting')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-amber-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>Захирлын мэндчилгээ</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleArticleClick('team')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-amber-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>Манай хамт олон</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleArticleClick('history')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-amber-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Түүхэн замнал</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleArticleClick('achievements')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-amber-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        <span>Бидний амжилт</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleArticleClick('symbolism')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-amber-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Palette className="w-3.5 h-3.5 text-purple-600" />
                        <span>Лого, бэлэгдэл</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Сургалт (Mobile Accordion) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setMobileEducationOpen(!mobileEducationOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 bg-blue-50/70 text-blue-950 font-bold text-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    <span>Сургалт</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-blue-700 transition-transform duration-200 ${
                      mobileEducationOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mobileEducationOpen && (
                  <div className="p-2 space-y-1 bg-white divide-y divide-slate-100 text-xs">
                    <button
                      onClick={() => handleArticleClick('curriculum')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-blue-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>Сургалтын хөтөлбөр</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleArticleClick('environment')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-blue-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <School className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Сургалтын орчин</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleArticleClick('rules')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-blue-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <FileText className="w-3.5 h-3.5 text-slate-700" />
                        <span>Дүрэм журам</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleArticleClick('clubs')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-blue-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Секц, дугуйлан</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Мэдээлэл (Mobile Accordion) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setMobileNewsOpen(!mobileNewsOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 bg-emerald-50/70 text-emerald-950 font-bold text-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Мэдээлэл</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-700 transition-transform duration-200 ${
                      mobileNewsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mobileNewsOpen && (
                  <div className="p-2 space-y-1 bg-white divide-y divide-slate-100 text-xs">
                    <button
                      onClick={() => handleCategoryNav('news-info', 'news')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-emerald-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Мэдээ, мэдээлэл</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleCategoryNav('olympiad', 'news')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-emerald-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <TrophyIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Олимпиад уралдаан</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleCategoryNav('sports-arts', 'news')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-emerald-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <ArtsIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Спорт, урлаг соёл</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleCategoryNav('primary', 'news')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-emerald-50/60 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <BookOpenCheck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Бага боловсрол</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleCategoryNav('admission-exam', 'admission')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-amber-50 rounded-lg text-slate-900 text-left cursor-pointer font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <ClipboardList className="w-3.5 h-3.5 text-amber-700" />
                        <span>Элсэлтийн шалгалт</span>
                      </span>
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-md">
                        2025
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Эцэг эх (Mobile Accordion) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setMobileParentsOpen(!mobileParentsOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 bg-slate-50 text-slate-900 font-bold text-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-700" />
                    <span>Эцэг эх</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-700 transition-transform duration-200 ${
                      mobileParentsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mobileParentsOpen && (
                  <div className="p-2 space-y-1 bg-white divide-y divide-slate-100 text-xs">
                    <button
                      onClick={() => openParentModalWithTab('schedule')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-slate-50 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Хичээлийн хуваарь & Календарь</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => openParentModalWithTab('menu')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-slate-50 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Utensils className="w-3.5 h-3.5 text-orange-600" />
                        <span>Үдийн цай, хоолны цэс</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => openParentModalWithTab('rules')}
                      className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-slate-50 rounded-lg text-slate-700 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <ShieldAlert className="w-3.5 h-3.5 text-slate-700" />
                        <span>Сургуулийн дүрэм & Стандарт</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              {/* Clean Feedback in mobile menu */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleFeedbackClick();
                }}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-[#1a3e88] hover:bg-[#153472] text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                <span>Санал хүсэлт</span>
              </button>

              {/* Admin toggle link in mobile menu */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAdminClick();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer border border-slate-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {isAdminOpen
                    ? 'Нүүр хуудас руу шилжих'
                    : isAdminAuthenticated
                    ? 'Админ удирдлагын систем'
                    : 'Админ нэвтрэх'}
                </span>
              </button>

              {isAdminAuthenticated && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 border border-red-200 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Админ эрхээс гарах (Logout)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Parents Info Modal */}
      <ParentsModal
        isOpen={parentsModalOpen}
        onClose={() => setParentsModalOpen(false)}
        activeTab={activeParentTab}
        onSelectTab={setActiveParentTab}
        onOpenFeedback={handleFeedbackClick}
      />
    </>
  );
};
