import { Link } from "react-router";
import { IconUser } from "@tabler/icons-react";

// Stores
import { useAuthStore } from "@/store/useAuthStore";

export default function UserSection() {
  const { accessToken } = useAuthStore();

  if (accessToken) {
    return (
      <Link to="/profile">
        <div className="bg-white border border-blue-200 rounded-xl p-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 cursor-pointer">
          <IconUser size={22} color="#1e40af" />
        </div>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-xl px-4 py-2 select-none hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
      <Link to="/login" className="text-sm text-blue-800 hover:text-blue-600 transition-colors">
        ورود
      </Link>
      <span className="text-blue-200">|</span>
      <Link to="/login/otp" className="text-sm text-blue-800 hover:text-blue-600 transition-colors">
        ثبت‌نام
      </Link>
    </div>
  );
}