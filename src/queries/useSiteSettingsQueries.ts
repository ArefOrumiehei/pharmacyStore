import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  getTicketTitles,
  getSiteGlobalSetting,
  getAboutUsData,
  getFAQData,
  getTermsData,
  getReturnPolicyData,
  getPaymentMethods,
  type ITicketTitles,
  type ISiteGlobalSetting,
  type IAboutUsData,
  type IFAQData,
  type ITermsData,
  type IReturnPolicyData,
  type IPaymentMethods,
} from "@/services/siteServices/siteServices";

/**
 * This content changes rarely (site config, static pages, bank cards) and is
 * safe to keep around for a while — 30 min stale, 1 hr garbage-collected —
 * instead of refetching on every mount/window focus.
 */
const STALE_TIME = 30 * 60 * 1000;
const GC_TIME = 60 * 60 * 1000;

// ─── Query keys ─────────────────────────────────────────────────────────────
// Centralized so components can invalidate/prefetch without hardcoding strings,
// e.g. queryClient.invalidateQueries({ queryKey: siteSettingsKeys.global() }).
export const siteSettingsKeys = {
  all: ["site-settings"] as const,
  ticketTitles: () => [...siteSettingsKeys.all, "ticket-titles"] as const,
  global: () => [...siteSettingsKeys.all, "global"] as const,
  aboutUs: () => [...siteSettingsKeys.all, "about"] as const,
  faq: () => [...siteSettingsKeys.all, "faq"] as const,
  terms: () => [...siteSettingsKeys.all, "terms"] as const,
  returnPolicy: () => [...siteSettingsKeys.all, "return-policy"] as const,
  paymentMethods: () => [...siteSettingsKeys.all, "payment"] as const,
};

// A trimmed-down options type: callers can override cache timing, enabled, etc.,
// but queryKey/queryFn are fixed per hook.
type QueryOpts<T> = Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;

// ─── Hooks ──────────────────────────────────────────────────────────────────

export const useTicketTitlesQuery = (options?: QueryOpts<ITicketTitles>) =>
  useQuery({
    queryKey: siteSettingsKeys.ticketTitles(),
    queryFn: getTicketTitles,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options,
  });

export const useSiteGlobalSettingQuery = (options?: QueryOpts<ISiteGlobalSetting>) =>
  useQuery({
    queryKey: siteSettingsKeys.global(),
    queryFn: getSiteGlobalSetting,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options,
  });

export const useAboutUsQuery = (options?: QueryOpts<IAboutUsData>) =>
  useQuery({
    queryKey: siteSettingsKeys.aboutUs(),
    queryFn: getAboutUsData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options,
  });

export const useFAQQuery = (options?: QueryOpts<IFAQData>) =>
  useQuery({
    queryKey: siteSettingsKeys.faq(),
    queryFn: getFAQData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options,
  });

export const useTermsQuery = (options?: QueryOpts<ITermsData>) =>
  useQuery({
    queryKey: siteSettingsKeys.terms(),
    queryFn: getTermsData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options,
  });

export const useReturnPolicyQuery = (options?: QueryOpts<IReturnPolicyData>) =>
  useQuery({
    queryKey: siteSettingsKeys.returnPolicy(),
    queryFn: getReturnPolicyData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options,
  });

export const usePaymentMethodsQuery = (options?: QueryOpts<IPaymentMethods>) =>
  useQuery({
    queryKey: siteSettingsKeys.paymentMethods(),
    queryFn: getPaymentMethods,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options,
  });