import { useEffect } from "react";
import { Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import { IconShoppingCart, IconTag } from "@tabler/icons-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router";
import { IMAGE_BASE } from "@/apis/apiInstance";
import { toPersianDigits } from "smart-persian-tools";

interface CartItem {
    productId: number;
    productName: string;
    picture: string;
    unitPrice: number;
    qty: number;
}

export default function CartStep() {
    const navigate = useNavigate();
    const { accessToken } = useAuthStore();
    const isGuest = !accessToken;

    const {
        cart, loading,
        fetchCart, increaseQty, decreaseQty, removeItem,
        guestCart, loadGuestCart, increaseGuestQty, decreaseGuestQty, removeGuestItem,
    } = useCartStore();

    useEffect(() => {
        if (isGuest) {
            loadGuestCart();
        } else {
            fetchCart();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Unified display items regardless of guest/auth
    const items: CartItem[] = isGuest ? guestCart : (cart?.items ?? []);
    const isEmpty = !loading && items.length === 0;
    const totalAmount = isGuest
        ? guestCart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0)
        : (cart?.totalAmount ?? 0);

    const handleProceed = () => {
        if (isEmpty || loading) return;
        if (isGuest) {
            // Guest: go to login, come back to address after auth
            navigate("/login/otp", { state: { returnTo: "/checkout/address" } });
        } else {
            // Authenticated: go directly to address (sync happens there on mount)
            navigate("/checkout/address");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-5">

            {/* ── Items panel ── */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl border border-blue-100 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-50">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <IconShoppingCart size={16} className="text-blue-800" />
                    </div>
                    <h3 className="text-base font-bold text-blue-800">سبد خرید</h3>
                    {items.length > 0 && !loading && (
                        <span className="mr-auto text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                            {items.length} محصول
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {loading ? (
                        <LoadingSkeleton />
                    ) : isEmpty ? (
                        <EmptyCart />
                    ) : (
                        <ul className="space-y-3">
                            {items.map((item, i) => (
                                <CartItemRow
                                    key={item.productId}
                                    item={item}
                                    index={i}
                                    onIncrease={() => isGuest ? increaseGuestQty(item.productId) : increaseQty(item.productId)}
                                    onDecrease={() => isGuest ? decreaseGuestQty(item.productId) : decreaseQty(item.productId)}
                                    onRemove={() => isGuest ? removeGuestItem(item.productId) : removeItem(item.productId)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* ── Summary panel ── */}
            <div className="lg:w-80 flex flex-col bg-white rounded-2xl border border-blue-100 overflow-hidden h-fit">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-50">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <IconTag size={16} className="text-blue-800" />
                    </div>
                    <h3 className="text-base font-bold text-blue-800">خلاصه سفارش</h3>
                </div>

                <div className="px-6 py-5 space-y-3">
                    <SummaryRow label="تعداد اقلام" value={`${toPersianDigits(items.length)} محصول`} loading={loading} />
                    <SummaryRow label="جمع کالاها" value={`${toPersianDigits(totalAmount)} تومان`} loading={loading} />
                    <SummaryRow label="هزینه ارسال" value="رایگان" loading={loading} highlight="green" />
                    <div className="border-t border-dashed border-blue-100 pt-3">
                        <SummaryRow label="مبلغ قابل پرداخت" value={`${toPersianDigits(totalAmount)} تومان`} loading={loading} bold />
                    </div>
                </div>

                <div className="px-6 pb-6 flex flex-col gap-3">
                    <button
                        onClick={handleProceed}
                        disabled={isEmpty || loading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white py-3 text-sm font-semibold transition-all duration-150 shadow-sm shadow-blue-100"
                    >
                        {isGuest ? (
                            <span>ورود برای ادامه خرید</span>
                        ) : (
                            <span>ادامه — ثبت آدرس</span>
                        )}
                        <ArrowLeft size={15} />
                    </button>

                    {/* Guest hint */}
                    {isGuest && !isEmpty && (
                        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-center leading-relaxed">
                            سبد خرید شما پس از ورود حفظ می‌شود
                        </p>
                    )}
                    {!isGuest && (
                        <p className="text-xs text-gray-400 text-center">
                            پرداخت امن با درگاه‌های معتبر بانکی
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */

function CartItemRow({
    item, index, onIncrease, onDecrease, onRemove,
}: {
    item: CartItem; index: number;
    onIncrease: () => void; onDecrease: () => void; onRemove: () => void;
}) {
    return (
        <li
            className="flex items-center gap-4 p-3 rounded-xl bg-white border border-blue-50 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <img
                src={`${IMAGE_BASE}${item.picture}`}
                alt={item.productName}
                className="w-16 h-16 rounded-xl object-contain flex-shrink-0 bg-blue-50/50 border border-blue-50 p-1"
                loading="lazy"
            />
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 text-sm truncate">{item.productName}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{toPersianDigits(item.unitPrice)} تومان</p>
                <p className="text-xs font-semibold text-blue-800 mt-1">
                    جمع: {toPersianDigits(item.unitPrice * item.qty)} تومان
                </p>
            </div>
            <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 rounded-xl p-1 flex-shrink-0">
                {item.qty === 1 ? (
                    <ControlButton onClick={onRemove} danger><Trash2 size={13} /></ControlButton>
                ) : (
                    <ControlButton onClick={onDecrease}><Minus size={13} /></ControlButton>
                )}
                <span className="min-w-[28px] text-center text-sm font-bold text-blue-800">{item.qty}</span>
                <ControlButton onClick={onIncrease}><Plus size={13} /></ControlButton>
            </div>
        </li>
    );
}

function ControlButton({ onClick, danger, children }: {
    onClick: () => void; danger?: boolean; children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150 active:scale-90 ${
                danger ? "text-rose-500 hover:bg-rose-50" : "text-blue-800 hover:bg-blue-100"
            }`}
        >
            {children}
        </button>
    );
}

function SummaryRow({ label, value, bold, loading, highlight }: {
    label: string; value: string; bold?: boolean; loading?: boolean; highlight?: "green";
}) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className={bold ? "font-bold text-gray-800" : "text-gray-500"}>{label}</span>
            {loading ? (
                <div className={`bg-blue-50 animate-pulse rounded ${bold ? "h-4 w-28" : "h-3.5 w-20"}`} />
            ) : (
                <span className={
                    bold ? "font-bold text-blue-800 text-base"
                    : highlight === "green" ? "text-green-600 font-medium"
                    : "text-gray-700"
                }>
                    {value}
                </span>
            )}
        </div>
    );
}

function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center h-52 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <IconShoppingCart size={28} className="text-blue-300" />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-gray-500">سبد خرید شما خالی است</p>
                <p className="text-xs text-gray-400 mt-1">محصولات مورد نظر را اضافه کنید</p>
            </div>
            <Link to="/" className="text-sm text-blue-800 font-medium hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all duration-200">
                رفتن به فروشگاه
            </Link>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-4 p-3 rounded-xl border border-blue-50">
                    <div className="w-16 h-16 rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-blue-50 animate-pulse rounded w-2/3" />
                        <div className="h-3 bg-blue-50 animate-pulse rounded w-1/3" />
                        <div className="h-3 bg-blue-50 animate-pulse rounded w-1/2" />
                    </div>
                    <div className="w-24 h-9 bg-blue-50 animate-pulse rounded-xl" />
                </li>
            ))}
        </ul>
    );
}