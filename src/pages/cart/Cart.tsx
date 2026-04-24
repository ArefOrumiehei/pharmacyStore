import { useEffect } from "react";
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

/* ---------------- TYPES ---------------- */
interface CartItem {
  productId: number;
  productName: string;
  picture: string;
  unitPrice: number;
  qty: number;
}

const IMAGE_BASE = "https://tk9839fd-5000.euw.devtunnels.ms/pictures/";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price);

/* ---------------- MAIN COMPONENT ---------------- */
export default function Cart() {
  const { cart, loading, fetchCart, increaseQty, decreaseQty, removeItem } =
    useCartStore();

  useEffect(() => {
    fetchCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const items: CartItem[] = cart?.items ?? [];
  const isEmpty = !loading && items.length === 0;

  return (
    <div className="w-full min-h-[70vh] flex gap-5 py-6" dir="rtl">
      {/* ── Cart Items Panel ── */}
      <div className="w-2/3 flex flex-col bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/80 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <ShoppingCart size={20} className="text-indigo-500" />
          <h3 className="text-lg font-bold text-gray-800">سبد خرید</h3>
          {items.length > 0 && !loading && (
            <span className="mr-auto text-xs font-medium text-gray-400">
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
              {items.map((item, index) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  index={index}
                  onIncrease={() => increaseQty(item.productId)}
                  onDecrease={() => decreaseQty(item.productId)}
                  onRemove={() => removeItem(item.productId)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Summary Panel ── */}
      <div className="w-1/3 flex flex-col bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">خلاصه سفارش</h3>
        </div>

        <div className="flex-1 px-6 py-5 space-y-3">
          <SummaryRow
            label="تعداد اقلام"
            value={`${formatPrice(items.length)} محصول`}
            loading={loading}
          />
          <SummaryRow
            label="جمع کالاها"
            value={`${(cart?.totalAmount ?? 0)} تومان`}
            loading={loading}
          />
          <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
            <SummaryRow
              label="مبلغ قابل پرداخت"
              value={`${(cart?.totalAmount ?? 0)} تومان`}
              bold
              loading={loading}
            />
          </div>
        </div>

        <div className="px-6 py-4">
          <button
            disabled={isEmpty || loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white py-3 text-sm font-semibold transition-all duration-150"
          >
            <span>ادامه و پرداخت</span>
            <ArrowLeft size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */
function CartItemRow({
  item,
  index,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  index: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  return (
    <li
      className="flex items-center gap-4 p-3 rounded-xl bg-white/80 border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all duration-200"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <img
        src={`${IMAGE_BASE}${item.picture}`}
        alt={item.productName}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-100"
        loading="lazy"
      />

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800 text-sm truncate">
          {item.productName}
        </h4>
        <p className="text-xs text-gray-400 mt-0.5">
          {(item.unitPrice)} تومان
        </p>
        <p className="text-xs font-medium text-indigo-500 mt-1">
          جمع: {(item.unitPrice * item.qty)} تومان
        </p>
      </div>

      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
        {item.qty === 1 ? (
          <ControlButton onClick={onRemove} danger>
            <Trash2 size={14} />
          </ControlButton>
        ) : (
          <ControlButton onClick={onDecrease}>
            <Minus size={14} />
          </ControlButton>
        )}

        <span className="min-w-[28px] text-center text-sm font-bold text-gray-700">
          {item.qty}
        </span>

        <ControlButton onClick={onIncrease}>
          <Plus size={14} />
        </ControlButton>
      </div>
    </li>
  );
}

function ControlButton({
  onClick,
  danger,
  children,
}: {
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150 active:scale-90 ${
        danger
          ? "text-rose-500 hover:bg-rose-50"
          : "text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  loading,
}: {
  label: string;
  value: string;
  bold?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={bold ? "font-bold text-gray-800" : "text-gray-500"}>
        {label}
      </span>
      {loading ? (
        <div
          className={`bg-gray-200 animate-pulse rounded ${
            bold ? "h-4 w-28" : "h-3.5 w-20"
          }`}
        />
      ) : (
        <span
          className={
            bold ? "font-bold text-indigo-600 text-base" : "text-gray-700"
          }
        >
          {value}
        </span>
      )}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
      <ShoppingCart size={40} strokeWidth={1.5} />
      <p className="text-sm">سبد خرید شما خالی است</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <ul className="space-y-3">
      {[1, 2, 3].map((i) => (
        <li
          key={i}
          className="flex items-center gap-4 p-3 rounded-xl bg-white/80 border border-gray-100"
        >
          <div className="w-16 h-16 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-200 animate-pulse rounded w-2/3" />
            <div className="h-3 bg-gray-200 animate-pulse rounded w-1/3" />
          </div>
          <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-lg" />
        </li>
      ))}
    </ul>
  );
}