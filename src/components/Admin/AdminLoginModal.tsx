import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  X,
  ShieldCheck,
  AlertCircle,
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    loginAdmin,
    openAdmin
  } = useSchool();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    setTimeout(() => {
      const result = loginAdmin(usernameInput, passwordInput);
      setIsLoggingIn(false);

      if (result.success) {
        setIsAdminLoginModalOpen(false);
        setUsernameInput('');
        setPasswordInput('');
      } else {
        setLoginError(result.message || 'Нэвтрэх нэр эсвэл нууц үг буруу байна!');
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 p-6 sm:p-8 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setIsAdminLoginModalOpen(false);
            setLoginError(null);
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          title="Хаах"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                Админ Системд Нэвтрэх
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Сайтын бүх мэдээлэл, санал хүсэлт удирдах
              </span>
            </div>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2 mb-4 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Нэвтрэх нэрээ оруулна уу"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium"
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
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Нууц үгээ оруулна уу"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium"
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
          </form>
        </div>
      </div>
    </div>
  );
};
