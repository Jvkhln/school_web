import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { CalendarEvent } from '../../types';
import {
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import {
  getMongoliaTime,
  getMongoliaTargetMonths,
  isEventInMongoliaMonths,
  generateMongoliaMonthPresets
} from '../../utils/mongoliaTime';

const CATEGORY_OPTIONS: { id: CalendarEvent['category']; name: string; color: string; groupName: string }[] = [
  { id: 'exam', name: '🔵 Улирлын шалгалт / Сорил (Сургалт)', color: 'blue', groupName: 'Сургалт, Шалгалт' },
  { id: 'olympiad', name: '🔵 Олимпиад / Уралдаан (Сургалт)', color: 'blue', groupName: 'Сургалт, Шалгалт' },
  { id: 'event', name: '🟡 Сургуулийн арга хэмжээ', color: 'amber', groupName: 'Арга хэмжээ' },
  { id: 'admission', name: '🟡 Элсэлтийн өдөрлөг / Бүртгэл', color: 'amber', groupName: 'Арга хэмжээ' },
  { id: 'meeting', name: '🟡 Эцэг эхийн хурал / Зөвлөгөөн', color: 'amber', groupName: 'Арга хэмжээ' },
  { id: 'holiday', name: '🟢 Сурагчдын амралт / Баяр', color: 'emerald', groupName: 'Баяр, Амралт' }
];

export const AdminCalendarManager: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent
  } = useSchool();

  const mnTime = useMemo(() => getMongoliaTime(), []);
  const mnTarget = useMemo(() => getMongoliaTargetMonths(), []);
  const monthPresets = useMemo(() => generateMongoliaMonthPresets(), []);

  const [search, setSearch] = useState('');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State initialized with Mongolia current date
  const [formData, setFormData] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    month: mnTime.yearMonth,
    monthName: mnTime.monthName,
    day: String(mnTime.day).padStart(2, '0'),
    dateRange: `${mnTime.year}.${String(mnTime.month).padStart(2, '0')}.${String(mnTime.day).padStart(2, '0')}`,
    category: 'event',
    categoryName: 'Сургуулийн арга хэмжээ',
    targetGroup: 'Бүх анги',
    description: '',
    location: 'Сургуулийн танхим',
    isImportant: false
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      month: mnTime.yearMonth,
      monthName: mnTime.monthName,
      day: String(mnTime.day).padStart(2, '0'),
      dateRange: `${mnTime.year}.${String(mnTime.month).padStart(2, '0')}.${String(mnTime.day).padStart(2, '0')}`,
      category: 'event',
      categoryName: 'Сургуулийн арга хэмжээ',
      targetGroup: 'Бүх анги',
      description: '',
      location: 'Сургуулийн танхим',
      isImportant: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: CalendarEvent) => {
    setEditingId(ev.id);
    setFormData({
      title: ev.title,
      month: ev.month,
      monthName: ev.monthName,
      day: ev.day,
      dateRange: ev.dateRange,
      category: ev.category,
      categoryName: ev.categoryName,
      targetGroup: ev.targetGroup,
      description: ev.description || '',
      location: ev.location || '',
      isImportant: !!ev.isImportant
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const matchedCat = CATEGORY_OPTIONS.find((c) => c.id === formData.category);
    const categoryName = matchedCat ? matchedCat.name.split('/')[0].trim() : 'Арга хэмжээ';

    const payload = {
      ...formData,
      categoryName
    };

    if (editingId) {
      updateCalendarEvent(editingId, payload);
    } else {
      addCalendarEvent(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteCalendarEvent(id);
    setDeleteConfirmId(null);
  };

  const filteredList = calendarEvents.filter((ev) => {
    const matchesSearch =
      !search ||
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.description?.toLowerCase().includes(search.toLowerCase()) ||
      ev.targetGroup.toLowerCase().includes(search.toLowerCase());

    let matchesMonth = true;
    if (selectedMonthFilter === 'upcoming') {
      matchesMonth = isEventInMongoliaMonths(ev, mnTarget.windowCodes);
    } else if (selectedMonthFilter !== 'all') {
      matchesMonth = isEventInMongoliaMonths(ev, [selectedMonthFilter]);
    }

    return matchesSearch && matchesMonth;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-amber-600" />
            <span>Календарчилсан Төлөвлөгөөний Удирдлага</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs sm:text-sm text-slate-500">
              Сургуулийн жилийн болон сарын шалгалт, амралт, арга хэмжээг нэмж удирдах.
            </p>
            <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200">
              🇲🇳 Монголын цаг: {mnTarget.academicYear} оны {mnTime.monthName}
            </span>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Шинэ төлөвлөгөө нэмэх</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Төлөвлөгөө, арга хэмжээ хайх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select
            value={selectedMonthFilter}
            onChange={(e) => setSelectedMonthFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
          >
            <option value="all">Бүх сарын төлөвлөгөө</option>
            <option value="upcoming">
              🇲🇳 Сүүлийн 1-2 сар ({mnTarget.current.name}, {mnTarget.next.name})
            </option>
            {monthPresets.map((m) => (
              <option key={m.code} value={m.code}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Нийт: <strong className="text-slate-900">{filteredList.length}</strong> үйл явдал
        </div>
      </div>

      {/* Events Table / Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map((ev) => {
          const isAcademic = ev.category === 'exam' || ev.category === 'olympiad';
          const isHoliday = ev.category === 'holiday';
          const colorClass = isAcademic
            ? 'border-l-4 border-l-blue-600'
            : isHoliday
            ? 'border-l-4 border-l-emerald-500'
            : 'border-l-4 border-l-amber-500';

          const badgeClass = isAcademic
            ? 'bg-blue-100 text-blue-900 border-blue-200'
            : isHoliday
            ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
            : 'bg-amber-100 text-amber-950 border-amber-300';

          return (
            <div
              key={ev.id}
              className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden ${colorClass}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 text-xs font-black">
                      {ev.monthName} • {ev.day}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                      {ev.categoryName}
                    </span>
                  </div>

                  {ev.isImportant && (
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded border border-amber-300">
                      Онцлох
                    </span>
                  )}
                </div>

              <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                {ev.title}
              </h4>

              {ev.description && (
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {ev.description}
                </p>
              )}

              <div className="space-y-1 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Огноо: {ev.dateRange}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Бүлэг: {ev.targetGroup}</span>
                </div>
                {ev.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Байршил: {ev.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleOpenEdit(ev)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Засах</span>
              </button>

              <button
                onClick={() => setDeleteConfirmId(ev.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Устгах</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>

      {filteredList.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Төлөвлөгөө олдсонгүй</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Шинээр төлөвлөгөө нэмэх эсвэл хайлтын шүүлтүүрээ өөрчилнө үү.
          </p>
          <button
            onClick={handleOpenAdd}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            Шинэ төлөвлөгөө нэмэх
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-600" />
                <span>
                  {editingId ? 'Төлөвлөгөө засах' : 'Шинэ төлөвлөгөө / үйл явдал нэмэх'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Төлөвлөгөөний нэр / Арга хэмжээний гарчиг *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Жишээ: 2-р улирлын сорил шалгалт"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Сар сонгох *
                  </label>
                  <select
                    value={formData.month}
                    onChange={(e) => {
                      const selected = monthPresets.find((m) => m.code === e.target.value);
                      const cleanName = selected ? selected.name.split('•')[0].trim() : e.target.value;
                      setFormData({
                        ...formData,
                        month: e.target.value,
                        monthName: cleanName
                      });
                    }}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    {monthPresets.map((m) => (
                      <option key={m.code} value={m.code}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Өдөр (Тоо эсвэл завсар) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Жишээ: 15 эсвэл 20-24"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Бүрэн огноо бичилт
                  </label>
                  <input
                    type="text"
                    placeholder="Жишээ: 2025.03.15 - 03.18"
                    value={formData.dateRange}
                    onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Үйл ажиллагааны төрөл *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as CalendarEvent['category']
                      })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Хамаарах бүлэг / Анги
                  </label>
                  <input
                    type="text"
                    placeholder="Жишээ: 6-12-р анги, Бүх сурагчид, Эцэг эхчүүд"
                    value={formData.targetGroup}
                    onChange={(e) => setFormData({ ...formData, targetGroup: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Байршил / Танхим
                  </label>
                  <input
                    type="text"
                    placeholder="Жишээ: Актовый заал, Спортын цогцолбор"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Дэлгэрэнгүй тайлбар & Заавар
                </label>
                <textarea
                  rows={3}
                  placeholder="Арга хэмжээ, шалгалтын талаарх нэмэлт мэдээлэл..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cal-is-important"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="cal-is-important" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Онцлох чухал арга хэмжээ гэж тэмдэглэх
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  {editingId ? 'Өөрчлөлтийг хадгалах' : 'Төлөвлөгөө нэмэх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 space-y-4 border border-slate-200 shadow-xl">
            <h4 className="font-bold text-slate-900 text-base">Төлөвлөгөөг устгах уу?</h4>
            <p className="text-xs text-slate-500">
              Энэ төлөвлөгөө хуанли болон вэбсайт дээрээс бүрмөсөн устах болно.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Болих
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Устгах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
