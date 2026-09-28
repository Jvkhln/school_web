import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolInfo, FeedbackEmailSetting, FeedbackType, SmtpConfig } from '../../types';
import { DEFAULT_FEEDBACK_EMAIL_SETTINGS } from '../../data/initialData';
import { AdminGoogleSheetsManager } from './AdminGoogleSheetsManager';
import {
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  KeyRound,
  ShieldCheck,
  User,
  Sparkles,
  Database,
  CloudUpload,
  Loader2,
  Users,
  Award,
  GraduationCap,
  Eye,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  AtSign,
  Server,
  Send,
  RefreshCw,
  Check,
  Lock,
  ExternalLink,
  ShieldAlert,
  Image as ImageIcon
} from 'lucide-react';
import { 
  PRESET_SCHOOL_IMAGES, 
  compressImageFile, 
  FALLBACK_IMAGE_URL,
  GOOGLE_DRIVE_FOLDER_URL,
  GOOGLE_DRIVE_DEFAULT_IMAGES
} from './ImagePresetPicker';

export const AdminSettingsManager: React.FC = () => {
  const {
    schoolInfo,
    updateSchoolInfo,
    resetToDefaults,
    exportDataJson,
    importDataJson,
    adminUsername,
    adminEmail,
    updateAdminProfile,
    updateAdminCredentials,
    news,
    programs,
    categories,
    heroSlides,
    calendarEvents,
    sectionTexts,
    feedbackEmailSettings,
    updateFeedbackEmailSettings,
    smtpConfig,
    updateSmtpConfig
  } = useSchool();

  const ensureAllTabs = (list: FeedbackEmailSetting[]): FeedbackEmailSetting[] => {
    return DEFAULT_FEEDBACK_EMAIL_SETTINGS.map((def) => {
      const found = list.find((it) => 
        it.tabKey === def.tabKey || 
        (def.tabKey === 'risk' && it.tabKey === 'complaint') ||
        (def.tabKey === 'bullying' && it.tabKey === 'admission')
      );
      if (found && def.tabKey === 'bullying' && (found.tabKey === 'admission' || found.tabTitle === 'Элсэлт бүртгэл')) {
        return { ...def, teacherEmail: found.teacherEmail || def.teacherEmail };
      }
      return found ? { ...def, ...found, tabKey: def.tabKey } : def;
    });
  };

  const [localSmtp, setLocalSmtp] = useState<SmtpConfig>(smtpConfig);
  const [smtpSaved, setSmtpSaved] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState('');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{
    success: boolean;
    method?: string;
    message?: string;
    error?: string;
    activationNeeded?: boolean;
  } | null>(null);

  useEffect(() => {
    setLocalSmtp(smtpConfig);
  }, [smtpConfig]);

  const [formData, setFormData] = useState<SchoolInfo>({
    ...schoolInfo,
    studentsLabel: schoolInfo.studentsLabel || 'Нийт суралцагч сурагчид',
    studentsDesc: schoolInfo.studentsDesc || '1-12-р ангийн шилдэг сурагчид',
    studentsSuffix: schoolInfo.studentsSuffix || '+',

    teachersLabel: schoolInfo.teachersLabel || 'Багшлах бүрэлдэхүүн',
    teachersDesc: schoolInfo.teachersDesc || 'Магистр, Доктор, Олон улсын зэрэгтэй',
    teachersSuffix: schoolInfo.teachersSuffix || '+',

    collegeLabel: schoolInfo.collegeLabel || 'Их дээд сургуулийн элсэлт',
    collegeDesc: schoolInfo.collegeDesc || 'Дэлхийн шилдэг болон дотоодын тэтгэлэг',
    collegeSuffix: schoolInfo.collegeSuffix || '+',

    clubsLabel: schoolInfo.clubsLabel || 'Хөгжлийн дугуйлан, клубүүд',
    clubsDesc: schoolInfo.clubsDesc || 'STEM, Урлаг, Спорт, Гадаад хэл',
    clubsSuffix: schoolInfo.clubsSuffix || '+',
    defaultNewsImageUrl: schoolInfo.defaultNewsImageUrl || FALLBACK_IMAGE_URL
  });

  const [isUploadingDefaultImg, setIsUploadingDefaultImg] = useState(false);

  const handleDefaultImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingDefaultImg(true);
      const compressed = await compressImageFile(file, 960, 640, 0.70);
      if (compressed) {
        setFormData(prev => ({ ...prev, defaultNewsImageUrl: compressed }));
      }
    } catch (err) {
      console.error('Image compression error', err);
    } finally {
      setIsUploadingDefaultImg(false);
      e.target.value = '';
    }
  };

  // Local state for Tab-specific Feedback Email Settings
  const [emailSettings, setEmailSettings] = useState<FeedbackEmailSetting[]>(() =>
    ensureAllTabs(feedbackEmailSettings || [])
  );
  const [emailSaveSuccess, setEmailSaveSuccess] = useState(false);

  useEffect(() => {
    if (feedbackEmailSettings && feedbackEmailSettings.length > 0) {
      setEmailSettings(ensureAllTabs(feedbackEmailSettings));
    }
  }, [feedbackEmailSettings]);

  // Admin Profile (Username & Email) management state
  const [adminProfileName, setAdminProfileName] = useState(adminUsername);
  const [adminProfileEmail, setAdminProfileEmail] = useState(adminEmail);
  const [adminProfileMsg, setAdminProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    setAdminProfileName(adminUsername);
  }, [adminUsername]);

  useEffect(() => {
    setAdminProfileEmail(adminEmail);
  }, [adminEmail]);

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfileName.trim()) {
      setAdminProfileMsg({ type: 'error', text: 'Админы нэвтрэх нэрийг оруулна уу!' });
      return;
    }
    if (!adminProfileEmail.trim() || !adminProfileEmail.includes('@')) {
      setAdminProfileMsg({ type: 'error', text: 'Админ хэрэглэгчийн хүчинтэй имэйл хаяг оруулна уу (жишээ: jvkhln1@gmail.com)!' });
      return;
    }
    setIsSavingProfile(true);
    setAdminProfileMsg(null);
    try {
      const res = await updateAdminProfile(adminProfileName, adminProfileEmail);
      setAdminProfileMsg({ type: res.success ? 'success' : 'error', text: res.message });
    } catch (err: any) {
      setAdminProfileMsg({ type: 'error', text: err.message || 'Алдаа гарлаа' });
    } finally {
      setIsSavingProfile(false);
      setTimeout(() => setAdminProfileMsg(null), 3500);
    }
  };

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [backupMsg, setBackupMsg] = useState<string | null>(null);

  // Tab email individual test status
  const [tabTestStatus, setTabTestStatus] = useState<
    Record<string, { loading?: boolean; msg?: string; success?: boolean; activationNeeded?: boolean }>
  >({});

  const handleTestTabEmail = async (tabKey: string, email: string) => {
    if (!email || !email.trim() || !email.includes('@')) {
      setTabTestStatus(prev => ({
        ...prev,
        [tabKey]: { loading: false, msg: 'Зөв имэйл хаяг оруулна уу (жишээ: jvkhln1@gmail.com)', success: false }
      }));
      return;
    }

    setTabTestStatus(prev => ({ ...prev, [tabKey]: { loading: true, msg: undefined } }));
    try {
      const resp = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testEmail: email.trim(),
          smtpConfig: localSmtp.enabled ? localSmtp : undefined,
          isRisk: tabKey === 'risk',
          isBullying: tabKey === 'bullying'
        })
      });
      const data = await resp.json();
      setTabTestStatus(prev => ({
        ...prev,
        [tabKey]: {
          loading: false,
          msg: data.message || data.error || (data.success ? 'Амжилттай илгээгдлээ' : 'Алдаа гарлаа'),
          success: !!data.success,
          activationNeeded: !!data.activationNeeded
        }
      }));
    } catch (err: any) {
      setTabTestStatus(prev => ({
        ...prev,
        [tabKey]: { loading: false, msg: err.message || 'Холбогдож чадсангүй', success: false }
      }));
    }
  };

  // Password & credentials state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newUsername, setNewUsername] = useState(adminUsername);
  const [credMsg, setCredMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleUpdateTabField = (
    tabKey: string,
    field: keyof FeedbackEmailSetting,
    value: string
  ) => {
    setEmailSettings((prev) =>
      prev.map((item) =>
        item.tabKey === tabKey ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSaveEmailSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFeedbackEmailSettings(emailSettings);
    setEmailSaveSuccess(true);
    setTimeout(() => setEmailSaveSuccess(false), 3000);
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSmtpConfig(localSmtp);
    setSmtpSaved(true);
    setTimeout(() => setSmtpSaved(false), 3500);
  };

  const handleSendTestEmail = async () => {
    if (!testEmailInput.trim()) return;
    setTestEmailLoading(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testEmail: testEmailInput.trim(),
          smtpConfig: localSmtp
        })
      });
      const data = await res.json();
      setTestEmailResult(data);
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        error: err.message || 'Сүлжээний холболт амжилтгүй боллоо'
      });
    } finally {
      setTestEmailLoading(false);
    }
  };

  const applyGmailPreset = () => {
    const defaultUser = localSmtp.user || emailSettings[0]?.teacherEmail || 'jvkhln1@gmail.com';
    setLocalSmtp(prev => ({
      ...prev,
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      enabled: true,
      user: defaultUser,
      fromEmail: defaultUser,
      fromName: prev.fromName || formData.name || 'Эрдмийн Далай Цогцолбор Сургууль'
    }));
  };

  const applyOfficePreset = () => {
    setLocalSmtp(prev => ({
      ...prev,
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      enabled: true
    }));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setCredMsg(null);
    const res = updateAdminCredentials(currentPass, newPass, newUsername, adminProfileEmail);
    if (res.success) {
      setCredMsg({ type: 'success', text: res.message });
      setCurrentPass('');
      setNewPass('');
    } else {
      setCredMsg({ type: 'error', text: res.message });
    }
  };

  const handleExport = () => {
    const dataStr = exportDataJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const success = importDataJson(text);
          if (success) {
            setBackupMsg('Мэдээллийг амжилттай сэргээж орууллаа!');
            setImportError(null);
            setTimeout(() => setBackupMsg(null), 4000);
          } else {
            setImportError('JSON файл уншихад алдаа гарлаа. Формат зөв эсэхийг шалгана уу.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Сургуулийн Үндсэн Тохиргоо & Өгөгдөл
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Сургуулийн нэр, утас, имэйл, хаяг, тоон үзүүлэлтүүд болон админы нууц үгийг солих.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Амжилттай хадгалагдлаа!</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Building className="w-4 h-4 text-amber-600" />
          <span>Ерөнхий танилцуулга & Холбоо барих</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Сургуулийн албан ёсны нэр *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Сургуулийн лого зураг (Зургийн линк эсвэл хоосон үлдээвэл үндсэн тэмдэг гарна)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="https://... логоны зургийн хаяг"
                value={formData.logoUrl || ''}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              {formData.logoUrl && (
                <div className="w-9 h-9 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                  <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Жишээ: Шинэ логоныхоо зургийн линкийг оруулж хадгалснаар толгой болон хөл хэсгийн бүх лого солигдоно.
            </p>
          </div>

          {/* Default News Cover Image Setting */}
          <div className="sm:col-span-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>Нийтлэл, мэдээний анхдагч зураг (Default News Cover Photo)</span>
              </label>
              <span className="text-[11px] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full font-medium">
                Мэдээний үндсэн зураг
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mb-3">
              Шинээр нийтлэл оруулахад зураг сонгоогүй эсвэл зургийн холбоос алдаатай үед энэхүү үндсэн зургийг нүүр хуудас болон дэлгэрэнгүй цонхонд автоматаар харуулна. Та өөрийн сургуулийн зургийг компьютерээсээ оруулах эсвэл доорх бэлэн сангаас сонгож болно.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-3">
              {/* Preview Thumbnail */}
              <div className="relative w-36 sm:w-44 aspect-16/10 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 shrink-0 shadow-xs">
                <img
                  src={formData.defaultNewsImageUrl || FALLBACK_IMAGE_URL}
                  alt="Default News Cover"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE_URL;
                  }}
                />
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  Харагдах байдал
                </div>
              </div>

              {/* URL input and upload button */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://... Зургийн шууд холбоос URL"
                    value={formData.defaultNewsImageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, defaultNewsImageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs">
                    {isUploadingDefaultImg ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    ) : (
                      <CloudUpload className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>{isUploadingDefaultImg ? 'Хуулж байна...' : 'Зураг оруулах'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDefaultImgUpload}
                      disabled={isUploadingDefaultImg}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Google Drive Dedicated Images Section */}
                <div className="bg-white p-3 rounded-xl border border-amber-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Google Drive-аас холбогдсон сургуулийн зургууд (4 зураг)</span>
                    </span>
                    <a
                      href={GOOGLE_DRIVE_FOLDER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Drive хавтас нээх</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GOOGLE_DRIVE_DEFAULT_IMAGES.map((item) => {
                      const isSelected = formData.defaultNewsImageUrl === item.url;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, defaultNewsImageUrl: item.url })}
                          className={`relative text-left p-1.5 rounded-xl border-2 transition-all cursor-pointer group ${
                            isSelected
                              ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-400/50'
                              : 'border-slate-200 hover:border-amber-400 bg-slate-50'
                          }`}
                        >
                          <div className="relative aspect-16/10 rounded-lg overflow-hidden mb-1.5 bg-slate-200">
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1 py-0.5 rounded">
                              {item.name}
                            </div>
                            {isSelected && (
                              <div className="absolute inset-0 bg-amber-600/40 flex items-center justify-center text-white font-bold text-xs gap-1">
                                <Check className="w-4 h-4" />
                                <span>Сонгосон</span>
                              </div>
                            )}
                          </div>
                          <div className="text-[11px] font-bold text-slate-800 truncate block">
                            {item.title}
                          </div>
                          <div className="text-[9px] text-slate-500 flex items-center justify-between mt-0.5">
                            <span>Харьцаа: {item.aspectRatio}</span>
                            <span className="text-amber-700 font-semibold">{isSelected ? 'Үндсэн' : 'Сонгох'}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preset Picker Row */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                    Эсвэл бусад бэлэн зургуудаас сонгох:
                  </span>
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                    {PRESET_SCHOOL_IMAGES.map((preset, idx) => {
                      const isCurrent = formData.defaultNewsImageUrl === preset.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, defaultNewsImageUrl: preset.url })}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                            isCurrent
                              ? 'border-amber-600 ring-2 ring-amber-400/50 scale-95'
                              : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                          }`}
                          title={preset.title}
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {isCurrent && (
                            <div className="absolute inset-0 bg-amber-600/50 flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Уриа үг (Motto)
            </label>
            <input
              type="text"
              value={formData.motto}
              onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Сургуулийн товч танилцуулга
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Утасны дугаар
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Имэйл хаяг
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ажиллах цагийн хуваарь
            </label>
            <input
              type="text"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Сургуулийн хаяг байршил
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Numbers & Stats Section */}
        <div className="border-t border-slate-200/80 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>Тоон үзүүлэлтүүд & Нэмэлт тайлбарууд (Stats Counter)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Нүүр хуудасны 4 гол статистик үзүүлэлтийн тоон утга, дагавар тэмдэг, гарчиг болон нэмэлт дэлгэрэнгүй тайлбаруудыг тохируулна.
              </p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-lg font-medium self-start sm:self-auto">
              Их дээд сургуулийн элсэлтийн тэмдэг: <strong>+</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* 1. Нийт сурагчид */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">1. Суралцагчдын үзүүлэлт</span>
                </div>
                <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                  {formData.studentsCount}{formData.studentsSuffix || '+'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Тоон утга / Тоо
                  </label>
                  <input
                    type="number"
                    value={formData.studentsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, studentsCount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    placeholder="1250"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Дагавар
                  </label>
                  <input
                    type="text"
                    value={formData.studentsSuffix || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, studentsSuffix: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    placeholder="+"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Үзүүлэлтийн нэр (Гарчиг)
                </label>
                <input
                  type="text"
                  value={formData.studentsLabel || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, studentsLabel: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  placeholder="Нийт суралцагч сурагчид"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Нэмэлт тайлбар (Дэд бичиглэл)
                </label>
                <textarea
                  rows={2}
                  value={formData.studentsDesc || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, studentsDesc: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="1-12-р ангийн шилдэг сурагчид"
                />
              </div>
            </div>

            {/* 2. Багшлах бүрэлдэхүүн */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">2. Багш нарын үзүүлэлт</span>
                </div>
                <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                  {formData.teachersCount}{formData.teachersSuffix || '+'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Тоон утга / Тоо
                  </label>
                  <input
                    type="number"
                    value={formData.teachersCount}
                    onChange={(e) =>
                      setFormData({ ...formData, teachersCount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    placeholder="92"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Дагавар
                  </label>
                  <input
                    type="text"
                    value={formData.teachersSuffix || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, teachersSuffix: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    placeholder="+"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Үзүүлэлтийн нэр (Гарчиг)
                </label>
                <input
                  type="text"
                  value={formData.teachersLabel || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, teachersLabel: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  placeholder="Багшлах бүрэлдэхүүн"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Нэмэлт тайлбар (Дэд бичиглэл)
                </label>
                <textarea
                  rows={2}
                  value={formData.teachersDesc || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, teachersDesc: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Магистр, Доктор, Олон улсын зэрэгтэй"
                />
              </div>
            </div>

            {/* 3. Их дээд сургуулийн элсэлт */}
            <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">3. Их дээд сургуулийн элсэлт</span>
                    <span className="block text-[10px] text-amber-700 font-semibold">(+ тэмдэгээр тохируулагдсан)</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md">
                  {formData.collegeAcceptanceRate}{formData.collegeSuffix || '+'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Тоон утга / Тоо
                  </label>
                  <input
                    type="number"
                    value={formData.collegeAcceptanceRate}
                    onChange={(e) =>
                      setFormData({ ...formData, collegeAcceptanceRate: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    placeholder="98"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Дагавар тэмдэг
                  </label>
                  <input
                    type="text"
                    value={formData.collegeSuffix !== undefined ? formData.collegeSuffix : '+'}
                    onChange={(e) =>
                      setFormData({ ...formData, collegeSuffix: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold"
                    placeholder="+"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Үзүүлэлтийн нэр (Гарчиг)
                </label>
                <input
                  type="text"
                  value={formData.collegeLabel || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, collegeLabel: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  placeholder="Их дээд сургуулийн элсэлт"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Нэмэлт тайлбар (Дэд бичиглэл)
                </label>
                <textarea
                  rows={2}
                  value={formData.collegeDesc || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, collegeDesc: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Дэлхийн шилдэг болон дотоодын тэтгэлэг"
                />
              </div>
            </div>

            {/* 4. Клуб, дугуйлан */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">4. Клуб, дугуйлангийн үзүүлэлт</span>
                </div>
                <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                  {formData.clubsCount}{formData.clubsSuffix || '+'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Тоон утга / Тоо
                  </label>
                  <input
                    type="number"
                    value={formData.clubsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, clubsCount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    placeholder="24"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Дагавар
                  </label>
                  <input
                    type="text"
                    value={formData.clubsSuffix || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, clubsSuffix: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    placeholder="+"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Үзүүлэлтийн нэр (Гарчиг)
                </label>
                <input
                  type="text"
                  value={formData.clubsLabel || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, clubsLabel: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  placeholder="Хөгжлийн дугуйлан, клубүүд"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Нэмэлт тайлбар (Дэд бичиглэл)
                </label>
                <textarea
                  rows={2}
                  value={formData.clubsDesc || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, clubsDesc: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="STEM, Урлаг, Спорт, Гадаад хэл"
                />
              </div>
            </div>
          </div>

          {/* Live Preview of Stats Bar in Admin */}
          <div className="mt-5 p-4 rounded-xl bg-slate-900 text-white border border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-amber-400">
              <Eye className="w-4 h-4" />
              <span>Нүүр хуудасны харагдац (Live Preview):</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 text-center">
                <div className="text-xl sm:text-2xl font-black text-white">
                  {formData.studentsCount}{formData.studentsSuffix || '+'}
                </div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">
                  {formData.studentsLabel || 'Нийт суралцагч сурагчид'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {formData.studentsDesc || '1-12-р ангийн шилдэг сурагчид'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 text-center">
                <div className="text-xl sm:text-2xl font-black text-white">
                  {formData.teachersCount}{formData.teachersSuffix || '+'}
                </div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">
                  {formData.teachersLabel || 'Багшлах бүрэлдэхүүн'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {formData.teachersDesc || 'Магистр, Доктор, Олон улсын зэрэгтэй'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/70 border border-amber-500/50 text-center ring-1 ring-amber-500/20">
                <div className="text-xl sm:text-2xl font-black text-white">
                  {formData.collegeAcceptanceRate}{formData.collegeSuffix !== undefined ? formData.collegeSuffix : '+'}
                </div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">
                  {formData.collegeLabel || 'Их дээд сургуулийн элсэлт'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {formData.collegeDesc || 'Дэлхийн шилдэг болон дотоодын тэтгэлэг'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 text-center">
                <div className="text-xl sm:text-2xl font-black text-white">
                  {formData.clubsCount}{formData.clubsSuffix || '+'}
                </div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">
                  {formData.clubsLabel || 'Хөгжлийн дугуйлан, клубүүд'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {formData.clubsDesc || 'STEM, Урлаг, Спорт, Гадаад хэл'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Тохиргоог хадгалах</span>
          </button>
        </div>
      </form>

      {/* Tab-specific Feedback & Inquiries Email Routing Configuration */}
      <form
        onSubmit={handleSaveEmailSettings}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-600" />
              <span>Санал хүсэлт & Эрсдэл хүлээн авах Gmail хаяг тохируулах</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Хэрэглэгчдийн илгээсэн сургуулийн орчны эрсдлийн үнэлгээ (хавсаргасан гэрэл зурагтай), санал хүсэлт, элсэлтийн мэдээллүүд нь админ самбарт хадгалагдахгүй бөгөөд <strong className="text-slate-800 font-bold">зөвхөн доор тохируулсан хариуцсан ажилтнуудын имэйл хаяг руу шууд</strong> хавсралт зурагтайгаа илгээгдэнэ.
            </p>
          </div>

          {emailSaveSuccess && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Багш нарын имэйл хаяг амжилттай хадгалагдлаа!</span>
            </div>
          )}
        </div>

        {/* Email Delivery Troubleshooting Guide */}
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 sm:p-5 text-xs text-amber-950 space-y-3 shadow-xs">
          <div className="font-bold flex items-center justify-between gap-2 text-amber-900 text-sm border-b border-amber-200/80 pb-2">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Яагаад "Active Form" хийгдэхгүй, имэйл очихгүй байна вэ?</span>
            </span>
            <span className="text-[11px] font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
              Нийтлэг асуудал
            </span>
          </div>

          <div className="text-[12px] text-amber-950/90 leading-relaxed space-y-1.5">
            <p>
              Гуравдагч үнэгүй <strong>FormSubmit</strong> релэй үйлчилгээ нь ихэвчлэн Google/Gmail-ийн спам шүүлтүүрт хаагдах, эсвэл "Activate Form" холбоос нь серверийн хүсэлтийг хязгаарласнаас шалтгаалан идэвхждэггүй. 
            </p>
            <p className="font-semibold text-indigo-950">
              ⚡ 100% найдвартай шийдэл: Доорх "Google / Gmail" албан ёсны серверийг 1 минутад холбох. Ингэснээр ямар ч "Active form" эсвэл гуравдагч үйлчилгээ шаардахгүйгээр бүх санал хүсэлт шууд таны Gmail-д 1 секундийн дотор саадгүй очих болно.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-white/95 p-3.5 rounded-xl border border-indigo-200 space-y-2 shadow-2xs">
              <div className="font-bold text-indigo-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold">✓</span>
                <span>Зөвлөмж: Google Аппын нууц үгээр холбох (1 минут)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Доорх <strong>"Имэйл илгээх серверийн тохиргоо (SMTP)"</strong> хэсгийн <strong>"Google / Gmail тохиргоо ашиглах"</strong> товчийг дараад, өөрийн Google Аппын 16 оронтой нууц үгийг оруулна.
              </p>
              <div className="pt-1">
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Google Аппын нууц үг авах (Шууд нээх)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200 space-y-1.5 shadow-2xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-500 text-white flex items-center justify-center text-[11px] font-bold">2</span>
                <span>Зөвхөн Gmail дээр шууд хүлээн авна</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Админ самбар дээр санал хүсэлтийн жагсаалт хадгалагдахгүй бөгөөд хэрэглэгчдийн илгээсэн эрсдэл, хүсэлтүүд <strong className="text-slate-900 font-bold">ЗӨВХӨН энд тохируулсан Gmail хаяг руу шууд</strong> очно. Ирсэн захидлыг Gmail-ийн 'Бүх захидал' болон 'Спам' хавтаснаас шалгана уу.
              </p>
            </div>
          </div>
        </div>

        {/* 1. DEDICATED RISK & SAFETY OFFICER EMAIL SETTINGS (PRIORITY SECTION) */}
        {(() => {
          const riskSetting = emailSettings.find((s) => s.tabKey === 'risk') || {
            tabKey: 'risk',
            tabTitle: 'Эрсдэлийн үнэлгээ',
            teacherName: 'Т. Болд',
            teacherRole: 'Аюулгүй байдал, эрсдэлийн удирдлагын менежер',
            teacherEmail: 'safety@erdmiin-dalai.edu.mn',
            description: 'Сургуулийн орчны аюулгүй байдал, болзошгүй эрсдэл, зөрчил мэдээлэх, үнэлэх',
            phone: ''
          };

          return (
            <div className="rounded-2xl border-2 border-rose-300 bg-gradient-to-b from-rose-50/80 via-white to-rose-50/30 p-5 sm:p-6 shadow-xs space-y-5 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-rose-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-base text-rose-950">
                        Эрсдэлийн үнэлгээ & Аюулгүй байдлын ажилтны Gmail тохиргоо
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 border border-rose-300 tracking-wider">
                        Шуурхай хүргэлт
                      </span>
                    </div>
                    <p className="text-xs text-rose-800/90 mt-0.5">
                      Сургуулийн орчин, аюулгүй байдлын эрсдэл илэрсэн үед энэхүү ажилтны Gmail хаяг руу шууд мэдэгдэл очино.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(riskSetting.teacherEmail)}&su=${encodeURIComponent('🛡️ [ТУРШИЛТ] Эрсдлийн үнэлгээ холболт шалгах')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 bg-white hover:bg-rose-100/60 border border-rose-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>Gmail дээр нээх</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Crucial Risk Banner */}
              <div className="bg-rose-100/70 border border-rose-300/80 rounded-xl p-3.5 text-xs text-rose-950 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <strong className="font-bold">Чухал санамж:</strong> Хэрэглэгчдийн илгээсэн эрсдлийн мэдээлэл (аюулын зэрэг, тайлбар, илэрсэн байршил, нотлох гэрэл зураг) нь админ самбарт хадгалагдахгүй бөгөөд <span className="font-extrabold text-rose-900 underline">зөвхөн доор тохируулсан хариуцсан ажилтны Gmail хаяг руу шууд</span> илгээгдэнэ.
                </div>
              </div>

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Officer Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-rose-600" />
                    <span>Хариуцах ажилтны нэр *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={riskSetting.teacherName}
                    onChange={(e) => handleUpdateTabField('risk', 'teacherName', e.target.value)}
                    placeholder="Жишээ: Т. Болд"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-semibold text-slate-900 shadow-2xs"
                  />
                </div>

                {/* 2. Officer Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                    <span>Албан тушаал / Үүрэг *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={riskSetting.teacherRole}
                    onChange={(e) => handleUpdateTabField('risk', 'teacherRole', e.target.value)}
                    placeholder="Аюулгүй байдал, эрсдэлийн менежер"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-semibold text-slate-900 shadow-2xs"
                  />
                </div>

                {/* 3. Emergency Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-rose-600" />
                    <span>Яаралтай холбогдох утас</span>
                  </label>
                  <input
                    type="text"
                    value={riskSetting.phone || ''}
                    onChange={(e) => handleUpdateTabField('risk', 'phone', e.target.value)}
                    placeholder="Жишээ: 9911-XXXX, 7058-XXXX"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-semibold text-slate-900 shadow-2xs"
                  />
                </div>

                {/* 4. Target Gmail Address (Wide) */}
                <div className="md:col-span-2 lg:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-rose-950 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <AtSign className="w-4 h-4 text-rose-600" />
                      <span>Эрсдлийн үнэлгээ хүлээн авах Gmail хаяг *</span>
                    </span>
                    <span className="text-[11px] font-medium text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                      Эрсдлийн захидал очих хаяг
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-rose-600">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={riskSetting.teacherEmail}
                      onChange={(e) => handleUpdateTabField('risk', 'teacherEmail', e.target.value)}
                      placeholder="Жишээ: safety@erdmiin-dalai.edu.mn эсвэл jvkhln1@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-rose-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-mono font-bold text-rose-950 shadow-2xs"
                    />
                  </div>

                  {/* Quick Preset helper for jvkhln1@gmail.com */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-[11px] text-slate-500 font-medium">Шуурхай сонгох:</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateTabField('risk', 'teacherEmail', 'jvkhln1@gmail.com')}
                      className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-white hover:bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>jvkhln1@gmail.com тохируулах</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateTabField('risk', 'teacherEmail', 'safety@erdmiin-dalai.edu.mn')}
                      className="text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>safety@erdmiin-dalai.edu.mn</span>
                    </button>
                  </div>
                </div>

                {/* 5. Risk Category Guidance Description */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Эрсдэлийн чиглэл, заавар
                  </label>
                  <textarea
                    rows={2}
                    value={riskSetting.description || ''}
                    onChange={(e) => handleUpdateTabField('risk', 'description', e.target.value)}
                    placeholder="Сургуулийн орчны аюулгүй байдал, болзошгүй эрсдэл, зөрчил мэдээлэх..."
                    className="w-full px-3 py-2 text-xs bg-white border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-slate-700 resize-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Visual Features of Risk Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="bg-white/80 p-3 rounded-xl border border-rose-200/90 space-y-1">
                  <div className="font-extrabold text-rose-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    <span>Өндөр эрсдэл (High Risk)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Ажилтны Gmail-д <strong>[ШУУРХАЙ - ӨНДӨР ЭРСДЭЛ]</strong> гэсэн онцгой анхааруулга бүхий гарчигтайгаар шууд очно.
                  </p>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-rose-200/90 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>📷</span>
                    <span>Байршил & Гэрэл зураг</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Илгээсэн гар утасны нотлох фото зураг болон эрсдэл илэрсэн байршлын хаяг имэйлийн их биед бүтнээр харагдана.
                  </p>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-rose-200/90 space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>🔒</span>
                    <span>100% Шууд хүргэлт</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Админ дээр цугларахгүй, зөвхөн энэ хаяг руу шууд очих тул мэдээлэл нууцлалтай бөгөөд алдагдахгүй.
                  </p>
                </div>
              </div>

              {/* Action Bar for Risk Email */}
              <div className="pt-3 border-t border-rose-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={tabTestStatus['risk']?.loading || !riskSetting.teacherEmail?.trim()}
                    onClick={() => handleTestTabEmail('risk', riskSetting.teacherEmail)}
                    className="text-xs font-bold px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-50 text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    {tabTestStatus['risk']?.loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Эрсдлийн шалгах имэйл илгээж байна...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Эрсдлийн туршилтын мэдэгдэл илгээх</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await updateFeedbackEmailSettings(emailSettings);
                      setEmailSaveSuccess(true);
                      setTimeout(() => setEmailSaveSuccess(false), 3000);
                    }}
                    className="text-xs font-bold px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Эрсдлийн тохиргоог хадгалах</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                  <span className="font-semibold text-slate-600">Одоо тохируулсан:</span>
                  <span className="font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200">
                    {riskSetting.teacherEmail || 'Тохируулаагүй'}
                  </span>
                </div>
              </div>

              {/* Test Status feedback for Risk Tab */}
              {tabTestStatus['risk'] && !tabTestStatus['risk']?.loading && (
                <div
                  className={`p-3 rounded-xl text-xs space-y-1.5 border animate-in fade-in ${
                    tabTestStatus['risk']?.activationNeeded
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : tabTestStatus['risk']?.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-100 border-rose-400 text-rose-950'
                  }`}
                >
                  <div className="flex items-start gap-2 font-bold">
                    {tabTestStatus['risk']?.activationNeeded ? (
                      <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : tabTestStatus['risk']?.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span>
                      {tabTestStatus['risk']?.activationNeeded
                        ? 'Баталгаажуулах имэйл илгээгдлээ!'
                        : tabTestStatus['risk']?.success
                        ? 'Эрсдлийн мэдэгдэл илгээх холболт амжилттай баталгаажлаа!'
                        : 'Холболт амжилтгүй боллоо:'}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {tabTestStatus['risk']?.msg}
                  </p>
                  {tabTestStatus['risk']?.activationNeeded && (
                    <div className="pt-1 flex items-center gap-2">
                      <a
                        href="https://mail.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <span>Gmail нээж 'Activate Form' дарах</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* 2. OTHER FEEDBACK / QUESTION / BULLYING TEACHER EMAIL SETTINGS */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                <span>Бусад санал хүсэлт, асуулт, үе тэнгийн дээрэлхэлт хариуцах ажилтнуудын Gmail хаяг</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Эцэг эх, сурагчдын илгээсэн ерөнхий санал, хичээлийн асуулт болон үе тэнгийн дээрэлхэлтийн нууц мэдээлэл эдгээр ажилтнуудын Gmail рүү очино.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emailSettings
              .filter((item) => item.tabKey !== 'risk' && item.tabKey !== 'complaint')
              .map((tabSetting) => {
                let icon = <MessageSquare className="w-4 h-4 text-amber-700" />;
                let badgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
                let cardBorder = 'hover:border-amber-400';
                let emailNote = '';

                if (tabSetting.tabKey === 'question') {
                  icon = <HelpCircle className="w-4 h-4 text-sky-700" />;
                  badgeBg = 'bg-sky-100 text-sky-900 border-sky-300';
                  cardBorder = 'hover:border-sky-400';
                } else if (tabSetting.tabKey === 'bullying') {
                  icon = <ShieldAlert className="w-4 h-4 text-blue-700" />;
                  badgeBg = 'bg-blue-100 text-blue-900 border-blue-300 font-extrabold';
                  cardBorder = 'hover:border-blue-400 border-blue-200 bg-blue-50/40 shadow-xs';
                  emailNote = '🔒 Сурагчдын илгээсэн үе тэнгийн дээрэлхэлтийн нууц мэдээлэл зөвхөн энэ хаяг руу очино.';
                } else if (tabSetting.tabKey === 'admission') {
                  icon = <GraduationCap className="w-4 h-4 text-indigo-700" />;
                  badgeBg = 'bg-indigo-100 text-indigo-900 border-indigo-300';
                  cardBorder = 'hover:border-indigo-400';
                }

                return (
                  <div
                    key={tabSetting.tabKey}
                    className={`p-4 rounded-xl bg-slate-50/80 border border-slate-200 ${cardBorder} transition-all space-y-3`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 ${badgeBg}`}>
                        {icon}
                        <span>{tabSetting.tabTitle}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        tab: {tabSetting.tabKey}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {tabSetting.tabKey === 'bullying' ? 'Хариуцах ажилтны нэр *' : 'Хариуцах багшийн нэр *'}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            required
                            value={tabSetting.teacherName}
                            onChange={(e) =>
                              handleUpdateTabField(tabSetting.tabKey, 'teacherName', e.target.value)
                            }
                            placeholder={tabSetting.tabKey === 'bullying' ? 'Жишээ: Ц. Энхмаа' : 'Жишээ: Б. Сарантуяа'}
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Албан тушаал *
                        </label>
                        <input
                          type="text"
                          required
                          value={tabSetting.teacherRole}
                          onChange={(e) =>
                            handleUpdateTabField(tabSetting.tabKey, 'teacherRole', e.target.value)
                          }
                          placeholder={tabSetting.tabKey === 'bullying' ? 'Жишээ: Нийгмийн ажилтан / Сэтгэл зүйч' : 'Жишээ: Сургалтын менежер'}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {tabSetting.tabKey === 'bullying' ? 'Ажилтны имэйл хаяг *' : 'Багшийн Gmail хаяг *'}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                            <AtSign className="w-3.5 h-3.5 text-amber-600" />
                          </div>
                          <input
                            type="email"
                            required
                            value={tabSetting.teacherEmail}
                            onChange={(e) =>
                              handleUpdateTabField(tabSetting.tabKey, 'teacherEmail', e.target.value)
                            }
                            placeholder={tabSetting.tabKey === 'bullying' ? 'counselor@erdmiin-dalai.edu.mn' : 'teacher@erdmiin-dalai.edu.mn'}
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono text-slate-900"
                          />
                        </div>
                        {emailNote && (
                          <p className="text-[10px] text-blue-800 font-medium bg-blue-100/70 p-1.5 rounded-lg mt-1.5 border border-blue-200">
                            {emailNote}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Test & Gmail link */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={tabTestStatus[tabSetting.tabKey]?.loading || !tabSetting.teacherEmail?.trim()}
                        onClick={() => handleTestTabEmail(tabSetting.tabKey, tabSetting.teacherEmail)}
                        className="text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {tabTestStatus[tabSetting.tabKey]?.loading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3 text-amber-600" />
                        )}
                        <span>Турших</span>
                      </button>

                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(tabSetting.teacherEmail)}&su=${encodeURIComponent('Шалгах захидал')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <span>Gmail нээх</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Test status banner */}
                    {tabTestStatus[tabSetting.tabKey] && !tabTestStatus[tabSetting.tabKey]?.loading && (
                      <div
                        className={`p-2 rounded-lg text-[11px] border leading-tight ${
                          tabTestStatus[tabSetting.tabKey]?.success
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}
                      >
                        {tabTestStatus[tabSetting.tabKey]?.msg}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Эдгээр тохиргоо нь вэб сайтын "Санал хүсэлт" цонхны таб тус бүрийн багшийн имэйл рүү шууд холбогдоно.
          </p>
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer ml-auto"
          >
            <Save className="w-4 h-4" />
            <span>Багш нарын имэйл тохиргоог хадгалах</span>
          </button>
        </div>
      </form>

      {/* Real Email Delivery & SMTP Configuration */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" />
              <span>Имэйл илгээх серверийн тохиргоо (SMTP & Бодит хүргэлт)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Сайтын зочдын санал хүсэлт хариуцсан багшийн имэйл хайрцагт саадгүй очихын тулд сургуулийн Gmail эсвэл SMTP серверийг энд тохируулна.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {smtpSaved && (
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SMTP тохиргоо амжилттай хадгалагдлаа!</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-700 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Шуурхай бэлэн тохиргоо (Presets):</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={applyGmailPreset}
              className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Google / Gmail (smtp.gmail.com:587)
            </button>
            <button
              type="button"
              onClick={applyOfficePreset}
              className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Microsoft 365 (smtp.office365.com:587)
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveSmtp} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <input
              type="checkbox"
              id="smtpEnabled"
              checked={localSmtp.enabled}
              onChange={(e) => setLocalSmtp(prev => ({ ...prev, enabled: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="smtpEnabled" className="text-xs font-bold text-indigo-950 cursor-pointer select-none">
              Бодит SMTP имэйл илгээлтийг идэвхжүүлэх (Идэвхгүй үед автоматаар захидал релэй болон шууд нээх холбоосоор ажиллана)
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                SMTP Сервер (Host) *
              </label>
              <input
                type="text"
                value={localSmtp.host}
                onChange={(e) => setLocalSmtp(prev => ({ ...prev, host: e.target.value }))}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Порт (Port) *
              </label>
              <input
                type="number"
                value={localSmtp.port}
                onChange={(e) => setLocalSmtp(prev => ({ ...prev, port: Number(e.target.value) || 587 }))}
                placeholder="587 эсвэл 465"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Илгээгчийн нэр (From Name)
              </label>
              <input
                type="text"
                value={localSmtp.fromName}
                onChange={(e) => setLocalSmtp(prev => ({ ...prev, fromName: e.target.value }))}
                placeholder="Эрдмийн Далай Цогцолбор Сургууль"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                SMTP Хэрэглэгч / Имэйл (User) *
              </label>
              <input
                type="text"
                value={localSmtp.user}
                onChange={(e) => setLocalSmtp(prev => ({ ...prev, user: e.target.value }))}
                placeholder="school@erdmiin-dalai.edu.mn эсвэл your@gmail.com"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                SMTP Нууц үг / Аппын нууц үг (Password) *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={localSmtp.pass}
                  onChange={(e) => setLocalSmtp(prev => ({ ...prev, pass: e.target.value }))}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Илгээгч имэйл (From Email)
              </label>
              <input
                type="email"
                value={localSmtp.fromEmail}
                onChange={(e) => setLocalSmtp(prev => ({ ...prev, fromEmail: e.target.value }))}
                placeholder="Хэрэглэгчийн имэйлтэй адил"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl text-xs text-indigo-950 space-y-2.5">
            <div className="font-bold flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-indigo-900 text-sm">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>Google Аппын нууц үг (App Password) үүсгэх хялбар 3 алхам:</span>
              </span>
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-colors shadow-2xs"
              >
                <span>Энд дарж Google хуудсыг нээх</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed pl-1">
              <li>Дээрх товчийг дарж <strong className="text-slate-900">myaccount.google.com/apppasswords</strong> хуудас руу орно (Google хаягаараа нэвтэрсэн байна).</li>
              <li>"App name" нүдэнд <strong className="text-slate-900 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">Сургууль</strong> гэж бичээд <strong className="text-slate-900">Create (Үүсгэх)</strong> товчийг дарна.</li>
              <li>Дэлгэцэнд гарч ирэх 16 оронтой шар өнгийн нууц үгийг хуулан дээрх <strong className="text-slate-900">"SMTP Нууц үг"</strong> талбарт хуулж тавиад <strong>"SMTP серверийн тохиргоог хадгалах"</strong> дарна.</li>
            </ol>
            <p className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
              ✓ Ингэснээр FormSubmit болон "Active form" шаардахгүйгээр бүх санал хүсэлт таны Gmail руу 100% шууд хүргэгдэнэ.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>SMTP серверийн тохиргоог хадгалах</span>
            </button>
          </div>
        </form>

        {/* Live Test Email Tool */}
        <div className="pt-5 border-t border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-indigo-600" />
            <span>Имэйл холболтыг шалгах (Туршилтын имэйл илгээх)</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            Тохируулсан имэйл систем рүү бодитоор захидал очиж буйг шалгахын тулд өөрийн шалгах имэйл хаягаа оруулаад "Турших" товчийг дарна уу.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <AtSign className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                value={testEmailInput}
                onChange={(e) => setTestEmailInput(e.target.value)}
                placeholder="Шалгах имэйл (жишээ: jvkhln1@gmail.com)"
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <button
              type="button"
              disabled={testEmailLoading || !testEmailInput.trim()}
              onClick={handleSendTestEmail}
              className="bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-bold text-xs px-5 py-2 rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {testEmailLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Шалгаж байна...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Туршилтын имэйл илгээх</span>
                </>
              )}
            </button>
          </div>

          {testEmailResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in ${
                testEmailResult.activationNeeded
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : testEmailResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {testEmailResult.activationNeeded ? (
                <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : testEmailResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold">
                  {testEmailResult.activationNeeded
                    ? 'Баталгаажуулах имэйл илгээгдлээ!'
                    : testEmailResult.success
                    ? 'Холболт амжилттай!'
                    : 'Имэйл илгээхэд алдаа гарлаа:'}
                </div>
                <div className="text-[11px] leading-relaxed">
                  {testEmailResult.message || testEmailResult.error}
                </div>
                {testEmailResult.activationNeeded && (
                  <div className="pt-1.5">
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                    >
                      <span>Gmail нээж 'Activate Form' товчийг дарах</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1. Admin User Profile & Email Configuration Form */}
      <form
        onSubmit={handleSaveAdminProfile}
        className="bg-white p-6 rounded-2xl border-2 border-amber-200/90 shadow-xs space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-2xs">
              <User className="w-4.5 h-4.5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span>Админ Хэрэглэгчийн Мэдээлэл & Имэйл Тохиргоо</span>
                <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                  Нэвтрэх & Мэдэгдэл
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Админ хэрэглэгчийн нэвтрэх нэр болон имэйл хаягийг оруулах (нууц үг шаардахгүйгээр шууд хадгална)
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="text-slate-400 block text-[11px]">Одоогийн админ имэйл:</span>
            <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {adminEmail || 'Тохируулаагүй'}
            </span>
          </div>
        </div>

        {adminProfileMsg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
              adminProfileMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {adminProfileMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{adminProfileMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Админы нэвтрэх нэр (Username) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                required
                value={adminProfileName}
                onChange={(e) => {
                  setAdminProfileName(e.target.value);
                  setNewUsername(e.target.value);
                }}
                placeholder="Жишээ: admin"
                className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Админ хэрэглэгчийн имэйл (Email) *</span>
              <span className="text-[10px] text-amber-700 font-medium">Нэвтрэхэд ашиглаж болно</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                required
                value={adminProfileEmail}
                onChange={(e) => setAdminProfileEmail(e.target.value)}
                placeholder="Жишээ: jvkhln1@gmail.com"
                className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-amber-50/40 border-2 border-amber-300/80 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
              />
            </div>

            {/* Quick preset for jvkhln1@gmail.com */}
            <div className="flex items-center gap-2 pt-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">Шуурхай:</span>
              <button
                type="button"
                onClick={() => setAdminProfileEmail('jvkhln1@gmail.com')}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>jvkhln1@gmail.com тохируулах</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <p className="text-[11px] text-slate-400">
            Хадгалсны дараа та нэвтрэх нэр эсвэл энэхүү имэйл хаягийн аль алинаар нь админ эрхээр нэвтрэх боломжтой болно.
          </p>
          <button
            type="submit"
            disabled={isSavingProfile}
            className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Админы мэдээлэл хадгалах</span>
          </button>
        </div>
      </form>

      {/* Admin Security & Password Change Form */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Админы Нэвтрэх Нэр & Нууц Үг Солих</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Одоогийн хэрэглэгч: <strong className="text-slate-700">{adminUsername}</strong>
          </span>
        </div>

        {credMsg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
              credMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {credMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{credMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Нэвтрэх нэр (Username)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Жишээ: admin"
                className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Одоогийн нууц үг *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Анхдагч: admin123"
                className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Шинэ нууц үг *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <input
                type="password"
                required
                minLength={4}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Шинэ нууц үг (дор хаяж 4 үсэг)"
                className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-400">
            Нууц үгээ сольсны дараа дараагийн нэвтрэлтэд шинэ нууц үгээ ашиглана.
          </p>
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Нууц үг солих</span>
          </button>
        </div>
      </form>

      {/* Google Sheets Integration Section */}
      <AdminGoogleSheetsManager />

      {/* Backup, Export & Reset Section */}
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
          Өгөгдлийн сан ба Нөөц хуулбар
        </h3>
        <p className="text-xs text-slate-600">
          Сайтын бүх мэдээ, хөтөлбөр, слайдер, ангиллын тохиргоог файл болгон татаж авах эсвэл өмнөх өгөгдлийг сэргээх боломжтой.
        </p>

        {backupMsg && (
          <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{backupMsg}</span>
          </div>
        )}

        {importError && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExport}
            className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Бүх өгөгдлийг JSON татах (Backup)</span>
          </button>

          <label className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 shadow-2xs flex items-center gap-2 transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-amber-600" />
            <span>JSON файлаас сэргээх (Restore)</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => {
              resetToDefaults();
              setBackupMsg('Өгөгдлийг анхны хэлбэрт амжилттай буцаалаа.');
              setTimeout(() => setBackupMsg(null), 4000);
            }}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 ml-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Анхны өгөгдөл рүү буцаах</span>
          </button>
        </div>
      </div>
    </div>
  );
};
