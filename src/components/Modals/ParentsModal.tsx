import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  X,
  Calendar,
  Utensils,
  ShieldAlert,
  GraduationCap,
  Clock,
  Download,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export type ParentModalTab = 'schedule' | 'menu' | 'rules';

interface ParentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ParentModalTab;
  onSelectTab: (tab: ParentModalTab) => void;
  onOpenFeedback: () => void;
}

export const ParentsModal: React.FC<ParentsModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenFeedback
}) => {
  const { schoolInfo } = useSchool();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Эцэг эх, асран хамгаалагчдын мэдээллийн булан
              </h2>
              <p className="text-xs text-slate-400">
                {schoolInfo?.name || 'Эрдмийн далай сургууль'} • 2025-2026 хичээлийн жил
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => onSelectTab('schedule')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-400/40'
                : 'bg-white text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Хичээлийн хуваарь</span>
          </button>

          <button
            onClick={() => onSelectTab('menu')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-400/40'
                : 'bg-white text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Үдийн хоол, цай</span>
          </button>

          <button
            onClick={() => onSelectTab('rules')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-400/40'
                : 'bg-white text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Дүрэм & Стандарт</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-700 text-sm space-y-4">
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Хичээлийн цагийн хуваарь & Бүтэц</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    2025-2026 оны хичээлийн жилийн батлагдсан 4 улирлын стандарт цагийн хуваарь.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-2">1-р ээлж (1-5-р анги)</span>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>1-р цаг:</span> <span className="font-semibold text-slate-900">08:00 - 08:40</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>2-р цаг:</span> <span className="font-semibold text-slate-900">08:45 - 09:25</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Үдийн цай:</span> <span className="font-semibold text-amber-700">09:25 - 09:45</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>3-р цаг:</span> <span className="font-semibold text-slate-900">09:50 - 10:30</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>4-р цаг:</span> <span className="font-semibold text-slate-900">10:35 - 11:15</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-2">2-р ээлж (6-12-р анги)</span>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>1-р цаг:</span> <span className="font-semibold text-slate-900">08:00 - 08:45</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>2-р цаг:</span> <span className="font-semibold text-slate-900">08:50 - 09:35</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>3-р цаг:</span> <span className="font-semibold text-slate-900">09:45 - 10:30</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Их завсарлага:</span> <span className="font-semibold text-amber-700">10:30 - 10:55</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>4-р цаг:</span> <span className="font-semibold text-slate-900">11:00 - 11:45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 flex items-start gap-3">
                <Utensils className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Үдийн цай & Сургуулийн хоолны цэс</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Эрүүл ахуйн стандарт, шим тэжээлийн мэргэжлийн эмчийн хяналт дор бэлтгэсэн 7 хоногийн цэс.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Гараг</th>
                      <th className="p-3">Үндсэн хоол</th>
                      <th className="p-3">Хачир & Зууш</th>
                      <th className="p-3">Ундаа / Амттан</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-semibold text-amber-700">Даваа</td>
                      <td className="p-3">Хүрэн манжинтай ногоотой хуурга</td>
                      <td className="p-3">Шинэхэн байцааны салат</td>
                      <td className="p-3">Аньсны халуун шүүс</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-amber-700">Мягмар</td>
                      <td className="p-3">Үхрийн махан бөөрөнхий гуляш</td>
                      <td className="p-3">Төмсний нухаш, лууван</td>
                      <td className="p-3">Нэрсний кисель</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-amber-700">Лхагва</td>
                      <td className="p-3">Тахианы махан шөл & Мантуун бууз</td>
                      <td className="p-3">Өргөст хэмхний салат</td>
                      <td className="p-3">Чацарганы халуун шүүс</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-amber-700">Пүрэв</td>
                      <td className="p-3">Цөцгийтэй загасны филе</td>
                      <td className="p-3">Ууранд жигнэсэн брокколи</td>
                      <td className="p-3">Сүүтэй халуун цай</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-amber-700">Баасан</td>
                      <td className="p-3">Үхрийн махан гурилтай шөл</td>
                      <td className="p-3">Шарсан ногооны цуглуулга</td>
                      <td className="p-3">Алимны шүүс, жигнэмэг</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Сургуулийн дотоод журам & Ёс зүйн стандарт</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Сурагчийн аюулгүй байдал, сургалтын таатай орчныг бүрдүүлэхэд мөрдөх үндсэн дүрмүүд.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <h5 className="font-bold text-slate-900 text-xs">1. Дүрэмт хувцас ба хувийн зохион байгуулалт</h5>
                  <p>Сурагчид өдөр бүр батлагдсан сургуулийн дүрэмт хувцсыг цэвэр үзэмжтэй өмсөж, сурагчийн тэмдгээ зүүнэ.</p>
                </div>
                <div className="border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <h5 className="font-bold text-slate-900 text-xs">2. Ухаалаг утас, төхөөрөмжийн хэрэглээ</h5>
                  <p>Хичээлийн цагаар ухаалаг утсыг ангийн тусгай шүүгээнд хадгалуулж, зөвхөн сургалтын зорилгоор багшийн зөвшөөрөлтэй ашиглана.</p>
                </div>
                <div className="border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <h5 className="font-bold text-slate-900 text-xs">3. Эцэг эхийн зөвлөл ба хамтын ажиллагаа</h5>
                  <p>Сар бүрийн сүүлийн 5 дахь өдөр багш-эцэг эхийн нээлттэй уулзалт зохион байгуулагдана.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenFeedback();
            }}
            className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl border border-amber-300 transition-all cursor-pointer"
          >
            ✍️ Сургуульд санал хүсэлт илгээх
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Хаах
          </button>
        </div>
      </div>
    </div>
  );
};
