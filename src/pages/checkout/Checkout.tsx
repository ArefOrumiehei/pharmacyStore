import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useOrderStore } from "@/store/useOrderStore";
import type { CreatePaymentRequest } from "@/services/orderServices/orderServices";
import {
  IconUser,
  IconPhone,
  IconMapPin,
  IconMail,
  IconCreditCard,
  IconWorldWww,
  IconUpload,
  IconLoader2,
  IconShieldCheck,
  IconTag,
  IconX,
  IconCheck,
} from "@tabler/icons-react";

interface CheckoutFormValues {
  receiverFullName: string;
  receiverMobile: string;
  receiverAddress: string;
  receiverZipCode: string;
  cardOwnerName?: string;
  nationalCode?: string;
  paymentReceiptPic?: File;
}

type PayMethod = 1 | 2;

interface ImageState {
  url: string | null;
  name: string | null;
}

type DiscountStatus = "idle" | "loading" | "valid" | "invalid";

const inputClass = (hasError: boolean) =>
  `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
    hasError
      ? "border-rose-200 bg-rose-50/30"
      : "border-blue-100 bg-blue-50/30"
  }`;

function Field({
  label,
  error,
  icon: Icon,
  children,
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
        <Icon
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
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

export default function Checkout() {
  const { createOrder } = useOrderStore();
  const [payMethod, setPayMethod] = useState<PayMethod>(1);
  const [image, setImage] = useState<ImageState>({ url: null, name: null });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  // Discount code state
  const [discountCode, setDiscountCode] = useState("");
  const [discountStatus, setDiscountStatus] = useState<DiscountStatus>("idle");
  const [discountAmount, setDiscountAmount] = useState<number | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>();

  const { ref: fileRef, ...fileRegister } = register("paymentReceiptPic", {
    required: payMethod === 2 ? "رسید پرداخت الزامی است" : false,
  });

  const handleImageUpload = useCallback(() => {
    fileUploadRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImage({ url: URL.createObjectURL(file), name: file.name });
      setValue("paymentReceiptPic", file, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const handleApplyDiscount = useCallback(async () => {
    if (!discountCode.trim()) return;
    setDiscountStatus("loading");
    setDiscountError(null);

    try {
      // Replace with your actual discount validation API call
      // const res = await validateDiscountCode(discountCode);
      await new Promise((r) => setTimeout(r, 800)); // mock delay

      // Mock: code "SAVE10" is valid
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
    setDiscountCode("");
    setDiscountStatus("idle");
    setDiscountAmount(null);
    setDiscountError(null);
  }, []);

  const onSubmit = useCallback(
    async (data: CheckoutFormValues) => {
      try {
        const baseFields = {
          receiverFullName: data.receiverFullName,
          receiverMobile: data.receiverMobile,
          receiverAddress: data.receiverAddress,
          receiverZipCode: data.receiverZipCode,
        };

        const payload: CreatePaymentRequest =
          payMethod === 2
            ? {
                ...baseFields,
                payMethod: 2,
                cardOwnerName: data.cardOwnerName!,
                nationalCode: data.nationalCode!,
                paymentReceiptPic: data.paymentReceiptPic!,
              }
            : { ...baseFields, payMethod: 1 };

        const res = await createOrder(payload);

        if (res?.data?.shouldRedirect && res.data.redirectUrl) {
          setIsRedirecting(true);
          setRedirectMessage(res.message ?? "در حال انتقال به صفحه پرداخت...");
          window.location.href = res.data.redirectUrl;
        }
      } catch (err) {
        console.error(err);
      }
    },
    [createOrder, payMethod]
  );

  if (isRedirecting) {
    return (
      <div
        className="w-full h-64 my-6 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center gap-4"
        dir="rtl"
      >
        <IconLoader2 size={28} className="text-blue-800 animate-spin" />
        <p className="text-sm font-medium text-blue-800">{redirectMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-800">تکمیل سفارش</h1>
        <p className="text-sm text-gray-400 mt-1">
          اطلاعات دریافت سفارش را وارد کنید
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Left column: main form ── */}
          <div className="flex-1 flex flex-col gap-5 w-full">

            {/* Receiver info */}
            <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-4">
              <SectionTitle>اطلاعات گیرنده</SectionTitle>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="نام و نام خانوادگی"
                  error={errors.receiverFullName?.message}
                  icon={IconUser}
                >
                  <input
                    {...register("receiverFullName", {
                      required: "نام الزامی است",
                    })}
                    placeholder="نام کامل گیرنده"
                    className={inputClass(!!errors.receiverFullName)}
                  />
                </Field>
                <Field
                  label="شماره موبایل"
                  error={errors.receiverMobile?.message}
                  icon={IconPhone}
                >
                  <input
                    {...register("receiverMobile", {
                      required: "موبایل الزامی است",
                    })}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className={inputClass(!!errors.receiverMobile)}
                  />
                </Field>
              </div>

              <Field
                label="آدرس"
                error={errors.receiverAddress?.message}
                icon={IconMapPin}
              >
                <input
                  {...register("receiverAddress", {
                    required: "آدرس الزامی است",
                  })}
                  placeholder="آدرس کامل"
                  className={inputClass(!!errors.receiverAddress)}
                />
              </Field>

              <Field
                label="کد پستی"
                error={errors.receiverZipCode?.message}
                icon={IconMail}
              >
                <input
                  {...register("receiverZipCode", {
                    required: "کد پستی الزامی است",
                  })}
                  placeholder="۱۲۳۴۵۶۷۸۹۰"
                  className={`${inputClass(!!errors.receiverZipCode)} sm:w-1/2`}
                />
              </Field>
            </div>

            {/* Payment method */}
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
                        isActive
                          ? "border-blue-800 bg-blue-50"
                          : "border-blue-100 bg-white hover:border-blue-200 hover:bg-blue-50/50"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                          isActive
                            ? "bg-blue-800 border-blue-800"
                            : "bg-blue-50 border-blue-100"
                        }`}
                      >
                        {method === 1 ? (
                          <IconWorldWww
                            size={18}
                            className={isActive ? "text-white" : "text-blue-800"}
                          />
                        ) : (
                          <IconCreditCard
                            size={18}
                            className={isActive ? "text-white" : "text-blue-800"}
                          />
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            isActive ? "text-blue-800" : "text-gray-700"
                          }`}
                        >
                          {method === 1 ? "پرداخت آنلاین" : "کارت به کارت"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {method === 1
                            ? "درگاه امن بانکی"
                            : "انتقال و ارسال رسید"}
                        </p>
                      </div>
                      {isActive && (
                        <div className="mr-auto w-2 h-2 rounded-full bg-blue-800" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Card-to-card extras */}
              {payMethod === 2 && (
                <div className="flex flex-col gap-4 pt-2 border-t border-blue-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="نام صاحب کارت"
                      error={errors.cardOwnerName?.message}
                      icon={IconUser}
                    >
                      <input
                        {...register("cardOwnerName", {
                          required: "نام صاحب کارت الزامی است",
                        })}
                        placeholder="نام روی کارت"
                        className={inputClass(!!errors.cardOwnerName)}
                      />
                    </Field>
                    <Field
                      label="کد ملی"
                      error={errors.nationalCode?.message}
                      icon={IconMail}
                    >
                      <input
                        {...register("nationalCode", {
                          required: "کد ملی الزامی است",
                        })}
                        placeholder="۰۰۱۲۳۴۵۶۷۸"
                        className={inputClass(!!errors.nationalCode)}
                      />
                    </Field>
                  </div>

                  {/* Receipt upload */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-600">
                      رسید پرداخت
                    </label>
                    <div
                      onClick={handleImageUpload}
                      className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        image.name
                          ? "border-green-200 bg-green-50"
                          : "border-blue-100 bg-blue-50/30 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {image.url ? (
                        <img
                          src={image.url}
                          alt="رسید"
                          className="w-12 h-12 object-cover rounded-lg border border-green-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
                          <IconUpload size={20} className="text-blue-800" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {image.name ?? "آپلود رسید پرداخت"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {image.name
                            ? "برای تغییر کلیک کنید"
                            : "PNG, JPG تا ۵ مگابایت"}
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      {...fileRegister}
                      ref={(el) => {
                        fileRef(el);
                        fileUploadRef.current = el;
                      }}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {errors.paymentReceiptPic && (
                      <p className="text-rose-500 text-xs">
                        {errors.paymentReceiptPic.message as string}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right column: summary + discount + submit ── */}
          <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4 lg:sticky lg:top-36">

            {/* Discount code */}
            <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3">
              <SectionTitle>کد تخفیف</SectionTitle>

              {discountStatus === "valid" ? (
                // Applied state
                <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <IconCheck size={14} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-700">
                        {discountCode.toUpperCase()}
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        {discountAmount}٪ تخفیف اعمال شد
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveDiscount}
                    className="w-7 h-7 rounded-lg bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors duration-150"
                  >
                    <IconX size={14} className="text-green-600" />
                  </button>
                </div>
              ) : (
                // Input state
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <IconTag
                        size={15}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => {
                          setDiscountCode(e.target.value);
                          if (discountStatus === "invalid") {
                            setDiscountStatus("idle");
                            setDiscountError(null);
                          }
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleApplyDiscount()
                        }
                        placeholder="کد تخفیف را وارد کنید"
                        className={`w-full border rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                          discountStatus === "invalid"
                            ? "border-rose-200 bg-rose-50/30"
                            : "border-blue-100 bg-blue-50/30"
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={
                        !discountCode.trim() || discountStatus === "loading"
                      }
                      className="px-4 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 flex-shrink-0"
                    >
                      {discountStatus === "loading" ? (
                        <IconLoader2 size={15} className="animate-spin" />
                      ) : (
                        "اعمال"
                      )}
                    </button>
                  </div>
                  {discountError && (
                    <p className="text-rose-500 text-xs">{discountError}</p>
                  )}
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
                  <span className="font-medium text-gray-800">— تومان</span>
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
              <p className="text-xs text-green-700 font-medium">
                پرداخت امن با رمزگذاری SSL
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100"
            >
              {isSubmitting ? (
                <IconLoader2 size={18} className="animate-spin" />
              ) : (
                "ثبت و پرداخت سفارش"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}