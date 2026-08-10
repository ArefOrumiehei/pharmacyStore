import apiInstance from "@/apis/apiInstance"

// ─── Types ───────────────────
export interface ITicketTitles {
  titles: ITicketSubjects[];
}

export interface ITicketSubjects {
  titleName: string;
  numberOfRow: number;
}

export interface ISocialItem {
  platformName: string;
  linkOrId: string;
}

export interface ISocialItems {
  items: ISocialItem[];
}

export interface IContactOptions {
  phones: IPhoneItems[];
  email: string;
  address: string;
  workingHours: string;
  latitude: null;
  longitude: null;
}

export interface IPhoneItems {
  title: string;
  number: string;
}

export interface IGeneralSetting {
  isMaintenanceMode: boolean;
  copyrightText: string;
}

export interface ISiteGlobalSetting {
  logo: string;
  favicon: string;
  socials: ISocialItems;
  contact: IContactOptions;
  generalSetting: IGeneralSetting;
}

export interface IAboutUsData {
  text: string;
}

export interface IFAQItems {
  question: string;
  answer: string;
  value: string;
}

export interface IFAQData {
  items: IFAQItems[];
}

export interface ITermsData {
  text: string;
}

export interface IReturnPolicyData {
  text: string;
}

export interface ICards {
  owner: string;
  number: string;
}

export interface IPaymentMethods {
  cards: ICards[];
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getTicketTitles = async (): Promise<ITicketTitles> => {
  const res = await apiInstance.get<IApiResponse<ITicketTitles>>("/api/site-settings/ticket-titles");
  return res.data.data;
};

export const getSiteGlobalSetting = async (): Promise<ISiteGlobalSetting> => {
  const res = await apiInstance.get<IApiResponse<ISiteGlobalSetting>>("/api/site-settings/global");
  return res.data.data;
}

export const getAboutUsData = async (): Promise<IAboutUsData> => {
  const res = await apiInstance.get<IApiResponse<IAboutUsData>>("/api/site-settings/about");
  return res.data.data;
}

export const getFAQData = async (): Promise<IFAQData> => {
  const res = await apiInstance.get<IApiResponse<IFAQData>>("/api/site-settings/faq");
  return res.data.data;
}

export const getTermsData = async (): Promise<ITermsData> => {
  const res = await apiInstance.get<IApiResponse<ITermsData>>("/api/site-settings/terms");
  return res.data.data;
}

export const getReturnPolicyData = async (): Promise<IReturnPolicyData> => {
  const res = await apiInstance.get<IApiResponse<IReturnPolicyData>>("/api/site-settings/return-policy");
  return res.data.data;
}

export const getPaymentMethods = async (): Promise<IPaymentMethods> => {
  const res = await apiInstance.get<IApiResponse<IPaymentMethods>>("/api/site-settings/payment");
  return res.data.data;
}