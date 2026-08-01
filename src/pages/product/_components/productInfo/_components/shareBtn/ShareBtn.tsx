import { useEffect, useRef, useState } from "react";
import { IconShare2, IconBrandWhatsapp, IconBrandTelegram, IconBrandX, IconLink, IconCheck, IconShare } from "@tabler/icons-react";
import { useShare } from "@/hooks/useShare";
import type { ShareButtonProps } from "@/pages/product/types/productPageTypes";



export default function ShareButton({ data, className, btnStyle }: ShareButtonProps) {
  const { isNativeShareSupported, share, shareTo, copied } = useShare();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = async () => {
    if (isNativeShareSupported) {
      await share(data);
    } else {
      setMenuOpen((p) => !p);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {btnStyle == "icon&text" ? 
        <button
          onClick={handleClick}
          className={
            className ??
            "flex items-center gap-1.5 h-7 sm:h-9 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg sm:rounded-xl px-3 py-2 transition-all duration-200"
          }
        >
          <IconShare2 size={16} />
          اشتراک‌گذاری
        </button>
        :
          <button onClick={handleClick} title="اشتراک گذاری" className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all active:scale-90">
            <IconShare size={16} className="text-gray-400" />
          </button>
      }

      {/* Desktop fallback menu */}
      {menuOpen && !isNativeShareSupported && (
        <div className="absolute left-0 top-[calc(100%+6px)] bg-white border border-blue-100 rounded-2xl shadow-lg z-30 py-1.5 min-w-[180px]" dir="rtl">
          <ShareMenuItem
            icon={<IconBrandWhatsapp size={16} className="text-green-600" />}
            label="واتساپ"
            onClick={() => { shareTo("whatsapp", data); setMenuOpen(false); }}
          />
          <ShareMenuItem
            icon={<IconBrandTelegram size={16} className="text-blue-500" />}
            label="تلگرام"
            onClick={() => { shareTo("telegram", data); setMenuOpen(false); }}
          />
          <ShareMenuItem
            icon={<IconBrandX size={16} className="text-gray-800" />}
            label="ایکس (توییتر)"
            onClick={() => { shareTo("twitter", data); setMenuOpen(false); }}
          />
          <div className="h-px bg-blue-50 my-1" />
          <ShareMenuItem
            icon={copied ? <IconCheck size={16} className="text-emerald-600" /> : <IconLink size={16} className="text-gray-500" />}
            label={copied ? "کپی شد!" : "کپی لینک"}
            onClick={() => shareTo("copy", data)}
          />
        </div>
      )}
    </div>
  );
}

function ShareMenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}