import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";

// Stores
import { useAuthStore } from "@/store/useAuthStore";

// Consts
import { MOBILE_HIDE_SIDEBAR_PATTERNS } from "./constants/Constants";

// Components
import ConfirmModal from "@/components/common/confirmModal/ConfirmModal";
import ProfileSidebar from "./_components/profileSidebar/ProfileSidebar";

export default function Profile() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const hideSidebarOnMobile = MOBILE_HIDE_SIDEBAR_PATTERNS.some((pattern) => pattern.test(pathname));

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } finally {
      setLoggingOut(false);
      setLogoutConfirmOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4" dir="rtl">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[280px_1fr]">
        <ProfileSidebar
          hideOnMobile={hideSidebarOnMobile}
          onLogoutClick={() => setLogoutConfirmOpen(true)}
        />

        <main>
          <Outlet />
        </main>
      </div>

      <ConfirmModal
        open={logoutConfirmOpen}
        title="خروج از حساب"
        description="آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟"
        confirmLabel="خروج از حساب"
        cancelLabel="انصراف"
        loading={loggingOut}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </div>
  );
}