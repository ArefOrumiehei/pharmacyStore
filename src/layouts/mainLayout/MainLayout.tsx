import { Outlet, useLocation } from "react-router";
import Header from "./header/Header";
import Footer from "./footer/Footer";

function MainLayout() {
  const { pathname } = useLocation();
  const isProfile = pathname.startsWith("/profile");

  return (
    <div className="flex flex-col min-h-screen pb-18 md:pb-0 bg-gray-50/50">
      <Header />
      <main className="flex-1 w-full px-4 md:px-[3rem]">
        <Outlet />
      </main>
      {!isProfile && <Footer />}
    </div>
  );
}

export default MainLayout;
