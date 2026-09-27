import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { HeroSlide } from '../../types';
import { ImagePresetPicker } from './ImagePresetPicker';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  Eye,
  EyeOff,
  FileText,
  Link,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

export const AdminSlideManager: React.FC = () => {
  const { heroSlides, news, addHeroSlide, updateHeroSlide, deleteHeroSlide } = useSchool();

  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop',
    buttonText: 'Дэлгэрэнгүй',
    buttonLink: '',
    badge: 'ОНЦЛОХ',
    active: true,
    order: 1
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop',
      buttonText: 'Дэлгэрэнгүй',
      buttonLink: '',
      badge: 'ОНЦЛОХ',
      active: true,
      order: 1
    });
    setSelectedNewsId('');
    setIsEditing(false);
    setCurrentEditId(null);
  };

  const handleEdit = (item: HeroSlide) => {
    setCurrentEditId(item.id);
    setFormData({
      title: item.title,
      subtitle: item.subtitle,
      imageUrl: item.imageUrl,
      buttonText: item.buttonText || 'Дэлгэрэнгүй',
      buttonLink: item.buttonLink || '',
      badge: item.badge || '',
      active: item.active,
      order: item.order
    });

    // Check if buttonLink corresponds to a news article
    if (item.buttonLink && item.buttonLink.startsWith('#news/')) {
      const targetSlugOrId = item.buttonLink.replace('#news/', '');
      const matched = news.find(n => n.id === targetSlugOrId || n.slug === targetSlugOrId);
      if (matched) {
        setSelectedNewsId(matched.id);
      }
    } else {
      setSelectedNewsId('');
    }

    setIsEditing(true);
  };

  // Handler when selecting a news article to link
  const handleSelectNewsArticle = (newsId: string) => {
    setSelectedNewsId(newsId);
    if (!newsId) return;

    const matched = news.find((n) => n.id === newsId);
    if (!matched) return;

    const targetLink = `#news/${matched.slug || matched.id}`;
    const firstImg = (matched.images && matched.images.length > 0 && matched.images[0]) || matched.imageUrl || formData.imageUrl;

    // Automatically fill fields with article data if form is new or user wants it
    setFormData((prev) => ({
      ...prev,
      title: prev.title ? prev.title : matched.title,
      subtitle: prev.subtitle ? prev.subtitle : matched.excerpt,
      imageUrl: firstImg,
      badge: matched.categoryName ? matched.categoryName.toUpperCase() : 'ШИНЭ МЭДЭЭ',
      buttonText: 'Дэлгэрэнгүй',
      buttonLink: targetLink
    }));
  };

  // Explicit auto-fill button from selected news article
  const handleApplyNewsData = () => {
    if (!selectedNewsId) return;
    const matched = news.find((n) => n.id === selectedNewsId);
    if (!matched) return;

    const firstImg = (matched.images && matched.images.length > 0 && matched.images[0]) || matched.imageUrl || formData.imageUrl;
    setFormData((prev) => ({
      ...prev,
      title: matched.title,
      subtitle: matched.excerpt,
      imageUrl: firstImg,
      badge: matched.categoryName ? matched.categoryName.toUpperCase() : 'ОНЦЛОХ МЭДЭЭ',
      buttonText: 'Дэлгэрэнгүй',
      buttonLink: `#news/${matched.slug || matched.id}`
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const finalLink = formData.buttonLink.trim() || '#news';

    if (currentEditId) {
      updateHeroSlide(currentEditId, {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        imageUrl: formData.imageUrl,
        buttonText: formData.buttonText.trim() || 'Дэлгэрэнгүй',
        buttonLink: finalLink,
        badge: formData.badge.trim(),
        active: formData.active,
        order: formData.order
      });
    } else {
      addHeroSlide({
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        imageUrl: formData.imageUrl,
        buttonText: formData.buttonText.trim() || 'Дэлгэрэнгүй',
        buttonLink: finalLink,
        badge: formData.badge.trim(),
        active: formData.active,
        order: (heroSlides.length || 0) + 1
      });
    }

    resetForm();
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-600" />
            <span>Нүүр хуудасны Слайдер Баннер Удирдах</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Нүүр хуудсанд гарах том баннерууд, холбогдох нийтлэл болон &ldquo;Дэлгэрэнгүй&rdquo; товчлуурын линкийг тохируулна.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Шинэ баннер нэмэх</span>
          </button>
        )}
      </div>

      {/* Form */}
      {isEditing && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <span>{currentEditId ? 'Баннер засах' : 'Шинэ баннер нэмэх'}</span>
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quick Link to Existing News Article */}
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>Нийтлэл сонгож холбох (Дэлгэрэнгүй товчлуурт)</span>
                </label>
                {selectedNewsId && (
                  <button
                    type="button"
                    onClick={handleApplyNewsData}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-200/70 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Энэ нийтлэлийн гарчиг, тайлбар, зургийг слайд руу шууд хуулж бөглөх"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Нийтлэлийн мэдээллийг автоматаар бөглөх</span>
                  </button>
                )}
              </div>
              <select
                value={selectedNewsId}
                onChange={(e) => handleSelectNewsArticle(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-amber-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
              >
                <option value="">-- Нийтлэл сонгохгүй (Гараар линк бичих эсвэл хэсэг сонгох) --</option>
                {news.map((item) => (
                  <option key={item.id} value={item.id}>
                    [{item.categoryName || 'Мэдээ'}] {item.title} ({item.date})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-amber-800">
                💡 Нийтлэл сонгоход &ldquo;Дэлгэрэнгүй&rdquo; товч дээр дарах үед тухайн нийтлэл шууд бүрэн эхээрээ нээгдэнэ.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Том гарчиг *
              </label>
              <input
                type="text"
                required
                placeholder="Жишээ: 2025-2026 Оны Хичээлийн Жилийн Шинэ Элсэлт Эхэллээ"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Дэд тайлбар өгүүлбэр
              </label>
              <textarea
                rows={2}
                placeholder="Дэлхийн түвшний стандартыг Монгол сэтгэлгээтэй хослуулж..."
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Grid of Badge, Button Text & Link */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Дээд Бадж / Тэмдэглэгээ
                </label>
                <input
                  type="text"
                  placeholder="ШИНЭ ЭЛСЭЛТ 2025"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Товч дээрх бичиг
                </label>
                <input
                  type="text"
                  placeholder="Дэлгэрэнгүй"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Товч дарах линк</span>
                  <Link className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <input
                  type="text"
                  placeholder="#news/article-id эсвэл #admission эсвэл URL"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono text-slate-700"
                />
              </div>
            </div>

            {/* Preset link buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 text-[11px] font-semibold">Бэлэн хэсгүүд:</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, buttonLink: '#about', buttonText: 'Бидний тухай' })}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] cursor-pointer"
              >
                #about (Бидний тухай)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, buttonLink: '#programs', buttonText: 'Хөтөлбөрүүд' })}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] cursor-pointer"
              >
                #programs (Сургалт)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, buttonLink: '#admission', buttonText: 'Элсэлтийн анкет' })}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] cursor-pointer"
              >
                #admission (Элсэлт)
              </button>
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Арын дэвсгэр зураг
              </label>
              <ImagePresetPicker
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="slide-active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="slide-active" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Идэвхтэй харуулах
              </label>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
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
                {currentEditId ? 'Өөрчлөлтийг хадгалах' : 'Баннер нэмэх'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Одоогийн слайдерууд ({heroSlides.length})
          </h3>
          <span className="text-xs text-slate-500">
            Идэвхтэй байгаа слайдерууд нүүр хуудасны толгойд ээлжлэн харагдана
          </span>
        </div>

        {heroSlides.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Одоогоор нэмэгдсэн баннер алга байна</p>
            <p className="text-xs text-slate-400 mt-1">Шинэ баннер нэмэх товч дээр дарж анхны слайдераа оруулна уу.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {heroSlides.map((slide) => {
              const isNewsLink = slide.buttonLink && slide.buttonLink.startsWith('#news/');
              const linkedNews = isNewsLink
                ? news.find(n => n.id === slide.buttonLink?.replace('#news/', '') || n.slug === slide.buttonLink?.replace('#news/', ''))
                : null;

              return (
                <div
                  key={slide.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-24 h-16 object-cover rounded-lg shrink-0 border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {slide.badge && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                            {slide.badge}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            slide.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {slide.active ? 'Идэвхтэй' : 'Идэвхгүй'}
                        </span>
                        {linkedNews && (
                          <span className="text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span>Холбогдсон нийтлэл: {linkedNews.title.slice(0, 30)}...</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 truncate max-w-md">
                        {slide.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate max-w-lg">{slide.subtitle}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span>Товч: <strong>{slide.buttonText || 'Дэлгэрэнгүй'}</strong></span>
                        <span>Линк: <code className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{slide.buttonLink || '#news'}</code></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => updateHeroSlide(slide.id, { active: !slide.active })}
                      className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title={slide.active ? 'Нуух' : 'Идэвхжүүлэх'}
                    >
                      {slide.active ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                    </button>
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Засах"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteHeroSlide(slide.id)}
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
        )}
      </div>
    </div>
  );
};

