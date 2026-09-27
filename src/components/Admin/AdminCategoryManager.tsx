import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { CategoryItem } from '../../types';
import { CategoryIcon, AVAILABLE_ICON_NAMES } from '../CategoryIcon';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Link as LinkIcon,
  Tag,
  Eye,
  EyeOff
} from 'lucide-react';

interface SubdomainPreset {
  name: string;
  nameEn: string;
  slug: string;
  iconName: string;
  subdomainUrl: string;
  badge: string;
  description: string;
}

const PRESET_SUBDOMAINS: SubdomainPreset[] = [
  {
    name: 'LMS Цахим сургалт',
    nameEn: 'E-Learning LMS',
    slug: 'lms',
    iconName: 'Laptop',
    subdomainUrl: 'https://lms.eds.edu.mn',
    badge: 'LMS',
    description: 'Сурагч, багш нарын цахим хичээл, даалгавар, дүнг хянах нэгдсэн систем'
  },
  {
    name: 'Цахим номын сан',
    nameEn: 'Digital Library',
    slug: 'library',
    iconName: 'Library',
    subdomainUrl: 'https://library.eds.edu.mn',
    badge: 'Номын сан',
    description: 'Сурах бичиг, цахим ном, эрдэм шинжилгээний материалын нэгдсэн сан'
  },
  {
    name: 'Эцэг эхийн портал',
    nameEn: 'Parents Portal',
    slug: 'parents',
    iconName: 'Users',
    subdomainUrl: 'https://parents.eds.edu.mn',
    badge: 'Портал',
    description: 'Эцэг эх, асран хамгаалагчдын мэдээлэл солилцох, зөвлөгөө авах систем'
  },
  {
    name: 'STEM & Робот төв',
    nameEn: 'STEM & Robotics Lab',
    slug: 'stem',
    iconName: 'Cpu',
    subdomainUrl: 'https://stem.eds.edu.mn',
    badge: 'Лаборатори',
    description: 'Инженерчлэл, робот техник, кодчилол, хиймэл оюуны төслийн төв'
  },
  {
    name: 'Кембрижийн хөтөлбөр',
    nameEn: 'Cambridge International',
    slug: 'cambridge',
    iconName: 'Globe',
    subdomainUrl: 'https://cambridge.eds.edu.mn',
    badge: 'Олон улсын',
    description: 'Олон улсын хөтөлбөр, шалгалт, сертификатын нэгдсэн мэдээлэл'
  },
  {
    name: 'Мэдээ, мэдээлэл',
    nameEn: 'News & Information',
    slug: 'news-info',
    iconName: 'Newspaper',
    subdomainUrl: 'https://news.eds.edu.mn',
    badge: 'Мэдээ',
    description: 'Сургуулийн цаг үеийн мэдээ, албан мэдэгдэл, зарлал ба шинэчлэлтүүд'
  },
  {
    name: 'Олимпиад, уралдаан',
    nameEn: 'Olympiads & Contests',
    slug: 'olympiad',
    iconName: 'Award',
    subdomainUrl: 'https://olympiad.eds.edu.mn',
    badge: 'Уралдаан',
    description: 'Математик, байгалийн ухаан, олон улсын болон улсын олимпиад, уралдааны амжилтууд'
  },
  {
    name: 'Спорт, урлаг соёл',
    nameEn: 'Sports, Arts & Culture',
    slug: 'sports-arts',
    iconName: 'Palette',
    subdomainUrl: 'https://arts-sports.eds.edu.mn',
    badge: 'Урлаг',
    description: 'Спорт секц, урлагийн наадам, хөгжим, театр, бие бялдрын хөгжлийн цогц арга хэмжээнүүд'
  }
];

export const AdminCategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useSchool();

  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [iconSearch, setIconSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    slug: '',
    iconName: 'GraduationCap',
    url: '',
    target: '_blank' as '_blank' | '_self',
    badge: '',
    description: '',
    active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      slug: '',
      iconName: 'GraduationCap',
      url: '',
      target: '_blank',
      badge: '',
      description: '',
      active: true
    });
    setIsEditing(false);
    setCurrentEditId(null);
  };

  const handleEdit = (cat: CategoryItem) => {
    setCurrentEditId(cat.id);
    setFormData({
      name: cat.name,
      nameEn: cat.nameEn || '',
      slug: cat.slug || '',
      iconName: cat.iconName || 'GraduationCap',
      url: cat.url || `https://${cat.slug}.eds.edu.mn`,
      target: cat.target || '_blank',
      badge: cat.badge || '',
      description: cat.description || '',
      active: cat.active !== false
    });
    setIsEditing(true);
  };

  const applyPreset = (preset: SubdomainPreset) => {
    setFormData({
      name: preset.name,
      nameEn: preset.nameEn,
      slug: preset.slug,
      iconName: preset.iconName,
      url: preset.subdomainUrl,
      target: '_blank',
      badge: preset.badge,
      description: preset.description,
      active: true
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const slug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-') ||
      'portal-' + Date.now();

    const formattedUrl =
      formData.url.trim() || `https://${slug}.eds.edu.mn`;

    if (currentEditId) {
      updateCategory(currentEditId, {
        name: formData.name,
        nameEn: formData.nameEn,
        slug: slug,
        iconName: formData.iconName,
        url: formattedUrl,
        target: formData.target,
        badge: formData.badge,
        description: formData.description,
        active: formData.active
      });
    } else {
      addCategory({
        name: formData.name,
        nameEn: formData.nameEn,
        slug: slug,
        iconName: formData.iconName,
        url: formattedUrl,
        target: formData.target,
        badge: formData.badge,
        description: formData.description,
        active: formData.active
      });
    }

    resetForm();
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredIconNames = AVAILABLE_ICON_NAMES.filter((icon) =>
    icon.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Сургуулийн цахим экосистем (Sub-Домайн холбоосууд)
            </h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {categories.length} систем
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Нүүр хуудсанд байрлах сургуулийн цахим экосистемийн порталууд тус бүрийн Sub-домайн URL, икон, шошгыг удирдах хэсэг.
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
            <span>Шинэ Sub-домайн нэмэх</span>
          </button>
        )}
      </div>

      {/* Quick Preset Subdomain Bar */}
      {!isEditing && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs sm:text-sm font-bold text-amber-900">
              Хурдан Sub-Домайн Загварууд (1 даралтаар нэмэх)
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_SUBDOMAINS.map((preset) => (
              <button
                key={preset.slug}
                onClick={() => applyPreset(preset)}
                className="bg-white hover:bg-amber-600 hover:text-white text-slate-700 border border-amber-200 text-xs font-medium px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group"
                title={`${preset.nameEn} (${preset.subdomainUrl})`}
              >
                <CategoryIcon name={preset.iconName} className="w-3.5 h-3.5 text-amber-600 group-hover:text-white" />
                <span>{preset.name}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-amber-100 font-mono">
                  +{preset.slug}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Edit / Add Form */}
      {isEditing && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-600" />
              <span>{currentEditId ? 'Sub-домайн холбоос засах' : 'Шинэ Sub-домайн / Холбоос үүсгэх'}</span>
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Чиглэл / Системийн нэр (Монгол) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Жишээ: STEM & Робот лаборатори, Бага боловсрол, LMS Систем"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Англи нэр / Дэд гарчиг
                </label>
                <input
                  type="text"
                  placeholder="Жишээ: STEM Robotics Lab, Primary School, E-Learning"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Subdomain URL and Target */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-white p-4 rounded-xl border border-slate-200">
              <div className="sm:col-span-8">
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sub-Домайн / Холбоос URL *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://stem.eds.edu.mn эсвэл https://primary.eds.edu.mn"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono text-blue-700 font-medium"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Хэрэглэгч тухайн икон дээр дарахад энэ хаяг руу шууд үсрэх болно.
                </p>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Холбоос нээх хэлбэр
                </label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value as '_blank' | '_self' })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="_blank">Шинэ цонхонд нээх (_blank)</option>
                  <option value="_self">Энэ цонхонд нээх (_self)</option>
                </select>
              </div>
            </div>

            {/* Icon Picker with search */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Икон сонгох
                </label>
                <input
                  type="text"
                  placeholder="Икон хайх..."
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg w-36 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Selected Icon and Visual Icons Grid */}
              <div className="flex items-center gap-3 mb-2 p-3 bg-white border border-slate-200 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CategoryIcon name={formData.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Сонгогдсон икон:</span>
                  <span className="font-mono text-sm font-bold text-slate-900 ml-2">{formData.iconName}</span>
                </div>
              </div>

              {/* Icons list */}
              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2 max-h-36 overflow-y-auto p-2 bg-white border border-slate-200 rounded-xl">
                {filteredIconNames.map((name) => {
                  const isSelected = formData.iconName === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: name })}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-600 text-white ring-2 ring-amber-400 scale-105 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-amber-600'
                      }`}
                      title={name}
                    >
                      <CategoryIcon name={name} className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slug, Badge & Active status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Слаг (Slug / Түлхүүр үг)
                </label>
                <input
                  type="text"
                  placeholder="stem, primary, lms..."
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-600" />
                  <span>Онцлох шошго (Badge)</span>
                </label>
                <input
                  type="text"
                  placeholder="Жишээ: Шинэ, LMS, Портал"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Нүүр хуудсанд харагдах
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                    />
                    <span>Идэвхтэй (Харагдана)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Товч тайлбар
              </label>
              <textarea
                rows={2}
                placeholder="Энэхүү sub-домайн эсвэл салбарын зорилго, хэрэглээний товч тайлбар..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Action Buttons */}
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
                {currentEditId ? 'Өөрчлөлтийг хадгалах' : 'Sub-домайн холбоос үүсгэх'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Configured Subdomain & Portal Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const url = cat.url || `https://${cat.slug}.eds.edu.mn`;
          const isInactive = cat.active === false;

          return (
            <div
              key={cat.id}
              className={`bg-white p-5 rounded-2xl border flex flex-col justify-between gap-4 shadow-2xs hover:border-amber-400 transition-all ${
                isInactive ? 'opacity-60 border-dashed border-slate-300' : 'border-slate-200'
              }`}
            >
              {/* Header: Icon, Name, Badge */}
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <CategoryIcon name={cat.iconName} className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-bold text-base text-slate-900 truncate">{cat.name}</h4>
                    {cat.badge && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  {cat.nameEn && (
                    <span className="text-xs text-slate-400 block font-medium truncate mb-1">
                      {cat.nameEn}
                    </span>
                  )}
                  {cat.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Subdomain URL box with test and copy */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-mono text-blue-700 font-semibold truncate" title={url}>
                    {url}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleCopyLink(url, cat.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                    title="Холбоос хуулах"
                  >
                    {copiedId === cat.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                    title="Холбоосоор орж шалгах"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Actions & Status */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCategory(cat.id, { active: isInactive ? true : false })}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                      isInactive
                        ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                    title={isInactive ? 'Нүүр хуудсанд харуулах' : 'Нүүр хуудсаас нуух'}
                  >
                    {isInactive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{isInactive ? 'Нуугдсан' : 'Идэвхтэй'}</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {cat.target === '_self' ? 'Энэ цонхонд' : 'Шинэ цонхонд'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                    title="Засах"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Устгах"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
