import { useRef, useState } from "react";
import { IconUser, IconCamera } from "@tabler/icons-react";
import { IMAGE_BASE } from "@/apis/apiInstance";

interface AvatarPickerProps {
  userFullName?: string;
  userPhoneNumber?: string;
  currentUrl?: string;
  disabled: boolean;
  onChange: (file: File) => void;
}

export function AvatarPicker({ userFullName, userPhoneNumber, currentUrl, disabled, onChange }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const src = preview ?? (currentUrl ? `${IMAGE_BASE}/${currentUrl}` : null);

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-blue-100 overflow-hidden bg-blue-50 flex items-center justify-center">
          {src ? (
            <img src={src} alt="پروفایل" className="w-full h-full object-cover" />
          ) : (
            <IconUser size={28} className="text-blue-200 sm:w-8 sm:h-8" />
          )}
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-xl bg-blue-800 hover:bg-blue-700 border-2 border-white flex items-center justify-center shadow-sm transition-colors"
          >
            <IconCamera size={13} className="text-white" />
          </button>
        )}
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleFile} />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm font-semibold text-gray-700 truncate">{userFullName || userPhoneNumber}</p>
        {!disabled && <p className="text-xs text-gray-400">JPG یا PNG، حداکثر ۱ مگابایت</p>}
      </div>
    </div>
  );
}