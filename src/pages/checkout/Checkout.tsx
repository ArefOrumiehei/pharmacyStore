import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useOrderStore } from "@/store/useOrderStore";
import type { CreatePaymentRequest } from "@/services/orderServices/orderServices";

/* ── Flat type for the form (covers all fields across both payment methods) ── */
interface CheckoutFormValues {
  receiverFullName: string;
  receiverMobile: string;
  receiverAddress: string;
  receiverZipCode: string;
  // Card-to-card only
  cardOwnerName?: string;
  nationalCode?: string;
  paymentReceiptPic?: File;
}

type PayMethod = 1 | 2;

interface ImageState {
  url: string | null;
  name: string | null;
}

interface RedirectState {
  isRedirecting: boolean;
  message: string | null;
}

const INPUT_CLASS =
  "bg-white rounded-md py-2 px-3 border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-300";

const ERROR_CLASS = "text-red-500 text-xs mt-1";

export default function Checkout() {
  const { createOrder } = useOrderStore();

  const [payMethod, setPayMethod] = useState<PayMethod>(1);
  const [image, setImage] = useState<ImageState>({ url: null, name: null });
  const [redirect, setRedirect] = useState<RedirectState>({
    isRedirecting: false,
    message: null,
  });

  const fileUploadRef = useRef<HTMLInputElement | null>(null);

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

  const onSubmit = useCallback(
    async (data: CheckoutFormValues) => {
      try {
        const baseFields = {
          receiverFullName: data.receiverFullName,
          receiverMobile: data.receiverMobile,
          receiverAddress: data.receiverAddress,
          receiverZipCode: data.receiverZipCode,
        };

        /* Build the correctly-typed union payload */
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
          setRedirect({
            isRedirecting: true,
            message: res.message ?? "در حال انتقال به صفحه پرداخت...",
          });
          window.location.href = res.data.redirectUrl;
        }
      } catch (err) {
        console.error(err);
      }
    },
    [createOrder, payMethod]
  );

  if (redirect.isRedirecting) {
    return (
      <div className="w-full h-80 my-4 rounded-xl bg-blue-300/50 flex items-center justify-center">
        <h3 className="text-black text-xl">{redirect.message}</h3>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-4">
      <h1 className="text-xl font-bold">اطلاعات سفارش</h1>

      <div className="flex flex-col bg-white/60 rounded-lg p-4 shadow-lg gap-4">
        {/* Name & Mobile */}
        <div className="flex gap-2">
          <div className="w-1/2">
            <input
              className={`${INPUT_CLASS} w-full`}
              {...register("receiverFullName", { required: "نام الزامی است" })}
              placeholder="نام و نام خانوادگی"
            />
            {errors.receiverFullName && (
              <p className={ERROR_CLASS}>{errors.receiverFullName.message}</p>
            )}
          </div>
          <div className="w-1/2">
            <input
              className={`${INPUT_CLASS} w-full`}
              {...register("receiverMobile", { required: "موبایل الزامی است" })}
              placeholder="شماره موبایل"
            />
            {errors.receiverMobile && (
              <p className={ERROR_CLASS}>{errors.receiverMobile.message}</p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">روش پرداخت</p>
          <div className="flex flex-col items-start gap-2 ms-2">
            {([1, 2] as PayMethod[]).map((method) => (
              <label key={method} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={method}
                  checked={payMethod === method}
                  onChange={() => setPayMethod(method)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{method === 1 ? "پرداخت آنلاین" : "کارت به کارت"}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Address & Zip */}
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              className={`${INPUT_CLASS} w-full`}
              {...register("receiverAddress", { required: "آدرس الزامی است" })}
              placeholder="آدرس"
            />
            {errors.receiverAddress && (
              <p className={ERROR_CLASS}>{errors.receiverAddress.message}</p>
            )}
          </div>
          <div className="w-1/3">
            <input
              className={`${INPUT_CLASS} w-full`}
              {...register("receiverZipCode", { required: "کد پستی الزامی است" })}
              placeholder="کد پستی"
            />
            {errors.receiverZipCode && (
              <p className={ERROR_CLASS}>{errors.receiverZipCode.message}</p>
            )}
          </div>
        </div>

        {/* Card-to-Card Fields */}
        {payMethod === 2 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              آپلود رسید پرداخت
            </span>

            <div
              onClick={handleImageUpload}
              className="bg-gray-300 rounded-md p-4 text-center text-gray-700 cursor-pointer hover:bg-gray-400 transition-colors"
            >
              {image.name ? (
                <span className="text-sm">فایل انتخابی: {image.name}</span>
              ) : (
                <span>فایل رسید خود را آپلود نمایید</span>
              )}
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
              <p className={ERROR_CLASS}>{errors.paymentReceiptPic.message}</p>
            )}

            <div className="flex gap-2">
              <div className="w-1/2">
                <input
                  className={`${INPUT_CLASS} w-full`}
                  {...register("cardOwnerName", { required: "نام صاحب کارت الزامی است" })}
                  placeholder="نام صاحب کارت"
                />
                {errors.cardOwnerName && (
                  <p className={ERROR_CLASS}>{errors.cardOwnerName.message}</p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  className={`${INPUT_CLASS} w-full`}
                  {...register("nationalCode", { required: "کد ملی الزامی است" })}
                  placeholder="کد ملی"
                />
                {errors.nationalCode && (
                  <p className={ERROR_CLASS}>{errors.nationalCode.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary bg-blue-400 mt-2 py-2 rounded-md disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت سفارش"}
        </button>
      </div>
    </form>
  );
}