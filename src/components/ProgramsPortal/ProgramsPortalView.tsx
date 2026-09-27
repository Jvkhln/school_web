import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { getProgramPermalink, getProgramsPortalPermalink } from '../../utils/permalinks';
import {
  Globe,
  ArrowLeft,
  Search,
  X,
  Share2,
  Check,
  Sparkles,
  BookOpen,
  GraduationCap,
  Cpu,
  Award,
  Palette,
  Layers,
  ArrowRight,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Copy,
  ExternalLink,
  ChevronRight,
  Compass,
  CheckCircle2,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { SchoolProgram } from '../../types';

export const ProgramsPortalView: React.FC = () => {
  const {
    programs,
    schoolInfo,
    sectionTexts,
    setSelectedProgramModal,
    setIsAdmissionModalOpen,
    setIsProgramsPortalView,
    setIsAdminOpen,
    isAdminAuthenticated
  } = useSchool();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'roadmap'>('grid');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedProgramId, setCopiedProgramId] = useState<string | null>(null);

  // Filter programs
  const filteredPrograms = programs.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' ||
      p.categorySlug === selectedCategory ||
      p.categoryName === selectedCategory;
    const matchesSearch =
      !localSearch ||
      p.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(localSearch.toLowerCase()) ||
      (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(localSearch.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  const availableCategories = Array.from(
    new Set(programs.map((p) => p.categoryName || p.categorySlug).filter(Boolean))
  );

  const handleCopySubdomainLink = () => {
    const link = getProgramsPortalPermalink();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleCopyProgramLink = (e: React.MouseEvent, prog: SchoolProgram) => {
    e.stopPropagation();
    const link = getProgramPermalink(prog.slug || prog.id);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedProgramId(prog.id);
      setTimeout(() => setCopiedProgramId(null), 2000);
    }
  };

  const handleReturnToMainSite = () => {
    setIsProgramsPortalView(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Subdomain Top Announcement & Browser Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Top Micro Subdomain Status Banner */}
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Subdomain Address Indicator */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SUBDOMAIN: programs.erdmiindalai.edu.mn</span>
              </span>
              <span className="hidden md:inline text-slate-400 text-xs">
                • Сургалтын хөтөлбөрийн албан ёсны бие даасан дэд портал
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleCopySubdomainLink}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                title="Дэд домайны холбоосыг хуулах"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Холбоос хуулагдлаа!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-amber-400" />
                    <span>Линк хуулах</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsAdminOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>{isAdminAuthenticated ? 'Админ систем' : 'Админ нэвтрэх'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Subdomain Main Header Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Brand & Subdomain Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReturnToMainSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer group"
              title="Сургуулийн үндсэн сайт руу буцах"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Үндсэн сайт руу буцах</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                    Сургалтын Хөтөлбөрийн Портал
                  </h1>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    v2.4
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  {schoolInfo.name} • Академик хөгжлийн дэд систем
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions & CTA */}
          <div className="flex items-center gap-2.5">
            {/* Fast search */}
            <div className="relative hidden md:block">
              <div className="flex items-center bg-slate-100/90 rounded-full px-3 py-1.5 border border-slate-200 w-48 lg:w-60 focus-within:ring-2 focus-within:ring-amber-400 focus-within:bg-white transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Хөтөлбөр хайх..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 focus:outline-hidden"
                />
                {localSearch && (
                  <button
                    onClick={() => setLocalSearch('')}
                    className="text-slate-400 hover:text-slate-600 ml-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Admission CTA Button */}
            <button
              onClick={() => setIsAdmissionModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Элсэх хүсэлт илгээх</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Subdomain Hero Banner */}
      <section className="bg-gradient-to-b from-amber-500/10 via-slate-50 to-transparent py-10 sm:py-14 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium flex-wrap">
            <button
              onClick={handleReturnToMainSite}
              className="hover:text-amber-700 transition-colors cursor-pointer"
            >
              {schoolInfo.name}
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-amber-700 font-semibold">programs.erdmiindalai.edu.mn</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-bold">Бүх хөтөлбөрүүд</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Академик Стандарт & Боловсролын Чиглэлүүд</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                Сургуулийн Онцлох Хөтөлбөрүүд ба Сургалтын Төлөвлөгөө
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 max-w-3xl">
                {sectionTexts.programsSubtitle ||
                  '1-12-р ангийн тасралтгүй залгамж холбоотой Үндэсний цөм хөтөлбөр, Кембрижийн олон улсын стандарт, STEM & AI кодчилол, их дээд сургуулийн тэтгэлэгт AP хөтөлбөр, урлаг спортын цогц систем.'}
              </p>

              {/* Quick Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500 uppercase">Хөтөлбөрүүд</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {programs.length} чиглэл
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium">1-12-р анги</div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500 uppercase">Стандарт</div>
                  <div className="text-xl font-extrabold text-blue-700 mt-0.5">Cambridge</div>
                  <div className="text-[11px] text-slate-500 font-medium">Checkpoint & IGCSE</div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500 uppercase">Инноваци</div>
                  <div className="text-xl font-extrabold text-emerald-700 mt-0.5">STEM & AI</div>
                  <div className="text-[11px] text-slate-500 font-medium">Робот & Кодчилол</div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500 uppercase">Тэтгэлэг</div>
                  <div className="text-xl font-extrabold text-purple-700 mt-0.5">SAT / AP</div>
                  <div className="text-[11px] text-slate-500 font-medium">100% Зөвлөгөө</div>
                </div>
              </div>
            </div>

            {/* Right Subdomain Direct Actions Card */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Дэд Порталын Шууд Холбоос
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Энэхүү дэд домайныг шууд хадгалах болон бусадтай хуваалцах боломжтой:
                </p>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-4 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-700 truncate">
                    programs.erdmiindalai.edu.mn
                  </span>
                  <button
                    onClick={handleCopySubdomainLink}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium cursor-pointer shrink-0 transition-colors"
                  >
                    {copiedLink ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setIsAdmissionModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Элсэлтийн асуулга бөглөх</span>
                  </button>

                  <button
                    onClick={handleReturnToMainSite}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Сургуулийн нүүр хуудас руу буцах</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Subdomain Filter, Search & View Controls */}
      <section className="bg-white border-b border-slate-200 sticky top-[73px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Бүгд ({programs.length})
              </button>
              {availableCategories.map((catName) => {
                const count = programs.filter(
                  (p) => p.categoryName === catName || p.categorySlug === catName
                ).length;
                return (
                  <button
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === catName
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {catName} ({count})
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle: Grid / List / Roadmap */}
            <div className="flex items-center gap-1.5 shrink-0 justify-between md:justify-end">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Картаар
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Жагсаалтаар
                </button>
                <button
                  onClick={() => setViewMode('roadmap')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'roadmap'
                      ? 'bg-white text-amber-700 shadow-2xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Compass className="w-3 h-3 text-amber-600" />
                  <span>Шатлал</span>
                </button>
              </div>

              {/* Mobile Search input if collapsed */}
              <div className="md:hidden flex-1 max-w-[180px]">
                <input
                  type="text"
                  placeholder="Хайх..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Body Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* VIEW 1: ROADMAP / PATHWAY PROGRESSION VIEW */}
        {viewMode === 'roadmap' && (
          <div className="mb-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-200">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>1-12-р ангийн залгамж холбоот замын зураг</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Суралцагчийн Академик Өсөлт & Шат Дамжлагын Замнал
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Манай сургуулийн хөтөлбөр нь суралцагчийг анх орсон цагаас нь дэлхийн шилдэг их сургуульд элсэх хүртэл системтэйгээр хөгжүүлнэ.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 relative flex flex-col">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-xs">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  Бага шат (1-5-р анги)
                </h4>
                <div className="text-xs font-semibold text-amber-800 mb-2">
                  Суурь сэтгэлгээ ба Төлөвшил
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
                  Монгол хэл, бичгийн бат бөх суурь, сэтгэн бодох математик, сониуч зан, англи хэлний суурь харилцаа.
                </p>
                <div className="text-[11px] font-bold text-amber-700 bg-white/80 p-2 rounded-xl border border-amber-100">
                  ✓ Үндэсний цөм хөтөлбөр
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 relative flex flex-col">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-xs">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  Дунд шат (6-9-р анги)
                </h4>
                <div className="text-xs font-semibold text-blue-800 mb-2">
                  Кембриж & Шинжлэх ухаан
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
                  Cambridge Checkpoint шалгалт, англи хэлээрх байгалийн шинжлэл, STEM лаборатори, кодчилол.
                </p>
                <div className="text-[11px] font-bold text-blue-700 bg-white/80 p-2 rounded-xl border border-blue-100">
                  ✓ Cambridge Lower Secondary
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 relative flex flex-col">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-xs">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  Ахлах шат (10-12-р анги)
                </h4>
                <div className="text-xs font-semibold text-indigo-800 mb-2">
                  IGCSE, AP & Их сургууль
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
                  SAT, IELTS 7.5+ бэлтгэл, их дээд сургуулийн өргөдөл эсээ, мэргэжил чиглүүлэлт, олон улсын тэмцээн.
                </p>
                <div className="text-[11px] font-bold text-indigo-700 bg-white/80 p-2 rounded-xl border border-indigo-100">
                  ✓ AP & University Track
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 relative flex flex-col">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-xs">
                  4
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  Төгсөлт & Тэтгэлэг
                </h4>
                <div className="text-xs font-semibold text-emerald-800 mb-2">
                  Дэлхийн Шилдэг 100 Сургууль
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
                  АНУ, Европ, Азийн тэргүүлэх их сургуулиудад 100% хүртэл тэтгэлэгтэй элсэн суралцах баталгаа.
                </p>
                <div className="text-[11px] font-bold text-emerald-700 bg-white/80 p-2 rounded-xl border border-emerald-100">
                  ✓ 100% Тэтгэлэгт зөвлөгөө
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: GRID CARDS VIEW */}
        {viewMode === 'grid' && (
          <div>
            {filteredPrograms.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <Sparkles className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Хөтөлбөр олдсонгүй
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Та хайлтын үгээ өөрчлөх эсвэл бүх ангиллыг сонгож үзнэ үү.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setLocalSearch('');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold cursor-pointer hover:bg-amber-700"
                >
                  Бүх хөтөлбөрийг харах
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredPrograms.map((prog) => {
                  const imageCount = (prog.images && prog.images.length > 0) ? prog.images.length : 1;

                  return (
                    <div
                      key={prog.id}
                      id={`portal-prog-${prog.id}`}
                      className="group bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      {/* Image Thumbnail */}
                      <div
                        onClick={() => setSelectedProgramModal(prog)}
                        className="relative w-full aspect-16/10 bg-slate-100 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={prog.imageUrl}
                          alt={prog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-slate-100">
                          {prog.categoryName}
                        </div>

                        {/* Gallery photos indicator if multiple images */}
                        {imageCount > 1 && (
                          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            <span>+{imageCount} зураг</span>
                          </div>
                        )}

                        {/* Age range badge */}
                        {prog.ageRange && (
                          <div className="absolute top-3 right-3 bg-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                            {prog.ageRange}
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col">
                        {/* Title */}
                        <h3
                          onClick={() => setSelectedProgramModal(prog)}
                          className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug mb-2 cursor-pointer"
                        >
                          {prog.title}
                        </h3>

                        {/* Subtitle / Description */}
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                          {prog.subtitle || prog.description}
                        </p>

                        {/* Tags */}
                        {prog.tags && prog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {prog.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Bullet Highlights */}
                        {prog.features && prog.features.length > 0 && (
                          <div className="space-y-1.5 mb-5 pt-3 border-t border-slate-100">
                            {prog.features.slice(0, 3).map((f, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{f}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Card Bottom Actions */}
                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedProgramModal(prog)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
                          >
                            <span>Дэлгэрэнгүй үзэх</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleCopyProgramLink(e, prog)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors cursor-pointer"
                              title="Хөтөлбөрийн холбоос хуулах"
                            >
                              {copiedProgramId === prog.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Share2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => setIsAdmissionModalOpen(true)}
                              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                            >
                              Элсэх
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: EXPANDED LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                id={`portal-list-prog-${prog.id}`}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs hover:shadow-md transition-all flex flex-col lg:flex-row gap-6 items-start"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => setSelectedProgramModal(prog)}
                  className="w-full lg:w-72 aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer relative group"
                >
                  <img
                    src={prog.imageUrl}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-white/95 text-slate-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {prog.categoryName}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h3
                      onClick={() => setSelectedProgramModal(prog)}
                      className="text-lg sm:text-xl font-extrabold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer"
                    >
                      {prog.title}
                    </h3>
                    {prog.ageRange && (
                      <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                        {prog.ageRange}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                    {prog.subtitle}
                  </p>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {prog.description}
                  </p>

                  {/* Highlights Grid */}
                  {prog.features && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {prog.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setSelectedProgramModal(prog)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                      <span>Хөтөлбөрийн дэлгэрэнгүй & нийтлэл</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setIsAdmissionModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Элсэх хүсэлт илгээх
                    </button>

                    <button
                      onClick={(e) => handleCopyProgramLink(e, prog)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors cursor-pointer"
                      title="Линк хуулах"
                    >
                      {copiedProgramId === prog.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 5. Subdomain Admission Callout & Contact Section */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                2025-2026 Хичээлийн жилийн элсэлтийн зөвлөгөө
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Та хүүхдээ аль хөтөлбөрт элсүүлэхээ шийдээгүй байна уу?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-2xl">
                Манай академик зөвлөхүүд сурагчийн нас, сонирхол, англи хэлний түвшинд нийцсэн тохирох хөтөлбөрийг үнэ төлбөргүй зөвлөж байна.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{schoolInfo.phone}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{schoolInfo.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{schoolInfo.workingHours}</span>
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
              <button
                onClick={() => setIsAdmissionModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Элсэлтийн зөвлөгөө авах</span>
              </button>

              <button
                onClick={handleReturnToMainSite}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Сургуулийн үндсэн сайт</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Subdomain Micro Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-6 px-4 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">{schoolInfo.name}</span>
            <span>•</span>
            <span className="font-mono text-emerald-400">programs.erdmiindalai.edu.mn</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={handleReturnToMainSite}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Үндсэн хуудас
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAdmissionModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Элсэлтийн хүсэлт
            </button>
            <span>•</span>
            <button
              onClick={handleCopySubdomainLink}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Дэд домайн холбоос
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
