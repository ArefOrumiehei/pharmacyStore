import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { IconLoader2 } from "@tabler/icons-react";
import type { CreatePaymentRequest } from "@/services/orderServices/orderServices";
import type { AddressData } from "../../interfaces/checkout";
import type { PaymentFormValues, PayMethod } from "./types/payment";

// Stores
import { useOrderStore } from "@/store/useOrderStore";
import { useCartStore } from "@/store/useCartStore";
import { useSiteStore } from "@/store/useSiteStore";

// Components
import SectionTitle from "@/components/common/sectionTitle/SectionTitle";
import { RedirectingScreen } from "./_components/redirectingScreen/RedirectingScreen";
import { AddressSummary } from "./_components/addressSummary/AddressSummary";
import { PaymentMethodSelector } from "./_components/paymentMethodSelector/PaymentMethodSelector";
import { CardToCardExtras } from "./_components/cardToCardExtras/CardToCardExtras";
import { CouponBox } from "./_components/couponBox/CouponBox";
import { OrderSummary } from "./_components/orderSummary/OrderSummary";
import { TrustBadge } from "./_components/trustBadge/TrustBadge";

export default function PaymentStep() {
    const navigate = useNavigate();
    const location = useLocation();
    const addressData: AddressData | undefined = location.state?.addressData;

    const { createOrder, fetchPreview, preview, loading: orderLoading } = useOrderStore();
    const { fetchPaymentMethods, paymentMethods, paymentMethodsLoading } = useSiteStore();
    const { cart, clearCart } = useCartStore();

    const [payMethod, setPayMethod] = useState<PayMethod>(1);
    const [image, setImage] = useState<{ url: string | null; name: string | null }>({ url: null, name: null });
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
    const fileUploadRef = useRef<HTMLInputElement | null>(null);

    // ── Coupon ─────────────────────────────────────────────────────────────────
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponMsg, setCouponMsg] = useState<string | null>(null);

    // ── Fetch preview on mount + when coupon changes ───────────────────────────
    useEffect(() => {
        fetchPreview(appliedCoupon ?? undefined);
        fetchPaymentMethods();
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
    const handleImageUpload = useCallback(() => fileUploadRef.current?.click(), []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage({ url: URL.createObjectURL(file), name: file.name });
        setReceiptFile(file);
        setReceiptError(null); // clear error the moment file is picked
    }, []);

    // ── Coupon handlers ────────────────────────────────────────────────────────
    const handleApplyCoupon = useCallback(async () => {
        const code = couponInput.trim();
        if (!code) return;
        setCouponMsg(null);
        // fetchPreview will show toast on error; check result via preview.isCouponHasValue
        await fetchPreview(code);
        // After fetch, read from store to know if it was valid
        const result = useOrderStore.getState().preview;
        if (result?.isCouponHasValue) {
        setAppliedCoupon(code);
        setCouponMsg(result?.discountMessage || "کد تخفیف با موفقیت اعمال شد");
        } else {
        setCouponMsg(result?.discountMessage || "کد تخفیف نامعتبر است");
        }
    }, [couponInput, fetchPreview]);

    const handleRemoveCoupon = useCallback(() => {
        setCouponInput("");
        setAppliedCoupon(null);
        setCouponMsg(null);
        fetchPreview(undefined);
    }, [fetchPreview]);

    const onSubmit = useCallback(
        async (data: PaymentFormValues) => {
        if (payMethod === 2 && !receiptFile) {
            setReceiptError("رسید پرداخت الزامی است");
            return;
        }

        try {
            const couponCode = preview?.isCouponApplied && preview.isCouponHasValue ? appliedCoupon ?? undefined : undefined;
            const payload: CreatePaymentRequest =
            payMethod === 2
                ? {
                    shippingInfoId: addressData!.shippingId!,
                    payMethod: 2,
                    cardOwnerName: data.cardOwnerName!,
                    nationalCode: data.nationalCode!,
                    paymentReceiptPic: receiptFile!,
                    couponCode,
                }
                : {
                    shippingInfoId: addressData!.shippingId!,
                    payMethod: 1,
                    couponCode,
                };

            const res = await createOrder(payload);

            // ── Method 1: online payment → redirect to bank gateway
            if (payMethod === 1 && res?.data?.shouldRedirect && res.data.redirectUrl) {
            setIsRedirecting(true);
            setRedirectMessage(res.message ?? "در حال انتقال به صفحه پرداخت...");
            window.location.href = res.data.redirectUrl;
            return;
            }

            // ── Method 2: card-to-card → navigate to success page
            if (payMethod === 2 && res?.data?.orderId) {
            localStorage.removeItem("server_cart");
            clearCart();
            navigate("/checkout/order-success", {
                state: { orderId: res.data.orderId, payMethod: 2 },
                replace: true,
            });
            return;
            }
        } catch {
            // toast already shown in store
        }
        },
        [createOrder, payMethod, addressData, receiptFile, appliedCoupon, navigate, preview, clearCart]
    );

    const handleSelectMethod = (method: PayMethod) => {
        setPayMethod(method);
        if (method === 1) {
        setReceiptFile(null);
        setReceiptError(null);
        setImage({ url: null, name: null });
        }
    };

    // ── Guard: no address = go back ────────────────────────────────────────────
    if (!addressData) {
        navigate("/checkout/address");
        return null;
    }

    // ── Redirecting screen ─────────────────────────────────────────────────────
    if (isRedirecting) {
        return <RedirectingScreen message={redirectMessage} />;
    }

    const previewLoading = orderLoading.preview;
    const isSubmitLoading = isSubmitting || orderLoading.createOrder;
    const totalQty = cart?.items?.reduce((sum, item) => sum + item.qty, 0) ?? 0;

    return (
        <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
            <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start">
                {/* ── Left: payment method ── */}
                <div className="flex-1 flex flex-col gap-4 sm:gap-5 w-full">
                    <AddressSummary addressData={addressData} onEdit={() => navigate("/checkout/address")} />

                    <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
                        <SectionTitle>روش پرداخت</SectionTitle>

                        <PaymentMethodSelector selected={payMethod} onSelect={handleSelectMethod} />

                        {payMethod === 2 && (
                        <CardToCardExtras
                            register={register}
                            errors={errors}
                            cards={paymentMethods?.cards ?? []}
                            cardsLoading={paymentMethodsLoading}
                            image={image}
                            receiptError={receiptError}
                            fileInputRef={fileUploadRef}
                            onUploadClick={handleImageUpload}
                            onFileChange={handleFileChange}
                        />
                        )}
                    </div>
                </div>

                {/* ── Right: summary + coupon + submit ── */}
                <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4 lg:sticky lg:top-36">
                    <CouponBox
                        appliedCoupon={appliedCoupon}
                        couponApplied={!!preview?.isCouponApplied}
                        couponHasValue={!!preview?.isCouponHasValue}
                        discountMessage={preview?.discountMessage}
                        couponInput={couponInput}
                        onCouponInputChange={(value) => {
                            setCouponInput(value);
                            setCouponMsg(null);
                        }}
                        onApply={handleApplyCoupon}
                        onRemove={handleRemoveCoupon}
                        applying={previewLoading}
                        couponMsg={couponMsg}
                    />

                    <OrderSummary preview={preview} loading={previewLoading} totalQty={totalQty} />

                    {payMethod === 1 && <TrustBadge />}

                    <button
                        type="submit"
                        disabled={isSubmitLoading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100"
                    >
                        {isSubmitLoading ? (
                        <IconLoader2 size={18} className="animate-spin" />
                        ) : payMethod === 2 ? (
                        "ارسال رسید پرداخت"
                        ) : (
                        "ثبت و پرداخت سفارش"
                        )}
                    </button>

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