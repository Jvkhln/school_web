import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Calendar, ArrowRight, Sparkles, PlusCircle, Eye, Tag, Share2, Check, TrendingUp } from 'lucide-react';
import { NewsArticle } from '../types';
import { getNewsPermalink } from '../utils/permalinks';
import { CalendarSidebar } from './CalendarSidebar';
import { FALLBACK_IMAGE_URL } from './Admin/ImagePresetPicker';
import { formatGoogleDriveImageUrl } from '../lib/googleDrive';

export const ARTICLE_NEWS_CATEGORIES = [
  { slug: 'news-info', name: 'Мэдээ, мэдээлэл' },
  { slug: 'olympiad', name: 'Олимпиад, уралдаан' },
  { slug: 'sports-arts', name: 'Спорт, урлаг соёл' },
  { slug: 'primary', name: 'Бага боловсрол' },
  { slug: 'admission-exam', name: 'Элсэлтийн шалгалт' }
];

export const NewsSection: React.FC = () => {
  const {
    news,
    openNewsArticle,
    searchQuery,
    sectionTexts,
    setIsAdminOpen,
    isAdminAuthenticated,
    activeCategory,
    setActiveCategory,
    schoolInfo
  } = useSchool();

  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'views'>('latest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Dedicated news category list (strictly separated from subdomains)
  const displayNewsCategories = React.useMemo(() => {
    const map = new Map<string, string>();
    ARTICLE_NEWS_CATEGORIES.forEach((c) => map.set(c.slug, c.name));
    news.forEach((n) => {
      if (n.categorySlug && !map.has(n.categorySlug)) {
        map.set(n.categorySlug, n.categoryName || n.categorySlug);
      }
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [news]);

  // Sync with context's activeCategory if changed
  useEffect(() => {
    if (activeCategory && activeCategory !== 'all') {
      const match = displayNewsCategories.find((c) => c.slug === activeCategory);
      if (match) {
        setSelectedNewsCategory(activeCategory);
      }
    }
  }, [activeCategory, displayNewsCategories]);

  const handleCategorySelect = (slug: string) => {
    setSelectedNewsCategory(slug);
    setActiveCategory(slug);
    setVisibleCount(6);
  };

  // Reset pagination when search or sort changes
  useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery, sortBy]);

  // Filter and sort news
  const filteredNews = news
    .filter((item) => {
      const matchesCategory =
        selectedNewsCategory === 'all' || item.categorySlug === selectedNewsCategory;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handleCopyCardLink = (e: React.MouseEvent, item: NewsArticle) => {
    e.stopPropagation();
    const link = getNewsPermalink(item.slug || item.id);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section id="news" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span>📰 Сургуулийн амьдрал & Нийтлэл</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {sectionTexts.newsTitle || 'Сүүлийн үеийн мэдээ мэдээлэл'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {sectionTexts.newsSubtitle || 'Сургуулийн сонин, амжилт, үйл явдал, танилцуулга'}
          </p>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200/70">
          {/* News Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedNewsCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Бүх мэдээ ({news.length})
            </button>
            {displayNewsCategories.map((cat) => {
              const count = news.filter((n) => n.categorySlug === cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  id={`news-cat-${cat.slug}`}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedNewsCategory === cat.slug
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-700 border border-slate-200'
                  }`}
                >
                  {cat.name} {count > 0 && <span className="opacity-80 text-xs">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                sortBy === 'latest'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Шинэ нь эхэндээ</span>
            </button>
            <button
              onClick={() => setSortBy('views')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                sortBy === 'views'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Их үзсэн</span>
            </button>
          </div>
        </div>

        {/* Main Content: 2-Column Side-by-Side (News Grid + Calendar Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: News Articles (8 cols on large screens) */}
          <div className="lg:col-span-8 w-full min-w-0">
            {filteredNews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                <Sparkles className="w-10 h-10 text-amber-500/80 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Энэ ангилалд одоогоор нийтлэл ороогүй байна
                </h3>
                <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">
                  Та сонгосон ангиллаа өөрчлөх эсвэл бусад бүх мэдээтэй танилцана уу.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-3">
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    Бүх нийтлэлийг харах ({news.length})
                  </button>
                  {isAdminAuthenticated && (
                    <button
                      onClick={() => setIsAdminOpen(true)}
                      className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Нийтлэл оруулах (Админ)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* News Cards Grid (2-columns in the 8-col section) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNews.slice(0, visibleCount).map((item) => (
                    <article
                      key={item.id}
                      id={`news-card-${item.id}`}
                      onClick={() => openNewsArticle(item)}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
                    >
                      {/* Image & Badges */}
                      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                        <img
                          src={formatGoogleDriveImageUrl(item.imageUrl || (item.images && item.images[0])) || schoolInfo.defaultNewsImageUrl || FALLBACK_IMAGE_URL}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = schoolInfo.defaultNewsImageUrl || FALLBACK_IMAGE_URL;
                          }}
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="bg-slate-950/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                            {item.categoryName || item.categorySlug}
                          </span>
                          {item.featured && (
                            <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-1 rounded-full shadow-xs flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Онцлох</span>
                            </span>
                          )}
                        </div>

                        {/* Share button overlay */}
                        <button
                          onClick={(e) => handleCopyCardLink(e, item)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                          title="Холбоос хуулах"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Date and View Count */}
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{item.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span>{item.views || 120}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug mb-2">
                            {item.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                            {item.excerpt}
                          </p>
                        </div>

                        {/* Footer tags and Read more */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                          {Array.isArray(item.tags) && item.tags.length > 0 ? (
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate max-w-[60%]">
                              <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{item.tags.join(', ')}</span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 font-medium truncate max-w-[60%]">
                              {item.categoryName || 'Сургуулийн мэдээ'}
                            </div>
                          )}

                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:text-amber-800 transition-colors shrink-0">
                            <span>Дэлгэрэнгүй</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Load More Pagination Bar for large sets of news */}
                {visibleCount < filteredNews.length && (
                  <div className="mt-8 text-center pt-4 border-t border-slate-200/70 flex flex-col items-center gap-2">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-amber-50 hover:text-amber-800 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 shadow-xs hover:border-amber-300 transition-all flex items-center gap-2 cursor-pointer group"
                    >
                      <span>Цааш үзэх (Дахин {Math.min(6, filteredNews.length - visibleCount)} нийтлэл)</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Нийт {filteredNews.length} нийтлэлээс {Math.min(visibleCount, filteredNews.length)}-г харуулж байна
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column: Calendar Sidebar (4 cols on large screens) */}
          <div id="calendar" className="lg:col-span-4 w-full scroll-mt-24">
            <CalendarSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};
