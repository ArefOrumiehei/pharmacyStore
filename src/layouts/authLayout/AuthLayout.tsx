import { Outlet } from "react-router";
import { IconPill } from "@tabler/icons-react";
import { Link } from "react-router";

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50/50 px-4 py-12" dir="rtl">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-blue-800 flex items-center justify-center">
          <IconPill size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold text-blue-800">فارماپلاس</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl shadow-sm p-8">
        <Outlet />
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-6">
        © ۱۴۰۵ فارماپلاس — تمامی حقوق محفوظ است
      </p>
    </div>
  );
};

export default AuthLayout;