import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SectionTexts } from '../../types';
import { ImagePresetPicker } from './ImagePresetPicker';
import {
  Save,
  RotateCcw,
  Type,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Layers,
  FileText,
  GraduationCap,
  Info,
  Sliders,
  Compass,
  Building,
  Check,
  Target,
  Image as ImageIcon
} from 'lucide-react';

export const AdminSectionTextsManager: React.FC = () => {
  const { sectionTexts, updateSectionTexts, resetToDefaults } = useSchool();

  const [formData, setFormData] = useState<SectionTexts>(sectionTexts);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'editor' | 'guide'>('editor');

  useEffect(() => {
    setFormData(sectionTexts);
  }, [sectionTexts]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSectionTexts(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header with Guide Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Вэб Текст & Бүлгүүдийн Засвар
            </h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Шууд шинэчлэгдэнэ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Нүүр хуудасны гарчгууд, тайлбар бичвэр, эрхэм зорилго болон бусад бүх текстийг эндээс засна.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveGuideTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGuideTab === 'editor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-600" />
                <span>Текст засах</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGuideTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGuideTab === 'guide'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Заавар & Зөвлөмж</span>
              </span>
            </button>
          </div>

          {saveSuccess && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Хадгалагдлаа!</span>
            </div>
          )}
        </div>
      </div>

      {activeGuideTab === 'guide' ? (
        /* How-To Guide for Editing Any Text on the Website */
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-extrabold text-amber-950 flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Вэб сайтын текстүүдийг хэрхэн солих вэ?</span>
            </h3>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              Манай систем нь динамик CMS бүтэцтэй тул кодонд гар хүрэлгүйгээр вэб сайтын <strong>БҮХ текстийг</strong> админ самбараас бүрэн удирдах боломжтой. Доорх зааврын дагуу тохирох цэс рүү орж засна:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Guide Item 1 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                1. Нүүр хуудасны гарчиг ба тайлбарууд
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Энэ цонхны <strong>"Текст засах"</strong> таб дээрээс "Онцлох хөтөлбөрүүд", "Сүүлийн үеийн мэдээ", "Бидний тухай", "Эрхэм зорилго" зэрэг үндсэн хэсгүүдийн гарчиг, дэд тайлбарыг солино.
              </p>
            </div>

            {/* Guide Item 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                2. Мэдээ & Нийтлэлийн текстүүд
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Админ самбарын <strong>"Мэдээ нийтлэл"</strong> таб руу орж аль ч мэдээний "Засах" товчийг дарж гарчиг, хураангуй, үндсэн эх бичвэр, зохиогч, огноог өөрчлөх эсвэл шинэ мэдээ нэмнэ.
              </p>
            </div>

            {/* Guide Item 3 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                3. Хөтөлбөрүүдийн бүрэн танилцуулга
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>"Сургалтын хөтөлбөрүүд"</strong> таб руу орж Бага анги, Кембриж, STEM лаб гэх мэт хөтөлбөр бүрийн нэр, насны ангилал, хуваарь, давуу тал, хичээлийн хөтөлбөрийн текстийг засна.
              </p>
            </div>

            {/* Guide Item 4 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                4. Слайдер том баннерын бичвэрүүд
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>"Слайдер баннер"</strong> таб дээр нүүр хуудасны эхэнд эргэлддэг том зургуудын гарчиг, дэд тайлбар, товчны бичиг ("Элсэлт илгээх" гэх мэт), зүүлт тэмдэглэгээг засна.
              </p>
            </div>

            {/* Guide Item 5 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                5
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                5. Ангилалуудын нэр ба тайлбар
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>"Ангилалууд"</strong> таб дээр сургалтын төрлүүдийн Монгол нэр, Англи нэр болон дүрс (icon)-ийг солих боломжтой.
              </p>
            </div>

            {/* Guide Item 6 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                6
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                6. Сургуулийн нэр, утас, хаяг, уриа
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>"Сургуулийн тохиргоо"</strong> таб руу орж сургуулийн нэр, уриа үг, утасны дугаар, имэйл, хаяг, ажиллах цаг болон тоон үзүүлэлтүүд (сурагч, багшийн тоо)-г солино.
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setActiveGuideTab('editor')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Type className="w-4 h-4" />
              <span>Одоо гарчиг & текстүүдээ засах</span>
            </button>
          </div>
        </div>
      ) : (
        /* The Actual Text Form */
        <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-200">
          {/* Section 0: Top Flowing Marquee Announcement */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-2xl border-2 border-amber-400/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Дээд талын урсдаг зарлал (Шуурхай мэдээний урсгал)</span>
              </h3>
              <span className="text-[11px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                Вэбсайтын оройд урсдаг
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Урсах зарлалын бичвэр (Цэг, зураас эсвэл • тэмдгээр зааглаж бичиж болно)
              </label>
              <textarea
                rows={2}
                value={formData.topAnnouncement || ''}
                onChange={(e) => setFormData({ ...formData, topAnnouncement: e.target.value })}
                placeholder="Жишээ: Цахим систем: 2025-2026 Оны элсэлтийн бүртгэл эхэллээ • Сургуулийн урлагийн их наадам 4-р сарын 10-нд болно..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-amber-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
              />
              <div className="mt-2 p-2.5 bg-slate-900 rounded-xl text-amber-300 text-xs overflow-hidden flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                  Харагдах байдал:
                </span>
                <div className="overflow-hidden whitespace-nowrap flex-1">
                  <span className="animate-marquee inline-block">
                    {formData.topAnnouncement || 'Зарлалын текст оруулаагүй байна...'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Featured Programs Heading */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>1. "Онцлох Хөтөлбөрүүд" бүлгийн гарчиг & тайлбар</span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Бүлгийн үндсэн гарчиг
                </label>
                <input
                  type="text"
                  required
                  value={formData.programsTitle}
                  onChange={(e) => setFormData({ ...formData, programsTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Дэд тайлбар бичвэр
                </label>
                <textarea
                  rows={2}
                  value={formData.programsSubtitle}
                  onChange={(e) => setFormData({ ...formData, programsSubtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: News Section Heading */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>2. "Сүүлийн Үеийн Мэдээ" бүлгийн гарчиг & тайлбар</span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Мэдээний хэсгийн гарчиг
                </label>
                <input
                  type="text"
                  required
                  value={formData.newsTitle}
                  onChange={(e) => setFormData({ ...formData, newsTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Мэдээний дэд тайлбар
                </label>
                <textarea
                  rows={2}
                  value={formData.newsSubtitle}
                  onChange={(e) => setFormData({ ...formData, newsSubtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: About School Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>3. "Бидний тухай & Эрхэм зорилго" зураг болон бичвэрүүд</span>
              </h3>
              <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                Зураг + Бичвэр
              </span>
            </div>

            {/* Image Picker for About section */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>"Бидний тухай" хэсгийн зураг сонгох эсвэл оруулах</span>
              </label>
              <ImagePresetPicker
                value={formData.aboutImageUrl || ''}
                onChange={(url) => setFormData({ ...formData, aboutImageUrl: url })}
                label="Танилцуулгын үндсэн зураг (Image URL / Файл хуулах / Бэлэн зураг)"
                recommendedAspect="4:3 харьцаа тохиромжтой"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Дээд шошго (Badge)
                </label>
                <input
                  type="text"
                  value={formData.aboutBadge}
                  onChange={(e) => setFormData({ ...formData, aboutBadge: e.target.value })}
                  placeholder="Жишээ: Сургуулийн тухай"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Үндсэн урилга гарчиг
                </label>
                <input
                  type="text"
                  value={formData.aboutTitle}
                  onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                  placeholder="Жишээ: Эрдмийн Далай Сургуульд тавтай морилно уу"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>
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
                  Эрхэм зорилго ишлэл үг (Зураг дээр гарах тод шар бичвэр)
                </label>
                <input
                  type="text"
                  value={formData.aboutMissionQuote}
                  onChange={(e) => setFormData({ ...formData, aboutMissionQuote: e.target.value })}
                  placeholder="Жишээ: Оюунлаг, ёс зүйтэй, дэлхийд өрсөлдөхүйц Монгол иргэнийг төлөвшүүлнэ"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-amber-50/50 border border-amber-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium text-amber-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Сургуулийн тухай дэлгэрэнгүй эх бичвэр
              </label>
              <textarea
                rows={3}
                value={formData.aboutDescription}
                onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Онцлох үзүүлэлтийн тоо (Жишээ нь: 100%)
                </label>
                <input
                  type="text"
                  value={formData.aboutStatValue}
                  onChange={(e) => setFormData({ ...formData, aboutStatValue: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Онцлох үзүүлэлтийн тайлбар
                </label>
                <input
                  type="text"
                  value={formData.aboutStatLabel}
                  onChange={(e) => setFormData({ ...formData, aboutStatLabel: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Хөтөлбөр рүү үсрэх товчлуурын бичвэр
                </label>
                <input
                  type="text"
                  value={formData.aboutButtonText || ''}
                  onChange={(e) => setFormData({ ...formData, aboutButtonText: e.target.value })}
                  placeholder="Жишээ: Хөтөлбөрүүдтэй танилцах"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Admission & Footer copy */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building className="w-4 h-4 text-amber-600" />
              <span>4. Элсэлтийн цонх ба Хөл хэсгийн (Footer) бичвэрүүд</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Элсэлтийн маягтын гарчиг
                </label>
                <input
                  type="text"
                  value={formData.admissionModalTitle}
                  onChange={(e) => setFormData({ ...formData, admissionModalTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Элсэлтийн маягтын тайлбар заавар
                </label>
                <input
                  type="text"
                  value={formData.admissionModalSubtitle}
                  onChange={(e) => setFormData({ ...formData, admissionModalSubtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Хөл хэсгийн товч бичвэр (Footer description)
              </label>
              <textarea
                rows={2}
                value={formData.footerDescription}
                onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                resetToDefaults();
                setFormData({
                  programsTitle: 'Манай Сургуулийн Онцлох Хөтөлбөрүүд',
                  programsSubtitle:
                    'Сурагч бүрийн оюуны чадамж, бүтээлч сэтгэлгээ, бие даах чадварыг нээн хөгжүүлж, олон улсын жишигт хүрэх чанартай боловсролын орчныг бүрдүүлж байна.',
                  newsTitle: 'Сургуулийн Сүүлийн Үеийн Мэдээ, Үйл Явдал',
                  newsSubtitle:
                    'Сургуулийн үйл ажиллагаа, сурагчдын гаргасан онцлох амжилтууд, элсэлтийн хуваарь болон эцэг эхчүүдэд зориулсан шинэ мэдээллүүдтэй танилцана уу.',
                  aboutBadge: 'Сургуулийн тухай',
                  aboutTitle: 'Эрдэм Боловсролын Цогцолбор Сургуульд тавтай морилно уу',
                  aboutDescription:
                    'Манай сургууль нь 2005 оноос эхлэн орчин үеийн боловсролын дэвшилтэт арга барил, олон улсын стандартыг үндэсний уламжлалт хүмүүжилтэй хослуулан хэрэгжүүлж байна. Бид сурагч нэг бүрийн өвөрмөц онцлог, авьяас билгийг хүндэтгэн, сурах чин эрмэлзлийг нь бадрааж, шинжлэх ухаанч арга зүйгээр боловсрол олгодог.',
                  aboutMissionQuote:
                    'Оюунлаг, ёс зүйтэй, дэлхийд өрсөлдөхүйц Монгол иргэнийг төлөвшүүлнэ',
                  aboutStatValue: '100%',
                  aboutStatLabel: 'Үндэсний & Олон улсын магадлан итгэмжлэл',
                  footerDescription:
                    'Олон улсын жишигт нийцсэн чанартай боловсролоор дамжуулан сурагчдынхаа ирээдүйн амжилтын бат бөх суурийг тавьж, дэлхийн иргэн болгон бэлтгэдэг.',
                  admissionModalTitle: 'Элсэлтийн хүсэлт илгээх',
                  admissionModalSubtitle:
                    'Та доорх мэдээллийг үнэн зөв бөглөн илгээнэ үү. Бид тантай эргэн холбогдох болно.'
                });
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Анхны текстүүд рүү буцаах</span>
            </button>

            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer ml-auto"
            >
              <Save className="w-4 h-4" />
              <span>Бүх өөрчлөлтийг хадгалах</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
