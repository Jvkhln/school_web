import React, { useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  School,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import { ARTICLE_NEWS_CATEGORIES } from './NewsSection';

export const Footer: React.FC = () => {
  const {
    schoolInfo,
    sectionTexts,
    news,
    setActiveCategory,
    openArticleBySlug,
    setIsAdmissionModalOpen
  } = useSchool();

  // News category list matching article categories
  const articleCategories = useMemo(() => {
    const map = new Map<string, string>();
    ARTICLE_NEWS_CATEGORIES.forEach((c) => map.set(c.slug, c.name));
    news.forEach((n) => {
      if (n.categorySlug && !map.has(n.categorySlug)) {
        map.set(n.categorySlug, n.categoryName || n.categorySlug);
      }
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [news]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#1a3e88] text-blue-50">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: School Identity & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {schoolInfo.logoUrl ? (
                <div className="h-10 sm:h-11 w-auto max-w-[130px] flex items-center justify-center shrink-0">
                  <img
                    src={schoolInfo.logoUrl}
                    alt={schoolInfo.name}
                    className="max-h-10 sm:max-h-11 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white text-[#1a3e88] flex items-center justify-center font-bold shadow-xs overflow-hidden shrink-0">
                  <School className="w-6 h-6" />
                </div>
              )}
              <span className="font-extrabold text-xl tracking-tight text-white">
                {schoolInfo.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-sm">
              {sectionTexts.footerDescription}
            </p>

            {/* Join Us / Social Links */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Биднийг дагаарай
              </h4>
              <div className="flex items-center space-x-3 text-white">
                <a
                  href={schoolInfo.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center justify-center"
                  aria-label="Facebook page"
                  title="Facebook хуудас"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={schoolInfo.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={schoolInfo.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center justify-center"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>

                {/* Direct Share on Facebook */}
                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://eds.edu.mn'),
                      '_blank',
                      'noopener,noreferrer,width=620,height=580'
                    );
                  }}
                  className="px-2.5 py-1.5 rounded-full bg-white/15 hover:bg-[#1877F2] text-white hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs border border-white/20"
                  title="Энэхүү цахим хуудсыг Facebook дээр хуваалцах"
                >
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                  <span>Хуваалцах</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Categories / News */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-white tracking-wide">
              Мэдээ, мэдээллийн чиглэл
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100/90">
              {articleCategories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => {
                      setActiveCategory(cat.slug);
                      if (cat.slug === 'admission-exam') {
                        const el = document.getElementById('admission') || document.getElementById('news');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        scrollToSection('news');
                      }
                    }}
                    className="hover:text-amber-300 hover:underline transition-all text-left cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    scrollToSection('news');
                  }}
                  className="text-amber-300 font-semibold hover:underline cursor-pointer"
                >
                  Бүх мэдээг харах →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Parents & Students Services */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-white tracking-wide">
              Эцэг эх, сурагчдад
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100/90">
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    scrollToSection('news');
                  }}
                  className="hover:text-amber-300 hover:underline cursor-pointer text-left"
                >
                  Сургуулийн зар мэдээ
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('calendar')}
                  className="hover:text-amber-300 hover:underline cursor-pointer text-left"
                >
                  Хичээлийн хуваарь & Календарь
                </button>
              </li>
              <li>
                <span className="hover:text-amber-300 cursor-pointer">Үдийн цай, хоолны цэс</span>
              </li>
              <li>
                <button
                  onClick={() => openArticleBySlug('rules')}
                  className="hover:text-amber-300 hover:underline cursor-pointer text-left"
                >
                  Сургуулийн дүрэм, стандарт
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-white tracking-wide">
              Холбоо барих
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-blue-100/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>{schoolInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <a
                  href={`mailto:${schoolInfo.email}`}
                  className="hover:text-amber-300 hover:underline transition-colors"
                >
                  {schoolInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <a
                  href={`tel:${schoolInfo.phone}`}
                  className="hover:text-amber-300 hover:underline transition-colors"
                >
                  {schoolInfo.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer line matching top bar */}
      <div className="border-t border-slate-800 bg-slate-900 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} "{schoolInfo.name}". Бүх эрх хуулиар хамгаалагдсан.</p>
          <p className="text-slate-400">
            Хөгжүүлсэн & Jvkhln
          </p>
        </div>
      </div>
    </footer>
  );
};
