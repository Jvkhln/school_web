import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SectionTexts, AboutValueItem } from '../../types';
import { ImagePresetPicker } from './ImagePresetPicker';
import {
  Compass,
  Target,
  Image as ImageIcon,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Globe2,
  Lightbulb,
  Award,
  Star,
  BookOpen,
  Heart,
  Users,
  Plus,
  Trash2,
  Eye,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { key: 'shield', label: 'Хамгаалалт & Аюулгүй байдал', icon: ShieldCheck },
  { key: 'globe', label: 'Олон улс & Англи хэл', icon: Globe2 },
  { key: 'stem', label: 'STEM & Технологи', icon: Lightbulb },
  { key: 'award', label: 'Шагнал & Манлайлал', icon: Award },
  { key: 'star', label: 'Од & Амжилт', icon: Star },
  { key: 'book', label: 'Ном & Эрдэм шинжилгээ', icon: BookOpen },
  { key: 'heart', label: 'Эрүүл мэнд & Халамж', icon: Heart },
  { key: 'users', label: 'Багш & Сурагчдын хамт олон', icon: Users },
  { key: 'target', label: 'Зорилго & Тэмүүлэл', icon: Target },
  { key: 'check', label: 'Чанартай баталгаа', icon: CheckCircle2 }
];

const DEFAULT_ABOUT_VALUES: AboutValueItem[] = [
  {
    id: 'val-1',
    iconName: 'shield',
    title: 'Аюулгүй & Тав тухтай орчин',
    description: '24/7 харуул хамгаалалт, агааржуулалтын систем, стандартын ариун цэвэр, эрүүл хооллолт.'
  },
  {
    id: 'val-2',
    iconName: 'globe',
    title: 'Олон улсын хөтөлбөр',
    description: 'Кембрижийн олон улсын сертификаттай сургалт ба Англи хэлний төрөлх орчин.'
  },
  {
    id: 'val-3',
    iconName: 'stem',
    title: 'STEM & Бүтээлч сэтгэлгээ',
    description: 'Робот техник, кодчилол, байгалийн шинжлэх ухааны лабораторийн бодит туршилтууд.'
  },
  {
    id: 'val-4',
    iconName: 'award',
    title: 'Хувь хүний манлайлал',
    description: 'Өөртөө итгэлтэй, ёс суртахуунтай, багаар ажиллах чадвартай зөв хүмүүн төлөвшил.'
  }
];

export const AdminAboutManager: React.FC = () => {
  const { sectionTexts, updateSectionTexts } = useSchool();

  const [formData, setFormData] = useState<SectionTexts>(sectionTexts);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Synchronize when sectionTexts changes from Firestore
  useEffect(() => {
    setFormData(sectionTexts);
  }, [sectionTexts]);

  const currentValues: AboutValueItem[] =
    formData.aboutValues && formData.aboutValues.length > 0
      ? formData.aboutValues
      : DEFAULT_ABOUT_VALUES;

  const handleValueChange = (index: number, field: keyof AboutValueItem, value: string) => {
    const updatedValues = [...currentValues];
    updatedValues[index] = {
      ...updatedValues[index],
      [field]: value
    };
    setFormData({ ...formData, aboutValues: updatedValues });
  };

  const handleAddValue = () => {
    const newValue: AboutValueItem = {
      id: `val-${Date.now()}`,
      iconName: 'star',
      title: 'Шинэ онцлог / Давуу тал',
      description: 'Энд сургуулийн онцлох давуу тал, үнэт зүйлийн тайлбарыг бичнэ үү.'
    };
    setFormData({ ...formData, aboutValues: [...currentValues, newValue] });
  };

  const handleDeleteValue = (index: number) => {
    const updatedValues = currentValues.filter((_, i) => i !== index);
    setFormData({ ...formData, aboutValues: updatedValues });
  };

  const handleResetValues = () => {
    setFormData({ ...formData, aboutValues: DEFAULT_ABOUT_VALUES });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSectionTexts(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const currentImageUrl =
    formData.aboutImageUrl ||
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=900&auto=format&fit=crop';

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              "Бидний тухай & Эрхэм зорилго" хэсгийн удирдлага
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Сургуулийн танилцуулга зураг, эрхэм зорилгын ишлэл, дэлгэрэнгүй тайлбар болон онцлог давуу талуудыг эндээс засварлаж Firebase өгөгдлийн санд шууд хадгална.
          </p>
        </div>

        {/* Action button & save feedback */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs sm:text-sm px-3.5 py-2 rounded-xl font-semibold border border-emerald-200 animate-in fade-in duration-200 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Firebase өгөгдлийн санд амжилттай хадгалагдлаа!</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>{activeTab === 'editor' ? 'Харагдах байдал үзэх' : 'Засварлах горим'}</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Block 1: Main Image & Real-time Live Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <span>1. Сургуулийн тухай үндсэн зураг (Image Management)</span>
            </h3>
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
              4:3 буюу Ландшафт харьцаа
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Image Picker */}
            <div className="lg:col-span-7 space-y-4">
              <ImagePresetPicker
                value={formData.aboutImageUrl || ''}
                onChange={(url) => setFormData({ ...formData, aboutImageUrl: url })}
                label="Танилцуулгын үндсэн зураг сонгох эсвэл оруулах"
                recommendedAspect="4:3 буюу 1200x900 хэмжээтэй зураг тохиромжтой"
              />
            </div>

            {/* Right: Live Preview Box */}
            <div className="lg:col-span-5 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Вэб дээр харагдах бодит байдал (Live Preview)
              </label>
              <div className="relative rounded-2xl overflow-hidden shadow-md aspect-4/3 bg-slate-900 border border-slate-200">
                <img
                  src={currentImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Target className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                      {formData.aboutMissionSubtitle || 'Манай эрхэм зорилго'}
                    </span>
                  </div>
                  <p className="text-xs font-medium leading-snug text-amber-50 line-clamp-2">
                    "{formData.aboutMissionQuote || 'Оюунлаг, ёс зүйтэй, дэлхийд өрсөлдөхүйц Монгол иргэнийг төлөвшүүлнэ'}"
                  </p>
                </div>

                {/* Floating badge preview */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-xs border border-slate-200 text-slate-900 text-[11px] font-bold flex items-center gap-1">
                  <span className="text-emerald-600 font-extrabold">✓</span>
                  <span>{formData.aboutStatValue || '100%'}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                * Зураг болон текст нь вэбсайтын нүүр хуудасны "Бидний тухай" хэсэгт яг ингэж харагдана.
              </p>
            </div>
          </div>
        </div>

        {/* Block 2: Mission and Vision Quotes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-600" />
              <span>2. Эрхэм зорилго (Mission & Vision)</span>
            </h3>
            <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
              Зураг дээрх тод бичвэр
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Эрхэм зорилгын дэд гарчиг
              </label>
              <input
                type="text"
                value={formData.aboutMissionSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, aboutMissionSubtitle: e.target.value })}
                placeholder="Жишээ: Манай эрхэм зорилго"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Эрхэм зорилгын гол бичвэр / Ишлэл үг
              </label>
              <input
                type="text"
                required
                value={formData.aboutMissionQuote || ''}
                onChange={(e) => setFormData({ ...formData, aboutMissionQuote: e.target.value })}
                placeholder="Жишээ: Оюунлаг, ёс зүйтэй, дэлхийд өрсөлдөхүйц Монгол иргэнийг төлөвшүүлнэ"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-amber-50/50 border border-amber-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold text-amber-950"
              />
            </div>
          </div>
        </div>

        {/* Block 3: About Title, Badge, Description and Button */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>3. Сургуулийн танилцуулга бичвэр & Товчлуур</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Дээд жижиг шошго (Badge)
              </label>
              <input
                type="text"
                value={formData.aboutBadge || ''}
                onChange={(e) => setFormData({ ...formData, aboutBadge: e.target.value })}
                placeholder="Жишээ: Сургуулийн тухай"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Үндсэн урилга гарчиг
              </label>
              <input
                type="text"
                required
                value={formData.aboutTitle || ''}
                onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                placeholder="Жишээ: Эрдмийн Далай Сургуульд тавтай морилно уу"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Сургуулийн тухай дэлгэрэнгүй эх бичвэр
            </label>
            <textarea
              rows={4}
              required
              value={formData.aboutDescription || ''}
              onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
              placeholder="Сургуулийн тухай дэлгэрэнгүй танилцуулга бичвэр..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Онцлох үзүүлэлтийн тоо
              </label>
              <input
                type="text"
                value={formData.aboutStatValue || ''}
                onChange={(e) => setFormData({ ...formData, aboutStatValue: e.target.value })}
                placeholder="Жишээ: 100% эсвэл 98%+"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Онцлох үзүүлэлтийн тайлбар
              </label>
              <input
                type="text"
                value={formData.aboutStatLabel || ''}
                onChange={(e) => setFormData({ ...formData, aboutStatLabel: e.target.value })}
                placeholder="Жишээ: Үндэсний & Олон улсын магадлан итгэмжлэл"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Хөтөлбөр рүү үсрэх товчлуурын нэр
              </label>
              <input
                type="text"
                value={formData.aboutButtonText || ''}
                onChange={(e) => setFormData({ ...formData, aboutButtonText: e.target.value })}
                placeholder="Жишээ: Хөтөлбөрүүдтэй танилцах"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Block 4: Core Values & Pillars List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>4. Онцлог давуу талууд & Үнэт зүйлсийн картууд ({currentValues.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Бидний тухай хэсэгт байрлах 4 онцлох багана (дүрс тэмдэг, гарчиг, тайлбар).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetValues}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Үндсэн 4 карт руу буцаах</span>
              </button>
              <button
                type="button"
                onClick={handleAddValue}
                className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Карт нэмэх</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentValues.map((val, idx) => (
              <div
                key={val.id || idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700">Карт #{idx + 1}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteValue(idx)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                    title="Устгах"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Icon Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Дүрс тэмдэг
                    </label>
                    <select
                      value={val.iconName}
                      onChange={(e) => handleValueChange(idx, 'iconName', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                    >
                      {AVAILABLE_ICONS.map((ic) => (
                        <option key={ic.key} value={ic.key}>
                          {ic.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Гарчиг
                    </label>
                    <input
                      type="text"
                      required
                      value={val.title}
                      onChange={(e) => handleValueChange(idx, 'title', e.target.value)}
                      placeholder="Жишээ: Аюулгүй & Тав тухтай орчин"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Дэлгэрэнгүй тайлбар
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={val.description}
                    onChange={(e) => handleValueChange(idx, 'description', e.target.value)}
                    placeholder="Жишээ: 24/7 харуул хамгаалалт, агааржуулалтын систем..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit & Save Footer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-2xl shadow-md sticky bottom-4 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-300">
              Өөрчлөлтүүд Firebase өгөгдлийн санд шууд хадгалагдана.
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Хадгалагдлаа!
              </span>
            )}
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Өгөгдлийн санд хадгалах</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
