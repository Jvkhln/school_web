import React from 'react';
import { AlertTriangle, X, Check, FileSpreadsheet } from 'lucide-react';

interface WorkspaceConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  affectedItemsCount?: number;
  affectedItemsDescription?: string[];
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const WorkspaceConfirmModal: React.FC<WorkspaceConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  affectedItemsCount,
  affectedItemsDescription,
  confirmText = 'Зөвшөөрөх & Үргэлжлүүлэх',
  cancelText = 'Цуцлах',
  isDestructive = false,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pt-1">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-rose-100 text-rose-600'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isDestructive ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-snug">{title}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        {affectedItemsDescription && affectedItemsDescription.length > 0 && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-1.5">
            <div className="font-semibold text-slate-700 flex items-center justify-between">
              <span>Нөлөөлөх хуудас ба өгөгдөл:</span>
              {typeof affectedItemsCount === 'number' && (
                <span className="bg-slate-200 text-slate-800 font-mono px-1.5 py-0.5 rounded text-[11px]">
                  {affectedItemsCount} зүйл
                </span>
              )}
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
              {affectedItemsDescription.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
