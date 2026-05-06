import apiInstance from "@/apis/apiInstance";

// ─── Request param types ─────────────────────────────────────────────────────

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

export interface IChangePasswordParams {
    currentPassword: string;
    password: string;
    rePassword: string;
}

export interface IChangeMobileRequestParams {
    mobile: string;
}

export interface IChangeMobileVerifyParams {
    mobile: string;
    code: string;
}

// ─── Order types ─────────────────────────────────────────────────────────────
export interface IOrderItem {
    id: number;
    orderId: number;
    productId: number;
    productName: string;
    productPicture: string;
    productFullPath: string;
    qty: number;
    unitPrice: number;
    unitPriceDisplay: string;
    discountRate: number;
    discountRateDisplay: string;
    totalPriceWithDiscount: number;
    totalPriceWithDiscountDisplay: string;
}

export interface IOrder {
    id: number;
    userId: number;
    creationDate: string;
    creationDateDisplay: string;
    lastModifiedDate: string;
    lastModifiedDateDisplay: string;
    sortDate: string;
    status: number;
    statusTitle: string;
    paymentMethod: string;
    paymentMethodInt: number;
    postTrackingNumber: string;
    totalAmount: number;
    totalAmountDisplay: string;
    discountAmount: number;
    discountAmountDisplay: string;
    couponCode: string;
    appliedCouponId: number;
    orderCouponAmount: number;
    orderCouponAmountDisplay: string;
    payAmount: number;
    payAmountDisplay: string;
    items: IOrderItem[];
}

export interface ITicket {
  userId:         number;
  subject:        string;
  message:        string;
  adminReply:     string | null;
  creationDate:   string;
  adminReplyDate: string | null;
  isAnswered:     boolean;
  trackingCode:   string;
}

export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: Record<string, string[]>;
}

// ─── Response types (extend as your API shapes become known) ─────────────────

export interface IUserProfile {
    id: string;
    fullname: string;
    username: string;
    email?: string;
    mobile?: string;
    profilePhoto?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const buildProfileForm = (
    data: IUpdateProfileParams | ICompleteProfileParams
): FormData => {
    const form = new FormData();
    form.append("fullname", data.fullname);
    form.append("username", data.username);
    if (data.email) form.append("email", data.email);
    if (data.profilePhoto) form.append("profilePhoto", data.profilePhoto);
    if ("password" in data) form.append("password", data.password);
    if ("repassword" in data) form.append("repassword", data.repassword);
    return form;
};

// ─── Account API calls ───────────────────────────────────────────────────────

export const getUser = async (): Promise<IUserProfile> => {
    const res = await apiInstance.get("/api/Account/me");
    return res.data;
};

export const getUserFavorites = async () => {
    const res = await apiInstance.get("/api/Account/favorites");
    return res.data;
};

export const getUserOrders = async (): Promise<IOrder[]> => {
    const res = await apiInstance.get<IApiResponse<IOrder[]>>(
        "/api/Account/orders"
    );
    return res.data.data;
};

export const getUserTickets = async (): Promise<ITicket[]> => {
  const res = await apiInstance.get<IApiResponse<ITicket[]>>("/api/Account/tickets");
  return res.data.data;
};

export const updateProfile = async (
    data: IUpdateProfileParams
): Promise<IUserProfile> => {
    const res = await apiInstance.post(
        "/api/Account/update-profile",
        buildProfileForm(data),
        { isFormDataRequest: true }
    );
    return res.data;
};

export const completeProfile = async (
    data: ICompleteProfileParams
): Promise<IUserProfile> => {
    const res = await apiInstance.post(
        "/api/Account/complete-profile",
        buildProfileForm(data),
        { isFormDataRequest: true }
    );
    return res.data;
};

export const changePassword = async ({
    currentPassword,
    password,
    rePassword,
}: IChangePasswordParams): Promise<void> => {
    const form = new FormData();
    form.append("CurrentPassword", currentPassword);
    form.append("password", password);
    form.append("rePassword", rePassword);
    await apiInstance.post("/api/Account/change-password", form, {
        isFormDataRequest: true,
    });
};

export const changeMobileReqOTP = async ({
    mobile,
}: IChangeMobileRequestParams): Promise<void> => {
    await apiInstance.post("/api/Account/change-mobile/request", { mobile });
};

export const changeMobileVerify = async ({
    mobile,
    code,
}: IChangeMobileVerifyParams) => {
    const res = await apiInstance.post("/api/Account/change-mobile/verify", {
        mobile,
        code,
    });
    return res.data;
};
