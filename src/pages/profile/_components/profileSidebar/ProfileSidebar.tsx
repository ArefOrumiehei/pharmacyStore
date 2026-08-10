import ProfileNav from "./_components/profileNav/ProfileNav";
import UserInfo from "./_components/userInfo/UserInfo";

interface ProfileSidebarProps {
  hideOnMobile: boolean;
  onLogoutClick: () => void;
}

export default function ProfileSidebar({ hideOnMobile, onLogoutClick }: ProfileSidebarProps) {
  return (
    <aside className={hideOnMobile ? "hidden lg:block" : ""}>
      <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl overflow-hidden lg:sticky lg:top-36">
        <UserInfo />
        <ProfileNav onLogoutClick={onLogoutClick} />
      </div>
    </aside>
  );
}