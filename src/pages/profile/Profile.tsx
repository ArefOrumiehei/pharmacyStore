// src/pages/profile/Profile.tsx
import { Outlet, NavLink } from "react-router";
import { Card } from "@/components/ui/card";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

export default function Profile() {
  const menuItems = [
    { path: "/profile", icon: User, label: "اطلاعات حساب", end: true },
    { path: "/profile/orders", icon: ShoppingBag, label: "سفارش‌های من" },
    { path: "/profile/favorites", icon: Heart, label: "علاقه‌مندی‌ها" },
    { path: "/profile/addresses", icon: MapPin, label: "آدرس‌ها" },
    { path: "/profile/notifications", icon: Bell, label: "اعلان‌ها" },
    { path: "/profile/settings", icon: Settings, label: "تنظیمات" },
  ];

  const handleLogout = () => {
    console.log("Logout");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside>
          <Card className="p-4 sticky top-40">
            <div className="flex items-center gap-3 pb-4 border-b mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">نام کاربر</h3>
                <p className="text-sm text-muted-foreground">09123456789</p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>خروج از حساب</span>
              </button>
            </nav>
          </Card>
        </aside>

        {/* Main Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
