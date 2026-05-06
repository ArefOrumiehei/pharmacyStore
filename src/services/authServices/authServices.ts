import apiInstance from "@/apis/apiInstance";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IAuthLoginParams {
  usernameOrMobile: string;
  password:         string;
  rememberMe:       boolean;
}

export interface IAuthTokenResponse {
  accessToken:  string;
  refreshToken: string;
}

export interface IForgotPasswordParams {
  mobile:          string;
  code:            string;
  password:        string;
  confirmPassword: string;
}

// ─── Auth API calls ───────────────────────────────────────────────────────────

export const authLogin = async (params: IAuthLoginParams): Promise<IAuthTokenResponse> => {
  const res = await apiInstance.post("/api/Auth/login", params);
  return res.data.data;
};

export const authRefreshToken = async (refreshToken: string): Promise<IAuthTokenResponse> => {
  const res = await apiInstance.post("/api/Auth/refresh", { refreshToken });
  return res.data.data;
};

export const authLogout = async (): Promise<void> => {
  await apiInstance.post("/api/Auth/logout");
};

export const loginSendOTP = async (mobile: string): Promise<void> => {
  await apiInstance.post("/api/Auth/login/send-otp", { mobile });
};

export const loginVerifyOTP = async (
  mobile: string,
  code:   string,
): Promise<IAuthTokenResponse> => {
  const res = await apiInstance.post("/api/Auth/login/verify-otp", { mobile, code });
  return res.data.data;
};

export const forgotPassSendOTP = async (mobile: string): Promise<void> => {
  await apiInstance.post("/api/Auth/forgot-password/send-otp", { mobile });
};

export const forgotPassVerifyAndReset = async (
  params: IForgotPasswordParams,
): Promise<void> => {
  await apiInstance.post("/api/Auth/forgot-password/verify-and-reset", params);
};