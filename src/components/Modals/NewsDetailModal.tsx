import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { getNewsPermalink } from '../../utils/permalinks';
import { ImageLightboxModal } from './ImageLightboxModal';
import {
  X,
  Calendar,
  Eye,
  User,
  Share2,
  Tag,
  Check,
  Maximize2,
  Images,
  Link,
  Copy,
  ZoomIn,
  Facebook,
  Video,
  Music,
  Play,
  Volume2
} from 'lucide-react';

export const NewsDetailModal: React.FC = () => {
  const { selectedNewsModal, closeNewsModal, schoolInfo } = useSchool();
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLightboxOpen(false);
    setLightboxIndex(0);
  }, [selectedNewsModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !lightboxOpen) {
        closeNewsModal();
      }
    };
    if (selectedNewsModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedNewsModal, lightboxOpen, closeNewsModal]);

  if (!selectedNewsModal) return null;

  // Direct shareable permalink
  const permalink = getNewsPermalink(selectedNewsModal.slug || selectedNewsModal.id);

  // Extract all valid images
  const defaultFallback = schoolInfo?.defaultNewsImageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop';
  const imagesList = Array.isArray(selectedNewsModal.images) && selectedNewsModal.images.length > 0
    ? selectedNewsModal.images.filter(Boolean)
    : [selectedNewsModal.imageUrl || defaultFallback];

  // 1 Single Header Cover Image (Strictly only 1 image)
  const headerCoverImage = selectedNewsModal.imageUrl || imagesList[0] || defaultFallback;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(permalink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(permalink)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=620,height=580');
  };

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div
        id="news-detail-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        onClick={closeNewsModal}
      >
        <div
          id="news-detail-modal"
          className="relative bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                {selectedNewsModal.categoryName || 'Мэдээ'}
              </span>
              <span className="text-xs text-slate-300 truncate hidden sm:inline">
                {schoolInfo?.name || 'Эрдмийн далай сургууль'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Facebook Share Button */}
              <button
                type="button"
                onClick={handleFacebookShare}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
                title="Facebook дээр хуваалцах"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
                <span className="hidden xs:inline">Facebook</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-slate-700 shadow-2xs"
                title="Шууд холбоос хуулах"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Хууллаа!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Хуваалцах</span>
                  </>
                )}
              </button>
              <button
                onClick={closeNewsModal}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-900/50 hover:text-red-300 text-slate-300 transition-colors cursor-pointer"
                title="Хаах (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Container */}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {/* 1. Header Cover Image - Compact pixel height banner with click-to-enlarge & full scroll viewer */}
            <div
              className="relative w-full bg-slate-950 overflow-hidden shrink-0 group cursor-pointer"
              onClick={() => openLightboxAt(0)}
              title="Зургийг дарж бүтэн нарийвчлалтайгаар дээш доош гүйлгэж харах"
            >
              {/* Compact height container (takes fewer vertical pixels on screen) */}
              <div className="relative h-44 sm:h-52 md:h-56 w-full flex items-center justify-center bg-slate-900 overflow-hidden">
                {/* Background blurred ambiance */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-40 scale-110"
                  style={{ backgroundImage: `url(${headerCoverImage})` }}
                />

                {/* Clear main cover photo */}
                <img
                  src={headerCoverImage}
                  alt={selectedNewsModal.title}
                  className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-300 shadow-md"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultFallback;
                  }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Click-to-enlarge & scroll badge */}
                <div className="absolute bottom-3 right-3 z-20 bg-slate-950/85 hover:bg-amber-500 hover:text-slate-950 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 border border-white/20 shadow-lg transition-all group-hover:scale-105">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Томруулж, гүйлгэж харах</span>
                </div>
              </div>
            </div>

            {/* Article Text Content Section */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Metadata Bar - High Contrast with prominent View Counter */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5 flex-wrap">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>{selectedNewsModal.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">{selectedNewsModal.author || 'Сургуулийн захиргаа'}</span>
                  </span>
                  {/* Prominent View Counter Badge */}
                  <span className="flex items-center gap-1.5 font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-lg shadow-2xs">
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>{selectedNewsModal.views || 0} хүн үзсэн</span>
                  </span>
                </div>

                {selectedNewsModal.featured && (
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
                    ⭐️ Онцлох мэдээ
                  </span>
                )}
              </div>

              {/* Main Article Title - Fully clear and high contrast */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {selectedNewsModal.title}
              </h1>

              {/* Excerpt Lead Paragraph */}
              {selectedNewsModal.excerpt && (
                <div className="p-4 sm:p-5 bg-amber-50/90 rounded-2xl border-l-4 border-amber-500 text-sm sm:text-base text-slate-800 font-medium leading-relaxed shadow-2xs">
                  {selectedNewsModal.excerpt}
                </div>
              )}

              {/* Full Content */}
              <div className="prose max-w-none text-slate-800 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-4 font-normal">
                {selectedNewsModal.content}
              </div>

              {/* MP4 Video Player Section if present */}
              {selectedNewsModal.videoUrl && (
                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Video className="w-3.5 h-3.5" />
                      </div>
                      <span>Хавсаргасан видео бичлэг (MP4)</span>
                    </h4>
                    <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      Видео тоглох
                    </span>
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full max-h-[480px] bg-black"
                      src={selectedNewsModal.videoUrl}
                    >
                      Таны хөтөч видео тоглуулахыг дэмжихгүй байна.
                    </video>
                  </div>
                </div>
              )}

              {/* MP3 Audio Player Section if present */}
              {selectedNewsModal.audioUrl && (
                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Music className="w-3.5 h-3.5" />
                      </div>
                      <span>Хавсаргасан аудио бичлэг / дуу (MP3)</span>
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Аудио сонсох
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                      <Volume2 className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <div className="text-xs font-bold text-white mb-2 truncate">
                        {selectedNewsModal.title} - Аудио бичлэг
                      </div>
                      <audio
                        controls
                        preload="metadata"
                        className="w-full h-10 rounded-lg"
                        src={selectedNewsModal.audioUrl}
                      >
                        Таны хөтөч аудио тоглуулахыг дэмжихгүй байна.
                      </audio>
                    </div>
                  </div>
                </div>
              )}

              {/* Photo Gallery Grid if 2 or more images - Click to enlarge */}
              {imagesList.length > 1 && (
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Images className="w-4 h-4 text-amber-600" />
                      <span>Нийтлэлийн зургийн цомог ({imagesList.length} зураг)</span>
                    </h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <ZoomIn className="w-3 h-3 text-amber-600" />
                      <span>Зурган дээр дарж томоор үзнэ үү</span>
                    </span>
                  </div>

                  <div className={`grid gap-3 ${imagesList.length === 2 ? 'grid-cols-2' : imagesList.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}>
                    {imagesList.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => openLightboxAt(i)}
                        className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-500 cursor-pointer group shadow-2xs hover:shadow-md transition-all"
                        title={`Зураг ${i + 1}-ийг томоор үзэх`}
                      >
                        <img
                          src={img}
                          alt={`Photo ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultFallback;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-100 scale-90 w-9 h-9 rounded-full bg-slate-900/85 text-amber-400 flex items-center justify-center backdrop-blur-xs border border-white/20 shadow-lg">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
                          #{i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Permalink Box for Sub-domain/Direct link sharing */}
              <div className="pt-4 border-t border-slate-100 w-full min-w-0">
                <div className="p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full min-w-0 max-w-full overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                    <div className="w-6 h-6 rounded-lg bg-slate-200/70 text-slate-600 flex items-center justify-center shrink-0">
                      <Link className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-semibold text-slate-600 shrink-0">Шууд холбоос:</span>
                        <span className="text-xs font-mono text-slate-500 truncate min-w-0 flex-1 select-all" title={permalink}>
                          {permalink}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={handleFacebookShare}
                      className="flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 bg-[#1877F2] hover:bg-[#166fe5] active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      title="Facebook дээр нийтлэх"
                    >
                      <Facebook className="w-3.5 h-3.5 fill-current" />
                      <span>Facebook-т хуваалцах</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 bg-white hover:bg-slate-100 active:scale-98 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Хууллаа!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Хуулах</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Bottom Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>Нийт <b>{selectedNewsModal.views || 0}</b> хүн уншсан</span>
            </div>
            <button
              onClick={closeNewsModal}
              className="text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Хаах
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Lightbox for Full-screen Image Zoom */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        images={imagesList}
        initialIndex={lightboxIndex}
        title={selectedNewsModal.title}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};
