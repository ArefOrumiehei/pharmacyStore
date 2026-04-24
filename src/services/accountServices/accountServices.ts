import apiInstance from "@/apis/apiInstance";

export interface ICompleteProfileParams {
  fullname: string;
  username: string;
  password: string;
  repassword: string;
  email?: string;
  profilePhoto?: File;
}

export interface IEditProfileParams {
  fullname: string;
  username: string;
  mobile: string;
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

export const completeProfile = async (data: ICompleteProfileParams) => {
  const form = new FormData();

  form.append("fullname", data.fullname);
  form.append("username", data.username);
  form.append("password", data.password);
  form.append("repassword", data.repassword);

  if (data.email) {
    form.append("email", data.email);
  }

  if (data.profilePhoto) {
    form.append("profilePhoto", data.profilePhoto);
  }

  const res = await apiInstance.post("/api/Account/complete-profile", form, {
    isFormDataRequest: true,
  });

  return res.data.data;
};

export const editProfile = async (data: IEditProfileParams) => {
  const form = new FormData();

  form.append("fullname", data.fullname);
  form.append("username", data.username);
  form.append("mobile", data.mobile);

  if (data.email) {
    form.append("email", data.email);
  }

  if (data.profilePhoto) {
    form.append("profilePhoto", data.profilePhoto);
  }

  const res = await apiInstance.post("/api/Account/edit-profile", form, {
    isFormDataRequest: true,
  });

  return res.data.data;
};

export const changePassword = async (password: string, rePassword: string) => {
  const form = new FormData();

  form.append("password", password);
  form.append("rePassword", rePassword);

  const res = await apiInstance.post("/api/Account/change-password", form, {
    isFormDataRequest: true,
  });

  return res.data.data;
};