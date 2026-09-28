import React, { useState, useEffect } from 'react';
import { uploadDataUrlToDrive, formatGoogleDriveImageUrl, isGoogleDriveUrl } from '../../lib/googleDrive';
import { getAccessToken } from '../../lib/firebase';
import {
  Image,
  Check,
  Upload,
  Link as LinkIcon,
  Trash2,
  Plus,
  AlertCircle,
  Eye,
  Video,
  Music,
  FileVideo,
  Volume2,
  X
} from 'lucide-react';

export const GOOGLE_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1cEUAmQs2FBM4ynFFENP-RV9jheOWBcN8?usp=drive_link';

export interface GoogleDrivePresetImage {
  id: string;
  name: string;
  url: string;
  driveViewUrl: string;
  directDownloadUrl: string;
  title: string;
  aspectRatio: string;
}

export const GOOGLE_DRIVE_DEFAULT_IMAGES: GoogleDrivePresetImage[] = [
  {
    id: '1YMmWU505jadHMoSJJtMQO5OKdiP4ubt0',
    name: 'z1',
    url: '/defaults/z1.jpg',
    driveViewUrl: 'https://drive.google.com/file/d/1YMmWU505jadHMoSJJtMQO5OKdiP4ubt0/view?usp=drive_link',
    directDownloadUrl: 'https://lh3.googleusercontent.com/d/1YMmWU505jadHMoSJJtMQO5OKdiP4ubt0',
    title: 'Google Drive z1 (Сургуулийн үндсэн фото)',
    aspectRatio: '16:9'
  },
  {
    id: '1Ol9pDiC2wL00U4HQzzD55w4vXGrHrOro',
    name: 'z2',
    url: '/defaults/z2.jpg',
    driveViewUrl: 'https://drive.google.com/file/d/1Ol9pDiC2wL00U4HQzzD55w4vXGrHrOro/view?usp=drive_link',
    directDownloadUrl: 'https://lh3.googleusercontent.com/d/1Ol9pDiC2wL00U4HQzzD55w4vXGrHrOro',
    title: 'Google Drive z2 (Багш сурагчид, сургалт)',
    aspectRatio: '3:2'
  },
  {
    id: '1Q-3mW7XFOO2Throh4kb4B5Td4Y7WFFCn',
    name: 'z3',
    url: '/defaults/z3.jpg',
    driveViewUrl: 'https://drive.google.com/file/d/1Q-3mW7XFOO2Throh4kb4B5Td4Y7WFFCn/view?usp=drive_link',
    directDownloadUrl: 'https://lh3.googleusercontent.com/d/1Q-3mW7XFOO2Throh4kb4B5Td4Y7WFFCn',
    title: 'Google Drive z3 (Сургуулийн өргөн баннер)',
    aspectRatio: '16:6'
  },
  {
    id: '1-7tLqDKJM4gUN1p1XWfnloa4oMNcEPrB',
    name: 'z4',
    url: '/defaults/z4.jpg',
    driveViewUrl: 'https://drive.google.com/file/d/1-7tLqDKJM4gUN1p1XWfnloa4oMNcEPrB/view?usp=drive_link',
    directDownloadUrl: 'https://lh3.googleusercontent.com/d/1-7tLqDKJM4gUN1p1XWfnloa4oMNcEPrB',
    title: 'Google Drive z4 (Арга хэмжээ, үйл ажиллагаа)',
    aspectRatio: '16:9'
  }
];

export const FALLBACK_IMAGE_URL = '/defaults/z1.jpg';

export const PRESET_SCHOOL_IMAGES = [
  {
    url: '/defaults/z1.jpg',
    title: '★ Google Drive z1 (Сургуулийн үндсэн фото)'
  },
  {
    url: '/defaults/z2.jpg',
    title: '★ Google Drive z2 (Багш сурагчид, сургалт)'
  },
  {
    url: '/defaults/z3.jpg',
    title: '★ Google Drive z3 (Сургуулийн өргөн баннер)'
  },
  {
    url: '/defaults/z4.jpg',
    title: '★ Google Drive z4 (Арга хэмжээ, үйл ажиллагаа)'
  },
  {
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
    title: 'Сурагчид, кампус'
  },
  {
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=900&auto=format&fit=crop',
    title: 'Анги танхим, багш'
  },
  {
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=900&auto=format&fit=crop',
    title: 'Робот техник, технологи'
  },
  {
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=900&auto=format&fit=crop',
    title: 'Бага ангийн сурагч'
  },
  {
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=900&auto=format&fit=crop',
    title: 'Лаборатори, туршилт'
  },
  {
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=900&auto=format&fit=crop',
    title: 'Урлаг, хөгжим'
  },
  {
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=900&auto=format&fit=crop',
    title: 'Номын сан'
  },
  {
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=900&auto=format&fit=crop',
    title: 'Эцэг эхийн өдөрлөг'
  },
  {
    url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=900&auto=format&fit=crop',
    title: 'Медаль, цом, шагнал'
  },
  {
    url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=900&auto=format&fit=crop',
    title: 'Төгсөлтийн баяр, амжилт'
  },
  {
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=900&auto=format&fit=crop',
    title: 'Спорт, хөнгөн атлетик'
  },
  {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop',
    title: 'Мэдээлэл технологи, IT'
  }
];

export async function compressImageFile(file: File, maxWidth = 960, maxHeight = 640, quality = 0.70): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Generates small, fast dataUrl (~40KB-70KB)
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string || '');
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

interface ImagePresetPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  recommendedAspect?: string;
}

export const ImagePresetPicker: React.FC<ImagePresetPickerProps> = ({ value, onChange, label, recommendedAspect }) => {
  const [customInput, setCustomInput] = useState(formatGoogleDriveImageUrl(value) || value || '');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setCustomInput(formatGoogleDriveImageUrl(value) || value || '');
  }, [value]);

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatGoogleDriveImageUrl(raw);
    setCustomInput(formatted);
    onChange(formatted);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const compressed = await compressImageFile(file);
        if (compressed) {
          // If Google account is connected, automatically upload to Google Drive for clean link
          try {
            const token = await getAccessToken();
            if (token) {
              const driveUrl = await uploadDataUrlToDrive(token, compressed, file.name || 'image.jpg');
              if (driveUrl) {
                setCustomInput(driveUrl);
                onChange(driveUrl);
                return;
              }
            }
          } catch (e) {
            console.warn('Drive upload fallback to local image:', e);
          }

          setCustomInput(compressed);
          onChange(compressed);
        }
      } catch (err) {
        console.error('File compression error', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-2.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">{label}</label>
          {recommendedAspect && (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {recommendedAspect}
            </span>
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="url"
            placeholder="Google Drive линк эсвэл зургийн URL оруулах..."
            value={customInput}
            onChange={handleCustomChange}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0">
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>{isUploading ? 'Боловсруулж байна...' : 'Файл хуулах'}</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {isGoogleDriveUrl(customInput) && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Google Drive шууд унших зураг холбогдсон</span>
        </div>
      )}

      {/* Preset thumbnails */}
      <div>
        <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
          Санал болгох зургийн сан:
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-1.5">
          {PRESET_SCHOOL_IMAGES.map((img, i) => {
            const isSelected = value === img.url;
            return (
              <button
                type="button"
                key={i}
                onClick={() => {
                  setCustomInput(img.url);
                  onChange(img.url);
                }}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-400/50 scale-95'
                    : 'border-transparent hover:border-slate-300 opacity-75 hover:opacity-100'
                }`}
                title={img.title}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-amber-600/40 flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview thumbnail */}
      {value && (
        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
          <img
            src={value}
            alt="Preview"
            className="w-16 h-12 object-cover rounded-lg shrink-0 border border-slate-200"
            referrerPolicy="no-referrer"
          />
          <div className="text-xs text-slate-600 truncate flex-1 font-mono">
            {value.startsWith('data:') ? 'Орон нутгийн шахсан зураг (Баазад хадгалагдана)' : value}
          </div>
        </div>
      )}
    </div>
  );
};

interface MultiImagePresetPickerProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  defaultImageUrl?: string;
}

export const MultiImagePresetPicker: React.FC<MultiImagePresetPickerProps> = ({
  images = [],
  onChange,
  maxImages = 5,
  defaultImageUrl
}) => {
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  // Ensure array has elements or valid format
  const currentImages = Array.isArray(images) && images.length > 0 ? images.slice(0, maxImages) : [''];

  const handleUpdateImage = (index: number, url: string) => {
    const updated = [...currentImages];
    const formatted = formatGoogleDriveImageUrl(url);
    updated[index] = formatted;
    onChange(updated);
  };

  const handleAddSlot = () => {
    if (currentImages.length < maxImages) {
      const nextIndex = currentImages.length;
      const nextImg = PRESET_SCHOOL_IMAGES[nextIndex % PRESET_SCHOOL_IMAGES.length].url;
      const updated = [...currentImages, nextImg];
      onChange(updated);
      setActiveSlot(nextIndex);
    }
  };

  const handleRemoveSlot = (index: number) => {
    if (currentImages.length <= 1) {
      onChange(['']);
    } else {
      const updated = currentImages.filter((_, i) => i !== index);
      onChange(updated);
      if (activeSlot >= updated.length) {
        setActiveSlot(updated.length - 1);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const compressed = await compressImageFile(file);
        if (compressed) {
          try {
            const token = await getAccessToken();
            if (token) {
              const driveUrl = await uploadDataUrlToDrive(token, compressed, file.name || 'image.jpg');
              if (driveUrl) {
                handleUpdateImage(activeSlot, driveUrl);
                return;
              }
            }
          } catch (e) {
            console.warn('Drive upload fallback to local image:', e);
          }

          handleUpdateImage(activeSlot, compressed);
        }
      } catch (err) {
        console.error('File compression error', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const activeImageUrl = currentImages[activeSlot] || '';

  return (
    <div className="space-y-4 p-4 bg-slate-50/90 rounded-2xl border border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Image className="w-4 h-4 text-amber-600" />
            <span>Нийтлэлийн зургийн цомог (5 хүртэлх зураг оруулах)</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            1-р зураг нь үндсэн нүүр зураг (Header Cover) болох ба 2, 3, 4, 5-р зургууд нийтлэлийн цомогт дэлгэгдэнэ.
          </p>
        </div>

        {currentImages.length < maxImages && (
          <button
            type="button"
            onClick={handleAddSlot}
            className="inline-flex items-center gap-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Зураг нэмэх ({currentImages.length}/{maxImages})</span>
          </button>
        )}
      </div>

      {/* Slots Tabs Grid (Up to 5 slots) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {currentImages.map((imgUrl, slotIdx) => {
          const isActive = activeSlot === slotIdx;
          const isHeader = slotIdx === 0;

          return (
            <div
              key={slotIdx}
              onClick={() => setActiveSlot(slotIdx)}
              className={`relative p-2 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-1.5 ${
                isActive
                  ? 'bg-white border-amber-500 shadow-xs ring-2 ring-amber-400/30'
                  : 'bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              {/* Thumbnail */}
              <div className="w-full aspect-4/3 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={`Зураг ${slotIdx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE_URL;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                    Хоосон
                  </div>
                )}
                <div className="absolute top-1 left-1 bg-slate-900/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                  #{slotIdx + 1}
                </div>
                {currentImages.length > 1 && !isHeader && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSlot(slotIdx);
                    }}
                    className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-red-500 hover:text-white text-slate-600 rounded-md shadow-xs transition-colors"
                    title="Устгах"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Slot Description */}
              <div className="min-w-0">
                <span className={`text-[11px] font-bold truncate block ${isHeader ? 'text-amber-800' : 'text-slate-700'}`}>
                  {isHeader ? '1. Толгой зураг' : `${slotIdx + 1}. Нэмэлт зураг`}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {imgUrl ? (imgUrl.startsWith('data:') ? 'Файл хуулсан' : 'Линктэй') : 'Сонгоогүй'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Slot Editor Box */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>Сонгосон: {activeSlot === 0 ? '1-р Үндсэн толгой зураг' : `${activeSlot + 1}-р Нэмэлт зураг`}</span>
          <span className="text-[11px] text-slate-400 font-normal">URL эсвэл зураг хуулах</span>
        </div>

        {/* Input & Upload */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="url"
              placeholder="Google Drive линк эсвэл зургийн URL оруулах..."
              value={activeImageUrl}
              onChange={(e) => handleUpdateImage(activeSlot, e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0">
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>{isUploading ? 'Хуулж байна...' : 'Файл хуулах'}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {isGoogleDriveUrl(activeImageUrl) && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Google Drive шууд унших зураг холбогдсон</span>
          </div>
        )}

        {/* Presets Grid */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500">
              Бэлэн зургийн сангаас сонгох:
            </span>
            {defaultImageUrl && (
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                ★ 1 дэх нь сургуулийн анхдагч зураг
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
            {defaultImageUrl && (
              <button
                type="button"
                onClick={() => handleUpdateImage(activeSlot, defaultImageUrl)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group cursor-pointer ${
                  activeImageUrl === defaultImageUrl
                    ? 'border-amber-500 ring-2 ring-amber-400/50 scale-95'
                    : 'border-amber-300 hover:border-amber-500'
                }`}
                title="Сургуулийн анхдагч зураг (Сургуулийн тохиргоонд хадгалсан)"
              >
                <img
                  src={defaultImageUrl}
                  alt="Default"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE_URL;
                  }}
                />
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[8px] font-bold px-1 rounded-bl">
                  Үндсэн
                </div>
                {activeImageUrl === defaultImageUrl && (
                  <div className="absolute inset-0 bg-amber-600/40 flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            )}
            {PRESET_SCHOOL_IMAGES.map((img, i) => {
              const isSelected = activeImageUrl === img.url;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleUpdateImage(activeSlot, img.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-400/50 scale-95'
                      : 'border-transparent hover:border-slate-300 opacity-75 hover:opacity-100'
                  }`}
                  title={img.title}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-600/40 flex items-center justify-center text-white">
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
  );
};

interface MediaAttachmentsManagerProps {
  videoUrl?: string;
  audioUrl?: string;
  onVideoChange: (url: string) => void;
  onAudioChange: (url: string) => void;
}

export const MediaAttachmentsManager: React.FC<MediaAttachmentsManagerProps> = ({
  videoUrl = '',
  audioUrl = '',
  onVideoChange,
  onAudioChange
}) => {
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoError(null);
    if (file.size > 30 * 1024 * 1024) {
      setVideoError('Файлын хэмжээ 30MB-аас их байна. YouTube эсвэл шууд видео URL линк ашиглахыг зөвлөж байна.');
    }

    setIsVideoUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        onVideoChange(res);
      }
      setIsVideoUploading(false);
    };
    reader.onerror = () => {
      setVideoError('Видео файлыг уншихад алдаа гарлаа.');
      setIsVideoUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioError(null);
    if (file.size > 20 * 1024 * 1024) {
      setAudioError('Аудио файлын хэмжээ 20MB-аас их байна.');
    }

    setIsAudioUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        onAudioChange(res);
      }
      setIsAudioUploading(false);
    };
    reader.onerror = () => {
      setAudioError('Аудио файлыг уншихад алдаа гарлаа.');
      setIsAudioUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50/90 rounded-2xl border border-slate-200">
      <div className="border-b border-slate-200 pb-2">
        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <FileVideo className="w-4 h-4 text-amber-600" />
          <span>Мултимедиа хавсралт (MP4 Бичлэг & MP3 Аудио)</span>
        </h4>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Нийтлэлдээ видео бичлэг (.mp4) болон аудио дуу/тайлбар (.mp3) оруулах боломжтой.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. MP4 Video Field */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-blue-600" />
              <span>MP4 Бичлэг оруулах</span>
            </label>
            {videoUrl && (
              <button
                type="button"
                onClick={() => onVideoChange('')}
                className="text-[10px] text-red-600 hover:text-red-700 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Бичлэг арилгах</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="MP4 видео URL эсвэл файл хуулах..."
                value={videoUrl.startsWith('data:') ? 'Орон нутгийн MP4 файл хуулагдсан' : videoUrl}
                onChange={(e) => onVideoChange(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>{isVideoUploading ? 'Хуулж байна...' : '.MP4 хуулах'}</span>
              <input type="file" accept="video/mp4,video/*" onChange={handleVideoFile} className="hidden" />
            </label>
          </div>

          {videoError && (
            <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>{videoError}</span>
            </div>
          )}

          {/* Video Preview */}
          {videoUrl && (
            <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-black/90 aspect-video relative">
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-contain"
              >
                Таны хөтөч видеог дэмжихгүй байна.
              </video>
            </div>
          )}
        </div>

        {/* 2. MP3 Audio Field */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-emerald-600" />
              <span>MP3 Аудио / Дуу оруулах</span>
            </label>
            {audioUrl && (
              <button
                type="button"
                onClick={() => onAudioChange('')}
                className="text-[10px] text-red-600 hover:text-red-700 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Аудио арилгах</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="MP3 аудио URL эсвэл файл хуулах..."
                value={audioUrl.startsWith('data:') ? 'Орон нутгийн MP3 файл хуулагдсан' : audioUrl}
                onChange={(e) => onAudioChange(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <label className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>{isAudioUploading ? 'Хуулж байна...' : '.MP3 хуулах'}</span>
              <input type="file" accept="audio/mp3,audio/*" onChange={handleAudioFile} className="hidden" />
            </label>
          </div>

          {audioError && (
            <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>{audioError}</span>
            </div>
          )}

          {/* Audio Preview */}
          {audioUrl && (
            <div className="mt-2 p-2.5 rounded-xl border border-slate-200 bg-slate-100/90 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Аудио тоглуулагч</span>
              </div>
              <audio src={audioUrl} controls className="w-full h-8" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
