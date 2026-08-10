import { useEffect, useRef, useState } from "react";
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";

interface CommentCardMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function CommentCardMenu({ onEdit, onDelete }: CommentCardMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative flex-shrink-0" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((p) => !p)}
        className="p-1 sm:p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <IconDotsVertical size={16} className="text-gray-400 sm:w-[17px] sm:h-[17px]" />
      </button>
      {menuOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] bg-white border border-blue-100 rounded-xl shadow-lg z-20 py-1 min-w-[110px] sm:min-w-[120px]">
          <button
            onClick={() => { onEdit(); setMenuOpen(false); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs sm:text-sm text-blue-800 hover:bg-blue-50 transition-colors"
          >
            <IconPencil size={14} /><span>ویرایش</span>
          </button>
          <button
            onClick={() => { onDelete(); setMenuOpen(false); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <IconTrash size={14} /><span>حذف</span>
          </button>
        </div>
      )}
    </div>
  );
}