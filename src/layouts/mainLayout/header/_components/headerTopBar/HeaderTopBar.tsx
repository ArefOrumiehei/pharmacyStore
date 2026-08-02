import { Link } from "react-router";
import { IconPill } from "@tabler/icons-react";
import SearchBox from "./_components/search_box/SearchBox";
import UserSection from "./_components/userSection/UserSection";
import CartBtn from "./_components/cartBtn/CartBtn";

const navLinks = [
  { to: "/blog", label: "مقالات" },
  { to: "/aboutus", label: "درباره‌ما" },
  { to: "/contactus", label: "تماس‌با‌ما" },
];

export default function HeaderTopBar() {
  return (
    <div className="bg-white border-b border-blue-100">
      <div className="w-full mx-auto flex items-center justify-between h-20 px-4 md:px-12 gap-4">

        {/* Logo + Desktop Search */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 flex-1 md:flex-none min-w-0 flex-col md:flex-row">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-blue-800 flex items-center justify-center">
                <IconPill size={16} className="text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-blue-800">
                فارماپلاس
              </h1>
            </Link>

            {/* Mobile size Navlinks */}
            <nav className="md:hidden flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  className="p-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex flex-1 min-w-0">
            <SearchBox />
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <UserSection />
          <CartBtn />
        </div>
      </div>
    </div>
  );
}