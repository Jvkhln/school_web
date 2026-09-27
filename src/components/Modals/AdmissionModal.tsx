import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  X,
  CheckCircle2,
  UserPlus,
  Send,
  School,
  Sparkles,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export const AdmissionModal: React.FC = () => {
  const {
    isAdmissionModalOpen,
    setIsAdmissionModalOpen,
    submitAdmissionInquiry,
    categories,
    sectionTexts,
    loginAdmin,
    isAdminAuthenticated,
    setIsAdminOpen
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'admission' | 'admin'>('admission');

  // Admission Form State
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    gradeLevel: '1-р анги',
    programInterest: 'Бага боловсрол',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Admin Login State
  const [adminUsernameInput, setAdminUsernameInput] = useState('admin');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isAdmissionModalOpen) return null;

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.phone) return;

    submitAdmissionInquiry({
      name: formData.parentName || formData.studentName,
      type: 'admission',
      message: `Элсэлтийн хүсэлт: ${formData.studentName} (${formData.gradeLevel}, ${formData.programInterest}). ${formData.notes || ''}`,
      studentName: formData.studentName,
      parentName: formData.parentName,
      phone: formData.phone,
      email: formData.email,
      gradeLevel: formData.gradeLevel,
      programInterest: formData.programInterest,
      notes: formData.notes
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsAdmissionModalOpen(false);
      setFormData({
        studentName: '',
        parentName: '',
        phone: '',
        email: '',
        gradeLevel: '1-р анги',
        programInterest: 'Бага боловсрол',
        notes: ''
      });
    }, 2500);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    setTimeout(() => {
      const res = loginAdmin(adminUsernameInput, adminPasswordInput);
      setIsLoggingIn(false);
      if (!res.success) {
        setLoginError(res.message || 'Нэвтрэх нэр эсвэл нууц үг буруу байна!');
      } else {
        setAdminPasswordInput('');
        setIsAdmissionModalOpen(false);
        setActiveTab('admission');
      }
    }, 200);
  };

  const handleAutoFillAdmin = () => {
    setAdminUsernameInput('admin');
    setAdminPasswordInput('admin123');
    setLoginError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 p-6 sm:p-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setIsAdmissionModalOpen(false);
            setLoginError(null);
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher: Admission vs Admin Login */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-6 max-w-sm">
          <button
            type="button"
            onClick={() => {
              setActiveTab('admission');
              setLoginError(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'admission'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Элсэлтийн хүсэлт</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setLoginError(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-slate-900 text-amber-400 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Админ нэвтрэх</span>
          </button>
        </div>

        {/* TAB 1: ADMISSION FORM */}
        {activeTab === 'admission' && (
          <>
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Таны хүсэлтийг амжилттай хүлээн авлаа!
                </h3>
                <p className="text-sm text-slate-600 max-w-xs mx-auto">
                  Манай элсэлтийн менежер таны бүртгүүлсэн утсаар 24 цагийн дотор холбогдож дэлгэрэнгүй
                  мэдээлэл өгөх болно.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                      {sectionTexts.admissionModalTitle}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      2025-2026 Оны хичээлийн жил
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  {sectionTexts.admissionModalSubtitle}
                </p>

                <form onSubmit={handleAdmissionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Сурагчийн нэр *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Жишээ: Тэмүүлэн"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Асран хамгаалагчийн нэр
                      </label>
                      <input
                        type="text"
                        placeholder="Жишээ: Батбаяр"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Утасны дугаар *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Жишээ: 9911-XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Имэйл хаяг
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Элсэх анги
                      </label>
                      <select
                        value={formData.gradeLevel}
                        onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Бэлтгэл бүлэг (5 нас)">Бэлтгэл бүлэг (5 нас)</option>
                        <option value="1-р анги">1-р анги</option>
                        <option value="2-р анги">2-р анги</option>
                        <option value="3-р анги">3-р анги</option>
                        <option value="4-р анги">4-р анги</option>
                        <option value="5-р анги">5-р анги</option>
                        <option value="6-р анги">6-р анги</option>
                        <option value="7-р анги">7-р анги</option>
                        <option value="8-р анги">8-р анги</option>
                        <option value="9-р анги">9-р анги</option>
                        <option value="10-р анги">10-р анги</option>
                        <option value="11-р анги">11-р анги</option>
                        <option value="12-р анги">12-р анги</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Сонирхож буй хөтөлбөр
                      </label>
                      <select
                        value={formData.programInterest}
                        onChange={(e) => setFormData({ ...formData, programInterest: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Нэмэлт асуулт, тэмдэглэл
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Хичээлийн хуваарь, төлбөрийн нөхцөл, тэтгэлэг гэх мэт..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Хүсэлт илгээх</span>
                    </button>
                  </div>

                  {/* Switch to Admin Login Footer Link */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Сургуулийн удирдлага, багш уу?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('admin');
                        setLoginError(null);
                      }}
                      className="text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Админаар нэвтрэх →</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {/* TAB 2: INTEGRATED ADMIN LOGIN */}
        {activeTab === 'admin' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  Админ Системд Нэвтрэх
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Сайтын мэдээ, хөтөлбөр, текст удирдах
                </span>
              </div>
            </div>

            {/* Quick Autofill Helper */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="text-[11px] text-amber-900">
                  <span>Нэр: <strong className="font-mono">admin</strong></span>
                  <span className="mx-1">|</span>
                  <span>Нууц үг: <strong className="font-mono">admin123</strong></span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAutoFillAdmin}
                className="text-[11px] bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 rounded-lg shadow-2xs shrink-0 cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
              >
                <Sparkles className="w-3 h-3" />
                <span>Бөглөх</span>
              </button>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Нэвтрэх нэр
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={adminUsernameInput}
                    onChange={(e) => setAdminUsernameInput(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Нууц үг
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Нууц үгээ оруулна уу"
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-amber-400 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Нэвтэрч орох</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admission');
                    setLoginError(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  ← Сурагчийн элсэлтийн хүсэлт рүү буцах
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
