import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { NewsArticle } from '../../types';
import { MultiImagePresetPicker, MediaAttachmentsManager, FALLBACK_IMAGE_URL } from './ImagePresetPicker';
import { getNewsPermalink } from '../../utils/permalinks';
import { formatGoogleDriveImageUrl } from '../../lib/googleDrive';
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Eye,
  CheckCircle,
  X,
  FileText,
  Sparkles,
  Tag,
  User,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Check,
  Video,
  Music,
  Star,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';

export const OFFICIAL_NEWS_CATEGORIES = [
  { slug: 'news-info', name: 'Мэдээ, мэдээлэл' },
  { slug: 'olympiad', name: 'Олимпиад, уралдаан' },
  { slug: 'sports-arts', name: 'Спорт, урлаг соёл' },
  { slug: 'primary', name: 'Бага боловсрол' },
  { slug: 'admission-exam', name: 'Элсэлтийн шалгалт' }
];

export const AdminNewsManager: React.FC = () => {
  const {
    news,
    addNewsArticle,
    updateNewsArticle,
    deleteNewsArticle,
    openNewsArticle,
    schoolInfo,
    isGoogleConnected,
    spreadsheetId,
    spreadsheetTitle,
    isSheetsSyncing,
    syncToSheetsWithData,
    lastSheetsSyncTime,
    loginWithGoogle
  } = useSchool();

  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  const defaultSchoolImage = schoolInfo.defaultNewsImageUrl || FALLBACK_IMAGE_URL;

  const handleManualSync = async () => {
    setSyncFeedback(null);
    const res = await syncToSheetsWithData({ news });
    if (res.success) {
      setSyncFeedback({ type: 'success', text: 'Google Sheets бааз руу амжилттай хадгалагдлаа!' });
    } else {
      setSyncFeedback({ type: 'error', text: res.message });
    }
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  // Collect all available categories dynamically
  const allCategories = React.useMemo(() => {
    const map = new Map<string, string>();
    OFFICIAL_NEWS_CATEGORIES.forEach((c) => map.set(c.slug, c.name));
    news.forEach((n) => {
      if (n.categorySlug && !map.has(n.categorySlug)) {
        map.set(n.categorySlug, n.categoryName || n.categorySlug);
      }
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [news]);

  const generateCategorySlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9а-яёүө-]+/gi, '-')
      .replace(/^-+|-+$/g, '') || `cat-${Date.now().toString().slice(-4)}`;
  };

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    categorySlug: 'news-info',
    categoryName: 'Мэдээ, мэдээлэл',
    date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '/'),
    excerpt: '',
    content: '',
    imageUrl: defaultSchoolImage,
    images: [defaultSchoolImage],
    videoUrl: '',
    audioUrl: '',
    author: 'Сургуулийн захиргаа',
    featured: false
  });

  const resetForm = () => {
    const defaultImg = schoolInfo.defaultNewsImageUrl || FALLBACK_IMAGE_URL;
    setFormData({
      title: '',
      slug: '',
      categorySlug: 'news-info',
      categoryName: 'Мэдээ, мэдээлэл',
      date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '/'),
      excerpt: '',
      content: '',
      imageUrl: defaultImg,
      images: [defaultImg],
      videoUrl: '',
      audioUrl: '',
      author: 'Сургуулийн захиргаа',
      featured: false
    });
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setIsEditing(false);
    setCurrentEditId(null);
  };

  const handleCategoryChange = (slug: string) => {
    if (slug === '__custom__') {
      setIsCustomCategory(true);
      return;
    }
    setIsCustomCategory(false);
    const found = allCategories.find((c) => c.slug === slug);
    setFormData({
      ...formData,
      categorySlug: slug,
      categoryName: found?.name || 'Мэдээ, мэдээлэл'
    });
  };

  const handleCustomCategoryInput = (name: string) => {
    setCustomCategoryName(name);
    const slug = generateCategorySlug(name);
    setFormData((prev) => ({
      ...prev,
      categorySlug: slug,
      categoryName: name.trim() || 'Шинэ ангилал'
    }));
  };

  const handleEdit = (item: NewsArticle) => {
    setCurrentEditId(item.id);
    const existingImages = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : [item.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop'];

    const isExisting = allCategories.some((c) => c.slug === item.categorySlug);
    if (!isExisting && item.categorySlug) {
      setIsCustomCategory(true);
      setCustomCategoryName(item.categoryName || item.categorySlug);
    } else {
      setIsCustomCategory(false);
      setCustomCategoryName('');
    }

    setFormData({
      title: item.title,
      slug: item.slug,
      categorySlug: item.categorySlug,
      categoryName: item.categoryName,
      date: item.date,
      excerpt: item.excerpt,
      content: item.content,
      imageUrl: existingImages[0] || item.imageUrl,
      images: existingImages,
      videoUrl: item.videoUrl || '',
      audioUrl: item.audioUrl || '',
      author: item.author,
      featured: item.featured
    });
    setIsEditing(true);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleImagesChange = (imgs: string[]) => {
    const validImgs = imgs.filter(Boolean);
    const primaryImg = validImgs[0] || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop';
    setFormData({
      ...formData,
      images: imgs,
      imageUrl: primaryImg
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const filteredImages = (formData.images || []).filter(Boolean);
    const primaryImageUrl = filteredImages[0] || formData.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop';

    if (currentEditId) {
      updateNewsArticle(currentEditId, {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        categorySlug: formData.categorySlug,
        categoryName: formData.categoryName,
        date: formData.date,
        excerpt: formData.excerpt || formData.content.slice(0, 140) + '...',
        content: formData.content,
        imageUrl: primaryImageUrl,
        images: filteredImages.length > 0 ? filteredImages : [primaryImageUrl],
        videoUrl: formData.videoUrl.trim() || '',
        audioUrl: formData.audioUrl.trim() || '',
        author: formData.author,
        featured: formData.featured
      });
    } else {
      addNewsArticle({
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        categorySlug: formData.categorySlug,
        categoryName: formData.categoryName,
        date: formData.date,
        excerpt: formData.excerpt || formData.content.slice(0, 140) + '...',
        content: formData.content,
        imageUrl: primaryImageUrl,
        images: filteredImages.length > 0 ? filteredImages : [primaryImageUrl],
        videoUrl: formData.videoUrl.trim() || '',
        audioUrl: formData.audioUrl.trim() || '',
        author: formData.author,
        featured: formData.featured
      });
    }

    resetForm();
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Мэдээ, Нийтлэл Удирдах
            </h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {news.length} нийтлэл
            </span>
            {spreadsheetId && (
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                isGoogleConnected
                  ? 'text-emerald-800 bg-emerald-50 border border-emerald-300'
                  : 'text-amber-800 bg-amber-50 border border-amber-300'
              }`}>
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{isGoogleConnected ? 'Google Sheets баазтай синк болно' : 'Google Sheets холбогдсон'}</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Энд оруулсан мэдээ нь нүүр хуудасны "Сүүлийн үеийн мэдээ"-нд харагдаж, Google Drive зургууд шууд уншигдана. Нийтлэл хадгалагдах үед Google Sheets бааз автоматаар шинэчлэгдэнэ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {spreadsheetId && (
            isGoogleConnected ? (
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSheetsSyncing}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                title="Google Sheets хүснэгтийн Нийтлэл таб руу синк хийх"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSheetsSyncing ? 'animate-spin text-emerald-600' : 'text-emerald-700'}`} />
                <span>{isSheetsSyncing ? 'Хадгалж байна...' : 'Sheets рүү хадгалах'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  const res = await loginWithGoogle();
                  if (res?.success) {
                    setTimeout(() => handleManualSync(), 300);
                  }
                }}
                className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Google Sheets эрхээ шинэчлэх / холбогдох"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                <span>Google-ээр холбогдох</span>
              </button>
            )
          )}

          {!isEditing && (
            <button
              onClick={() => {
                resetForm();
                setIsEditing(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Шинэ мэдээ нийтлэх</span>
            </button>
          )}
        </div>
      </div>

      {syncFeedback && (
        <div className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in ${
          syncFeedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {syncFeedback.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
          <span>{syncFeedback.text}</span>
        </div>
      )}

      {/* Edit / Create Form */}
      {isEditing && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>{currentEditId ? 'Мэдээ засах' : 'Шинэ мэдээ оруулах'}</span>
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Мэдээний гарчиг *
              </label>
              <input
                type="text"
                required
                placeholder="Жишээ: 12-р ангийн төгсөгчид олон улсын тэтгэлэг хүртлээ"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>

            {/* Category & Date & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Ангилал сонгох *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(!isCustomCategory);
                      if (!isCustomCategory) {
                        setCustomCategoryName('');
                      }
                    }}
                    className="text-[11px] text-amber-700 hover:text-amber-800 font-medium underline cursor-pointer"
                  >
                    {isCustomCategory ? 'Жагсаалтаас сонгох' : '+ Шинэ ангилал'}
                  </button>
                </div>

                {isCustomCategory ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      placeholder="Шинэ ангиллын нэр..."
                      value={customCategoryName}
                      onChange={(e) => handleCustomCategoryInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-amber-50/50 border border-amber-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                    <p className="text-[10px] text-slate-500">
                      Холбоос slug: <span className="font-mono text-amber-800">{formData.categorySlug}</span>
                    </p>
                  </div>
                ) : (
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    {allCategories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                    <option value="__custom__">+ Шинэ ангилал үүсгэх...</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Огноо
                </label>
                <input
                  type="text"
                  placeholder="2025/02/20"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Нийтэлсэн зохиогч
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* 5 Images Selector */}
            <div>
              <MultiImagePresetPicker
                images={formData.images}
                onChange={handleImagesChange}
                maxImages={5}
                defaultImageUrl={schoolInfo.defaultNewsImageUrl}
              />
            </div>

            {/* Video and Audio Media Attachments */}
            <div>
              <MediaAttachmentsManager
                videoUrl={formData.videoUrl}
                audioUrl={formData.audioUrl}
                onVideoChange={(v) => setFormData({ ...formData, videoUrl: v })}
                onAudioChange={(a) => setFormData({ ...formData, audioUrl: a })}
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Товч хураангуй (Нүүр хуудасны картан дээр харагдана)
              </label>
              <textarea
                rows={2}
                placeholder="Мэдээний товч хураангуй 1-2 өгүүлбэр..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Дэлгэрэнгүй агуулга *
              </label>
              <textarea
                rows={6}
                required
                placeholder="Мэдээний бүрэн эх бичвэрийг энд бичнэ үү..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Featured toggle */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-5 h-5 cursor-pointer accent-emerald-600"
                />
                <label htmlFor="featured-check" className="text-xs sm:text-sm font-bold text-slate-800 cursor-pointer select-none">
                  Нүүр хуудасны толгой Слайдер (Hero Slider) дээр онцлон харуулах
                </label>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                formData.featured 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {formData.featured ? 'Слайдерт гарна' : 'Энгийн мэдээ'}
              </span>
            </div>

            {/* Live Preview Card */}
            <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Харагдах байдлын шууд урьдчилсан харагдац (Live Preview):
              </span>
              <div className="max-w-md bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                <div className="relative aspect-16/9 bg-slate-200 overflow-hidden">
                  <img
                    src={formatGoogleDriveImageUrl(formData.imageUrl || formData.images[0]) || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {formData.categoryName}
                  </div>
                  {formData.images.filter(Boolean).length > 1 && (
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                      <ImageIcon className="w-3 h-3" />
                      <span>{formData.images.filter(Boolean).length} зураг</span>
                    </div>
                  )}
                  {formData.videoUrl && (
                    <div className="absolute bottom-2 right-2 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      <span>Видео</span>
                    </div>
                  )}
                </div>
                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    <span>{formData.date}</span>
                    <span>•</span>
                    <User className="w-3 h-3" />
                    <span>{formData.author}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2">
                    {formData.title || 'Мэдээний гарчиг энд тод харагдана'}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {formData.excerpt || formData.content || 'Товч тайлбар энд гарна...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Болих
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {currentEditId ? 'Өөрчлөлтийг баазад хадгалах' : 'Firebase баазад нийтлэх'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of News Items */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Нийтлэгдсэн мэдээллүүд ({news.length})
            </h3>
            <span className="text-xs text-amber-800 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>Нийт үзэлт: {news.reduce((acc, curr) => acc + (curr.views || 0), 0)}</span>
            </span>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Firebase Firestore холбогдсон
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {news.map((item) => {
            const itemImages = Array.isArray(item.images) && item.images.length > 0 ? item.images.filter(Boolean) : [item.imageUrl];
            const permalink = getNewsPermalink(item.slug || item.id);
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-300 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={formatGoogleDriveImageUrl(item.imageUrl || itemImages[0]) || defaultSchoolImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultSchoolImage;
                      }}
                    />
                    {itemImages.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] font-bold px-1 rounded">
                        {itemImages.length} зураг
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {item.categoryName}
                      </span>
                      <span className="text-xs text-slate-400">{item.date}</span>
                      
                      {/* View Counter Badge */}
                      <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Eye className="w-3 h-3 text-amber-600" />
                        <span>{item.views || 0} үзсэн</span>
                      </span>

                      {/* Video Badge */}
                      {item.videoUrl && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <Video className="w-3 h-3 text-blue-600" />
                          <span>MP4</span>
                        </span>
                      )}

                      {/* Audio Badge */}
                      {item.audioUrl && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <Music className="w-3 h-3 text-emerald-600" />
                          <span>MP3</span>
                        </span>
                      )}

                      {item.featured && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-1.5 py-0.2 rounded">
                          Онцлох
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 truncate max-w-md">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate max-w-lg">{item.excerpt || item.content}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {/* Quick toggle featured in hero slider */}
                  <button
                    onClick={() => updateNewsArticle(item.id, { featured: !item.featured })}
                    className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                      item.featured
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                        : 'text-slate-400 hover:text-amber-700 hover:bg-amber-50'
                    }`}
                    title={item.featured ? 'Слайдерээс хасах' : 'Нүүрний слайдерт онцлох'}
                  >
                    <Star className={`w-4 h-4 ${item.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span className="hidden md:inline">{item.featured ? 'Слайдерт байна' : 'Слайдерт гаргах'}</span>
                  </button>

                  {/* Direct link copy */}
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(permalink);
                        setCopiedId(item.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Шууд холбоос хуулах"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {/* Live preview */}
                  <button
                    onClick={() => openNewsArticle(item)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Сайт дээр харах"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                    title="Засах"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteNewsArticle(item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Устгах"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
