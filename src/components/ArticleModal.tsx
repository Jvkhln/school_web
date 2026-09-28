import React, { useEffect, useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { getArticlePermalink } from '../utils/permalinks';
import { ImageLightboxModal } from './Modals/ImageLightboxModal';
import { FALLBACK_IMAGE_URL } from './Admin/ImagePresetPicker';
import { formatGoogleDriveImageUrl } from '../lib/googleDrive';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  User, 
  Share2, 
  CheckCircle2, 
  Award, 
  Users, 
  Building2, 
  Trophy, 
  Palette, 
  BookOpen, 
  School, 
  FileText, 
  Sparkles,
  ArrowRight,
  BookMarked,
  Images,
  Maximize2,
  ZoomIn,
  Link as LinkIcon,
  Copy,
  Check,
  Facebook,
  Video,
  Music,
  Volume2
} from 'lucide-react';

export const ArticleModal: React.FC = () => {
  const { selectedArticleModal, setSelectedArticleModal, schoolInfo } = useSchool();
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLightboxOpen(false);
    setLightboxIndex(0);
  }, [selectedArticleModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !lightboxOpen) {
        setSelectedArticleModal(null);
      }
    };
    if (selectedArticleModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedArticleModal, lightboxOpen, setSelectedArticleModal]);

  if (!selectedArticleModal) return null;

  const article = selectedArticleModal;
  const defaultFallback = schoolInfo?.defaultNewsImageUrl || FALLBACK_IMAGE_URL;

  // Extract all valid images
  const rawImagesList = Array.isArray(article.images) && article.images.length > 0
    ? article.images.filter(Boolean)
    : [article.coverImage || defaultFallback];
  const imagesList = rawImagesList.map(img => formatGoogleDriveImageUrl(img));

  // 1 Single Header Cover Image (Strictly 1 image)
  const headerCoverImage = formatGoogleDriveImageUrl(article.coverImage) || imagesList[0] || defaultFallback;

  const getIcon = (name?: string) => {
    switch (name) {
      case 'Award': return <Award className="w-4 h-4 text-amber-500" />;
      case 'Users': return <Users className="w-4 h-4 text-blue-500" />;
      case 'Building2': return <Building2 className="w-4 h-4 text-indigo-500" />;
      case 'Trophy': return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'Palette': return <Palette className="w-4 h-4 text-purple-500" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'School': return <School className="w-4 h-4 text-emerald-500" />;
      case 'FileText': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-500" />;
      default: return <BookMarked className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleShare = () => {
    const url = article.articleUrl?.startsWith('http')
      ? article.articleUrl
      : getArticlePermalink(article.slug || article.id);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFacebookShare = () => {
    const url = article.articleUrl?.startsWith('http')
      ? article.articleUrl
      : getArticlePermalink(article.slug || article.id);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=620,height=580');
  };

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div 
        id="article-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
        onClick={() => setSelectedArticleModal(null)}
      >
        <div 
          id="article-modal-content"
          className="relative w-full max-w-3xl my-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                {getIcon(article.iconName)}
                <span>{article.category === 'about' ? 'Бидний тухай' : 'Сургалт'}</span>
              </span>
              {article.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                  {article.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
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
                id="article-share-btn"
                onClick={handleShare}
                title="Холбоос хуулах"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Хууллаа</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Хуваалцах</span>
                  </>
                )}
              </button>
              <button
                id="article-close-btn"
                onClick={() => setSelectedArticleModal(null)}
                title="Хаах (Esc)"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/50 hover:text-red-300 text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Modal Content */}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {/* 1. Header Cover Image - Compact pixel height banner with click-to-enlarge & full scroll viewer */}
            <div 
              className="relative w-full bg-slate-950 overflow-hidden shrink-0 group cursor-pointer"
              onClick={() => openLightboxAt(0)}
              title="Зургийг дарж бүтэн нарийвчлалтайгаар дээш доош гүйлгэж харах"
            >
              {/* Compact height container */}
              <div className="relative h-44 sm:h-52 md:h-56 w-full flex items-center justify-center bg-slate-900 overflow-hidden">
                {/* Background blurred ambiance */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-40 scale-110"
                  style={{ backgroundImage: `url(${headerCoverImage})` }}
                />

                {/* Clear main cover photo */}
                <img
                  src={headerCoverImage}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultFallback;
                  }}
                  className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-300 shadow-md"
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

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Title & Metadata - Crisp and high contrast */}
              <div className="space-y-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100 text-xs sm:text-sm text-slate-500">
                  {article.author && (
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <User className="w-4 h-4 text-amber-600" />
                      <span>{article.author}</span>
                    </div>
                  )}
                  {article.updatedAt && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Шинэчилсэн: {article.updatedAt}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subtitle callout */}
              {article.subtitle && (
                <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1 bg-amber-50/50 rounded-r-xl">
                  {article.subtitle}
                </p>
              )}

              {/* Key Highlights */}
              {article.highlights && article.highlights.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Онцлох мэдээлэл</span>
                  </h4>
                  <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                    {article.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Main Content */}
              <div className="prose max-w-none text-slate-800 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-4">
                {article.content}
              </div>

              {/* MP4 Video Player Section if present */}
              {article.videoUrl && (
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
                      src={article.videoUrl}
                    >
                      Таны хөтөч видео тоглуулахыг дэмжихгүй байна.
                    </video>
                  </div>
                </div>
              )}

              {/* MP3 Audio Player Section if present */}
              {article.audioUrl && (
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
                        {article.title} - Аудио бичлэг
                      </div>
                      <audio
                        controls
                        preload="metadata"
                        className="w-full h-10 rounded-lg"
                        src={article.audioUrl}
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

              {/* Article External Link CTA if present */}
              {article.articleUrl && (
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-blue-50/70 border border-blue-200/80 p-3.5 sm:p-4 rounded-2xl w-full min-w-0 max-w-full overflow-hidden">
                  <div className="text-xs text-blue-900 min-w-0 flex-1 font-medium">
                    Энэхүү сэдэвтэй холбоотой дэлгэрэнгүй эх сурвалж эсвэл нийтлэлийг үзэх:
                  </div>
                  <a
                    id="article-external-link-btn"
                    href={article.articleUrl}
                    target={article.target || '_blank'}
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    <span>Нийтлэл рүү үсрэх</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Direct Permalink Box for Sub-domain/Direct link sharing */}
              {(() => {
                const permalink = article.articleUrl?.startsWith('http')
                  ? article.articleUrl
                  : getArticlePermalink(article.slug || article.id);
                return (
                  <div className="pt-2 border-t border-slate-100 w-full min-w-0">
                    <div className="p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full min-w-0 max-w-full overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                        <div className="w-6 h-6 rounded-lg bg-slate-200/70 text-slate-600 flex items-center justify-center shrink-0">
                          <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
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
                );
              })()}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{schoolInfo?.name || 'Эрдмийн далай сургууль'}</span>
            </div>
            <button
              onClick={() => setSelectedArticleModal(null)}
              className="px-4 py-2 text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors cursor-pointer"
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
        title={article.title}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};
