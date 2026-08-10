import type { RefObject } from "react";
import { IconUpload } from "@tabler/icons-react";

interface ReceiptUploadProps {
  imageUrl: string | null;
  imageName: string | null;
  error: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ReceiptUpload({ imageUrl, imageName, error, fileInputRef, onUploadClick, onFileChange }: ReceiptUploadProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600">رسید پرداخت</label>
      <div
        onClick={onUploadClick}
        className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 ${
          imageName
            ? "border-green-200 bg-green-50"
            : error
            ? "border-rose-200 bg-rose-50/30"
            : "border-blue-100 bg-blue-50/30 hover:border-blue-300 hover:bg-blue-50"
        }`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="رسید" className="w-12 h-12 object-cover rounded-lg border border-green-200 flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <IconUpload size={20} className="text-blue-800" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">{imageName ?? "آپلود رسید پرداخت"}</p>
          <p className="text-xs text-gray-400 mt-0.5">{imageName ? "برای تغییر کلیک کنید" : "PNG, JPG تا ۵ مگابایت"}</p>
        </div>
      </div>

      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={onFileChange} />

      {error && <p className="text-rose-500 text-xs">{error}</p>}
    </div>
  );
}