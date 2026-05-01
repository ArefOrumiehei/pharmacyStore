import apiInstance from "@/apis/apiInstance";

export interface ICompleteProfileParams {
  fullname: string;
  username: string;
  password: string;
  repassword: string;
  email?: string;
  profilePhoto?: File;
}

export interface IUpdateProfileParams {
  fullname: string;
  username: string;
  email?: string;
  profilePhoto?: File;
}

export const getUser = async () => {
  const res = await apiInstance.get("/api/Account/me")
  return res.data.data;
}

export const getUserFavorites = async () => {
  const res = await apiInstance.get("/api/Account/favorites")
  return res.data.data;
}

export const getUserOrders = async () => {
  const res = await apiInstance.get("/api/Account/orders")
  return res.data.data;
}

export const updateProfile = async (data: IUpdateProfileParams) => {
  const form = new FormData();

  form.append("fullname", data.fullname);
  form.append("username", data.username);

  if (data.email) {
    form.append("email", data.email);
  }

  if (data.profilePhoto) {
    form.append("profilePhoto", data.profilePhoto);
  }

  const res = await apiInstance.post("/api/Account/update-profile", form, {
    isFormDataRequest: true,
  });

  return res.data.data;
};

export const changePassword = async (CurrentPassword: string, password: string, rePassword: string) => {
  const form = new FormData();

  form.append("CurrentPassword", CurrentPassword);
  form.append("password", password);
  form.append("rePassword", rePassword);

  const res = await apiInstance.post("/api/Account/change-password", form, {
    isFormDataRequest: true,
  });

  return res.data.data;
};

export const getUserTickets = async () => {
  const res = await apiInstance.get("/api/Account/tickets")
  return res.data.data;
}

export const changeMobileReqOTP = async (mobile: string) => {
  await apiInstance.post("/api/Account/change-mobile/request", {mobile})
}

export const changeMobileVerify = async (mobile: string, code: string) => {
  const res = await apiInstance.post("/api/Account/change-mobile/verify", {mobile, code})
  return res.data;
}