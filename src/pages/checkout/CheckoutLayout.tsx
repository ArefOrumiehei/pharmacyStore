import { Outlet, useLocation } from "react-router";
import { IconShoppingCart, IconMapPin, IconCreditCard, IconCheck } from "@tabler/icons-react";

export type CheckoutStep = 1 | 2 | 3;

export interface AddressData {
  receiverFullName: string;
  receiverMobile: string;
  receiverAddress: string;
  receiverZipCode: string;
}

const STEPS = [
  { id: 1, path: "cart",    label: "سبد خرید",   icon: IconShoppingCart },
  { id: 2, path: "address", label: "آدرس تحویل", icon: IconMapPin       },
  { id: 3, path: "payment", label: "پرداخت",     icon: IconCreditCard   },
];

function useCurrentStep(): CheckoutStep {
  const { pathname } = useLocation();
  if (pathname.includes("address")) return 2;
  if (pathname.includes("payment")) return 3;
  return 1;
}

function StepIndicator() {
  const current = useCurrentStep();

  return (
    <div className="w-full flex items-center justify-center px-4 py-6">
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const done   = step.id < current;
          const active = step.id === current;
          const Icon   = step.icon;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                    done
                      ? "bg-blue-800 border-blue-800 shadow-md shadow-blue-200"
                      : active
                      ? "bg-white border-blue-800 shadow-md shadow-blue-100"
                      : "bg-white border-blue-100"
                  }`}
                >
                  {done ? (
                    <IconCheck size={16} className="text-white" strokeWidth={2.5} />
                  ) : (
                    <Icon size={16} className={active ? "text-blue-800" : "text-gray-300"} />
                  )}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                    active ? "text-blue-800" : done ? "text-blue-400" : "text-gray-300"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div className="w-8 sm:w-24 md:w-32 lg:w-48 h-0.5 mb-5 mx-2 rounded-full overflow-hidden bg-blue-100">
                  <div
                    className="h-full bg-blue-800 rounded-full transition-all duration-500"
                    style={{ width: done ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CheckoutLayout() {
  return (
    <div className="w-full min-h-screen py-4 px-4" dir="rtl">
      <StepIndicator />
      <div className="max-w-5xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}