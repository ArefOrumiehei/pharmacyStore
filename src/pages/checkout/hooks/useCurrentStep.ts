import { useLocation } from "react-router";
import type { CheckoutStep } from "../interfaces/checkout";

export function useCurrentStep(): CheckoutStep {
  const { pathname } = useLocation();
  if (pathname.includes("address")) return 2;
  if (pathname.includes("payment")) return 3;
  return 1;
}