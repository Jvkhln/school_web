import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { INITIAL_HERO_SLIDES } from '../data/initialData';
import { NewsArticle } from '../types';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, FileText } from 'lucide-react';
import { FALLBACK_IMAGE_URL } from './Admin/ImagePresetPicker';
import { formatGoogleDriveImageUrl } from '../lib/googleDrive';

interface DisplaySlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  badge?: string;
  newsArticle?: NewsArticle;
}

export const HeroSlider: React.FC = () => {
  const { heroSlides, news, openNewsArticle, setIsAdmissionModalOpen, schoolInfo } = useSchool();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const defaultFallbackImage = schoolInfo?.defaultNewsImageUrl || FALLBACK_IMAGE_URL;

  // Combine featured news articles + active hero slides
  const activeSlides: DisplaySlide[] = useMemo(() => {
    const featuredNewsSlides: DisplaySlide[] = (news || [])
      .filter((n) => n.featured)
      .map((n) => {
        const firstImg = (n.images && n.images.length > 0 && n.images[0]) || n.imageUrl || defaultFallbackImage;
        return {
          id: `featured-news-${n.id}`,
          title: n.title,
          subtitle: n.excerpt || (n.content ? n.content.replace(/<[^>]*>?/gm, '').slice(0, 160) + '...' : ''),
          imageUrl: firstImg,
          buttonText: 'Дэлгэрэнгүй',
          buttonLink: `#news/${n.slug || n.id}`,
          badge: n.categoryName ? `${n.categoryName} • Онцлох нийтлэл` : 'Онцлох нийтлэл',
          newsArticle: n
        };
      });

    const baseSource = (heroSlides && heroSlides.length > 0) ? heroSlides : INITIAL_HERO_SLIDES;
    const baseSlides: DisplaySlide[] = baseSource
      .filter((s) => s.active !== false)
      .map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle || '',
        imageUrl: s.imageUrl || defaultFallbackImage,
        buttonText: s.buttonText || 'Дэлгэрэнгүй',
        buttonLink: s.buttonLink || '#news',
        badge: s.badge
      }));

    // Put featured news articles in front, then standard hero slides
    const combined = [...featuredNewsSlides, ...baseSlides];
    
    // Always guarantee at least initial slides if all turned off
    if (combined.length > 0) {
      return combined;
    }

    return INITIAL_HERO_SLIDES.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      imageUrl: s.imageUrl || defaultFallbackImage,
      buttonText: 'Дэлгэрэнгүй',
      buttonLink: s.buttonLink || '#news',
      badge: s.badge
    }));
  }, [heroSlides, news, defaultFallbackImage]);

  // Safe index calculation to prevent out-of-bounds rendering
  const totalSlides = activeSlides.length;
  const safeIndex = (currentIndex >= 0 && currentIndex < totalSlides) ? currentIndex : 0;

  // Reset index safely if total slides change
  useEffect(() => {
    if (currentIndex >= totalSlides) {
      setCurrentIndex(0);
    }
  }, [totalSlides, currentIndex]);

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto slide interval with pause-on-hover
  useEffect(() => {
    if (totalSlides <= 1 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, isHovered]);

  const current = activeSlides[safeIndex] || activeSlides[0];

  if (!current) {
    return null;
  }

  const handleCtaClick = () => {
    if (!current) return;

    if (current.newsArticle) {
      openNewsArticle(current.newsArticle);
      return;
    }

    if (current.buttonLink?.startsWith('#news/')) {
      const slugOrId = current.buttonLink.replace('#news/', '');
      const found = news.find((n) => n.id === slugOrId || n.slug === slugOrId);
      if (found) {
        openNewsArticle(found);
        return;
      }
    }

    if (current.buttonLink === '#admission') {
      setIsAdmissionModalOpen(true);
      return;
    }

    if (current.buttonLink === '#programs') {
      const el = document.getElementById('programs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (current.buttonLink === '#news') {
      const el = document.getElementById('news');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (current.buttonLink?.startsWith('#')) {
      const targetId = current.buttonLink.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (current.buttonLink?.startsWith('http')) {
      window.open(current.buttonLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      id="hero-slider-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[520px] sm:h-[600px] lg:h-[650px] overflow-hidden bg-slate-950 select-none"
    >
      {/* Background Images with Stable Cross-fade transition */}
      {activeSlides.map((slide, index) => {
        const isCurrent = index === safeIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isCurrent ? 'opacity-100 z-1 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={formatGoogleDriveImageUrl(slide.imageUrl) || defaultFallbackImage}
              alt={slide.title}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== defaultFallbackImage) {
                  target.src = defaultFallbackImage;
                }
              }}
              className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-10000"
              referrerPolicy="no-referrer"
            />
            {/* Subtle gradient overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent sm:from-black/80 sm:via-black/45 sm:to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
          </div>
        );
      })}

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-10 lg:px-16 flex flex-col justify-center z-10">
        <div className="max-w-2xl text-white space-y-4 sm:space-y-6 bg-slate-950/65 sm:bg-slate-950/50 p-6 sm:p-8 rounded-3xl backdrop-blur-xs border border-white/10 shadow-2xl">
          {/* Top Badge */}
          {current.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-xs border border-emerald-400/30">
              {current.newsArticle ? <FileText className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{current.badge}</span>
            </div>
          )}

          {/* Main Hero Title */}
          <h1
            onClick={handleCtaClick}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md cursor-pointer hover:text-emerald-300 transition-colors line-clamp-3"
          >
            {current.title}
          </h1>

          {/* Subtitle / Description */}
          {current.subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow-sm line-clamp-3">
              {current.subtitle}
            </p>
          )}

          {/* Action CTA Button - Only 'Дэлгэрэнгүй' */}
          <div className="pt-2 sm:pt-3 flex items-center">
            <button
              id="hero-cta-button"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-xl hover:shadow-emerald-600/40 transition-all cursor-pointer ring-1 ring-emerald-400/30"
            >
              <span>{current.buttonText || 'Дэлгэрэнгүй'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Prev Navigation Arrow Button */}
      {totalSlides > 1 && (
        <button
          id="hero-prev-btn"
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 hover:bg-white/60 text-white flex items-center justify-center backdrop-blur-xs transition-all active:scale-90 hover:scale-105 cursor-pointer shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Navigation Arrow Button */}
      {totalSlides > 1 && (
        <button
          id="hero-next-btn"
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 hover:bg-white/60 text-white flex items-center justify-center backdrop-blur-xs transition-all active:scale-90 hover:scale-105 cursor-pointer shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Horizontal Slider Indicator Dots */}
      {totalSlides > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 transition-all rounded-full cursor-pointer ${
                idx === safeIndex ? 'w-8 bg-emerald-500 shadow-md' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

