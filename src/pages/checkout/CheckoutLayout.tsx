import { Outlet, useLocation } from "react-router";
import { StepIndicator } from "./_components/stepIndicator/StepIndicator";

export default function CheckoutLayout() {
  const { pathname } = useLocation();
  const isSuccessPage = pathname.includes("order-success");

  return (
    <div className="w-full min-h-screen py-4 px-3 sm:px-4" dir="rtl">
      {!isSuccessPage && <StepIndicator />}
      <div className="max-w-5xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}