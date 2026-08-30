import { useState } from "react";
import { Check, Pencil, Trash2, X, Loader2 } from "lucide-react";
import type { IAddress } from "@/types/account/account";

interface AddressCardProps {
    address: IAddress;
    selected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    deleting: boolean;
}

export function AddressCard({
    address,
    selected,
    onSelect,
    onEdit,
    onDelete,
    deleting,
}: AddressCardProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <div
            className={`w-full rounded-xl border transition-all duration-200 overflow-hidden ${
                selected
                    ? "border-blue-800 bg-blue-50 shadow-sm shadow-blue-100"
                    : "border-blue-100 bg-white hover:border-blue-200"
            }`}
        >
            <button
                type="button"
                onClick={onSelect}
                className="w-full text-right flex items-start gap-3 p-3 sm:p-4"
            >
                <div
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        selected
                            ? "border-blue-800 bg-blue-800"
                            : "border-gray-300"
                    }`}
                >
                    {selected && (
                        <Check
                            size={11}
                            className="text-white"
                            strokeWidth={3}
                        />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">
                        {address.receiverFullName}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5 line-clamp-2">
                        {address.receiverAddress}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        <span className="text-xs text-gray-400">
                            {address.receiverMobile}
                        </span>
                        <span className="text-xs text-gray-300 hidden sm:inline">
                            •
                        </span>
                        <span className="text-xs text-gray-400">
                            کد پستی: {address.receiverZipCode}
                        </span>
                    </div>
                </div>
            </button>

            <div className="flex items-center justify-between max-[270px]:flex-col flex-row-reverse max-[400px]:flex-wrap gap-2 px-3 sm:px-4 pb-3">
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex items-center justify-center gap-1.5 max-[270px]:w-full text-xs font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg transition-all duration-150"
                >
                    <Pencil size={12} />
                    ویرایش
                </button>

                {confirmDelete ? (
                    <div className="flex items-center w-full gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">حذف شود؟</span>
                        <div className="flex items-center gap-1 flex-row-reverse">
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete();
                                    setConfirmDelete(false);
                                }}
                                disabled={deleting}
                                className="flex items-center gap-1 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-all duration-150"
                            >
                                {deleting ? (
                                    <Loader2
                                        size={11}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Check size={11} />
                                )}
                                بله
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmDelete(false)}
                                className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all duration-150"
                            >
                                <X size={11} />
                                خیر
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="flex items-center justify-center gap-1.5 max-[270px]:w-full text-xs font-medium text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3 py-1.5 rounded-lg transition-all duration-150"
                    >
                        <Trash2 size={12} />
                        حذف
                    </button>
                )}
            </div>
        </div>
    );
}
