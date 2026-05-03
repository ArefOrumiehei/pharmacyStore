import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router";
import {
  IconUser, IconPhone, IconMapPin, IconMail,
} from "@tabler/icons-react";
import type { AddressData } from "../../CheckoutLayout";

// ─── Placeholder data (replace with real API call later) ────────────────────
const PLACEHOLDER_ADDRESSES: (AddressData & { id: number; label: string })[] = [
  {
    id:               1,
    label:            "خانه",
    receiverFullName: "علی رضایی",
    receiverMobile:   "09121234567",
    receiverAddress:  "تهران، خیابان ولیعصر، پلاک ۱۲، واحد ۳",
    receiverZipCode:  "1234567890",
  },
  {
    id:               2,
    label:            "محل کار",
    receiverFullName: "علی رضایی",
    receiverMobile:   "09359876543",
    receiverAddress:  "تهران، شهرک غرب، بلوار دادمان، پلاک ۵۵",
    receiverZipCode:  "1459876543",
  },
];

// ─── Shared field styles ─────────────────────────────────────────────────────
const inputClass = (hasError: boolean) =>
  `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
    hasError ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
  }`;

function Field({
  label, error, icon: Icon, children,
}: {
  label: string;
  error?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
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

// ─── Saved address card ──────────────────────────────────────────────────────
function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: (typeof PLACEHOLDER_ADDRESSES)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-right flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
        selected
          ? "border-blue-800 bg-blue-50 shadow-sm shadow-blue-100"
          : "border-blue-100 bg-white hover:border-blue-200 hover:bg-blue-50/50"
      }`}
    >
      {/* Selection indicator */}
      <div
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
          selected ? "border-blue-800 bg-blue-800" : "border-gray-300"
        }`}
      >
        {selected && <Check size={11} className="text-white" strokeWidth={3} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-gray-800">{address.receiverFullName}</span>
          <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-lg">
            {address.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{address.receiverAddress}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-gray-400">{address.receiverMobile}</span>
          <span className="text-xs text-gray-300">•</span>
          <span className="text-xs text-gray-400">کد پستی: {address.receiverZipCode}</span>
        </div>
      </div>
    </button>
  );
}

// ─── New address form ────────────────────────────────────────────────────────
function NewAddressForm({
  onSave,
  onCancel,
}: {
  onSave: (data: AddressData) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressData>();

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="نام و نام خانوادگی" error={errors.receiverFullName?.message} icon={IconUser}>
          <input
            {...register("receiverFullName", { required: "نام الزامی است" })}
            placeholder="نام کامل گیرنده"
            className={inputClass(!!errors.receiverFullName)}
          />
        </Field>
        <Field label="شماره موبایل" error={errors.receiverMobile?.message} icon={IconPhone}>
          <input
            {...register("receiverMobile", { required: "موبایل الزامی است" })}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            className={inputClass(!!errors.receiverMobile)}
          />
        </Field>
      </div>

      <Field label="آدرس کامل" error={errors.receiverAddress?.message} icon={IconMapPin}>
        <input
          {...register("receiverAddress", { required: "آدرس الزامی است" })}
          placeholder="استان، شهر، خیابان، پلاک و واحد"
          className={inputClass(!!errors.receiverAddress)}
        />
      </Field>

      <Field label="کد پستی" error={errors.receiverZipCode?.message} icon={IconMail}>
        <input
          {...register("receiverZipCode", { required: "کد پستی الزامی است" })}
          placeholder="۱۲۳۴۵۶۷۸۹۰"
          className={`${inputClass(!!errors.receiverZipCode)} sm:w-1/2`}
        />
      </Field>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white py-2.5 text-sm font-semibold transition-all duration-150"
        >
          <Check size={14} />
          <span>ذخیره آدرس</span>
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 rounded-xl border border-blue-200 text-blue-800 hover:bg-blue-50 text-sm font-medium transition-all duration-150"
          >
            انصراف
          </button>
        )}
      </div>
    </form>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function AddressStep() {
  const navigate = useNavigate();

  const hasAddresses = PLACEHOLDER_ADDRESSES.length > 0;

  // Start with first saved address selected (if any), otherwise go straight to new-form mode
  const [selectedId, setSelectedId]   = useState<number | null>(
    hasAddresses ? PLACEHOLDER_ADDRESSES[0].id : null,
  );
  const [showNewForm, setShowNewForm] = useState(!hasAddresses);
  const [newAddress,  setNewAddress]  = useState<AddressData | null>(null);

  // The address that will be forwarded to PaymentStep
  const selectedSaved = PLACEHOLDER_ADDRESSES.find((a) => a.id === selectedId);
  const activeAddress: AddressData | null = newAddress && selectedId === -1
    ? newAddress
    : selectedSaved ?? null;

  const canProceed = activeAddress !== null;

  const handleSaveNew = (data: AddressData) => {
    setNewAddress(data);
    setSelectedId(-1);       // -1 = the newly entered address
    setShowNewForm(false);
  };

  const handleProceed = () => {
    if (!activeAddress) return;
    navigate("/checkout/payment", { state: { addressData: activeAddress } });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">

      {/* ── Form card ── */}
      <div className="flex-1 bg-white rounded-2xl border border-blue-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-50">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <IconMapPin size={16} className="text-blue-800" />
          </div>
          <h3 className="text-base font-bold text-blue-800">آدرس تحویل</h3>
        </div>

        <div className="px-6 py-6 flex flex-col gap-4">

          {/* Saved addresses */}
          {hasAddresses && (
            <div className="flex flex-col gap-3">
              {PLACEHOLDER_ADDRESSES.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  selected={selectedId === addr.id}
                  onSelect={() => {
                    setSelectedId(addr.id);
                    setNewAddress(null);
                    setShowNewForm(false);
                  }}
                />
              ))}

              {/* Newly saved address (appears after user fills form) */}
              {newAddress && (
                <AddressCard
                  key={-1}
                  address={{ ...newAddress, id: -1, label: "آدرس جدید" }}
                  selected={selectedId === -1}
                  onSelect={() => setSelectedId(-1)}
                />
              )}
            </div>
          )}

          {/* Add new address toggle / form */}
          {showNewForm ? (
            <div className="border border-blue-100 rounded-xl p-4 bg-blue-50/30">
              <p className="text-xs font-semibold text-blue-800 mb-3">
                {hasAddresses ? "افزودن آدرس جدید" : "ثبت آدرس"}
              </p>
              <NewAddressForm
                onSave={handleSaveNew}
                onCancel={hasAddresses ? () => setShowNewForm(false) : undefined}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewForm(true)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50 text-sm font-medium transition-all duration-200"
            >
              <Plus size={15} />
              <span>افزودن آدرس جدید</span>
            </button>
          )}

        </div>
      </div>

      {/* ── Side actions ── */}
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