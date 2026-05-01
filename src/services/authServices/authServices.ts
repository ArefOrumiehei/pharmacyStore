import apiInstance from "@/apis/apiInstance";

export interface Role {
  id: number;
  name: string;
  creationDate: string;
}

export interface IAuthRegisterParams {
  fullname: string;
  username: string;
  password: string;
  mobile: string;
  email?: string;
  roleId?: number;
  profilePhoto?: string;
  roles?: Role[];
}

export interface IAuthLoginParams {
  usernameOrMobile: string;
  password: string;
  rememberMe: boolean;
}

export const authRegister = async (params: IAuthRegisterParams) => {
  const res = await apiInstance.post("/api/Auth/register", params)
  return res.data.data;
}

export const authLogin = async (params: IAuthLoginParams) => {
  const res = await apiInstance.post("/api/Auth/login", params)
  return res.data.data;
}

export const authRefreshToken = async (refreshToken: string) => {
  const res = await apiInstance.post("/api/Auth/refresh", {refreshToken})
  return res.data.data;
}

export const authLogout = async () => {
  const res = await apiInstance.post("/api/Auth/logout")
  return res.data.data;
}

export const loginSendOTP = async (mobile: string) => {
  await apiInstance.post("/api/Auth/login/send-otp", {mobile})
}

export const loginVerifyOTP = async (mobile: string, code: string) => {
  const res = await apiInstance.post("/api/Auth/login/verify-otp", {mobile, code})
  return res.data;
}

export const forgotPassSendOTP = async (mobile: string) => {
  await apiInstance.post("/api/Auth/forgot-password/send-otp", {mobile})
}

export const forgotPassVerifyAndReset = async (mobile: string, code: string, password: string, confirmPassword: string) => {
  const res = await apiInstance.post("/api/Auth/forgot-password/verify-and-reset", {mobile, code, password, confirmPassword})
  return res.data;
}