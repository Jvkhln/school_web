import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { CategoryIcon } from './CategoryIcon';
import { ExternalLink, Globe } from 'lucide-react';
import { CategoryItem } from '../types';

export const CategoryIconBar: React.FC = () => {
  const { categories, setIsAdmissionModalOpen } = useSchool();

  // Visible sub-domain portals & services
  const displaySubdomains = categories.filter((cat) => cat.active !== false);

  const getResolvedUrl = (cat: CategoryItem): string => {
    if (!cat.url) {
      return cat.slug ? `https://${cat.slug}.eds.edu.mn` : '#';
    }
    const trimmed = cat.url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//') || trimmed.startsWith('#')) {
      return trimmed;
    }
    if (trimmed.includes('.') && !trimmed.startsWith('#')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const handleSubdomainClick = (e: React.MouseEvent<HTMLAnchorElement>, cat: CategoryItem) => {
    const targetUrl = getResolvedUrl(cat);

    // Hash links
    if (targetUrl.startsWith('#')) {
      e.preventDefault();
      const targetId = targetUrl.substring(1);
      if (targetId === 'admission') {
        setIsAdmissionModalOpen(true);
        return;
      }
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Direct external/subdomain navigation
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://') || targetUrl.startsWith('//')) {
      if (cat.target === '_self') {
        window.location.href = targetUrl;
      } else {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
      e.preventDefault();
    }
  };

  if (displaySubdomains.length === 0) {
    return null;
  }

  return (
    <section id="categories" className="w-full bg-white border-b border-slate-200/80 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section subtle title */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <Globe className="w-4 h-4 text-amber-600" />
          <span className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">
            Сургуулийн цахим экосистем
          </span>
        </div>

        <div className="flex flex-wrap justify-center items-stretch gap-3 sm:gap-6 md:gap-8">
          {displaySubdomains.map((cat) => {
            const resolvedUrl = getResolvedUrl(cat);
            const isExternal = resolvedUrl.startsWith('http://') || resolvedUrl.startsWith('https://');

            return (
              <a
                key={cat.id}
                id={`subdomain-link-${cat.slug || cat.id}`}
                href={resolvedUrl}
                target={isExternal ? (cat.target || '_blank') : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleSubdomainClick(e, cat)}
                className="w-[110px] sm:w-[135px] md:w-[155px] flex flex-col items-center justify-start group transition-all p-2.5 sm:p-3 rounded-2xl cursor-pointer text-center text-slate-700 hover:bg-amber-50/60 hover:text-amber-900 border border-transparent hover:border-amber-200 hover:shadow-xs"
                title={`${cat.name}\n${cat.description || ''}\n${resolvedUrl}`}
              >
                {/* Circular Icon Container */}
                <div className="relative mb-2 shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xs bg-slate-100 text-slate-700 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-105 group-hover:shadow-md group-hover:shadow-amber-600/25">
                    <CategoryIcon
                      name={cat.iconName}
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform group-hover:scale-110"
                    />
                  </div>

                  {/* Optional Badge */}
                  {cat.badge && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs border border-white leading-tight">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Name Label with External Link Icon */}
                <div className="flex items-center justify-center gap-1 w-full px-1">
                  <span className="text-xs sm:text-sm text-center leading-snug tracking-tight transition-all font-bold text-slate-900 group-hover:text-amber-800 line-clamp-2">
                    {cat.name}
                  </span>
                  {isExternal && (
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-700 opacity-60 group-hover:opacity-100 shrink-0 transition-opacity" />
                  )}
                </div>

                {/* Subdomain URL or English identifier */}
                <span className="text-[10px] sm:text-[11px] text-slate-400 group-hover:text-amber-700/80 font-mono mt-0.5 truncate max-w-full px-1">
                  {cat.nameEn || (cat.url ? cat.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${cat.slug}.eds.edu.mn`)}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

