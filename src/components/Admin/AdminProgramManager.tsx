import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolProgram } from '../../types';
import { MultiImagePresetPicker } from './ImagePresetPicker';
import { getProgramPermalink } from '../../utils/permalinks';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  X,
  GraduationCap,
  Sparkles,
  Tag,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';

export const OFFICIAL_PROGRAM_CATEGORIES = [
  { slug: 'primary', name: 'Бага боловсрол' },
  { slug: 'olympiad', name: 'Олимпиад, уралдаан' },
  { slug: 'sports-arts', name: 'Спорт, урлаг соёл' },
  { slug: 'admission-exam', name: 'Элсэлтийн шалгалт' },
  { slug: 'news-info', name: 'Мэдээ, мэдээлэл' }
];

export const AdminProgramManager: React.FC = () => {
  const { programs, addProgram, updateProgram, deleteProgram, setSelectedProgramModal } = useSchool();

  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const defaultImg = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=900&auto=format&fit=crop';

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    categorySlug: 'primary',
    categoryName: 'Бага боловсрол',
    imageUrl: defaultImg,
    images: [defaultImg],
    tagsString: '1-5-р анги, Суурь мэдлэг, Англи хэл',
    description: '',
    featuresString: 'Өдөр өнжүүлэх анги\nҮдийн хоол, эрүүл зөв хооллолт\nТуршлагатай багш нарын баг',
    curriculum: 'Монгол Улсын ерөнхий боловсролын үндэсний стандарт + Кембриж',
    ageRange: '6 - 11 нас',
    schedule: 'Даваа - Баасан 08:30 - 15:30',
    featured: true,
    order: 1
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      categorySlug: 'primary',
      categoryName: 'Бага боловсрол',
      imageUrl: defaultImg,
      images: [defaultImg],
      tagsString: '1-5-р анги, Суурь мэдлэг, Англи хэл',
      description: '',
      featuresString: 'Өдөр өнжүүлэх анги\nҮдийн хоол, эрүүл зөв хооллолт\nТуршлагатай багш нарын баг',
      curriculum: 'Монгол Улсын ерөнхий боловсролын үндэсний стандарт + Кембриж',
      ageRange: '6 - 11 нас',
      schedule: 'Даваа - Баасан 08:30 - 15:30',
      featured: true,
      order: 1
    });
    setIsEditing(false);
    setCurrentEditId(null);
  };

  const handleCategoryChange = (slug: string) => {
    const found = OFFICIAL_PROGRAM_CATEGORIES.find((c) => c.slug === slug);
    setFormData({
      ...formData,
      categorySlug: slug,
      categoryName: found?.name || 'Бага боловсрол'
    });
  };

  const handleEdit = (item: SchoolProgram) => {
    setCurrentEditId(item.id);
    const existingImages = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : [item.imageUrl || defaultImg];

    setFormData({
      title: item.title,
      slug: item.slug || item.id,
      subtitle: item.subtitle,
      categorySlug: item.categorySlug,
      categoryName: item.categoryName,
      imageUrl: existingImages[0] || item.imageUrl,
      images: existingImages,
      tagsString: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      description: item.description,
      featuresString: Array.isArray(item.features) ? item.features.join('\n') : '',
      curriculum: item.curriculum || '',
      ageRange: item.ageRange || '',
      schedule: item.schedule || '',
      featured: item.featured ?? true,
      order: item.order || 1
    });
    setIsEditing(true);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleImagesChange = (imgs: string[]) => {
    const validImgs = imgs.filter(Boolean);
    const primaryImg = validImgs[0] || defaultImg;
    setFormData({
      ...formData,
      images: imgs,
      imageUrl: primaryImg
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const tags = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const features = formData.featuresString
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const filteredImages = (formData.images || []).filter(Boolean);
    const primaryImageUrl = filteredImages[0] || formData.imageUrl || defaultImg;

    if (currentEditId) {
      updateProgram(currentEditId, {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        subtitle: formData.subtitle,
        categorySlug: formData.categorySlug,
        categoryName: formData.categoryName,
        imageUrl: primaryImageUrl,
        images: filteredImages.length > 0 ? filteredImages : [primaryImageUrl],
        tags,
        description: formData.description,
        features,
        curriculum: formData.curriculum,
        ageRange: formData.ageRange,
        schedule: formData.schedule,
        featured: formData.featured,
        order: formData.order
      });
    } else {
      addProgram({
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        subtitle: formData.subtitle,
        categorySlug: formData.categorySlug,
        categoryName: formData.categoryName,
        imageUrl: primaryImageUrl,
        images: filteredImages.length > 0 ? filteredImages : [primaryImageUrl],
        tags,
        description: formData.description,
        features,
        curriculum: formData.curriculum,
        ageRange: formData.ageRange,
        schedule: formData.schedule,
        featured: formData.featured,
        order: formData.order
      });
    }

    resetForm();
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Сургалтын Хөтөлбөр & Чиглэл Удирдах
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Энд оруулсан хөтөлбөрүүд 3 хүртэлх зурагтай, дэлгэрэнгүй тайлбар, давуу талуудын жагсаалттайгаар сайт дээр харагдана. Өгөгдөл нь Firebase Firestore баазад хадгалагдана.
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
            <span>Шинэ хөтөлбөр нэмэх</span>
          </button>
        )}
      </div>

      {/* Edit / Create Form (Matching AdminNewsManager layout) */}
      {isEditing && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>{currentEditId ? 'Хөтөлбөр засах' : 'Шинэ хөтөлбөр үүсгэх'}</span>
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Хөтөлбөрийн нэр *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Жишээ: Кембрижийн олон улсын дунд шатны хөтөлбөр"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Холбоосын Slug (Сонголттой)
                </label>
                <input
                  type="text"
                  placeholder="cambridge-lower-secondary"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Subtitle / Key Highlights Banner */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Богино товч тайлбар (Картын нэр доор ба нийтлэлийн эхэнд онцлох хайрцгаар гарна) *
              </label>
              <input
                type="text"
                required
                placeholder="Жишээ: 6-9-р анги • Cambridge Checkpoint • Англи хэлээрх хичээлүүд • IGCSE бэлтгэл"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ангилал сонгох *
                </label>
                <select
                  value={formData.categorySlug}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  {OFFICIAL_PROGRAM_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Түлхүүр тагууд (Таслалаар тусгаарлах)
                </label>
                <input
                  type="text"
                  placeholder="Cambridge, IGCSE, Англи хэл, STEM"
                  value={formData.tagsString}
                  onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Multi-Image Preset Picker (1 to 3 images gallery) */}
            <MultiImagePresetPicker
              images={formData.images}
              onChange={handleImagesChange}
              maxImages={3}
            />

            {/* Meta info: Age range, Schedule, Curriculum */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Насны ангилал
                </label>
                <input
                  type="text"
                  placeholder="6 - 11 нас"
                  value={formData.ageRange}
                  onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Хичээллэх хуваарь
                </label>
                <input
                  type="text"
                  placeholder="Даваа - Баасан 08:30 - 16:00"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Сургалтын стандарт & Төлөвлөгөө
                </label>
                <input
                  type="text"
                  placeholder="Cambridge Lower Secondary Curriculum"
                  value={formData.curriculum}
                  onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Description (Full rich text) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Хөтөлбөрийн дэлгэрэнгүй танилцуулга текст *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Хөтөлбөрийн зорилго, давуу тал, заагдах хичээлүүд, лаборатори орчин, төгсөгчдийн үр дүн..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            {/* Features (mөp бүрт нэг давуу тал) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Онцлох давуу талууд (Мөр тус бүрт 1 давуу тал бичнэ үү)
              </label>
              <textarea
                rows={4}
                placeholder="Шинжлэх ухааны лабораторид хийгдэх туршилтууд&#10;Олон улсын шалгалтад бэлтгэх тусгай сургалт&#10;Төрөлх англи хэлтэй багш нарын удирдах хичээл&#10;Мэтгэлцээн, илтгэх ур чадварын клуб"
                value={formData.featuresString}
                onChange={(e) => setFormData({ ...formData, featuresString: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Featured toggle & Order */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Нүүр хуудасны онцлох хэсэгт тодруулах (Featured)</span>
              </label>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">Эрэмбэ:</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  className="w-16 px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                />
              </div>
            </div>

            {/* Buttons */}
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
                {currentEditId ? 'Өөрчлөлтийг хадгалах' : 'Хөтөлбөр үүсгэх'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Program List (Matching AdminNewsManager List Style) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Бүртгэлтэй хөтөлбөрүүд ({programs.length})
          </h3>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Firebase Firestore холбогдсон
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {programs.map((item) => {
            const itemImages = Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.imageUrl];
            const permalink = getProgramPermalink(item.slug || item.id);
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-300 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Thumbnail with image count badge */}
                  <div className="relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={item.imageUrl || itemImages[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {itemImages.length > 1 && (
                      <div className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                        +{itemImages.length}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {item.categoryName}
                      </span>

                      {item.ageRange && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                          {item.ageRange}
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
                    <p className="text-xs text-slate-500 truncate max-w-lg">
                      {item.subtitle || item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {/* Copy link */}
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

                  {/* Live preview in modal */}
                  <button
                    onClick={() => setSelectedProgramModal(item)}
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
                    onClick={() => deleteProgram(item.id)}
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
