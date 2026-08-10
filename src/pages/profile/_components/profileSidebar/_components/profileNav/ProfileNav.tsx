import { NavLink } from "react-router";
import { IconLogout, IconChevronLeft } from "@tabler/icons-react";
import { MENU_ITEMS } from "../../../../constants/Constants";

interface ProfileNavProps {
  onLogoutClick: () => void;
}

export default function ProfileNav({ onLogoutClick }: ProfileNavProps) {
  return (
    <nav className="p-2 sm:p-3 space-y-1">
      {MENU_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-blue-800 text-white"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-800"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={16} className="flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && <IconChevronLeft size={13} className="opacity-70 flex-shrink-0 sm:w-[15px] sm:h-[15px]" />}
            </>
          )}
        </NavLink>
      ))}

      <div className="pt-1.5 sm:pt-2 border-t border-blue-50 mt-1.5 sm:mt-2">
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all duration-150"
        >
          <IconLogout size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>خروج از حساب</span>
        </button>
      </div>
    </nav>
  );
}