import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Plus, Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router";
import { IconUser, IconPhone, IconMapPin, IconMail } from "@tabler/icons-react";
import type { AddressData } from "../../CheckoutLayout";
import type { IAddress, IAddressFormParams, IEditAddressFormParams } from "@/services/accountServices/accountServices";
import { useUserStore } from "@/store/useAccountStore";

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputClass = (hasError: boolean) =>
  `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
    hasError ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
  }`;

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label, error, icon: Icon, children,
}: {
  label:    string;
  error?:   string;
  icon:     React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        {children}
      </div>
      {error && <p className="text-rose-500 text-xs">{error}</p>}
    </div>
  );
}

// ─── Address form (shared for create + edit) ──────────────────────────────────

type AddressFormMode =
  | { mode: "create"; onSave: (data: IAddressFormParams) => Promise<void> }
  | { mode: "edit";   onSave: (data: IAddressFormParams) => Promise<void>; defaults: IAddress };

function AddressForm({
  config,
  onCancel,
  loading,
}: {
  config:   AddressFormMode;
  onCancel?: () => void;
  loading:  boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<IAddressFormParams>({
    defaultValues: config.mode === "edit" ? {
      receiverFullName: config.defaults.receiverFullName,
      receiverMobile:   config.defaults.receiverMobile,
      receiverAddress:  config.defaults.receiverAddress,
      receiverZipCode:  config.defaults.receiverZipCode,
    } : {},
  });

  return (
    <form onSubmit={handleSubmit(config.onSave)} className="flex flex-col gap-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="نام و نام خانوادگی" error={errors.receiverFullName?.message} icon={IconUser}>
          <input
            {...register("receiverFullName", { required: "نام الزامی است" })}
            placeholder="نام کامل گیرنده"
            disabled={loading}
            className={inputClass(!!errors.receiverFullName)}
          />
        </Field>
        <Field label="شماره موبایل" error={errors.receiverMobile?.message} icon={IconPhone}>
          <input
            {...register("receiverMobile", { required: "موبایل الزامی است" })}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            disabled={loading}
            className={inputClass(!!errors.receiverMobile)}
          />
        </Field>
      </div>

      <Field label="آدرس کامل" error={errors.receiverAddress?.message} icon={IconMapPin}>
        <input
          {...register("receiverAddress", { required: "آدرس الزامی است" })}
          placeholder="استان، شهر، خیابان، پلاک و واحد"
          disabled={loading}
          className={inputClass(!!errors.receiverAddress)}
        />
      </Field>

      <Field label="کد پستی" error={errors.receiverZipCode?.message} icon={IconMail}>
        <input
          {...register("receiverZipCode", { required: "کد پستی الزامی است" })}
          placeholder="۱۲۳۴۵۶۷۸۹۰"
          disabled={loading}
          className={`${inputClass(!!errors.receiverZipCode)} sm:w-1/2`}
        />
      </Field>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 text-sm font-semibold transition-all duration-150"
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /><span>در حال ذخیره...</span></>
            : <><Check size={14} /><span>{config.mode === "edit" ? "ذخیره تغییرات" : "ذخیره آدرس"}</span></>
          }
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 rounded-xl border border-blue-200 text-blue-800 hover:bg-blue-50 disabled:opacity-50 text-sm font-medium transition-all duration-150"
          >
            انصراف
          </button>
        )}
      </div>
    </form>
  );
}

// ─── Address card ─────────────────────────────────────────────────────────────

function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
  deleting,
}: {
  address:  IAddress;
  selected: boolean;
  onSelect: () => void;
  onEdit:   () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={`w-full rounded-xl border transition-all duration-200 overflow-hidden ${
      selected
        ? "border-blue-800 bg-blue-50 shadow-sm shadow-blue-100"
        : "border-blue-100 bg-white hover:border-blue-200"
    }`}>
      {/* Main row */}
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-right flex items-start gap-3 p-4"
      >
        {/* Radio */}
        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          selected ? "border-blue-800 bg-blue-800" : "border-gray-300"
        }`}>
          {selected && <Check size={11} className="text-white" strokeWidth={3} />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800">{address.receiverFullName}</p>
          <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{address.receiverAddress}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-gray-400">{address.receiverMobile}</span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-gray-400">کد پستی: {address.receiverZipCode}</span>
          </div>
        </div>
      </button>

      {/* Action row */}
      <div className="flex items-center gap-2 px-4 pb-3">
        {/* Edit */}
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg transition-all duration-150"
        >
          <Pencil size={12} />
          ویرایش
        </button>

        {/* Delete — with inline confirm */}
        {confirmDelete ? (
          <div className="flex items-center gap-2 mr-auto">
            <span className="text-xs text-gray-500">حذف شود؟</span>
            <button
              type="button"
              onClick={() => { onDelete(); setConfirmDelete(false); }}
              disabled={deleting}
              className="flex items-center gap-1 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-all duration-150"
            >
              {deleting ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
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
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3 py-1.5 rounded-lg transition-all duration-150 mr-auto"
          >
            <Trash2 size={12} />
            حذف
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function AddressSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-blue-50 p-4 flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-50 animate-pulse flex-shrink-0 mt-0.5" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3.5 w-32 bg-blue-50 animate-pulse rounded" />
              <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
              <div className="h-3 w-40 bg-blue-50 animate-pulse rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type FormState =
  | { type: "hidden" }
  | { type: "create" }
  | { type: "edit"; address: IAddress };

export default function AddressStep() {
  const navigate = useNavigate();
  const { userAddresses, loading, fetchUserAddresses, createUserAddress, editUserAddress, deleteUserAddress } = useUserStore();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formState, setFormState]   = useState<FormState>({ type: "hidden" });

  // Fetch on mount
  useEffect(() => {
    fetchUserAddresses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addresses = userAddresses ?? [];
  const hasAddresses = addresses.length > 0;

  // Auto-select first address once loaded
  useEffect(() => {
    if (!loading.addresses && hasAddresses && selectedId === null) {
      setSelectedId(addresses[0].id);
    }
  }, [loading.addresses, hasAddresses]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show create form automatically when no addresses exist
  useEffect(() => {
    if (!loading.addresses && !hasAddresses) {
      setFormState({ type: "create" });
    }
  }, [loading.addresses, hasAddresses]);

  const selectedAddress = addresses.find((a) => a.id === selectedId) ?? null;
  const canProceed      = selectedAddress !== null && formState.type === "hidden";

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
    // If the deleted address was selected, clear selection
    if (selectedId === id) setSelectedId(null);
  };

  const handleProceed = () => {
    if (!selectedAddress) return;
    const addressData: AddressData = {
      receiverFullName: selectedAddress.receiverFullName,
      receiverMobile:   selectedAddress.receiverMobile,
      receiverAddress:  selectedAddress.receiverAddress,
      receiverZipCode:  selectedAddress.receiverZipCode,
      shippingId:       selectedAddress.id,
    };
    navigate("/checkout/payment", { state: { addressData } });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start" dir="rtl">

      {/* ── Address card ── */}
      <div className="flex-1 bg-white rounded-2xl border border-blue-100 overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-50">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <IconMapPin size={16} className="text-blue-800" />
          </div>
          <h3 className="text-base font-bold text-blue-800">آدرس تحویل</h3>
        </div>

        <div className="px-6 py-6 flex flex-col gap-4">

          {/* Loading */}
          {loading.addresses && <AddressSkeleton />}

          {/* Saved address list */}
          {!loading.addresses && hasAddresses && (
            <div className="flex flex-col gap-3">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  selected={selectedId === addr.id}
                  deleting={loading.deleteAddress}
                  onSelect={() => { setSelectedId(addr.id); setFormState({ type: "hidden" }); }}
                  onEdit={()   => { setFormState({ type: "edit", address: addr }); }}
                  onDelete={()  => handleDelete(addr.id)}
                />
              ))}
            </div>
          )}

          {/* Inline form — create or edit */}
          {!loading.addresses && formState.type !== "hidden" && (
            <div className="border border-blue-100 rounded-xl p-4 bg-blue-50/30">
              <p className="text-xs font-semibold text-blue-800 mb-4">
                {formState.type === "edit" ? "ویرایش آدرس" : hasAddresses ? "افزودن آدرس جدید" : "ثبت آدرس"}
              </p>
              <AddressForm
                config={
                  formState.type === "edit"
                    ? { mode: "edit",   onSave: handleEdit,   defaults: formState.address }
                    : { mode: "create", onSave: handleCreate }
                }
                onCancel={hasAddresses ? () => setFormState({ type: "hidden" }) : undefined}
                loading={loading.createAddress || loading.editAddress}
              />
            </div>
          )}

          {/* Add new button — hidden while form is open */}
          {!loading.addresses && formState.type === "hidden" && (
            <button
              type="button"
              onClick={() => setFormState({ type: "create" })}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50 text-sm font-medium transition-all duration-200"
            >
              <Plus size={15} />
              <span>افزودن آدرس جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Side panel ── */}
      <div className="w-full lg:w-72 flex flex-col gap-3">
        <div className="bg-white rounded-2xl border border-blue-100 p-5 flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">مرحله ۲ از ۳</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            آدرس تحویل سفارش خود را انتخاب یا وارد کنید.
          </p>
        </div>

        <button
          type="button"
          onClick={handleProceed}
          disabled={!canProceed}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white py-3 text-sm font-semibold transition-all duration-150 shadow-sm shadow-blue-100"
        >
          <span>ادامه — پرداخت</span>
          <ArrowLeft size={15} />
        </button>

        <button
          type="button"
          onClick={() => navigate("/checkout/cart")}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 text-blue-800 bg-white hover:bg-blue-50 py-3 text-sm font-medium transition-all duration-150"
        >
          <ArrowRight size={15} />
          <span>بازگشت به سبد خرید</span>
        </button>
      </div>
    </div>
  );
}