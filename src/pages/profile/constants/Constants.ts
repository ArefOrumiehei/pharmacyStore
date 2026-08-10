import type { ITicket } from "@/services/accountServices/accountServices";
import { IconArrowBack, IconArrowBackUp, IconCircleCheck, IconClock, IconClockDollar, IconCreditCard, IconHeadset, IconHeart, IconHome, IconHomeCheck, IconMapPin, IconMessage2, IconPackage, IconReceipt, IconRotateClockwise, IconShoppingBag, IconTruck, IconUser, IconX } from "@tabler/icons-react";
import * as z from "zod";

export const MENU_ITEMS = [
  { path: "/profile", icon: IconHome , label: "خلاصه فعالیت", end: true },
  { path: "/profile/orders", icon: IconShoppingBag, label: "سفارش‌های من" },
  { path: "/profile/favorites", icon: IconHeart, label: "علاقه‌مندی‌ها" },
  { path: "/profile/comments", icon: IconMessage2, label: "نظرات من" },
  { path: "/profile/addresses", icon: IconMapPin, label: "آدرس‌های من" },
  { path: "/profile/tickets", icon: IconHeadset, label: "تیکت‌های پشتیبانی" },
  { path: "/profile/account", icon: IconUser, label: "حساب کاربری" },
];

export const MOBILE_HIDE_SIDEBAR_PATTERNS = [
  /^\/profile\/orders\/[^/]+$/,
  /^\/profile\/tickets\/[^/]+$/,
  /^\/profile\/tickets\/new\/[^/]+$/,
];

// Orser Status
export const STATUS_CONFIG: Record<
  number,
  { label: string; class: string; icon: React.ComponentType<{ className?: string; size?: number }> }
> = {
  1: { label: "ثبت شده، پرداخت نشده", class: "bg-gray-50 border-gray-100 text-gray-700", icon: IconReceipt },
  2: { label: "در انتظار پرداخت درگاه", class: "bg-yellow-50 border-yellow-100 text-yellow-700", icon: IconCreditCard },
  3: { label: "در انتظار تایید کارت به کارت", class: "bg-amber-50 border-amber-100 text-amber-700", icon: IconClockDollar },
  4: { label: "پرداخت موفق", class: "bg-emerald-50 border-emerald-100 text-emerald-700", icon: IconCircleCheck },
  5: { label: "در حال آماده سازی", class: "bg-orange-50 border-orange-100 text-orange-700", icon: IconPackage },
  6: { label: "ارسال شده", class: "bg-blue-50 border-blue-100 text-blue-800", icon: IconTruck },
  7: { label: "تحویل داده شده", class: "bg-green-50 border-green-100 text-green-700", icon: IconHomeCheck },
  8: { label: "نیازمند بازگشت وجه", class: "bg-purple-50 border-purple-100 text-purple-700", icon: IconRotateClockwise },
  9: { label: "لغو شده", class: "bg-rose-50 border-rose-100 text-rose-600", icon: IconX },
  10: { label: "مرجوع شده", class: "bg-red-50 border-red-100 text-red-700", icon: IconArrowBackUp },
  11: { label: "درخواست مرجوعی", class: "bg-indigo-50 border-indigo-100 text-indigo-700", icon: IconArrowBack },
};

export const FALLBACK_STATUS = STATUS_CONFIG[5];

// Tickets Status
export const getTicketStatus = (ticket: ITicket) =>
  ticket.isAnswered
    ? { label: "پاسخ داده شده", className: "text-green-700 bg-green-50 border-green-200", Icon: IconCircleCheck }
    : { label: "در انتظار پاسخ", className: "text-blue-700 bg-blue-50 border-blue-200",   Icon: IconClock   };

// Send ticket
export type TicketPriority = "low" | "medium" | "high";

export interface PriorityOption {
  value: TicketPriority;
  label: string;
  subLabel: string;
  activeClass: string;
}

export const PRIORITIES: PriorityOption[] = [
  { value: "low", label: "عادی", subLabel: "پاسخ در ۴۸ ساعت", activeClass: "border-gray-300 bg-gray-50 text-gray-700" },
  { value: "medium", label: "متوسط", subLabel: "پاسخ در ۲۴ ساعت", activeClass: "border-amber-400 bg-amber-50 text-amber-700" },
  { value: "high", label: "فوری", subLabel: "پاسخ در ۴ ساعت", activeClass: "border-rose-400 bg-rose-50 text-rose-700" },
];

export interface TicketFormValues {
  subject: string;
  message: string;
  email?: string;
  priority: TicketPriority;
}

export interface TicketTitleOption {
  titleName: string;
  numberOfRow: string | number;
}


// Acoount Section
export const profileSchema = z.object({
  fullname: z.string().min(2, "حداقل ۲ کاراکتر").max(100, "حداکثر ۱۰۰ کاراکتر"),
  username: z.string().min(2, "حداقل ۲ کاراکتر").max(50, "حداکثر ۵۰ کاراکتر"),
  email: z.string().email("ایمیل معتبر وارد کنید").optional().or(z.literal("")),
});

// Change password — requires current password
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز فعلی الزامی است"),
    password: z.string().min(6, "حداقل ۶ کاراکتر"),
    rePassword: z.string().min(6, "حداقل ۶ کاراکتر"),
  })
  .refine((d) => d.password === d.rePassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["rePassword"],
  });

// Set password — no current password needed
export const setPasswordSchema = z
  .object({
    password: z.string().min(6, "حداقل ۶ کاراکتر"),
    rePassword: z.string().min(6, "حداقل ۶ کاراکتر"),
  })
  .refine((d) => d.password === d.rePassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["rePassword"],
  });

export const mobileSchema = z.object({
  mobile: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید"),
  code: z.string().length(6, "کد ۶ رقمی را وارد کنید").optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;
export type MobileFormValues = z.infer<typeof mobileSchema>;

export const inputClass = (hasError: boolean, disabled?: boolean) =>
  `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
    disabled
      ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100"
      : hasError
      ? "border-rose-200 bg-rose-50/30"
      : "border-blue-100 bg-blue-50/30"
  }`;