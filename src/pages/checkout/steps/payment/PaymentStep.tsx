import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import type { CreatePaymentRequest } from "@/services/orderServices/orderServices";
import {
  IconUser, IconMail, IconCreditCard, IconWorldWww, IconUpload,
  IconLoader2, IconShieldCheck, IconTag, IconX, IconCheck, IconMapPin,
} from "@tabler/icons-react";
import type { AddressData } from "../../CheckoutLayout";
import { useOrderStore } from "@/store/useOrderStore";
import { useCallback, useRef, useState } from "react";

interface PaymentFormValues {
  cardOwnerName?: string;
  nationalCode?: string;
  paymentReceiptPic?: File;
}

type PayMethod = 1 | 2;
type DiscountStatus = "idle" | "loading" | "valid" | "invalid";

const inputClass = (hasError: boolean) =>
  `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
    hasError ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
  }`;

function Field({
  label, error, icon: Icon, children,
}: {
  label: string; error?: string;
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  );
}

export default function PaymentStep() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Address data passed from AddressStep via navigate state
  const addressData: AddressData | undefined = location.state?.addressData;

  const { createOrder } = useOrderStore();
  const [payMethod, setPayMethod]             = useState<PayMethod>(1);
  const [image, setImage]                     = useState<{ url: string | null; name: string | null }>({ url: null, name: null });
  const [isRedirecting, setIsRedirecting]     = useState(false);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  const [discountCode, setDiscountCode]       = useState("");
  const [discountStatus, setDiscountStatus]   = useState<DiscountStatus>("idle");
  const [discountAmount, setDiscountAmount]   = useState<number | null>(null);
  const [discountError, setDiscountError]     = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } =
    useForm<PaymentFormValues>();

  const { ref: fileRef, ...fileRegister } = register("paymentReceiptPic", {
    required: payMethod === 2 ? "رسید پرداخت الزامی است" : false,
  });

  const handleImageUpload = useCallback(() => fileUploadRef.current?.click(), []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage({ url: URL.createObjectURL(file), name: file.name });
    setValue("paymentReceiptPic", file, { shouldValidate: true, shouldDirty: true });
  }, [setValue]);

  const handleApplyDiscount = useCallback(async () => {
    if (!discountCode.trim()) return;
    setDiscountStatus("loading");
    setDiscountError(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (discountCode.toUpperCase() === "SAVE10") {
        setDiscountStatus("valid");
        setDiscountAmount(10);
      } else {
        setDiscountStatus("invalid");
        setDiscountError("کد تخفیف نامعتبر است");
      }
    } catch {
      setDiscountStatus("invalid");
      setDiscountError("خطا در بررسی کد تخفیف");
    }
  }, [discountCode]);

  const handleRemoveDiscount = useCallback(() => {
    setDiscountCode(""); setDiscountStatus("idle");
    setDiscountAmount(null); setDiscountError(null);
  }, []);

  const onSubmit = useCallback(async (data: PaymentFormValues) => {
  try {
    // Cast addressData fields as required — they're validated in the previous step
    const base = {
      receiverFullName: addressData!.receiverFullName,
      receiverMobile:   addressData!.receiverMobile,
      receiverAddress:  addressData!.receiverAddress,
      receiverZipCode:  addressData!.receiverZipCode,
    };

    const payload: CreatePaymentRequest = payMethod === 2
      ? {
          ...base,
          payMethod:          2,
          cardOwnerName:      data.cardOwnerName!,
          nationalCode:       data.nationalCode!,
          paymentReceiptPic:  data.paymentReceiptPic!,
        }
      : { ...base, payMethod: 1 };

    const res = await createOrder(payload);
    if (res?.data?.shouldRedirect && res.data.redirectUrl) {
      setIsRedirecting(true);
      setRedirectMessage(res.message ?? "در حال انتقال به صفحه پرداخت...");
      window.location.href = res.data.redirectUrl;
    }
  } catch (err) { console.error(err); }
}, [createOrder, payMethod, addressData]);

  // Guard: if landed here directly without address, redirect back
  if (!addressData) {
    navigate("/checkout/address");
    return null;
  }
  
  if (isRedirecting) {
    return (
      <div className="w-full h-64 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center gap-4">
        <IconLoader2 size={28} className="text-blue-800 animate-spin" />
        <p className="text-sm font-medium text-blue-800">{redirectMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Right: payment method */}
        <div className="flex-1 flex flex-col gap-5 w-full">

          {/* Address summary (read-only) */}
          <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <SectionTitle>آدرس تحویل</SectionTitle>
              <button
                type="button"
                onClick={() => navigate("/checkout/address")}
                className="text-xs text-blue-800 font-medium hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                ویرایش
              </button>
            </div>
            <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3">
              <IconMapPin size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-700">{addressData.receiverFullName}</span>
                <span className="text-xs text-gray-500">{addressData.receiverMobile}</span>
                <span className="text-xs text-gray-500">{addressData.receiverAddress}</span>
                <span className="text-xs text-gray-400">کد پستی: {addressData.receiverZipCode}</span>
              </div>
            </div>
          </div>

          {/* Payment method selector */}
          <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-4">
            <SectionTitle>روش پرداخت</SectionTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([1, 2] as PayMethod[]).map((method) => {
                const isActive = payMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPayMethod(method)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-right ${
                      isActive ? "border-blue-800 bg-blue-50" : "border-blue-100 bg-white hover:border-blue-200 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${isActive ? "bg-blue-800 border-blue-800" : "bg-blue-50 border-blue-100"}`}>
                      {method === 1
                        ? <IconWorldWww size={18} className={isActive ? "text-white" : "text-blue-800"} />
                        : <IconCreditCard size={18} className={isActive ? "text-white" : "text-blue-800"} />
                      }
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? "text-blue-800" : "text-gray-700"}`}>
                        {method === 1 ? "پرداخت آنلاین" : "کارت به کارت"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {method === 1 ? "درگاه امن بانکی" : "انتقال و ارسال رسید"}
                      </p>
                    </div>
                    {isActive && <div className="mr-auto w-2 h-2 rounded-full bg-blue-800" />}
                  </button>
                );
              })}
            </div>

            {/* Card-to-card extras */}
            {payMethod === 2 && (
              <div className="flex flex-col gap-4 pt-2 border-t border-blue-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="نام صاحب کارت" error={errors.cardOwnerName?.message} icon={IconUser}>
                    <input {...register("cardOwnerName", { required: "نام صاحب کارت الزامی است" })} placeholder="نام روی کارت" className={inputClass(!!errors.cardOwnerName)} />
                  </Field>
                  <Field label="کد ملی" error={errors.nationalCode?.message} icon={IconMail}>
                    <input {...register("nationalCode", { required: "کد ملی الزامی است" })} placeholder="۰۰۱۲۳۴۵۶۷۸" className={inputClass(!!errors.nationalCode)} />
                  </Field>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">رسید پرداخت</label>
                  <div
                    onClick={handleImageUpload}
                    className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      image.name ? "border-green-200 bg-green-50" : "border-blue-100 bg-blue-50/30 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {image.url
                      ? <img src={image.url} alt="رسید" className="w-12 h-12 object-cover rounded-lg border border-green-200 flex-shrink-0" />
                      : <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0"><IconUpload size={20} className="text-blue-800" /></div>
                    }
                    <div>
                      <p className="text-sm font-medium text-gray-600">{image.name ?? "آپلود رسید پرداخت"}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{image.name ? "برای تغییر کلیک کنید" : "PNG, JPG تا ۵ مگابایت"}</p>
                    </div>
                  </div>
                  <input
                    type="file" accept="image/*" {...fileRegister}
                    ref={(el) => { fileRef(el); fileUploadRef.current = el; }}
                    className="hidden" onChange={handleFileChange}
                  />
                  {errors.paymentReceiptPic && <p className="text-rose-500 text-xs">{errors.paymentReceiptPic.message as string}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Left: summary + discount + submit */}
        <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4 lg:sticky lg:top-36">

          {/* Discount code */}
          <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3">
            <SectionTitle>کد تخفیف</SectionTitle>
            {discountStatus === "valid" ? (
              <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <IconCheck size={14} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-700">{discountCode.toUpperCase()}</p>
                    <p className="text-xs text-green-600 mt-0.5">{discountAmount}٪ تخفیف اعمال شد</p>
                  </div>
                </div>
                <button type="button" onClick={handleRemoveDiscount} className="w-7 h-7 rounded-lg bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors duration-150">
                  <IconX size={14} className="text-green-600" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IconTag size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value);
                        if (discountStatus === "invalid") { setDiscountStatus("idle"); setDiscountError(null); }
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
                      placeholder="کد تخفیف را وارد کنید"
                      className={`w-full border rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                        discountStatus === "invalid" ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    disabled={!discountCode.trim() || discountStatus === "loading"}
                    className="px-4 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 flex-shrink-0"
                  >
                    {discountStatus === "loading" ? <IconLoader2 size={15} className="animate-spin" /> : "اعمال"}
                  </button>
                </div>
                {discountError && <p className="text-rose-500 text-xs">{discountError}</p>}
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3">
            <SectionTitle>خلاصه سفارش</SectionTitle>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>جمع کل</span>
                <span className="font-medium text-gray-800">— تومان</span>
              </div>
              {discountStatus === "valid" && discountAmount && (
                <div className="flex items-center justify-between text-green-600">
                  <span>تخفیف ({discountAmount}٪)</span>
                  <span className="font-medium">— تومان</span>
                </div>
              )}
              <div className="flex items-center justify-between text-gray-600">
                <span>هزینه ارسال</span>
                <span className="font-medium text-green-600">رایگان</span>
              </div>
              <div className="h-px bg-blue-50 my-1" />
              <div className="flex items-center justify-between text-blue-800 font-bold text-base">
                <span>مبلغ قابل پرداخت</span>
                <span>— تومان</span>
              </div>
            </div>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <IconShieldCheck size={16} className="text-green-600 flex-shrink-0" />
            <p className="text-xs text-green-700 font-medium">پرداخت امن با رمزگذاری SSL</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100"
          >
            {isSubmitting ? <IconLoader2 size={18} className="animate-spin" /> : "ثبت و پرداخت سفارش"}
          </button>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/checkout/address")}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 text-blue-800 bg-white hover:bg-blue-50 py-3 text-sm font-medium transition-all duration-150"
          >
            <ArrowRight size={15} />
            <span>بازگشت به آدرس</span>
          </button>
        </div>
      </div>
    </form>
  );
}