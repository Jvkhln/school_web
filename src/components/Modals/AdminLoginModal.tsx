import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  LogIn,
  KeyRound,
  Sparkles,
  UserPlus
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    setIsAdmissionModalOpen,
    loginAdmin,
    adminUsername,
    adminEmail
  } = useSchool();

  const [usernameInput, setUsernameInput] = useState(adminUsername || 'admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(usernameInput, passwordInput);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Нэвтрэх нэр эсвэл нууц үг буруу байна!');
      } else {
        setPasswordInput('');
      }
    }, 200);
  };

  const handleAutoFill = () => {
    setUsernameInput('admin');
    setPasswordInput('admin123');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header background with amber gradient */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 text-white text-center relative">
          <button
            onClick={() => {
              setIsAdminLoginModalOpen(false);
              setErrorMsg(null);
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            Админ Удирдлагын Нэвтрэх
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Вэб сайтын бүх мэдээлэл, хөтөлбөр, текст, баннерыг удирдах админ систем
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Quick Demo Credentials Autofill Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-amber-900 block">
                  Нэвтрэх мэдээлэл:
                </span>
                <span className="text-amber-800/90 text-[11px]">
                  Нэр: <strong className="font-mono">{adminUsername || 'admin'}</strong> {adminEmail ? <>| Имэйл: <strong className="font-mono">{adminEmail}</strong></> : null} | Нууц үг: <strong className="font-mono">admin123</strong>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1.5 rounded-lg shadow-2xs shrink-0 cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
            >
              <Sparkles className="w-3 h-3" />
              <span>Шууд бөглөх</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Нэвтрэх нэр эсвэл Админ имэйл
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={adminEmail ? `Жишээ: ${adminUsername} эсвэл ${adminEmail}` : "admin эсвэл jvkhln1@gmail.com"}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Нууц үг
                </label>
                <span className="text-[11px] text-slate-400">
                  (Анхдагч: admin123)
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Нууц үгээ оруулна уу"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Админ систем рүү нэвтрэх</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note & Switch to Admission Form */}
          <div className="pt-2 text-center space-y-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsAdminLoginModalOpen(false);
                setIsAdmissionModalOpen(true);
              }}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Элсэлтийн хүсэлт илгээх рүү очих →</span>
            </button>
            <p className="text-[11px] text-slate-400">
              Нэвтэрсний дараа Сургуулийн тохиргоо цэснээс нууц үгээ хүссэн үедээ солих боломжтой.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
