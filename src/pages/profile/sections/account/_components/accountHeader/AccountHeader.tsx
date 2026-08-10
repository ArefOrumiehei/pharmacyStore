import { IconPencil, IconX, IconCheck, IconLoader2 } from "@tabler/icons-react";

interface AccountHeaderProps {
  isEditing: boolean;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function AccountHeader({ isEditing, saving, onEdit, onCancel, onSave }: AccountHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-blue-800">اطلاعات حساب کاربری</h1>
        <p className="text-sm text-gray-400 mt-0.5">اطلاعات شخصی خود را مدیریت کنید</p>
      </div>

      {!isEditing ? (
        <button
          onClick={onEdit}
          className="self-start sm:self-auto flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
        >
          <IconPencil size={15} />
          ویرایش
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <IconX size={15} />
            انصراف
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-4 py-2 rounded-xl transition-all duration-200"
          >
            {saving ? <IconLoader2 size={15} className="animate-spin" /> : <IconCheck size={15} />}
            ذخیره
          </button>
        </div>
      )}
    </div>
  );
}