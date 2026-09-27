import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { getProgramPermalink } from '../../utils/permalinks';
import {
  X,
  CheckCircle2,
  Clock,
  Users,
  BookOpen,
  ArrowRight,
  Tag,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Images,
  Award,
  Sparkles
} from 'lucide-react';

export const ProgramDetailModal: React.FC = () => {
  const { selectedProgramModal, setSelectedProgramModal, setIsAdmissionModalOpen, schoolInfo } = useSchool();
  const [copied, setCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProgramModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProgramModal(null);
      }
    };
    if (selectedProgramModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProgramModal, setSelectedProgramModal]);

  if (!selectedProgramModal) return null;

  const handleApply = () => {
    setSelectedProgramModal(null);
    setIsAdmissionModalOpen(true);
  };

  // Direct shareable permalink
  const permalink = getProgramPermalink(selectedProgramModal.slug || selectedProgramModal.id);

  // Extract all valid images (up to 3)
  const imagesList = Array.isArray(selectedProgramModal.images) && selectedProgramModal.images.length > 0
    ? selectedProgramModal.images.filter(Boolean)
    : [selectedProgramModal.imageUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=900&auto=format&fit=crop'];

  const currentImage = imagesList[activeImageIndex] || imagesList[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(permalink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  return (
    <div
      id="program-detail-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={() => setSelectedProgramModal(null)}
    >
      <div
        id="program-detail-modal"
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Clean, High Contrast, Matching News Style) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs">
              {selectedProgramModal.categoryName || 'Сургалтын хөтөлбөр'}
            </span>
            <span className="text-xs text-slate-300 truncate hidden sm:inline">
              {schoolInfo?.name || 'Эрдмийн далай сургууль'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-slate-700 shadow-2xs"
              title="Шууд холбоос хуулах"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Холбоос хууллаа!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Хуваалцах</span>
                </>
              )}
            </button>
            <button
              onClick={() => setSelectedProgramModal(null)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-900/50 hover:text-red-300 text-slate-300 transition-colors cursor-pointer"
              title="Хаах (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {/* Main Photo Gallery (1 to 3 images, matching news article gallery) */}
          <div className="relative w-full bg-slate-950 overflow-hidden shrink-0 group">
            <div className="relative aspect-16/9 sm:aspect-21/9 max-h-84 w-full flex items-center justify-center bg-slate-900">
              <img
                src={currentImage}
                alt={selectedProgramModal.title}
                className="w-full h-full object-cover transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Multi-image navigation arrows */}
              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition-all shadow-md cursor-pointer opacity-90 group-hover:opacity-100"
                    title="Өмнөх зураг"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition-all shadow-md cursor-pointer opacity-90 group-hover:opacity-100"
                    title="Дараагийн зураг"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo Index Indicator */}
              {imagesList.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 border border-white/10">
                  <Images className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {activeImageIndex + 1} / {imagesList.length} зураг
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails if > 1 image */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-2 p-2.5 bg-slate-900 border-t border-slate-800 overflow-x-auto justify-center">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-11 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-0 left-0 bg-black/70 text-white text-[9px] font-bold px-1 rounded-br">
                      #{idx + 1}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Program Content Container - Spacious & High Contrast */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Quick Meta Chips */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5 flex-wrap">
                {selectedProgramModal.ageRange && (
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>Насны ангилал: {selectedProgramModal.ageRange}</span>
                  </span>
                )}
                {selectedProgramModal.schedule && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Хуваарь: {selectedProgramModal.schedule}</span>
                  </span>
                )}
              </div>

              {selectedProgramModal.featured && (
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Онцлох хөтөлбөр</span>
                </span>
              )}
            </div>

            {/* Program Title */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {selectedProgramModal.title}
              </h1>
            </div>

            {/* Subtitle / Key Focus Highlights Box */}
            {selectedProgramModal.subtitle && (
              <div className="p-4 sm:p-5 bg-amber-50/90 rounded-2xl border-l-4 border-amber-500 text-sm sm:text-base text-slate-800 font-medium leading-relaxed shadow-2xs">
                {selectedProgramModal.subtitle}
              </div>
            )}

            {/* Tags list */}
            {selectedProgramModal.tags && selectedProgramModal.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedProgramModal.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Detailed Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Хөтөлбөрийн тухай дэлгэрэнгүй</span>
              </h3>
              <div className="prose max-w-none text-slate-800 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-3 font-normal">
                {selectedProgramModal.description}
              </div>
            </div>

            {/* Curriculum & Standard Section */}
            {selectedProgramModal.curriculum && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Сургалтын төлөвлөгөө & Академик стандарт</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {selectedProgramModal.curriculum}
                </p>
              </div>
            )}

            {/* Features / Advantages Grid */}
            {selectedProgramModal.features && selectedProgramModal.features.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Онцлох давуу талууд & Орчин</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProgramModal.features.map((feat, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs hover:border-emerald-300 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Multi-Image Gallery Grid (if 2 or 3 images) */}
            {imagesList.length > 1 && (
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Images className="w-4 h-4 text-amber-600" />
                  <span>Хөтөлбөрийн зургийн цомог ({imagesList.length} зураг)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imagesList.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        activeImageIndex === idx
                          ? 'border-amber-500 ring-2 ring-amber-400/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Program gallery ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Link Share Bar */}
            <div className="p-3 sm:p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs w-full min-w-0 max-w-full overflow-hidden">
              <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-semibold text-slate-600 shrink-0">Шууд холбоос:</span>
                    <span className="text-xs font-mono text-slate-600 truncate min-w-0 flex-1 select-all" title={permalink}>
                      {permalink}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl bg-white hover:bg-slate-100 active:scale-98 border border-slate-300 text-slate-700 font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Хууллаа!</span>
                  </>
                ) : (
                  <span>Холбоос хуулах</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
          <button
            onClick={() => setSelectedProgramModal(null)}
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Хаах
          </button>
          <button
            onClick={handleApply}
            className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Энэ хөтөлбөрт элсэх хүсэлт илгээх</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
