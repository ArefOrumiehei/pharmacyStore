import { useState } from "react";
import {
  IconBell,
  IconMail,
  IconShieldCheck,
  IconTrash,
  IconDeviceMobile,
  IconAlertTriangle,
} from "@tabler/icons-react";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
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

  const [notifSettings, setNotifSettings] = useState({
    orderUpdates: true,
    offers: true,
    newsletter: false,
    sms: true,
  });

  const toggle = (key: keyof typeof notifSettings) =>
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-blue-800">تنظیمات</h1>
        <p className="text-sm text-gray-400 mt-0.5">حساب کاربری و ترجیحات خود را مدیریت کنید</p>
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