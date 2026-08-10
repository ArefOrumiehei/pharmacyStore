import { useState } from "react";
import { IconHome, IconPencil, IconTrash } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { IAddress } from "@/services/accountServices/accountServices";
import AddressDeleteConfirm from "../addressDeleteConfirm/AddressDeleteConfirm";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  deleting,
}: {
  address: IAddress;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="w-full max-w-full bg-white rounded-xl sm:rounded-2xl border border-blue-100 p-3.5 sm:p-5 flex flex-col justify-between gap-2.5 sm:gap-3 hover:shadow-sm transition-all duration-200 overflow-hidden">

      <div className="w-full flex flex-col items-start">
        {/* Header */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <IconHome size={13} className="text-blue-800 sm:w-[15px] sm:h-[15px]" />
          </div>
          <span className="font-semibold text-xs sm:text-sm text-gray-700 line-clamp-1 min-w-0">{address.receiverFullName}</span>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1 text-[10px] sm:text-xs text-gray-500 min-w-0">
          <p className="leading-5 break-words line-clamp-2">{toPersianDigits(address.receiverAddress)}</p>
          <p className="truncate">کد پستی: {toPersianDigits(address.receiverZipCode)}</p>
          <p className="truncate">موبایل: {toPersianDigits(address.receiverMobile)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center flex-row-reverse gap-2 pt-1 border-t border-blue-50 min-w-0">
        <button
          onClick={onEdit}
          className="flex-1 min-w-0 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-medium text-blue-800 hover:bg-blue-50 border border-blue-100 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200 whitespace-nowrap"
        >
          <IconPencil size={12} className="sm:w-[13px] sm:h-[13px] flex-shrink-0" /> ویرایش
        </button>

        {confirmDelete ? (
          <AddressDeleteConfirm
            deleting={deleting}
            onConfirm={() => { onDelete(); setConfirmDelete(false); }}
            onCancel={() => setConfirmDelete(false)}
          />
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-100 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0"
          >
            <IconTrash size={12} className="sm:w-[13px] sm:h-[13px]" />
          </button>
        )}
      </div>
    </div>
  );
}