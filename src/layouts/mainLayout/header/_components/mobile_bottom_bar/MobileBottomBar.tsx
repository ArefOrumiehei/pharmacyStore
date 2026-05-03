import { Link, useLocation } from "react-router";
import {
  IconHome,
  IconCategory,
  IconSearch,
  IconShoppingCart,
  IconUser,
  IconLogin,
  IconX,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/useAccountStore";

interface MobileBottomBarProps {
  onCategoriesOpen: () => void;
  categoriesOpen: boolean;
  searchOpen: boolean;
  onSearchToggle: () => void;
}

export default function MobileBottomBar({
  onCategoriesOpen,
  categoriesOpen,
  searchOpen,
  onSearchToggle,
}: MobileBottomBarProps) {
  const location = useLocation();
  const { user } = useUserStore();

  const isActive = (path: string) => location.pathname === path;
  const isCheckoutRoute = (path: string) => location.pathname.split("/")[1] === path;

  return (
    <nav className="fixed bottom-0 inset-x-0 py-1 z-50 md:hidden bg-white border-t border-blue-100 shadow-[0_-4px_20px_rgba(30,64,175,0.08)]">
      <div className="flex items-center justify-around h-16 px-2">

        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 ${
            isActive("/") ? "text-blue-800" : "text-gray-400 hover:text-blue-800"
          }`}
        >
          <IconHome size={22} stroke={isActive("/") ? 2.2 : 1.7} />
          <span className="text-[10px] font-medium">خانه</span>
        </Link>

        {/* Categories */}
        <button
          onClick={onCategoriesOpen}
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 ${
            categoriesOpen ? "text-blue-800" : "text-gray-400 hover:text-blue-800"
          }`}
        >
          <IconCategory size={22} stroke={categoriesOpen ? 2.2 : 1.7} />
          <span className="text-[10px] font-medium">دسته‌بندی</span>
        </button>

        {/* Search — center elevated pill, toggles open/close */}
        <button
          onClick={onSearchToggle}
          className={`flex flex-col items-center gap-0.5 w-16 p-3 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 ${
            searchOpen
              ? "bg-gray-100 text-blue-800 shadow-gray-200/60"
              : "bg-blue-50 text-blue-800 shadow-blue-300/40"
          }`}
          aria-label={searchOpen ? "بستن جستجو" : "جستجو"}
        >
          {searchOpen
            ? <IconX size={22} stroke={2} />
            : <IconSearch size={22} stroke={1.8} />
          }
          <span className="text-[10px] font-medium">
            {searchOpen ? "بستن" : "جستجو"}
          </span>
        </button>

        {/* Cart */}
        <Link
          to="/checkout/cart"
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 ${
            isCheckoutRoute("checkout") ? "text-blue-800" : "text-gray-400 hover:text-blue-800"
          }`}
        >
          <IconShoppingCart size={22} stroke={isCheckoutRoute("checkout") ? 2.2 : 1.7} />
          <span className="text-[10px] font-medium">سبد خرید</span>
        </Link>

        {/* Profile / Login */}
        {user?.id ? (
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 ${
              isActive("/profile") ? "text-blue-800" : "text-gray-400 hover:text-blue-800"
            }`}
          >
            <IconUser size={22} stroke={isActive("/profile") ? 2.2 : 1.7} />
            <span className="text-[10px] font-medium">پروفایل</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 ${
              isActive("/login") ? "text-blue-800" : "text-gray-400 hover:text-blue-800"
            }`}
          >
            <IconLogin size={22} stroke={1.7} />
            <span className="text-[10px] font-medium">ورود</span>
          </Link>
        )}
      </div>
    </nav>
  );
}