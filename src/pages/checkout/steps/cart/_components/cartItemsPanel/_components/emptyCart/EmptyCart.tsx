import { Link } from "react-router";
import { IconShoppingCart } from "@tabler/icons-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-52 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
        <IconShoppingCart size={28} className="text-blue-300" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">سبد خرید شما خالی است</p>
        <p className="text-xs text-gray-400 mt-1">محصولات مورد نظر را اضافه کنید</p>
      </div>
      <Link
        to="/plp"
        className="text-sm text-blue-800 font-medium hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
      >
        رفتن به فروشگاه
      </Link>
    </div>
  );
}