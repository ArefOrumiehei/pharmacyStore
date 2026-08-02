import { Link } from "react-router";
import { IconShoppingCart } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";

// Stores
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

export default function CartBtn() {
  const { accessToken } = useAuthStore();
  const cart = useCartStore((s) => s.cart);
  const guestCart = useCartStore((s) => s.guestCart);

  const totalQty = accessToken
    ? cart?.items?.reduce((sum, item) => sum + item.qty, 0) ?? 0
    : guestCart?.reduce((sum, item) => sum + item.qty, 0) ?? 0;

  const displayCount = totalQty > 99 ? "99+" : totalQty;

  return (
    <Link to="/checkout/cart">
      <div className="relative bg-white border border-blue-200 rounded-xl p-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 cursor-pointer">
        <IconShoppingCart size={22} color="#1e40af" />
        {totalQty > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-blue-800 text-white text-[10px] font-bold leading-none shadow-sm">
            {toPersianDigits(displayCount)}
          </span>
        )}
      </div>
    </Link>
  );
}