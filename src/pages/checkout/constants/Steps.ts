import { IconShoppingCart, IconMapPin, IconCreditCard } from "@tabler/icons-react";
import type { ComponentType } from "react";
import type { CheckoutStep } from "../interfaces/checkout";

export interface StepConfig {
  id: CheckoutStep;
  path: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export const STEPS: StepConfig[] = [
  { id: 1, path: "cart", label: "سبد خرید", icon: IconShoppingCart },
  { id: 2, path: "address", label: "آدرس تحویل", icon: IconMapPin },
  { id: 3, path: "payment", label: "پرداخت", icon: IconCreditCard },
];