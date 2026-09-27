import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { Users, Award, GraduationCap, Sparkles } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { schoolInfo } = useSchool();

  const stats = [
    {
      id: 'students',
      label: schoolInfo.studentsLabel || 'Нийт суралцагч сурагчид',
      value: `${schoolInfo.studentsCount ?? 1250}${schoolInfo.studentsSuffix !== undefined ? schoolInfo.studentsSuffix : '+'}`,
      icon: Users,
      desc: schoolInfo.studentsDesc || '1-12-р ангийн шилдэг сурагчид'
    },
    {
      id: 'teachers',
      label: schoolInfo.teachersLabel || 'Багшлах бүрэлдэхүүн',
      value: `${schoolInfo.teachersCount ?? 92}${schoolInfo.teachersSuffix !== undefined ? schoolInfo.teachersSuffix : '+'}`,
      icon: GraduationCap,
      desc: schoolInfo.teachersDesc || 'Магистр, Доктор, Олон улсын зэрэгтэй'
    },
    {
      id: 'college',
      label: schoolInfo.collegeLabel || 'Их дээд сургуулийн элсэлт',
      value: `${schoolInfo.collegeAcceptanceRate ?? 98}${schoolInfo.collegeSuffix !== undefined ? schoolInfo.collegeSuffix : '+'}`,
      icon: Award,
      desc: schoolInfo.collegeDesc || 'Дэлхийн шилдэг болон дотоодын тэтгэлэг'
    },
    {
      id: 'clubs',
      label: schoolInfo.clubsLabel || 'Хөгжлийн дугуйлан, клубүүд',
      value: `${schoolInfo.clubsCount ?? 24}${schoolInfo.clubsSuffix !== undefined ? schoolInfo.clubsSuffix : '+'}`,
      icon: Sparkles,
      desc: schoolInfo.clubsDesc || 'STEM, Урлаг, Спорт, Гадаад хэл'
    }
  ];

  return (
    <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-amber-500/50 hover:bg-slate-800/60 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-amber-400 mb-1 leading-snug">
                  {stat.label}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 max-w-[200px] leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
