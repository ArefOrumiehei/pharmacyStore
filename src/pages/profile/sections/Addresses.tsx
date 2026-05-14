import { useEffect, useState } from "react";
import {
  IconMapPin, IconPlus, IconPencil, IconTrash,
  IconCheck, IconX, IconHome, IconBuildingStore, IconLoader2,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/store/useAccountStore";
import type { IAddress, IAddressFormParams, IEditAddressFormParams } from "@/services/accountServices/accountServices";

// ─── Shared styles ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  );
}

const inputClass = (hasError?: boolean) =>
  `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
    hasError ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
  }`;

// ─── Address form ─────────────────────────────────────────────────────────────

function AddressForm({
  defaults,
  onSave,
  onCancel,
  saving,
}: {
  defaults?: IAddress;
  onSave:    (v: IAddressFormParams) => Promise<void>;
  onCancel:  () => void;
  saving:    boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<IAddressFormParams>({
    defaultValues: defaults ? {
      receiverFullName: defaults.receiverFullName,
      receiverMobile:   defaults.receiverMobile,
      receiverAddress:  defaults.receiverAddress,
      receiverZipCode:  defaults.receiverZipCode,
    } : {},
  });

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-4">
      <SectionTitle>{defaults ? "ویرایش آدرس" : "آدرس جدید"}</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">نام گیرنده</label>
          <input
            {...register("receiverFullName", { required: "نام الزامی است" })}
            placeholder="نام کامل گیرنده"
            className={inputClass(!!errors.receiverFullName)}
          />
          {errors.receiverFullName && <p className="text-rose-500 text-xs">{errors.receiverFullName.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">شماره موبایل</label>
          <input
            {...register("receiverMobile", { required: "موبایل الزامی است" })}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            className={inputClass(!!errors.receiverMobile)}
          />
          {errors.receiverMobile && <p className="text-rose-500 text-xs">{errors.receiverMobile.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-gray-600">آدرس کامل</label>
          <input
            {...register("receiverAddress", { required: "آدرس الزامی است" })}
            placeholder="استان، شهر، خیابان، پلاک و واحد"
            className={inputClass(!!errors.receiverAddress)}
          />
          {errors.receiverAddress && <p className="text-rose-500 text-xs">{errors.receiverAddress.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">کد پستی</label>
          <input
            {...register("receiverZipCode", { required: "کد پستی الزامی است" })}
            placeholder="۱۲۳۴۵۶۷۸۹۰"
            className={inputClass(!!errors.receiverZipCode)}
          />
          {errors.receiverZipCode && <p className="text-rose-500 text-xs">{errors.receiverZipCode.message}</p>}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 px-4 py-2 rounded-xl transition-all duration-200"
        >
          <IconX size={15} /> انصراف
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSave)}
          disabled={saving}
          className="flex items-center gap-1.5 text-sm text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-4 py-2 rounded-xl transition-all duration-200"
        >
          {saving ? <IconLoader2 size={15} className="animate-spin" /> : <IconCheck size={15} />}
          ذخیره آدرس
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function AddressSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white border border-blue-50 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 animate-pulse" />
              <div className="h-4 w-16 bg-blue-50 animate-pulse rounded" />
            </div>
            <div className="h-5 w-16 bg-blue-50 animate-pulse rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
            <div className="h-3 w-24 bg-blue-50 animate-pulse rounded" />
            <div className="h-3 w-32 bg-blue-50 animate-pulse rounded" />
          </div>
          <div className="flex gap-2 pt-1 border-t border-blue-50">
            <div className="flex-1 h-8 bg-blue-50 animate-pulse rounded-xl" />
            <div className="w-10 h-8 bg-blue-50 animate-pulse rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Address card ─────────────────────────────────────────────────────────────

function AddressCard({
  address,
  onEdit,
  onDelete,
  deleting,
}: {
  address:  IAddress;
  onEdit:   () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isWork =
    address.receiverAddress.includes("کار") ||
    address.receiverAddress.includes("محل");

  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-5 flex flex-col gap-3 hover:shadow-sm transition-all duration-200">

      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          {isWork
            ? <IconBuildingStore size={15} className="text-blue-800" />
            : <IconHome size={15} className="text-blue-800" />
          }
        </div>
        <span className="font-semibold text-sm text-gray-700">{address.receiverFullName}</span>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1 text-xs text-gray-500">
        <p className="leading-5">{address.receiverAddress}</p>
        <p>کد پستی: {address.receiverZipCode}</p>
        <p>موبایل: {address.receiverMobile}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-blue-50">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-blue-800 hover:bg-blue-50 border border-blue-100 py-2 rounded-xl transition-all duration-200"
        >
          <IconPencil size={13} /> ویرایش
        </button>

        {confirmDelete ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">حذف شود؟</span>
            <button
              onClick={() => { onDelete(); setConfirmDelete(false); }}
              disabled={deleting}
              className="flex items-center gap-1 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 px-2.5 py-2 rounded-xl transition-all duration-150"
            >
              {deleting ? <IconLoader2 size={11} className="animate-spin" /> : <IconCheck size={11} />}
              بله
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 px-2.5 py-2 rounded-xl transition-all duration-150"
            >
              <IconX size={11} /> خیر
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-100 px-3 py-2 rounded-xl transition-all duration-200"
          >
            <IconTrash size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type FormState =
  | { type: "hidden" }
  | { type: "create" }
  | { type: "edit"; address: IAddress };

export default function Addresses() {
  const {
    userAddresses,
    loading,
    fetchUserAddresses,
    createUserAddress,
    editUserAddress,
    deleteUserAddress,
  } = useUserStore();

  const [formState, setFormState] = useState<FormState>({ type: "hidden" });

  useEffect(() => {
    fetchUserAddresses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addresses: IAddress[] = userAddresses ?? [];

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreate = async (data: IAddressFormParams) => {
    await createUserAddress(data);
    setFormState({ type: "hidden" });
  };

  const handleEdit = async (data: IAddressFormParams) => {
    if (formState.type !== "edit") return;
    const payload: IEditAddressFormParams = {
      ...data,
      shippinginfoId: String(formState.address.id),
    };
    await editUserAddress(payload);
    setFormState({ type: "hidden" });
  };

  const handleDelete = async (id: number) => {
    await deleteUserAddress(id);
  };

  const formSaving = loading.createAddress || loading.editAddress;

  return (
    <div className="flex flex-col gap-5" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-800">آدرس‌های من</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            آدرس‌های تحویل سفارش خود را مدیریت کنید
          </p>
        </div>
        {formState.type === "hidden" && (
          <button
            onClick={() => setFormState({ type: "create" })}
            className="flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <IconPlus size={15} />
            آدرس جدید
          </button>
        )}
      </div>

      {/* Create / edit form */}
      {formState.type !== "hidden" && (
        <AddressForm
          defaults={formState.type === "edit" ? formState.address : undefined}
          onSave={formState.type === "edit" ? handleEdit : handleCreate}
          onCancel={() => setFormState({ type: "hidden" })}
          saving={formSaving}
        />
      )}

      {/* Loading */}
      {loading.addresses && <AddressSkeleton />}

      {/* Empty state */}
      {!loading.addresses && addresses.length === 0 && formState.type === "hidden" && (
        <div className="bg-white border border-blue-100 rounded-2xl flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <IconMapPin size={28} className="text-blue-300" />
          </div>
          <p className="text-sm text-gray-500">هنوز آدرسی ثبت نشده است</p>
          <button
            onClick={() => setFormState({ type: "create" })}
            className="flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <IconPlus size={15} /> افزودن آدرس
          </button>
        </div>
      )}

      {/* Address grid */}
      {!loading.addresses && addresses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) =>
            formState.type === "edit" && formState.address.id === addr.id ? (
              // Inline edit expands to full width
              <div key={addr.id} className="sm:col-span-2">
                <AddressForm
                  defaults={formState.address}
                  onSave={handleEdit}
                  onCancel={() => setFormState({ type: "hidden" })}
                  saving={formSaving}
                />
              </div>
            ) : (
              <AddressCard
                key={addr.id}
                address={addr}
                deleting={loading.deleteAddress}
                onEdit={() => setFormState({ type: "edit", address: addr })}
                onDelete={() => handleDelete(addr.id)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}