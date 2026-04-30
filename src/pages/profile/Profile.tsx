import { Outlet, NavLink, useNavigate } from "react-router";
import {
  IconUser,
  IconShoppingBag,
  IconHeart,
  IconMapPin,
  IconSettings,
  IconLogout,
  IconBell,
  IconChevronLeft,
  IconHeadset,
  IconMessage2,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/useAccountStore";
import { useAuthStore } from "@/store/useAuthStore";

const MENU_ITEMS = [
  { path: "/profile", icon: IconUser, label: "خلاصه فعالیت", end: true },
  { path: "/profile/account", icon: IconUser, label: "حساب کاربری" },
  { path: "/profile/orders", icon: IconShoppingBag, label: "سفارش‌های من" },
  { path: "/profile/favorites", icon: IconHeart, label: "علاقه‌مندی‌ها" },
  { path: "/profile/comments", icon: IconMessage2, label: "نظرات من" },
  { path: "/profile/addresses", icon: IconMapPin, label: "آدرس‌های من" },
  { path: "/profile/tickets",       icon: IconHeadset,     label: "تیکت‌های پشتیبانی" },
  { path: "/profile/notifications", icon: IconBell, label: "اعلان‌ها" },
  { path: "/profile/settings", icon: IconSettings, label: "تنظیمات" },
];

export default function Profile() {
  const { user } = useUserStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

        {/* ── Sidebar ── */}
        <aside>
          <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden sticky top-36">

            {/* User info */}
            <div className="flex items-center gap-3 p-5 border-b border-blue-50 bg-blue-50/50">
              <div className="w-12 h-12 rounded-2xl bg-blue-800 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {user?.fullname?.[0] ?? user?.username?.[0] ?? "؟"}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-800 text-sm truncate">
                  {user?.fullname ?? user?.username ?? "کاربر"}
                </h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {user?.mobile ?? user?.email ?? ""}
                </p>
              </div>
            </div>

            {/* Nav */}
            <nav className="p-3 space-y-1">
              {MENU_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-blue-800 text-white"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-800"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={18} className="flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <IconChevronLeft size={15} className="opacity-70" />}
                    </>
                  )}
                </NavLink>
              ))}

              <div className="pt-2 border-t border-blue-50 mt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all duration-150"
                >
                  <IconLogout size={18} />
                  <span>خروج از حساب</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* ── Main ── */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}