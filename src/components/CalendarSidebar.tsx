import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { CalendarEvent } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CalendarDays,
  Tag,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Info,
  SlidersHorizontal,
  FileSpreadsheet,
  Facebook,
  ExternalLink
} from 'lucide-react';
import {
  getMongoliaTargetMonths,
  isEventInMongoliaMonths
} from '../utils/mongoliaTime';

export const CalendarSidebar: React.FC = () => {
  const {
    calendarEvents,
    isAdminAuthenticated,
    openAdmin,
    setIsAdminOpen
  } = useSchool();

  const [activeMonthFilter, setActiveMonthFilter] = useState<'upcoming' | string>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Responsive width tracking for Facebook iframe widget to fit container exactly
  const fbContainerRef = useRef<HTMLDivElement>(null);
  const [fbWidth, setFbWidth] = useState<number>(340);

  useEffect(() => {
    if (!fbContainerRef.current) return;
    const updateWidth = () => {
      if (fbContainerRef.current) {
        const clientWidth = Math.floor(fbContainerRef.current.clientWidth);
        if (clientWidth > 0) {
          // Facebook Page Plugin accepts width between 180 and 500
          const clamped = Math.min(Math.max(clientWidth, 180), 500);
          setFbWidth(clamped);
        }
      }
    };

    updateWidth();
    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    observer.observe(fbContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Dynamic calculation based on Mongolia Timezone (Asia/Ulaanbaatar, UTC+8)
  const mongoliaTarget = useMemo(() => {
    return getMongoliaTargetMonths();
  }, []);

  // Extract distinct months present in the calendar events, sorted chronologically
  const availableMonths = useMemo(() => {
    const monthsMap = new Map<string, string>();
    calendarEvents.forEach((ev) => {
      if (ev.month) {
        monthsMap.set(ev.month, ev.monthName || ev.month);
      }
    });
    return Array.from(monthsMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [calendarEvents]);

  // Determine the next 1-2 upcoming months specifically in Mongolia's current timezone window
  const upcomingMonths = useMemo(() => {
    return mongoliaTarget.windowCodes; // e.g. ["2026-09", "2026-10"]
  }, [mongoliaTarget]);

  // Filter events based on active month filter and category using Mongolia timezone
  const filteredEvents = useMemo(() => {
    return calendarEvents.filter((ev) => {
      // Month match based on Mongolia Timezone
      let matchesMonth = true;
      if (activeMonthFilter === 'upcoming') {
        matchesMonth = isEventInMongoliaMonths(ev, upcomingMonths);
      } else if (activeMonthFilter !== 'all') {
        matchesMonth = isEventInMongoliaMonths(ev, [activeMonthFilter]);
      }

      // Category match supporting 3-color harmonious groups
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'academic') {
          matchesCategory = ev.category === 'exam' || ev.category === 'olympiad';
        } else if (selectedCategory === 'event') {
          matchesCategory = ev.category === 'event' || ev.category === 'admission' || ev.category === 'meeting';
        } else if (selectedCategory === 'holiday') {
          matchesCategory = ev.category === 'holiday';
        } else {
          matchesCategory = ev.category === selectedCategory;
        }
      }

      return matchesMonth && matchesCategory;
    }).sort((a, b) => {
      // Sort by month then day
      if (a.month !== b.month) return a.month.localeCompare(b.month);
      return a.day.localeCompare(b.day);
    });
  }, [calendarEvents, activeMonthFilter, selectedCategory, upcomingMonths]);

  // Category visual styles based on 3 harmonious color palettes:
  // 1. Blue: Academic & Exams (exam, olympiad)
  // 2. Amber: Events & Community (event, admission, meeting)
  // 3. Emerald: Holidays & Vacations (holiday)
  const getCategoryStyles = (category: CalendarEvent['category']) => {
    switch (category) {
      case 'exam':
      case 'olympiad':
        return {
          group: 'academic',
          groupName: 'Сургалт, Шалгалт',
          badge: 'bg-blue-100 text-blue-900 border-blue-200',
          dot: 'bg-blue-600',
          dayBg: 'bg-gradient-to-br from-blue-50 to-blue-100/70 border-blue-200 text-blue-950',
          borderHighlight: 'border-l-4 border-l-blue-600',
          accentColor: 'text-blue-700'
        };
      case 'holiday':
        return {
          group: 'holiday',
          groupName: 'Баяр, Амралт',
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          dot: 'bg-emerald-500',
          dayBg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/70 border-emerald-200 text-emerald-950',
          borderHighlight: 'border-l-4 border-l-emerald-500',
          accentColor: 'text-emerald-700'
        };
      case 'admission':
      case 'meeting':
      case 'event':
      default:
        return {
          group: 'event',
          groupName: 'Арга хэмжээ, Бүртгэл',
          badge: 'bg-amber-100 text-amber-950 border-amber-300',
          dot: 'bg-amber-500',
          dayBg: 'bg-gradient-to-br from-amber-50 to-amber-100/70 border-amber-200 text-amber-950',
          borderHighlight: 'border-l-4 border-l-amber-500',
          accentColor: 'text-amber-700'
        };
    }
  };

  return (
    <div className="bg-slate-50/90 border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col relative">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base lg:text-lg leading-tight flex items-center gap-1.5">
              <span>Хуанли & Төлөвлөгөө</span>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {mongoliaTarget.academicYear} Оны сургалтын төлөвлөгөө
              </p>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded-md border border-amber-200/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>УБ: {mongoliaTarget.current.name}</span>
              </span>
            </div>
          </div>
        </div>

        {isAdminAuthenticated && (
          <button
            onClick={() => setIsAdminOpen(true)}
            className="text-[10px] sm:text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 sm:px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 border border-amber-300 shrink-0 cursor-pointer"
            title="Төлөвлөгөө засах / нэмэх"
          >
            <PlusCircle className="w-3 h-3 text-amber-700" />
            <span>Засах</span>
          </button>
        )}
      </div>

      {/* 3-Color Harmony Legend Bar */}
      <div className="mt-3 grid grid-cols-3 gap-1 p-1.5 bg-white/90 rounded-2xl border border-slate-200/80 shadow-2xs">
        <button
          type="button"
          onClick={() => setSelectedCategory(selectedCategory === 'academic' ? 'all' : 'academic')}
          className={`flex items-center justify-center gap-1.5 py-1 px-1.5 rounded-xl transition-all text-left cursor-pointer ${
            selectedCategory === 'academic'
              ? 'bg-blue-100/90 text-blue-950 font-bold shadow-2xs'
              : 'hover:bg-blue-50/60 text-slate-700'
          }`}
          title="Сургалт, шалгалт, олимпиадаар шүүх"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 ring-2 ring-blue-200" />
          <span className="text-[11px] font-bold truncate">Сургалт, Шалгалт</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory(selectedCategory === 'event' ? 'all' : 'event')}
          className={`flex items-center justify-center gap-1.5 py-1 px-1.5 rounded-xl transition-all text-left cursor-pointer ${
            selectedCategory === 'event'
              ? 'bg-amber-100/90 text-amber-950 font-bold shadow-2xs'
              : 'hover:bg-amber-50/60 text-slate-700'
          }`}
          title="Арга хэмжээ, бүртгэл, уулзалтаар шүүх"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 ring-2 ring-amber-200" />
          <span className="text-[11px] font-bold truncate">Арга хэмжээ</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory(selectedCategory === 'holiday' ? 'all' : 'holiday')}
          className={`flex items-center justify-center gap-1.5 py-1 px-1.5 rounded-xl transition-all text-left cursor-pointer ${
            selectedCategory === 'holiday'
              ? 'bg-emerald-100/90 text-emerald-950 font-bold shadow-2xs'
              : 'hover:bg-emerald-50/60 text-slate-700'
          }`}
          title="Баяр, сурагчдын амралтаар шүүх"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-200" />
          <span className="text-[11px] font-bold truncate">Баяр, Амралт</span>
        </button>
      </div>

      {/* Month Slide / Tab Bar */}
      <div className="pt-3 sm:pt-4 pb-2 sm:pb-3">
        <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Сар сонгох:</span>
          <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 truncate max-w-[180px]">
            {activeMonthFilter === 'upcoming'
              ? `Сүүлийн 1-2 сар (${mongoliaTarget.current.name}, ${mongoliaTarget.next.name})`
              : activeMonthFilter === 'all'
              ? 'Бүх сар'
              : availableMonths.find(([m]) => m === activeMonthFilter)?.[1] || activeMonthFilter}
          </span>
        </div>

        {/* Scrollable / Sliding Month Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none no-scrollbar">
          <button
            onClick={() => setActiveMonthFilter('upcoming')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeMonthFilter === 'upcoming'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Сүүлийн 1-2 сар ({mongoliaTarget.current.name}, {mongoliaTarget.next.name})</span>
          </button>

          {availableMonths.map(([mCode, mName]) => {
            const isCurrentMonth = mCode === mongoliaTarget.current.code;
            return (
              <button
                key={mCode}
                onClick={() => setActiveMonthFilter(mCode)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeMonthFilter === mCode
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {isCurrentMonth && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                )}
                <span>{mName}</span>
                {isCurrentMonth && (
                  <span className={`text-[9px] font-extrabold px-1 py-0.2 rounded border ${
                    activeMonthFilter === mCode
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    Энэ сар
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => setActiveMonthFilter('all')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeMonthFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            Бүгд ({calendarEvents.length})
          </button>
        </div>
      </div>

      {/* 3-Color Harmonious Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pb-3 mb-2 border-b border-slate-200/60 text-[11px]">
        {[
          { id: 'all', label: 'Бүх төрөл', activeClass: 'bg-slate-900 text-white' },
          { id: 'academic', label: '🔵 Сургалт, Шалгалт', activeClass: 'bg-blue-700 text-white shadow-xs' },
          { id: 'event', label: '🟡 Арга хэмжээ', activeClass: 'bg-amber-600 text-white shadow-xs' },
          { id: 'holiday', label: '🟢 Баяр, Амралт', activeClass: 'bg-emerald-700 text-white shadow-xs' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? cat.activeClass
                : 'text-slate-600 hover:bg-slate-200/80 bg-white/80 border border-slate-200/70'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events List / Timeline Display */}
      <div className="flex-1 overflow-y-auto max-h-[460px] pr-1 space-y-2.5 scrollbar-thin">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white/60 rounded-2xl border border-dashed border-slate-300">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 mb-1">
              Энэ хугацаанд төлөвлөгөө бүртгэгдээгүй байна
            </p>
            <p className="text-[11px] text-slate-500 mb-3">
              Өөр сар эсвэл ангилал сонгоно уу.
            </p>
            <button
              onClick={() => {
                setActiveMonthFilter('all');
                setSelectedCategory('all');
              }}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Бүх төлөвлөгөөг харах
            </button>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const styles = getCategoryStyles(ev.category);
            return (
              <div
                key={ev.id}
                id={`calendar-event-${ev.id}`}
                onClick={() => setSelectedEvent(ev)}
                className={`group relative bg-white hover:bg-slate-50/90 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${styles.borderHighlight}`}
              >
                <div className="flex items-start gap-3">
                  {/* Day / Month Badge with 3-color palette */}
                  <div
                    className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl border flex flex-col items-center justify-center shrink-0 shadow-2xs ${styles.dayBg}`}
                  >
                    <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-tight opacity-75 leading-none">
                      {ev.monthName || ev.month.slice(-2) + '-р сар'}
                    </span>
                    <span className="text-base sm:text-lg font-black leading-tight tracking-tight mt-0.5">
                      {ev.day}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${styles.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                        <span>{ev.categoryName}</span>
                      </span>
                      {ev.targetGroup && (
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Users className="w-2.5 h-2.5 text-slate-400" />
                          <span>{ev.targetGroup}</span>
                        </span>
                      )}
                      {ev.isImportant && (
                        <span className="text-[9px] font-extrabold text-amber-900 bg-amber-200/90 px-1.5 py-0.5 rounded border border-amber-300">
                          Онцлох
                        </span>
                      )}
                      {isEventInMongoliaMonths(ev, [mongoliaTarget.current.code]) && (
                        <span className="text-[9px] font-extrabold text-emerald-900 bg-emerald-100/90 px-1.5 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Энэ сард</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-amber-800 transition-colors leading-snug line-clamp-2">
                      {ev.title}
                    </h4>

                    {ev.description && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {ev.description}
                      </p>
                    )}

                    {ev.location && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all self-center shrink-0" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Summary / Quick Note */}
      <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-amber-600" />
          <span>Нийт {calendarEvents.length} төлөвлөгөөт үйл явдал</span>
        </div>

        <button
          onClick={() => setActiveMonthFilter('all')}
          className="font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
        >
          Бүх төлөвлөгөө
        </button>
      </div>

      {/* Facebook Page Plugin Widget */}
      <div className="mt-5 pt-4 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
              <Facebook className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Facebook хуудас</h4>
              <p className="text-[10px] text-slate-500">Эрдмийн Далай Цогцолбор Сургууль</p>
            </div>
          </div>
          <a
            href="https://www.facebook.com/Erdmiindalai.school/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-[#1877F2] hover:text-blue-700 flex items-center gap-1 hover:underline transition-colors"
          >
            <span>Хуудас үзэх</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div
          ref={fbContainerRef}
          className="w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white flex justify-center shadow-2xs"
        >
          <iframe
            src={`https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FErdmiindalai.school%2F&tabs=timeline&width=${fbWidth}&height=470&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=1528415047359780`}
            width={fbWidth}
            height="470"
            style={{ border: 'none', overflow: 'hidden', width: '100%' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Эрдмийн Далай Цогцолбор Сургууль Facebook Page"
            className="w-full block"
          />
        </div>
      </div>

      {/* Selected Event Popup Modal */}
      {selectedEvent && (() => {
        const modalStyles = getCategoryStyles(selectedEvent.category);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div
              className={`bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl p-6 relative space-y-4 animate-in zoom-in-95 duration-200 ${modalStyles.borderHighlight}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-xs ${modalStyles.dayBg}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider block ${modalStyles.accentColor}`}>
                      {selectedEvent.monthName} • {selectedEvent.categoryName}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                      {selectedEvent.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Хугацаа
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedEvent.dateRange || `${selectedEvent.monthName} ${selectedEvent.day}`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Хамаарах бүлэг
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedEvent.targetGroup || 'Бүх сурагчид'}
                    </span>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-2 bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200/80 text-xs">
                    <MapPin className={`w-4 h-4 shrink-0 ${modalStyles.accentColor}`} />
                    <span className="font-medium">Байршил: {selectedEvent.location}</span>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">
                      Дэлгэрэнгүй тайлбар
                    </span>
                    <p className="text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {isAdminAuthenticated && (
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      setIsAdminOpen(true);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Админ самбарт засах
                  </button>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Хаах
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
