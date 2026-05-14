import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import type { CreatePaymentRequest } from "@/services/orderServices/orderServices";
import {
    IconUser,
    IconMail,
    IconCreditCard,
    IconWorldWww,
    IconUpload,
    IconLoader2,
    IconShieldCheck,
    IconTag,
    IconX,
    IconCheck,
    IconMapPin,
} from "@tabler/icons-react";
import type { AddressData } from "../../CheckoutLayout";
import { useOrderStore } from "@/store/useOrderStore";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentFormValues {
    cardOwnerName?: string;
    nationalCode?: string;
    paymentReceiptPic?: File;
}

type PayMethod = 1 | 2;

// ─── Shared UI ────────────────────────────────────────────────────────────────

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

// ─── Summary row ──────────────────────────────────────────────────────────────

function SummaryRow({
    label,
    value,
    highlight,
    bold,
    loading,
}: {
    label: string;
    value?: string;
    highlight?: "green";
    bold?: boolean;
    loading?: boolean;
}) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span
                className={bold ? "font-bold text-gray-800" : "text-gray-500"}
            >
                {label}
            </span>
            {loading ? (
                <div
                    className={`bg-blue-50 animate-pulse rounded ${
                        bold ? "h-4 w-28" : "h-3.5 w-20"
                    }`}
                />
            ) : (
                <span
                    className={
                        bold
                            ? "font-bold text-blue-800 text-base"
                            : highlight === "green"
                            ? "text-green-600 font-medium"
                            : "text-gray-700"
                    }
                >
                    {value ?? "—"}
                </span>
            )}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PaymentStep() {
    const navigate = useNavigate();
    const location = useLocation();
    const addressData: AddressData | undefined = location.state?.addressData;

    const {
        createOrder,
        fetchPreview,
        preview,
        loading: orderLoading,
    } = useOrderStore();

    const [payMethod, setPayMethod] = useState<PayMethod>(1);
    const [image, setImage] = useState<{
        url: string | null;
        name: string | null;
    }>({ url: null, name: null });
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
    const fileUploadRef = useRef<HTMLInputElement | null>(null);

    // ── Coupon ─────────────────────────────────────────────────────────────────
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);

    // ── Fetch preview on mount + when coupon changes ───────────────────────────
    useEffect(() => {
        fetchPreview(appliedCoupon ?? undefined);
    }, [appliedCoupon]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Form ───────────────────────────────────────────────────────────────────
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PaymentFormValues>();

    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptError, setReceiptError] = useState<string | null>(null);

    // ── File upload ────────────────────────────────────────────────────────────
    const handleImageUpload = useCallback(
        () => fileUploadRef.current?.click(),
        []
    );

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setImage({ url: URL.createObjectURL(file), name: file.name });
            setReceiptFile(file);
            setReceiptError(null); // clear error the moment file is picked
        },
        []
    );

    // ── Coupon handlers ────────────────────────────────────────────────────────
    const handleApplyCoupon = useCallback(async () => {
        const code = couponInput.trim();
        if (!code) return;
        setCouponError(null);
        // fetchPreview will show toast on error; check result via preview.isValidCoupon
        await fetchPreview(code);
        // After fetch, read from store to know if it was valid
        const result = useOrderStore.getState().preview;
        if (result?.isValidCoupon) {
            setAppliedCoupon(code);
        } else {
            setCouponError("کد تخفیف نامعتبر است");
        }
    }, [couponInput, fetchPreview]);

    const handleRemoveCoupon = useCallback(() => {
        setCouponInput("");
        setAppliedCoupon(null);
        setCouponError(null);
        fetchPreview(undefined);
    }, [fetchPreview]);

    // ── Submit ─────────────────────────────────────────────────────────────────
    const onSubmit = useCallback(
        async (data: PaymentFormValues) => {
            if (payMethod === 2 && !receiptFile) {
                setReceiptError("رسید پرداخت الزامی است");
                return;
            }
            try {
                const payload: CreatePaymentRequest =
                    payMethod === 2
                        ? {
                              ShippingInfoId: addressData!.shippingId!,
                              payMethod: 2,
                              cardOwnerName: data.cardOwnerName!,
                              nationalCode: data.nationalCode!,
                              paymentReceiptPic: data.paymentReceiptPic!,
                          }
                        : {
                              ShippingInfoId: addressData!.shippingId!,
                              payMethod: 1,
                          };

                const res = await createOrder(payload);
                if (res?.data?.shouldRedirect && res.data.redirectUrl) {
                    setIsRedirecting(true);
                    setRedirectMessage(
                        res.message ?? "در حال انتقال به صفحه پرداخت..."
                    );
                    window.location.href = res.data.redirectUrl;
                }
            } catch {
                // toast already shown in store
            }
        },
        [createOrder, payMethod, addressData, receiptFile]
    );

    // ── Guard: no address = go back ────────────────────────────────────────────
    if (!addressData) {
        navigate("/checkout/address");
        return null;
    }

    // ── Redirecting screen ─────────────────────────────────────────────────────
    if (isRedirecting) {
        return (
            <div className="w-full h-64 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center gap-4">
                <IconLoader2 size={28} className="text-blue-800 animate-spin" />
                <p className="text-sm font-medium text-blue-800">
                    {redirectMessage}
                </p>
            </div>
        );
    }

    const previewLoading = orderLoading.preview;
    const isSubmitLoading = isSubmitting || orderLoading.createOrder;

    return (
        <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* ── Left: payment method ── */}
                <div className="flex-1 flex flex-col gap-5 w-full">
                    {/* Address summary */}
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
                            <IconMapPin
                                size={15}
                                className="text-blue-400 flex-shrink-0 mt-0.5"
                            />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-gray-700">
                                    {addressData?.receiverFullName}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {addressData?.receiverMobile}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {addressData?.receiverAddress}
                                </span>
                                <span className="text-xs text-gray-400">
                                    کد پستی: {addressData?.receiverZipCode}
                                </span>
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
                                        onClick={() => {
                                            setPayMethod(method);
                                            if (method === 1) {
                                                setReceiptFile(null);
                                                setReceiptError(null);
                                                setImage({
                                                    url: null,
                                                    name: null,
                                                });
                                            }
                                        }}
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
                                                    className={
                                                        isActive
                                                            ? "text-white"
                                                            : "text-blue-800"
                                                    }
                                                />
                                            ) : (
                                                <IconCreditCard
                                                    size={18}
                                                    className={
                                                        isActive
                                                            ? "text-white"
                                                            : "text-blue-800"
                                                    }
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p
                                                className={`text-sm font-semibold ${
                                                    isActive
                                                        ? "text-blue-800"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {method === 1
                                                    ? "پرداخت آنلاین"
                                                    : "کارت به کارت"}
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
                                                required:
                                                    "نام صاحب کارت الزامی است",
                                            })}
                                            placeholder="نام روی کارت"
                                            className={inputClass(
                                                !!errors.cardOwnerName
                                            )}
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
                                            className={inputClass(
                                                !!errors.nationalCode
                                            )}
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
                                                : receiptError
                                                ? "border-rose-200 bg-rose-50/30"
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
                                                <IconUpload
                                                    size={20}
                                                    className="text-blue-800"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                {image.name ??
                                                    "آپلود رسید پرداخت"}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {image.name
                                                    ? "برای تغییر کلیک کنید"
                                                    : "PNG, JPG تا ۵ مگابایت"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Plain input — no register, just ref + onChange */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileUploadRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />

                                    {receiptError && (
                                        <p className="text-rose-500 text-xs">
                                            {receiptError}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right: summary + coupon + submit ── */}
                <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4 lg:sticky lg:top-36">
                    {/* Coupon */}
                    <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3">
                        <SectionTitle>کد تخفیف</SectionTitle>

                        {appliedCoupon && preview?.isValidCoupon ? (
                            <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <IconCheck
                                            size={14}
                                            className="text-green-600"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-green-700">
                                            {appliedCoupon.toUpperCase()}
                                        </p>
                                        <p className="text-xs text-green-600 mt-0.5">
                                            کد تخفیف اعمال شد
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveCoupon}
                                    className="w-7 h-7 rounded-lg bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors duration-150"
                                >
                                    <IconX
                                        size={14}
                                        className="text-green-600"
                                    />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <IconTag
                                            size={15}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <input
                                            type="text"
                                            value={couponInput}
                                            onChange={(e) => {
                                                setCouponInput(e.target.value);
                                                setCouponError(null);
                                            }}
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                handleApplyCoupon()
                                            }
                                            placeholder="کد تخفیف را وارد کنید"
                                            className={`w-full border rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                                                couponError
                                                    ? "border-rose-200 bg-rose-50/30"
                                                    : "border-blue-100 bg-blue-50/30"
                                            }`}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        disabled={
                                            !couponInput.trim() ||
                                            previewLoading
                                        }
                                        className="px-4 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 flex-shrink-0"
                                    >
                                        {previewLoading ? (
                                            <IconLoader2
                                                size={15}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            "اعمال"
                                        )}
                                    </button>
                                </div>
                                {couponError && (
                                    <p className="text-rose-500 text-xs">
                                        {couponError}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Order summary — driven by preview API */}
                    <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3">
                        <SectionTitle>خلاصه سفارش</SectionTitle>
                        <div className="flex flex-col gap-2">
                            <SummaryRow
                                label="تعداد اقلام"
                                value={
                                    preview
                                        ? `${preview.itemsCount} محصول`
                                        : undefined
                                }
                                loading={previewLoading}
                            />
                            <SummaryRow
                                label="جمع کالاها"
                                value={
                                    preview?.totalAmountDisplay
                                        ? `${preview.totalAmountDisplay} تومان`
                                        : undefined
                                }
                                loading={previewLoading}
                            />
                            {preview && preview.discountAmount > 0 && (
                                <SummaryRow
                                    label="تخفیف"
                                    value={`${preview.discountAmountDisplay} تومان-`}
                                    highlight="green"
                                    loading={previewLoading}
                                />
                            )}
                            <SummaryRow
                                label="هزینه ارسال"
                                value="رایگان"
                                highlight="green"
                                loading={previewLoading}
                            />
                            <div className="h-px bg-blue-50 my-1" />
                            <SummaryRow
                                label="مبلغ قابل پرداخت"
                                value={
                                    preview?.payAmountDisplay
                                        ? `${preview.payAmountDisplay} تومان`
                                        : undefined
                                }
                                bold
                                loading={previewLoading}
                            />
                        </div>
                    </div>

                    {/* Trust badge */}
                    <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                        <IconShieldCheck
                            size={16}
                            className="text-green-600 flex-shrink-0"
                        />
                        <p className="text-xs text-green-700 font-medium">
                            پرداخت امن با رمزگذاری SSL
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitLoading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100"
                    >
                        {isSubmitLoading ? (
                            <IconLoader2 size={18} className="animate-spin" />
                        ) : (
                            "ثبت و پرداخت سفارش"
                        )}
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
