import React from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  CheckCircle2,
  ShieldCheck,
  Globe2,
  Lightbulb,
  Compass,
  Award,
  Star,
  BookOpen,
  Heart,
  Users,
  Target
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  shield: ShieldCheck,
  globe: Globe2,
  stem: Lightbulb,
  lightbulb: Lightbulb,
  award: Award,
  star: Star,
  book: BookOpen,
  heart: Heart,
  users: Users,
  target: Target,
  check: CheckCircle2
};

export const AboutSection: React.FC = () => {
  const { sectionTexts } = useSchool();

  const defaultValues = [
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

  const valuesToRender = (sectionTexts.aboutValues && sectionTexts.aboutValues.length > 0)
    ? sectionTexts.aboutValues
    : defaultValues;

  const mainImageUrl = sectionTexts.aboutImageUrl || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=900&auto=format&fit=crop';
  const missionSubtitle = sectionTexts.aboutMissionSubtitle || 'Манай эрхэм зорилго';
  const buttonLabel = sectionTexts.aboutButtonText || 'Хөтөлбөрүүдтэй танилцах';

  return (
    <section id="about" className="py-16 sm:py-24 bg-white px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-4/3 bg-slate-100">
                <img
                  src={mainImageUrl}
                  alt={sectionTexts.aboutTitle || 'Бидний тухай'}
                  className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Mission Quote Overlay */}
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                      {missionSubtitle}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-semibold leading-snug drop-shadow-md text-amber-50">
                    "{sectionTexts.aboutMissionQuote || 'Оюунлаг, ёс зүйтэй, дэлхийд өрсөлдөхүйц Монгол иргэнийг төлөвшүүлнэ'}"
                  </p>
                </div>
              </div>

              {/* Floating stats card */}
              {(sectionTexts.aboutStatValue || sectionTexts.aboutStatLabel) && (
                <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-100 max-w-[200px] sm:max-w-[240px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {sectionTexts.aboutStatValue || '100%'}
                      </div>
                      <div className="text-xs text-slate-500 font-medium leading-tight">
                        {sectionTexts.aboutStatLabel || 'Магадлан итгэмжлэл'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: About texts & Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold tracking-wide uppercase border border-amber-200">
              <Compass className="w-3.5 h-3.5" />
              <span>{sectionTexts.aboutBadge || 'Сургуулийн тухай'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {sectionTexts.aboutTitle || 'Эрдмийн Далай Сургуульд тавтай морилно уу'}
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              {sectionTexts.aboutDescription || 'Бид сурагч нэг бүрийн өвөрмөц онцлог, авьяас билгийг хүндэтгэн, сурах чин эрмэлзлийг нь бадрааж, орчин үеийн шилдэг технологи, шинжлэх ухаанч арга зүйгээр боловсрол олгодог.'}
            </p>

            {/* Grid of values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {valuesToRender.map((v, i) => {
                const IconComponent = ICON_MAP[v.iconName?.toLowerCase()] || ShieldCheck;
                return (
                  <div
                    key={v.id || i}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{v.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{v.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('news');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{buttonLabel}</span>
                <span className="text-amber-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
