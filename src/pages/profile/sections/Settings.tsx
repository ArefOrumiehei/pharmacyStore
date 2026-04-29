import { useState } from "react";
import {
  IconLock,
  IconBell,
  IconMail,
  IconShieldCheck,
  IconTrash,
  IconLoader2,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconDeviceMobile,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "رمز فعلی الزامی است"),
  newPassword: z.string().min(6, "حداقل ۶ کاراکتر"),
  confirmPassword: z.string().min(6, "حداقل ۶ کاراکتر"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "رمز عبور و تکرار آن یکسان نیستند",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  );
}

const inputClass = (hasError?: boolean) =>
  `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
    hasError ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
  }`;

function PasswordField({
  label,
  error,
  show,
  onToggle,
  inputProps,
}: {
  label: string;
  error?: string;
  show: boolean;
  onToggle: () => void;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="relative">
        <IconLock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input {...inputProps} type={show ? "text" : "password"} className={`${inputClass(!!error)} pl-10`} />
        <button type="button" onClick={onToggle}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          {show ? <IconEyeOff size={15} /> : <IconEye size={15} />}
        </button>
      </div>
      {error && <p className="text-rose-500 text-xs">{error}</p>}
    </div>
  );
}

interface ToggleRowProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
  label: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleRow({ icon: Icon, iconBg, iconColor, label, desc, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-blue-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon size={15} className={iconColor} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${checked ? "bg-blue-800" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${checked ? "right-0.5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const [notifSettings, setNotifSettings] = useState({
    orderUpdates: true,
    offers: true,
    newsletter: false,
    sms: true,
  });

  const toggle = (key: keyof typeof notifSettings) =>
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  const onSave = async (data: PasswordFormValues) => {
    setPwSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    console.log("change password", data);
    setPwSuccess(true);
    reset();
    setPwSaving(false);
    setTimeout(() => setPwSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-blue-800">تنظیمات</h1>
        <p className="text-sm text-gray-400 mt-0.5">حساب کاربری و ترجیحات خود را مدیریت کنید</p>
      </div>

      {/* Change password */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6">
        <SectionTitle>تغییر رمز عبور</SectionTitle>

        {pwSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3 mt-4">
            <IconCheck size={15} />
            رمز عبور با موفقیت تغییر کرد
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <PasswordField
            label="رمز عبور فعلی"
            error={errors.currentPassword?.message}
            show={showCurrent}
            onToggle={() => setShowCurrent((p) => !p)}
            inputProps={register("currentPassword")}
          />
          <PasswordField
            label="رمز عبور جدید"
            error={errors.newPassword?.message}
            show={showNew}
            onToggle={() => setShowNew((p) => !p)}
            inputProps={register("newPassword")}
          />
          <PasswordField
            label="تکرار رمز جدید"
            error={errors.confirmPassword?.message}
            show={showConfirm}
            onToggle={() => setShowConfirm((p) => !p)}
            inputProps={register("confirmPassword")}
          />
        </div>

        <button
          onClick={handleSubmit(onSave)}
          disabled={pwSaving}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-5 py-2.5 rounded-xl transition-all duration-200"
        >
          {pwSaving ? <IconLoader2 size={15} className="animate-spin" /> : <IconLock size={15} />}
          ذخیره رمز جدید
        </button>
      </div>

      {/* Notification settings */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6">
        <SectionTitle>تنظیمات اعلان‌ها</SectionTitle>
        <div className="mt-4">
          <ToggleRow
            icon={IconShieldCheck}
            iconBg="bg-blue-50 border-blue-100"
            iconColor="text-blue-800"
            label="اعلان‌های سفارش"
            desc="اطلاع‌رسانی درباره وضعیت سفارش‌ها"
            checked={notifSettings.orderUpdates}
            onChange={() => toggle("orderUpdates")}
          />
          <ToggleRow
            icon={IconBell}
            iconBg="bg-amber-50 border-amber-100"
            iconColor="text-amber-600"
            label="پیشنهادات و تخفیف‌ها"
            desc="اطلاع از تخفیف‌ها و کمپین‌های ویژه"
            checked={notifSettings.offers}
            onChange={() => toggle("offers")}
          />
          <ToggleRow
            icon={IconMail}
            iconBg="bg-green-50 border-green-100"
            iconColor="text-green-600"
            label="خبرنامه ایمیلی"
            desc="دریافت آخرین اخبار و مطالب سلامت"
            checked={notifSettings.newsletter}
            onChange={() => toggle("newsletter")}
          />
          <ToggleRow
            icon={IconDeviceMobile}
            iconBg="bg-purple-50 border-purple-100"
            iconColor="text-purple-600"
            label="پیامک"
            desc="دریافت اطلاع‌رسانی از طریق پیامک"
            checked={notifSettings.sms}
            onChange={() => toggle("sms")}
          />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6">
        <SectionTitle>امنیت حساب</SectionTitle>
        <div className="flex items-center gap-3 mt-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <IconShieldCheck size={18} className="text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium">حساب شما امن است</p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-rose-100 rounded-2xl p-6">
        <h2 className="text-base font-bold text-rose-600 flex items-center gap-2">
          <span className="w-1 h-5 bg-rose-500 rounded-full inline-block flex-shrink-0" />
          منطقه خطر
        </h2>
        <div className="mt-4 flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-4">
          <IconAlertTriangle size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-rose-700">حذف حساب کاربری</p>
            <p className="text-xs text-rose-500 mt-0.5 leading-5">
              با حذف حساب کاربری، تمام اطلاعات، سفارشات و داده‌های شما به طور دائمی پاک خواهد شد.
            </p>
            <button className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 active:scale-95 px-4 py-2 rounded-xl transition-all duration-200">
              <IconTrash size={13} />
              حذف حساب کاربری
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}