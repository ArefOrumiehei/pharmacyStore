import { IMAGE_BASE } from "@/apis/apiInstance";
import { useUserStore } from "@/store/useAccountStore";

export default function UserInfo() {
  const { user } = useUserStore();
  
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 p-3.5 sm:p-5 border-b border-blue-50 bg-blue-50/50">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-800 flex items-center justify-center flex-shrink-0">
        {user?.profilePhoto ? (
          <img
            src={`${IMAGE_BASE}/${user.profilePhoto}`}
            alt={user.fullname ?? user.username ?? "پروفایل"}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-white font-bold text-sm sm:text-lg">
            {user?.fullname?.[0] ?? user?.username?.[0] ?? "؟"}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-gray-800 text-xs sm:text-sm truncate">
          {user?.fullname ?? user?.username ?? "کاربر"}
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-400 truncate mt-0.5">
          {user?.mobile ?? user?.email ?? ""}
        </p>
      </div>
    </div>
  );
}