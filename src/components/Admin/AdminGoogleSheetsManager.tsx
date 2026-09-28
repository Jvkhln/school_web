import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { GoogleSignInButton } from '../GoogleSignInButton';
import { WorkspaceConfirmModal } from '../Modals/WorkspaceConfirmModal';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  Layers,
  Link as LinkIcon,
  ShieldCheck,
  LogOut,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Database,
  Mail,
  UserCheck,
  Copy,
  Check,
  X,
  Key
} from 'lucide-react';
import { SHEET_TAB_NAMES } from '../../lib/googleSheets';
import firebaseConfig from '../../../firebase-applet-config.json';

export const AdminGoogleSheetsManager: React.FC = () => {
  const {
    googleUser,
    isGoogleConnected,
    loginWithGoogle,
    logoutFromGoogle,
    spreadsheetId,
    spreadsheetTitle,
    spreadsheetUrl,
    isSheetsSyncing,
    lastSheetsSyncTime,
    autoSyncToSheets,
    setAutoSyncToSheets,
    updateSpreadsheetId,
    createNewSchoolSpreadsheet,
    syncAllToGoogleSheets,
    loadAllFromGoogleSheets,
    inquiries,
    news,
    programs,
    calendarEvents,
    heroSlides,
    categories,
    institutionalArticles
  } = useSchool();

  const [inputSheetId, setInputSheetId] = useState(spreadsheetId);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState(false);

  // Confirmation modal states for destructive/bulk workspace operations
  const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false);
  const [isLoadConfirmOpen, setIsLoadConfirmOpen] = useState(false);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);
  const [isDomainHelpOpen, setIsDomainHelpOpen] = useState(false);
  const [domainCopied, setDomainCopied] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isSigningInGoogle) return;
    setIsSigningInGoogle(true);
    setFeedbackMsg(null);
    try {
      const res = await loginWithGoogle();
      if (res.cancelled) {
        // User closed or dismissed the popup - clean return
        return;
      }
      if (!res.success) {
        setFeedbackMsg({ type: 'error', text: res.error || 'Google нэвтрэлт амжилтгүй боллоо' });
        if (res.isUnauthorizedDomain || res.error?.includes('unauthorized-domain')) {
          setIsDomainHelpOpen(true);
        }
      } else {
        setFeedbackMsg({ type: 'success', text: `Google аккаунт амжилттай холбогдлоо (${res.user?.email})` });
      }
    } finally {
      setIsSigningInGoogle(false);
      setTimeout(() => setFeedbackMsg(null), 5000);
    }
  };

  const handleSaveSpreadsheetId = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingId(true);
    setFeedbackMsg(null);
    try {
      const res = await updateSpreadsheetId(inputSheetId);
      setFeedbackMsg({ type: res.success ? 'success' : 'error', text: res.message });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Алдаа гарлаа' });
    } finally {
      setIsUpdatingId(false);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleCreateNewSheet = async () => {
    setFeedbackMsg(null);
    const res = await createNewSchoolSpreadsheet();
    if (res.success) {
      setInputSheetId(res.spreadsheetId || '');
      setFeedbackMsg({ type: 'success', text: res.message });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleConfirmSync = async () => {
    setIsSyncConfirmOpen(false);
    setFeedbackMsg(null);
    const res = await syncAllToGoogleSheets();
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleConfirmLoad = async () => {
    setIsLoadConfirmOpen(false);
    setFeedbackMsg(null);
    const res = await loadAllFromGoogleSheets();
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Google Sheets Өгөгдлийн Сан
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Firebase-ийн оронд сургуулийн элсэлтийн хүсэлт, санал хүсэлт, мэдээ, хөтөлбөр зэрэг бүх өгөгдлийг Google Sheets хүснэгт рүү шууд илгээж удирдана.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {isGoogleConnected ? (
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Google холбогдсон</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold px-3 py-1.5 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Google холбоогүй</span>
            </div>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-3 animate-in fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border border-rose-300 text-rose-900'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{feedbackMsg.text}</span>
        </div>
      )}

      {/* 1. Google Account Connection Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <UserCheck className="w-4.5 h-4.5 text-slate-800" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                1. Google Аккаунт Холболт
              </h3>
              <p className="text-xs text-slate-500">
                Google Sheets болон Google Drive руу өгөгдөл илгээхийн тулд сургуулийн эрх бүхий Google хаягаар нэвтэрнэ.
              </p>
            </div>
          </div>

          <div>
            {isGoogleConnected ? (
              <button
                type="button"
                onClick={logoutFromGoogle}
                className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Гарах</span>
              </button>
            ) : null}
          </div>
        </div>

        {isGoogleConnected ? (
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {googleUser?.photoURL ? (
                <img
                  src={googleUser.photoURL}
                  alt={googleUser.displayName || 'Google user'}
                  className="w-10 h-10 rounded-full border border-emerald-300"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {googleUser?.displayName ? googleUser.displayName[0] : 'G'}
                </div>
              )}
              <div>
                <div className="font-bold text-sm text-slate-900">
                  {googleUser?.displayName || 'Google Хэрэглэгч'}
                </div>
                <div className="text-xs font-mono text-emerald-800 font-semibold">
                  {googleUser?.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-700 bg-white border border-emerald-200 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Spreadsheets & Drive эрх идэвхтэй</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-slate-800">
                Google Sheets холболт идэвхжүүлэх
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Google Sheets рүү элсэлтийн хүсэлт, санал хүсэлт бичихийн тулд доорх товчоор нэвтэрнэ үү.
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <GoogleSignInButton
                onClick={handleGoogleSignIn}
                isLoading={isSigningInGoogle}
                text="Google-ээр холбогдох"
              />
              <button
                type="button"
                onClick={() => setIsDomainHelpOpen(true)}
                className="text-[11px] text-amber-700 hover:text-amber-800 underline font-medium cursor-pointer inline-flex items-center gap-1"
              >
                <span>auth/unauthorized-domain алдаа гарсан уу? Заавар</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Spreadsheet Setup & Selection Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                2. Сургуулийн Google Spreadsheet Хүснэгт
              </h3>
              <p className="text-xs text-slate-500">
                Өгөгдөл хадгалах хүснэгтийг 1-товчоор автоматаар үүсгэх эсвэл бэлэн байгаа хүснэгтийн ID / холбоосыг зааж өгөх боломжтой.
              </p>
            </div>
          </div>

          {spreadsheetUrl && (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>Google Sheets дээр нээх</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Active spreadsheet info box */}
        {spreadsheetId ? (
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-sm text-slate-900">
                  {spreadsheetTitle || 'Эрдмийн Далай Цогцолбор Сургууль'}
                </span>
              </div>
              {lastSheetsSyncTime && (
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Сүүлд синк хийсэн: <strong>{lastSheetsSyncTime}</strong></span>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-slate-700 text-[11px]">
                ID: {spreadsheetId}
              </span>
              <span className="text-emerald-700 text-[11px] font-semibold">✓ {Object.values(SHEET_TAB_NAMES).length} хуудас (Tabs) үүссэн</span>
            </div>

            {/* List tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 pt-2 border-t border-emerald-200/60">
              {Object.values(SHEET_TAB_NAMES).map((tabTitle, idx) => (
                <div
                  key={idx}
                  className="bg-white px-2 py-1.5 rounded-lg border border-emerald-200 text-center text-[10px] sm:text-[11px] font-semibold text-slate-700 truncate"
                  title={tabTitle}
                >
                  {tabTitle}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Actions to create or link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Option A: Create fresh sheet */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                Шинэ Google Sheet автоматаар үүсгэх
              </h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Сургуулийн бүх хүсэлт, мэдээ, хөтөлбөр, календарийн баганууд бүхий бэлэн загвартай хүснэгтийг таны Google Drive дээр автоматаар үүсгэж холбоно.
            </p>
            <button
              type="button"
              onClick={handleCreateNewSheet}
              disabled={isSheetsSyncing || !isGoogleConnected}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Шинэ Google Sheet үүсгэж холбох</span>
            </button>
            {!isGoogleConnected && (
              <p className="text-[11px] text-amber-600 font-medium">
                * Дээрх Google холболтоор эхлээд нэвтэрнэ үү.
              </p>
            )}
          </div>

          {/* Option B: Input existing spreadsheet */}
          <form onSubmit={handleSaveSpreadsheetId} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-slate-700" />
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                Одоо байгаа хүснэгтийн ID / Линк холбох
              </h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Google Sheets хүснэгтийн бүрэн холбоос (URL) эсвэл ID-г оруулж холбоно.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputSheetId}
                onChange={(e) => setInputSheetId(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/... эсвэл ID"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <button
                type="submit"
                disabled={isUpdatingId}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                Холбох
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Sync & Backup Actions with Confirmation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <RefreshCw className={`w-4.5 h-4.5 text-amber-700 ${isSheetsSyncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                3. Синк & Өгөгдөл Илгээх Үйлдлүүд
              </h3>
              <p className="text-xs text-slate-500">
                Сургуулийн бүх мэдээллийг хүснэгт рүү экспортлох эсвэл хүснэгтээс татаж авах.
              </p>
            </div>
          </div>

          {/* Auto-sync toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoSyncToSheets(!autoSyncToSheets)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              {autoSyncToSheets ? (
                <ToggleRight className="w-5 h-5 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-slate-400" />
              )}
              <span>Автомат илгээлт: <strong>{autoSyncToSheets ? 'Идэвхтэй' : 'Унтраасан'}</strong></span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Export to Google Sheets */}
          <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-2.5">
            <div className="font-bold text-xs sm:text-sm text-emerald-950 flex items-center gap-2">
              <ArrowUpFromLine className="w-4 h-4 text-emerald-600" />
              <span>Google Sheets рүү бүх өгөгдлийг илгээх (Sync)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Вэбсайт дээрх бүх элсэлтийн хүсэлт, мэдээ, хөтөлбөр, календарийг Google Sheets хүснэгтийн холбогдох хуудсуудад бүрэн шинэчилж хуулна.
            </p>
            <button
              type="button"
              onClick={() => setIsSyncConfirmOpen(true)}
              disabled={isSheetsSyncing || !spreadsheetId || !isGoogleConnected}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSheetsSyncing ? 'animate-spin' : ''}`} />
              <span>{isSheetsSyncing ? 'Синк хийж байна...' : 'Хүснэгт рүү бүрэн илгээх (Sync)'}</span>
            </button>
          </div>

          {/* Import from Google Sheets */}
          <div className="p-4 bg-blue-50/40 border border-blue-200 rounded-xl space-y-2.5">
            <div className="font-bold text-xs sm:text-sm text-blue-950 flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-blue-600" />
              <span>Google Sheets-ээс татаж авах (Import)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Sheets хүснэгтэд зассан мэдээ, хөтөлбөр, хуанлийн мэдээллийг татаж вэбсайтын өгөгдлийг хүснэгтийн дагуу сэргээнэ.
            </p>
            <button
              type="button"
              onClick={() => setIsLoadConfirmOpen(true)}
              disabled={isSheetsSyncing || !spreadsheetId || !isGoogleConnected}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Хүснэгтээс татаж шинэчлэх</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Real-time Inquiries & Submissions summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4.5 h-4.5 text-slate-700" />
            <h3 className="font-bold text-base text-slate-900">
              4. Ирсэн Бүртгэл, Хүсэлтүүдийн Жагсаалт
            </h3>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
            Нийт {inquiries.length} хүсэлт бүртгэлтэй
          </span>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Одоогоор шинээр ирсэн хүсэлт, эрсдлийн мэдээлэл байхгүй байна.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Огноо</th>
                  <th className="px-3 py-2.5">Төрөл</th>
                  <th className="px-3 py-2.5">Илгээгч / Сурагч</th>
                  <th className="px-3 py-2.5">Утас</th>
                  <th className="px-3 py-2.5">Агуулга</th>
                  <th className="px-3 py-2.5">Төлөв</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.slice(0, 10).map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">
                      {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('mn-MN') : '-'}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inq.type === 'risk'
                          ? 'bg-rose-100 text-rose-700'
                          : inq.type === 'bullying'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inq.type === 'risk' ? 'Эрсдэл' : inq.type === 'bullying' ? 'Дээрэлхэлт' : inq.type === 'admission' ? 'Элсэлт' : 'Санал'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-bold text-slate-800">
                      {inq.studentName || inq.name || (inq.isAnonymous ? 'Нэрээ нууцалсан' : '-')}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 font-mono">
                      {inq.phone || '-'}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 max-w-xs truncate">
                      {inq.message || inq.notes || '-'}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        Google Sheets бэлэн
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation modal for Sync to Google Sheets */}
      <WorkspaceConfirmModal
        isOpen={isSyncConfirmOpen}
        onClose={() => setIsSyncConfirmOpen(false)}
        onConfirm={handleConfirmSync}
        title="Google Sheets хүснэгтийг шинэчлэх үү?"
        description="Вэбсайтад байгаа бүх өгөгдлийг (хүсэлтүүд, мэдээ, хөтөлбөр, хуанли, слайдер, sub-домайн холбоос, дэд цэсийн нийтлэл) таны Google Sheets хүснэгт рүү бичиж синк хийнэ. Хүснэгтэд өмнө байсан эгнээ шинэчлэгдэнэ."
        affectedItemsCount={inquiries.length + news.length + programs.length + calendarEvents.length + heroSlides.length + categories.length + institutionalArticles.length}
        affectedItemsDescription={[
          `Хүсэлт ба Элсэлт (${inquiries.length} бичлэг)`,
          `Мэдээ мэдээлэл (${news.length} нийтлэл)`,
          `Сургалтын хөтөлбөр (${programs.length} хөтөлбөр)`,
          `Календар төлөвлөгөө (${calendarEvents.length} арга хэмжээ)`,
          `Sub-домайн & Холбоос (${categories.length} систем)`,
          `Дэд цэсийн нийтлэл & Холбоос (${institutionalArticles.length} нийтлэл)`,
          `Сургуулийн танилцуулга & Баатар Слайдер (${heroSlides.length} слайд)`
        ]}
        confirmText="Тийм, Google Sheets рүү синк хийх"
        cancelText="Буцах"
        isLoading={isSheetsSyncing}
      />

      {/* Confirmation modal for Loading from Google Sheets */}
      <WorkspaceConfirmModal
        isOpen={isLoadConfirmOpen}
        onClose={() => setIsLoadConfirmOpen(false)}
        onConfirm={handleConfirmLoad}
        isDestructive={true}
        title="Google Sheets-ээс өгөгдлийг татаж солих уу?"
        description="Google Sheets дээрх өгөгдлийг татаж, вэбсайтын одоогийн мэдээ, хөтөлбөр, хуанли, sub-домайн холбоос, дэд цэсийн нийтлэлүүдийг хүснэгтэд байгаа утгаар дарж солино."
        confirmText="Тийм, хүснэгтээс татаж шинэчлэх"
        cancelText="Цуцлах"
        isLoading={isSheetsSyncing}
      />

      {/* Domain Authorization Help Modal (auth/unauthorized-domain) */}
      {isDomainHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Key className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Google нэвтрэлтийн домэйн зөвшөөрөх
                  </h3>
                  <p className="text-xs text-amber-800 font-medium">
                    auth/unauthorized-domain алдааг шийдэх заавар
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDomainHelpOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                Firebase Authentication нь аюулгүй байдлын үүднээс зөвхөн <b>Authorized domains</b> (зөвшөөрөгдсөн домэйн)-д бүртгэгдсэн хаягаас Google нэвтрэлт хийхийг зөвшөөрдөг.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2">
                <div className="text-xs font-bold text-amber-900">
                  Таны одоогийн вэбийн домэйн хаяг:
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-3 py-2 rounded-lg border border-amber-300 font-mono text-xs text-slate-800 break-all select-all font-semibold">
                    {typeof window !== 'undefined' ? window.location.hostname : ''}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(window.location.hostname);
                        setDomainCopied(true);
                        setTimeout(() => setDomainCopied(false), 3000);
                      }
                    }}
                    className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {domainCopied ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Хуулагдлаа!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Хуулах</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                  Хэрхэн нэмэх вэ? (30 секунд)
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <li>
                    Дээрх <b>"Хуулах"</b> товчийг дарж домэйн нэрээ хуулна.
                  </li>
                  <li>
                    Доорх <b>"Firebase Console нээх"</b> товчоор <b>Settings ➔ Authorized domains</b> хэсэг рүү орно.
                  </li>
                  <li>
                    <b>"Add domain"</b> товчийг дараад хуулсан домэйнээ оруулан <b>Done</b> дарна.
                  </li>
                  <li>
                    Вэб хуудсаа дахин ачааллаад (F5) Google-ээр дахин нэвтэрнэ.
                  </li>
                </ol>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
                💡 <b>Зөвлөгөө:</b> Хэрэв та зөвхөн Google Sheets-ээс мэдээллээ вэб сайтад уншуулах гэж байгаа бол Google Sheet-ийнхээ <b>Share ➔ "Anyone with the link can view"</b> болгоход Google нэвтрэхгүйгээр шууд бүх мэдээлэл уншигддаг.
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDomainHelpOpen(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Хаах
              </button>
              <a
                href={`https://console.firebase.google.com/project/${(firebaseConfig as any).projectId || 'gen-lang-client-0172387818'}/authentication/settings`}
                target="_blank"
                rel="noreferrer noopener"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Firebase Console нээх</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
