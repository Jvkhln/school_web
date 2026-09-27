import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { CalendarSidebar } from './CalendarSidebar';
import { ArrowRight, Sparkles, PlusCircle } from 'lucide-react';

export const FeaturedPrograms: React.FC = () => {
  const {
    programs,
    sectionTexts,
    setSelectedProgramModal,
    searchQuery,
    setIsAdminOpen,
    isAdminAuthenticated
  } = useSchool();

  // Local program filter
  const [selectedProgramCategory, setSelectedProgramCategory] = useState<string>('all');

  // Extract unique category names from available programs
  const availableProgramCategories = Array.from(
    new Set(programs.map((p) => p.categoryName || p.categorySlug).filter(Boolean))
  );

  // Filter programs based on local category filter and searchQuery
  const filteredPrograms = programs.filter((prog) => {
    const matchesCategory =
      selectedProgramCategory === 'all' ||
      prog.categoryName === selectedProgramCategory ||
      prog.categorySlug === selectedProgramCategory;
    const matchesSearch =
      !searchQuery ||
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(prog.tags) && prog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="programs" className="py-16 sm:py-20 bg-white px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span>🎓 Боловсрол & Хөгжлийн хөтөлбөр</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {sectionTexts.programsTitle || 'Сургалтын онцлох хөтөлбөрүүд'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {sectionTexts.programsSubtitle || 'Кембрижийн олон улсын стандарт, STEM сургалт, хэлний хөтөлбөрүүд'}
          </p>

          {/* Filter Pills for Programs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setSelectedProgramCategory('all')}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedProgramCategory === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Бүх хөтөлбөр ({programs.length})
            </button>
            {availableProgramCategories.map((catName) => {
              const count = programs.filter(
                (p) => p.categoryName === catName || p.categorySlug === catName
              ).length;
              return (
                <button
                  key={catName}
                  onClick={() => setSelectedProgramCategory(catName)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedProgramCategory === catName
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {catName} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Side-by-side Layout: Programs + Calendar Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Programs Column (8 of 12 columns on large screens) */}
          <div className="lg:col-span-8">
            {/* Empty state */}
            {filteredPrograms.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 p-8">
                <Sparkles className="w-10 h-10 text-amber-500/80 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Энэ ангилалд одоогоор хөтөлбөр олдсонгүй
                </h3>
                <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">
                  Та сонгосон ангиллаа өөрчлөх эсвэл бусад бүх хөтөлбөртэй танилцана уу.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-3">
                  <button
                    onClick={() => setSelectedProgramCategory('all')}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    Бүх хөтөлбөрийг харах ({programs.length})
                  </button>
                  {isAdminAuthenticated && (
                    <button
                      onClick={() => setIsAdminOpen(true)}
                      className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Хөтөлбөр нэмэх (Админ)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Program Cards Grid (2 columns on tablet/desktop within the 8-col area) */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {filteredPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    id={`program-card-${prog.id}`}
                    onClick={() => setSelectedProgramModal(prog)}
                    className="group cursor-pointer flex flex-col items-center text-center transition-all duration-300 bg-white hover:bg-slate-50/50 p-3 sm:p-4 rounded-3xl border border-transparent hover:border-slate-200/80 hover:shadow-lg"
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden mb-4 shadow-2xs group-hover:shadow-md transition-all duration-500 bg-slate-100">
                      <img
                        src={prog.imageUrl}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=900&auto=format&fit=crop';
                        }}
                      />
                      {/* Category pill */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-slate-100">
                        {prog.categoryName}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug mb-1.5 px-1">
                      {prog.title}
                    </h3>

                    {/* Subtitle / Description */}
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-3 px-1 line-clamp-2">
                      {prog.subtitle}
                    </p>

                    {/* View Details Link */}
                    <div className="mt-auto inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-600 group-hover:text-amber-700 group-hover:translate-x-1 transition-all">
                      <span>Дэлгэрэнгүй үзэх</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendar Plan Sidebar (4 of 12 columns on large screens) */}
          <div className="lg:col-span-4 w-full">
            <CalendarSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};
