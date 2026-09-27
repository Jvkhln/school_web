import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Images,
  Scroll,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  title?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  title,
  onClose
}) => {
  const validImages = Array.isArray(images) && images.length > 0 ? images.filter(Boolean) : [];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = Fit screen, 1.5, 2, 2.5, 3
  const [isScrollMode, setIsScrollMode] = useState<boolean>(false); // Scrollable full height mode
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
      setIsScrollMode(false);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && validImages.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
        setZoomLevel(1);
      } else if (e.key === 'ArrowLeft' && validImages.length > 1) {
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
        setZoomLevel(1);
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel((prev) => Math.min(prev + 0.3, 3));
      } else if (e.key === '-') {
        setZoomLevel((prev) => Math.max(prev - 0.3, 1));
      } else if (e.key === '0') {
        setZoomLevel(1);
        setIsScrollMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, validImages.length, onClose]);

  if (!isOpen || validImages.length === 0) return null;

  const currentImage = validImages[currentIndex] || validImages[0];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
    setZoomLevel(1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    setZoomLevel(1);
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.35, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.35, 1));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(1);
    setIsScrollMode(false);
  };

  const toggleScrollMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsScrollMode((prev) => !prev);
    setZoomLevel(1);
  };

  return (
    <div
      id="image-lightbox-overlay"
      className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-2 sm:p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 py-2 px-3 text-white z-20 shrink-0 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Info & Counter */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 shrink-0">
            <Images className="w-3.5 h-3.5" />
            <span>
              {currentIndex + 1} / {validImages.length}
            </span>
          </div>
          {title && (
            <h3 className="text-xs sm:text-sm font-semibold text-slate-200 truncate max-w-xs sm:max-w-md md:max-w-lg hidden xs:block">
              {title}
            </h3>
          )}
        </div>

        {/* Right: Zoom & Scroll Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Scroll Full Height Toggle */}
          <button
            type="button"
            onClick={toggleScrollMode}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer border ${
              isScrollMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Зургийг дээш доош чөлөөтэй гүйлгэж харах горим"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isScrollMode ? 'Дэлгэцэнд багтаах' : 'Дээш доош гүйлгэх'}
            </span>
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer border border-slate-700"
            title="Жижигрүүлэх (-)"
          >
            <ZoomOut className="w-4 h-4 text-amber-400" />
          </button>

          {/* Zoom Percentage / Reset */}
          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono font-bold transition-colors cursor-pointer border border-slate-700"
            title="Хэмжээг тэглэх (100%)"
          >
            {Math.round(zoomLevel * 100)}%
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer border border-slate-700"
            title="Томруулах (+)"
          >
            <ZoomIn className="w-4 h-4 text-amber-400" />
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/70 hover:text-red-200 text-white transition-colors cursor-pointer border border-slate-700 ml-1"
            title="Хаах (Esc)"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        ref={scrollContainerRef}
        className="relative flex-1 w-full max-w-7xl mx-auto flex items-center justify-center overflow-auto my-2 custom-scrollbar"
        onClick={(e) => {
          // If clicked directly on the stage background (not the image), close or reset
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Prev Arrow */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900/85 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md border border-slate-700 transition-all shadow-2xl cursor-pointer hover:scale-105 active:scale-95"
            title="Өмнөх зураг (←)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* Scrollable / Full Clarity Image Presentation */}
        <div
          className={`flex items-center justify-center transition-transform duration-200 ${
            isScrollMode
              ? 'w-full max-w-4xl py-6 my-auto'
              : 'max-h-full max-w-full'
          }`}
          style={
            !isScrollMode && zoomLevel > 1
              ? {
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  cursor: 'grab'
                }
              : undefined
          }
          onClick={(e) => {
            e.stopPropagation();
            if (!isScrollMode) {
              if (zoomLevel === 1) {
                setZoomLevel(1.6);
              } else {
                setZoomLevel(1);
              }
            }
          }}
        >
          <img
            src={currentImage}
            alt={title || 'Томруулсан зураг'}
            className={`${
              isScrollMode
                ? 'w-full h-auto object-contain rounded-2xl shadow-2xl ring-1 ring-white/10'
                : 'max-h-[75vh] sm:max-h-[82vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10'
            }`}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Next Arrow */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900/85 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md border border-slate-700 transition-all shadow-2xl cursor-pointer hover:scale-105 active:scale-95"
            title="Дараагийн зураг (→)"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}
      </div>

      {/* Bottom Controls & Thumbnail Strip */}
      <div
        className="w-full max-w-4xl mx-auto flex flex-col items-center gap-2 py-1 px-3 z-20 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation hint */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 bg-slate-900/70 px-3 py-1 rounded-full border border-slate-800/80 backdrop-blur-xs">
          <span>💡 Зураг дээр дарж томруулах эсвэл <b>"Дээш доош гүйлгэх"</b> горимоор бүрэн нарийвчлалтай унших боломжтой</span>
        </div>

        {/* Thumbnails (if > 1 image) */}
        {validImages.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-full py-1">
            {validImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setZoomLevel(1);
                }}
                className={`relative w-14 h-10 sm:w-16 sm:h-11 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  currentIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 opacity-100 shadow-md'
                    : 'border-slate-700/80 opacity-50 hover:opacity-90'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-0.5 left-0.5 bg-black/80 text-amber-400 text-[9px] font-bold px-1 rounded">
                  #{idx + 1}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
