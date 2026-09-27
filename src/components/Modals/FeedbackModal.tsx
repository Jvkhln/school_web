import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  X,
  CheckCircle2,
  Send,
  Sparkles,
  Phone,
  User,
  Mail,
  HelpCircle,
  GraduationCap,
  MessageCircle,
  ExternalLink,
  ShieldAlert,
  MapPin,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  AlertTriangle,
  Info,
  Shield,
  Lock
} from 'lucide-react';
import { RiskLevel } from '../../types';

export const FeedbackModal: React.FC = () => {
  const {
    isAdmissionModalOpen,
    setIsAdmissionModalOpen,
    submitAdmissionInquiry,
    programs,
    feedbackEmailSettings
  } = useSchool();

  // Form type: feedback, question, bullying, risk (replaced admission with bullying)
  const [feedbackType, setFeedbackType] = useState<'feedback' | 'question' | 'bullying' | 'risk'>('feedback');

  const currentRecipient = feedbackEmailSettings?.find(s => s.tabKey === feedbackType) || {
    tabKey: feedbackType,
    tabTitle: feedbackType === 'risk'
      ? 'Эрсдлийн үнэлгээ'
      : feedbackType === 'bullying'
      ? 'Үе тэнгийн дээрэлхэлт'
      : feedbackType === 'question'
      ? 'Асуулт'
      : 'Санал хүсэлт',
    teacherName: feedbackType === 'risk'
      ? 'Т. Болд'
      : feedbackType === 'bullying'
      ? 'Ц. Энхмаа'
      : 'Б. Сарантуяа',
    teacherRole: feedbackType === 'risk'
      ? 'Аюулгүй байдал, эрсдэлийн удирдлагын менежер'
      : feedbackType === 'bullying'
      ? 'Нийгмийн ажилтан / Сэтгэл зүйч'
      : 'Сургалтын менежер / Багш',
    teacherEmail: feedbackType === 'risk'
      ? 'safety@erdmiin-dalai.edu.mn'
      : feedbackType === 'bullying'
      ? 'counselor@erdmiin-dalai.edu.mn'
      : 'feedback@erdmiin-dalai.edu.mn',
    description: ''
  };

  const [formData, setFormData] = useState({
    name: '',
    studentName: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    gradeLevel: '1-р анги',
    programInterest: 'Ерөнхий боловсрол',
    // Risk assessment specific fields
    riskLevel: 'medium' as RiskLevel,
    riskCategory: 'Сургуулийн орчин, гадна талбай',
    location: '',
    imageUrl: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<{
    success?: boolean;
    method?: string;
    activationNeeded?: boolean;
    message?: string;
  } | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<{
    subject: string;
    body: string;
    recipientEmail: string;
    recipientName: string;
    recipientRole: string;
    type: string;
    riskLevel?: string;
    isAnonymous?: boolean;
  } | null>(null);

  if (!isAdmissionModalOpen) return null;

  // Process & compress image from phone or computer
  const handleImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsProcessingImage(true);
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress image using canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setImagePreview(compressedDataUrl);
          setFormData(prev => ({ ...prev, imageUrl: compressedDataUrl }));
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => setIsProcessingImage(false);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => setIsProcessingImage(false);
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFileName(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isRisk = feedbackType === 'risk';
    const isBullying = feedbackType === 'bullying';
    const effectiveAnonymous = isAnonymous && (isBullying || isRisk);

    const studentNameVal = effectiveAnonymous
      ? 'Нэрээ нууцалсан сурагч'
      : (formData.studentName.trim() || formData.name.trim());

    const senderNameVal = effectiveAnonymous
      ? (isBullying ? 'Нэрээ нууцалсан сурагч' : 'Нэрээ нууцалсан иргэн / сурагч')
      : (isBullying ? studentNameVal : formData.name.trim());

    const phoneVal = effectiveAnonymous && !formData.phone.trim()
      ? 'Нууцалсан'
      : formData.phone.trim();

    if (isBullying) {
      if (effectiveAnonymous) {
        if (!formData.message.trim()) return;
      } else {
        if (!studentNameVal || !formData.phone.trim() || !formData.message.trim()) return;
      }
    } else if (isRisk) {
      if (effectiveAnonymous) {
        if (!formData.message.trim() || !formData.location.trim()) return;
      } else {
        if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim() || !formData.location.trim()) return;
      }
    } else {
      if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) return;
    }

    setLoading(true);

    const riskLevelText = formData.riskLevel === 'high' ? 'Өндөр' : formData.riskLevel === 'medium' ? 'Дунд' : 'Бага';
    
    const subject = formData.subject.trim() || (
      isRisk
        ? `Эрсдлийн үнэлгээ (${riskLevelText}) ${effectiveAnonymous ? '[Нэрээ нууцалсан]' : ''} - ${formData.riskCategory}`
        : isBullying
        ? `Үе тэнгийн дээрэлхэлтийн нууц мэдээлэл ${effectiveAnonymous ? '[НЭРЭЭ НУУЦАЛСАН СУРАГЧ]' : `(${formData.gradeLevel ? `${formData.gradeLevel} - ` : ''}${studentNameVal})`}`
        : feedbackType === 'feedback'
        ? 'Санал хүсэлт'
        : 'Асуулт лавлагаа'
    );

    const fullBody = isRisk
      ? `Илгээгч: ${effectiveAnonymous ? 'Нэрээ нууцалсан (Нууц мэдээлэл)' : formData.name.trim()}
Утас: ${effectiveAnonymous && (!formData.phone.trim() || phoneVal === 'Нууцалсан') ? 'Нууцалсан / Оруулаагүй' : phoneVal}
Имэйл: ${effectiveAnonymous ? 'Нууцалсан' : (formData.email.trim() || 'байхгүй')}
Төрөл: Эрсдлийн үнэлгээ ${effectiveAnonymous ? '(Нэрээ нууцалсан)' : ''}
Эрсдлийн түвшин: ${riskLevelText}
Эрсдэлийн ангилал: ${formData.riskCategory}
Байршил: ${formData.location.trim()}
Тайлбар:
${formData.message.trim()}`
      : isBullying
      ? `Төрөл: Үе тэнгийн дээрэлхэлтийн нууц мэдээлэл ${effectiveAnonymous ? '(НЭРЭЭ НУУЦАЛСАН)' : ''}
Сурагчийн нэр: ${effectiveAnonymous ? '🔒 Нэрээ нууцалсан сурагч' : studentNameVal}
Анги: ${formData.gradeLevel.trim() || 'Тодорхойгүй / Нууцалсан'}
Утасны дугаар: ${effectiveAnonymous && (!formData.phone.trim() || phoneVal === 'Нууцалсан') ? 'Нууцалсан / Оруулаагүй' : phoneVal}
Имэйл: ${effectiveAnonymous ? 'Нууцалсан' : (formData.email.trim() || 'байхгүй')}

Дэлгэрэнгүй мэдээлэл:
${formData.message.trim()}

[НУУЦЛАЛЫН МЭДЭГДЭЛ]: ${effectiveAnonymous ? 'Илгээгч сурагч нэрээ бүрэн нууцалсан тул хувийн нууцыг 100% чандлан хангаж, зөвхөн сургуулийн нийгмийн ажилтан, сэтгэл зүйчийн шууд хяналтад асуудлыг шийдвэрлэхэд ашиглана.' : 'Мэдээлэл өгсөн сурагчийн хувийн мэдээллийг чандлан нууцалж, зөвхөн сургуулийн нийгмийн ажилтан, сэтгэл зүйчийн шууд хяналтад ашиглана.'}`
      : `Илгээгч: ${formData.name.trim()}
Утас: ${formData.phone.trim()}
Имэйл: ${formData.email.trim() || 'байхгүй'}
Төрөл: ${currentRecipient.tabTitle}
${formData.gradeLevel ? `Анги: ${formData.gradeLevel}\n` : ''}${formData.programInterest ? `Хөтөлбөр: ${formData.programInterest}\n` : ''}
Агуулга:
${formData.message.trim()}`;

    setLastSubmittedData({
      subject: `[${currentRecipient.tabTitle}] ${subject}`,
      body: fullBody,
      recipientEmail: currentRecipient.teacherEmail,
      recipientName: currentRecipient.teacherName,
      recipientRole: currentRecipient.teacherRole,
      type: feedbackType,
      riskLevel: formData.riskLevel,
      isAnonymous: effectiveAnonymous
    });

    try {
      const res = await submitAdmissionInquiry({
        name: senderNameVal,
        studentName: isBullying ? (effectiveAnonymous ? 'Нэрээ нууцалсан сурагч' : studentNameVal) : undefined,
        parentName: isBullying || effectiveAnonymous ? undefined : formData.name.trim(),
        phone: phoneVal,
        email: effectiveAnonymous ? undefined : (formData.email.trim() || undefined),
        type: feedbackType,
        subject,
        message: formData.message.trim(),
        gradeLevel: isBullying ? (formData.gradeLevel.trim() || undefined) : undefined,
        programInterest: undefined,
        notes: formData.message.trim(),
        recipientName: currentRecipient.teacherName,
        recipientEmail: currentRecipient.teacherEmail,
        recipientRole: currentRecipient.teacherRole,
        riskLevel: isRisk ? formData.riskLevel : undefined,
        riskCategory: isRisk ? formData.riskCategory : undefined,
        location: isRisk ? formData.location.trim() : undefined,
        imageUrl: formData.imageUrl ? formData.imageUrl : undefined,
        isAnonymous: effectiveAnonymous
      });
      setDeliveryResult(res);
    } catch (err) {
      console.warn('Inquiry submit err', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        studentName: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
        gradeLevel: '1-р анги',
        programInterest: 'Ерөнхий боловсрол',
        riskLevel: 'medium',
        riskCategory: 'Сургуулийн орчин, гадна талбай',
        location: '',
        imageUrl: ''
      });
      setImagePreview(null);
      setImageFileName(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 p-5 sm:p-7 flex flex-col my-auto max-h-[94vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setIsAdmissionModalOpen(false);
            setSubmitted(false);
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer z-10"
          title="Хаах"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
              lastSubmittedData?.type === 'risk'
                ? 'bg-rose-100 text-rose-600'
                : lastSubmittedData?.type === 'bullying'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-emerald-100 text-emerald-600'
            }`}>
              {lastSubmittedData?.type === 'risk' ? (
                <ShieldAlert className="w-9 h-9" />
              ) : lastSubmittedData?.type === 'bullying' ? (
                <Shield className="w-9 h-9" />
              ) : (
                <CheckCircle2 className="w-8 h-8" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {lastSubmittedData?.type === 'risk'
                  ? 'Эрсдлийн үнэлгээ амжилттай бүртгэгдлээ!'
                  : lastSubmittedData?.type === 'bullying'
                  ? 'Үе тэнгийн дээрэлхэлтийн мэдээллийг хүлээн авлаа!'
                  : 'Таны хүсэлтийг амжилттай хүлээн авлаа!'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {lastSubmittedData?.type === 'risk'
                  ? 'Сургуулийн орчны эрсдэл, аюулгүй байдлын мэдээлэл болон гэрэл зураг хариуцсан ажилтны имэйл рүү яаралтай хүргэгдлээ.'
                  : lastSubmittedData?.type === 'bullying'
                  ? 'Сурагчийн хувийн мэдээллийг чандлан нууцалж, сургуулийн нийгмийн ажилтан, сэтгэл зүйчийн имэйл рүү шуурхай хүргэгдлээ.'
                  : 'Систем хүсэлтийг бүртгэж, хариуцсан багшийн имэйл хаяг руу хуваарилан илгээлээ.'}
              </p>
            </div>

            {lastSubmittedData?.isAnonymous && (
              <div className="bg-blue-50/90 border-2 border-blue-200 rounded-2xl p-3 max-w-sm mx-auto text-left flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                    <span>100% Нэрээ нууцалсан илгээмж</span>
                    <span className="text-[9px] bg-blue-200 text-blue-800 px-1.5 py-0.2 rounded font-bold">Нууц</span>
                  </div>
                  <p className="text-[11px] text-blue-800/90 mt-0.5 leading-snug">
                    Таны нэр болон холбогдох хувийн мэдээллийг нийгмийн ажилтанд задруулахгүйгээр бүрэн нууцласан болно.
                  </p>
                </div>
              </div>
            )}

            <div className={`border rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2 ${
              lastSubmittedData?.type === 'risk'
                ? 'bg-rose-50/80 border-rose-200'
                : lastSubmittedData?.type === 'bullying'
                ? 'bg-blue-50/80 border-blue-200'
                : 'bg-emerald-50/80 border-emerald-200'
            }`}>
              <div className={`text-xs font-bold flex items-center gap-1.5 border-b pb-1.5 ${
                lastSubmittedData?.type === 'risk'
                  ? 'text-rose-900 border-rose-200/60'
                  : lastSubmittedData?.type === 'bullying'
                  ? 'text-blue-900 border-blue-200/60'
                  : 'text-emerald-900 border-emerald-200/60'
              }`}>
                <Mail className={`w-4 h-4 shrink-0 ${
                  lastSubmittedData?.type === 'risk'
                    ? 'text-rose-700'
                    : lastSubmittedData?.type === 'bullying'
                    ? 'text-blue-700'
                    : 'text-emerald-700'
                }`} />
                <span>{lastSubmittedData?.type === 'bullying' ? 'Хүлээн авсан ажилтан:' : 'Хүлээн авсан ажилтан / багш:'}</span>
              </div>
              <p className="text-xs text-slate-700">
                <strong className="text-slate-900 text-sm">{lastSubmittedData?.recipientName || currentRecipient.teacherName}</strong>
                <span className="block text-slate-500 text-[11px]">{lastSubmittedData?.recipientRole || currentRecipient.teacherRole}</span>
              </p>
              <div className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs font-semibold truncate bg-white/80 ${
                lastSubmittedData?.type === 'risk'
                  ? 'border-rose-200 text-rose-800'
                  : lastSubmittedData?.type === 'bullying'
                  ? 'border-blue-200 text-blue-800'
                  : 'border-emerald-200 text-emerald-800'
              }`}>
                {lastSubmittedData?.recipientEmail || currentRecipient.teacherEmail}
              </div>
            </div>

            {/* Email delivery note */}
            {deliveryResult && (
              <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 max-w-md mx-auto border border-slate-200">
                {deliveryResult.method === 'smtp' && (
                  <p className="text-emerald-700 font-medium">✓ Имэйл хаяг руу SMTP серверээр амжилттай шууд илгээгдсэн.</p>
                )}
                {deliveryResult.method === 'relay' && (
                  <p className="text-teal-700 font-medium">✓ Имэйл хаяг руу шуурхай релэйгээр хүргэгдлээ.</p>
                )}
                {deliveryResult.method === 'activation_needed' && (
                  <div className="text-amber-800 space-y-1">
                    <p className="font-bold">⚠️ Анхааруулга: Имэйл баталгаажуулалт шаардлагатай</p>
                    <p className="text-[11px]">{deliveryResult.message}</p>
                  </div>
                )}
                {deliveryResult.success === false && (
                  <p className="text-rose-600">Имэйл илгээхэд мэдэгдэл: {deliveryResult.message || 'Алдаа гарлаа'}</p>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdmissionModalOpen(false);
                  setSubmitted(false);
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
              >
                Хаах
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                {feedbackType === 'risk' ? (
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                ) : feedbackType === 'bullying' ? (
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {feedbackType === 'risk'
                    ? 'Эрсдлийн үнэлгээ, мэдээлэл бүртгэх'
                    : feedbackType === 'bullying'
                    ? 'Үе тэнгийн дээрэлхэлт мэдээлэх'
                    : 'Санал хүсэлт илгээх'}
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                {feedbackType === 'risk'
                  ? 'Сургуулийн орчны аюулгүй байдал, болзошгүй эрсдэлийг гэрэл зураг, байршлын хамт мэдээлэх'
                  : feedbackType === 'bullying'
                  ? 'Сурагчийн хувийн мэдээллийг чандлан нууцалж, сургуулийн нийгмийн ажилтан, сэтгэл зүйчид мэдээлэх'
                  : 'Сургуулийн удирдлага, багш нарт санал хүсэлт, асуултаа илгээх'}
              </p>
            </div>

            {/* Type selector tabs: feedback, question, bullying, risk */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl mb-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFeedbackType('feedback')}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  feedbackType === 'feedback'
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="truncate">Санал хүсэлт</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType('question')}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  feedbackType === 'question'
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="truncate">Асуулт</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType('bullying')}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  feedbackType === 'bullying'
                    ? 'bg-blue-600 text-white shadow-xs font-extrabold ring-2 ring-blue-300'
                    : 'text-blue-700 hover:text-blue-900 hover:bg-blue-100/60'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="truncate">Дээрэлхэлт</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType('risk')}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  feedbackType === 'risk'
                    ? 'bg-rose-500 text-white shadow-xs font-extrabold ring-2 ring-rose-300'
                    : 'text-rose-700 hover:text-rose-900 hover:bg-rose-100/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="truncate">Эрсдэл</span>
              </button>
            </div>

            {/* Recipient Staff / Teacher Information Badge */}
            <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs mb-3.5 transition-all border ${
              feedbackType === 'risk'
                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                : feedbackType === 'bullying'
                ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                : 'bg-amber-50/70 border-amber-200 text-slate-700'
            }`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                feedbackType === 'risk'
                  ? 'bg-rose-100 text-rose-800'
                  : feedbackType === 'bullying'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {feedbackType === 'risk' ? (
                  <ShieldAlert className="w-3.5 h-3.5" />
                ) : feedbackType === 'bullying' ? (
                  <Shield className="w-3.5 h-3.5" />
                ) : (
                  <Mail className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap leading-tight">
                  <span className="text-[10px] opacity-70 font-medium">
                    {feedbackType === 'risk'
                      ? 'Эрсдэл хариуцсан ажилтан:'
                      : feedbackType === 'bullying'
                      ? 'Хүлээн авах ажилтан (Нууцлал):'
                      : 'Хүлээн авах багш:'}
                  </span>
                  <span className="font-bold text-xs">{currentRecipient.teacherName}</span>
                  <span className="text-[11px] opacity-75">({currentRecipient.teacherRole})</span>
                </div>
                <div className="text-[11px] font-mono font-semibold flex items-center gap-2 mt-0.5 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3 opacity-60 shrink-0" />
                    <span className="truncate">{currentRecipient.teacherEmail}</span>
                  </div>
                  {currentRecipient.phone && (
                    <span className="text-[10px] text-slate-500 font-sans font-medium">
                      Утас: {currentRecipient.phone}
                    </span>
                  )}
                  <span className="text-[10px] bg-white/70 px-1.5 py-0.2 rounded text-slate-600">
                    {feedbackType === 'bullying' ? 'Нууцлалтай хүргэгдэнэ' : 'Gmail рүү очино'}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* ===================== RISK ASSESSMENT SPECIFIC FIELDS ===================== */}
              {feedbackType === 'risk' ? (
                <div className="space-y-3.5 p-3.5 bg-rose-50/40 rounded-2xl border border-rose-100 animate-in fade-in duration-200">
                  {/* 1. Эрсдлийн түвшин (Өндөр, Дунд, Бага) */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1.5">
                      Эрсдлийн түвшин сонгох *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, riskLevel: 'high' })}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          formData.riskLevel === 'high'
                            ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-400/40'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50/50'
                        }`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${formData.riskLevel === 'high' ? 'bg-white animate-pulse' : 'bg-rose-500'}`} />
                        <span className="text-xs font-black">Өндөр</span>
                        <span className="text-[10px] opacity-80 leading-none">Яаралтай</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, riskLevel: 'medium' })}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          formData.riskLevel === 'medium'
                            ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                        }`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${formData.riskLevel === 'medium' ? 'bg-white' : 'bg-amber-500'}`} />
                        <span className="text-xs font-black">Дунд</span>
                        <span className="text-[10px] opacity-80 leading-none">Анхаарах</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, riskLevel: 'low' })}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          formData.riskLevel === 'low'
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400/40'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                        }`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${formData.riskLevel === 'low' ? 'bg-white' : 'bg-emerald-500'}`} />
                        <span className="text-xs font-black">Бага</span>
                        <span className="text-[10px] opacity-80 leading-none">Сэрэмжлүүлэг</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Эрсдэл бүртгэх хэсэг: Ангилал ба Гарчиг */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Эрсдэлийн ангилал / чиглэл *
                      </label>
                      <select
                        value={formData.riskCategory}
                        onChange={(e) => setFormData({ ...formData, riskCategory: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400/40 focus:border-rose-500"
                      >
                        <option value="Сургуулийн орчин, гадна талбай">Сургуулийн орчин, гадна талбай</option>
                        <option value="Барилга байгууламж, шат, цонх">Барилга байгууламж, шат, цонх</option>
                        <option value="Цахилгаан, сантехник, тоног төхөөрөмж">Цахилгаан, сантехник, тоног төхөөрөмж</option>
                        <option value="Эрүүл ахуй, хоол хүнс, цэвэр ус">Эрүүл ахуй, хоол хүнс, цэвэр ус</option>
                        <option value="Сурагчийн аюулгүй байдал, дарамт">Сурагчийн аюулгүй байдал, дарамт</option>
                        <option value="Замын хөдөлгөөн, гарц, автобус">Замын хөдөлгөөн, гарц, автобус</option>
                        <option value="Бусад болзошгүй эрсдэл">Бусад болзошгүй эрсдэл</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Эрсдэлийн товч гарчиг
                      </label>
                      <input
                        type="text"
                        placeholder="Жишээ: 2-р давхрын шатны гишгүүр эвдэрсэн"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400/40 focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* 3. Байршил оруулах хэсэг */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Эрсдэл илэрсэн байршил *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-rose-500" />
                      <input
                        type="text"
                        required
                        placeholder="Жишээ: А байр 2-р давхар, 204 тоотын үүд, Спортын заал..."
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400/40 focus:border-rose-500"
                      />
                    </div>
                    {/* Quick location chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] text-slate-400">Шуурхай сонгох:</span>
                      {['Гадна талбай', '1-р давхар', '2-р давхар', '3-р давхар', 'Спортын заал', 'Цайны газар', 'Номын сан'].map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setFormData({ ...formData, location: loc })}
                          className="text-[10px] bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Гар утас болон компьютерээс зураг оруулах хэсэг */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Гар утас эсвэл компьютерээс зураг оруулах
                    </label>

                    {/* Hidden inputs */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />

                    {imagePreview ? (
                      <div className="relative p-2.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-3">
                        <img
                          src={imagePreview}
                          alt="Хавсаргасан зураг"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {imageFileName || 'Эрсдлийн зураг'}
                          </p>
                          <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Зураг амжилттай хавсаргагдлаа
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                            >
                              Зураг солих
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" /> Устгах
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-white border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-2xl text-center transition-colors">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessingImage}
                            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Зураг сонгох</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            disabled={isProcessingImage}
                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Камераар авах</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">
                          Гар утасны камер эсвэл компьютер доторх файлуудаас PNG, JPG зураг хавсаргах боломжтой
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* ===================== PEER BULLYING (ҮЕ ТЭНГИЙН ДЭЭРЭЛХЭЛТ) ===================== */}
              {feedbackType === 'bullying' ? (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  {/* Privacy & Confidentiality Notice */}
                  <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="font-black text-blue-950 flex items-center gap-2">
                        <span>Хувийн мэдээллийн нууцлал</span>
                        <span className="px-1.5 py-0.5 text-[9px] bg-blue-600 text-white rounded font-bold uppercase tracking-wider">
                          100% Нууцлалтай
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-900/90 mt-0.5 leading-relaxed">
                        Мэдээлэл өгсөн сурагчийн хувийн мэдээллийг чандлан нууцална. Энэхүү мэдээлэл нь зөвхөн сургуулийн нийгмийн ажилтан, сэтгэл зүйчид очих бөгөөд сурагчийн эрх ашиг, аюулгүй байдлыг хамгаалахад ашиглагдана.
                      </p>
                    </div>
                  </div>

                  {/* ANONYMOUS CHECKBOX CARD */}
                  <div
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                      isAnonymous
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400/40'
                        : 'bg-white hover:bg-blue-50/60 border-blue-200/90 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isAnonymous ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                      }`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black">Нэрээ нууцлах (Anonymous)</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            isAnonymous ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {isAnonymous ? 'Идэвхжсэн' : 'Сонгох'}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-0.5 leading-tight ${
                          isAnonymous ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {isAnonymous
                            ? 'Таны нэр болон холбоо барих мэдээлэл нийгмийн ажилтанд задруулагдахгүй.'
                            : 'Хэрэв өөрийн нэрээ илгээхээс эмээж байвал энэ сонголтыг чагталж нэрээ нууцална уу.'}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      id="anonymous-bullying-toggle"
                      checked={isAnonymous}
                      onChange={(e) => {
                        e.stopPropagation();
                        setIsAnonymous(e.target.checked);
                      }}
                      className="w-5 h-5 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
                    />
                  </div>

                  {/* Class and Student Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isAnonymous ? 'Анги (Сонголтоор)' : 'Анги *'}
                      </label>
                      <input
                        type="text"
                        required={!isAnonymous}
                        placeholder={isAnonymous ? 'Сонголтоор: Жишээ нь 8-р анги' : 'Жишээ: 8А анги, 9Б...'}
                        value={formData.gradeLevel}
                        onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Сурагчийн нэр {isAnonymous ? '(Нууцалсан)' : '*'}
                      </label>
                      {isAnonymous ? (
                        <div className="w-full px-3 py-2 text-xs sm:text-sm bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-2 text-blue-900 font-bold">
                          <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>🔒 Нэрээ нууцалсан сурагч</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="Сурагчийн нэр"
                            value={formData.studentName}
                            onChange={(e) =>
                              setFormData({ ...formData, studentName: e.target.value, name: e.target.value })
                            }
                            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phone number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isAnonymous ? 'Утасны дугаар (Сонголтоор - хариу холбогдохыг хүсвэл оруулна)' : 'Утасны дугаар *'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="tel"
                        required={!isAnonymous}
                        placeholder={isAnonymous ? 'Сонголтоор: 9911-XXXX' : '9911-XXXX'}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Дэлгэрэнгүй мэдээлэл *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Үе тэнгийн дээрэлхэлт, дарамт шахалт, болсон явдлын талаар дэлгэрэнгүй бичнэ үү (Хэзээ, хаана, юу болсон тухай)..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 ring-2 ring-blue-400/40"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>{isAnonymous ? '🔒 Нэрээ нууцлан дээрэлхэлтийн мэдээллийг илгээх' : 'Үе тэнгийн дээрэлхэлтийн мэдээллийг нууцлан илгээх'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-slate-500">
                    🔒 Мэдээлэл өгсөн сурагчийн хувийн мэдээллийг чандлан нууцална.
                  </p>
                </div>
              ) : (
                <>
                  {/* Anonymous option for Risk tab as requested */}
                  {feedbackType === 'risk' && (
                    <div
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 mb-3.5 ${
                        isAnonymous
                          ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-400/40'
                          : 'bg-white hover:bg-rose-50/60 border-rose-200/90 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isAnonymous ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                        }`}>
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black">Нэрээ нууцлах (Эрсдэл мэдээлэгчийн нэрийг нууцлах)</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                              isAnonymous ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isAnonymous ? 'Идэвхжсэн' : 'Сонгох'}
                            </span>
                          </div>
                          <p className={`text-[11px] mt-0.5 leading-tight ${
                            isAnonymous ? 'text-rose-100' : 'text-slate-500'
                          }`}>
                            {isAnonymous
                              ? 'Таны нэр болон холбогдох утас нууцлагдана.'
                              : 'Нэрээ илгээхээс эмээж байвал энд чагталж нэрээ нууцална уу.'}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        id="anonymous-risk-toggle"
                        checked={isAnonymous}
                        onChange={(e) => {
                          e.stopPropagation();
                          setIsAnonymous(e.target.checked);
                        }}
                        className="w-5 h-5 text-rose-600 rounded-md border-slate-300 focus:ring-rose-500 cursor-pointer shrink-0"
                      />
                    </div>
                  )}

                  {/* ===================== COMMON SENDER INFO (NAME, PHONE, EMAIL) ===================== */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isAnonymous && feedbackType === 'risk' ? 'Мэдээлэгчийн нэр (Нууцалсан)' : 'Таны нэр *'}
                      </label>
                      {isAnonymous && feedbackType === 'risk' ? (
                        <div className="w-full px-3 py-2 text-xs sm:text-sm bg-rose-50/70 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-900 font-bold">
                          <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>🔒 Нэрээ нууцалсан иргэн / сурагч</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="Нэрээ оруулна уу"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isAnonymous && feedbackType === 'risk' ? 'Утасны дугаар (Сонголтоор)' : 'Утасны дугаар *'}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="tel"
                          required={!(isAnonymous && feedbackType === 'risk')}
                          placeholder={isAnonymous && feedbackType === 'risk' ? 'Сонголтоор: 9911-XXXX' : '9911-XXXX'}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Имэйл хаяг (сонголтоор)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {feedbackType !== 'risk' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Гарчиг / Сэдэв
                        </label>
                        <input
                          type="text"
                          placeholder="Жишээ: Сургалтын талаар"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Description / Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {feedbackType === 'risk' ? 'Эрсдэлийн дэлгэрэнгүй тайлбар *' : 'Санал хүсэлтийн дэлгэрэнгүй агуулга *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={
                        feedbackType === 'risk'
                          ? 'Эрсдэлийн талаарх дэлгэрэнгүй тайлбар, нөхцөл байдал, зөвлөмжөө энд тодорхой бичнэ үү...'
                          : 'Сургуулийн үйл ажиллагаа, сургалт, орчин нөхцөлтэй холбоотой санал, асуултаа энд бичнэ үү...'
                      }
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                        feedbackType === 'risk'
                          ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 ring-2 ring-rose-400/40'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/30 ring-2 ring-amber-400/30 border border-amber-300'
                      }`}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : feedbackType === 'risk' ? (
                        <>
                          <ShieldAlert className="w-4 h-4" />
                          <span>{isAnonymous ? '🔒 Эрсдлийн үнэлгээг нууцлан илгээх' : 'Эрсдлийн үнэлгээг ажилтанд илгээх'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Санал хүсэлт илгээх</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-slate-400">
                    {feedbackType === 'risk'
                      ? 'Таны илгээсэн эрсдлийн мэдээлэл хариуцсан ажилтны Gmail болон сургуулийн системд нэн даруй бүртгэгдэнэ.'
                      : 'Таны илгээсэн мэдээлэл сургуулийн удирдлагын системд шууд бүртгэгдэнэ.'}
                  </p>
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
