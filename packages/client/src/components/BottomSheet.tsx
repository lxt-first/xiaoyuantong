import { useState, useCallback } from "react";
import type { FC, ReactNode } from "react";

interface SheetOption {
  key: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
}

interface BottomSheetProps {
  options: SheetOption[];
  onSelect: (key: string) => void;
  onClose: () => void;
}

export const BottomSheet: FC<BottomSheetProps> = ({ options, onSelect, onClose }) => {
  return (
    <div className="overlay show" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">选择发布类型</div>
        {options.map((opt) => (
          <div
            key={opt.key}
            className="sheet-option"
            onClick={() => onSelect(opt.key)}
          >
            <div
              className="sheet-option-icon"
              style={{ background: opt.bg, color: opt.color }}
            >
              {opt.icon}
            </div>
            <div className="sheet-option-text">{opt.label}</div>
            <div className="sheet-option-arrow">›</div>
          </div>
        ))}
        <div className="sheet-cancel" onClick={onClose}>
          取消
        </div>
      </div>
    </div>
  );
};

// Toast
let toastTimer: ReturnType<typeof setTimeout> | null = null;

export function showToast(msg: string) {
  const el = document.getElementById("global-toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

export const ToastContainer: FC = () => (
  <div className="toast" id="global-toast" />
);
