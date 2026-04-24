import { Outlet, useLocation } from "react-router";
import Header from "./header/Header";
import Footer from "./footer/Footer";

function MainLayout() {
  const { pathname } = useLocation();
  const isProfile = pathname.startsWith("/profile");

  return (
    <div className="flex flex-col min-h-screen bg-sky-100 px-[3rem]">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      {!isProfile && <Footer />}
    </div>
  );
}

export default MainLayout;
