import apiInstance from "@/apis/apiInstance";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface IUserProfile {
    id: string;
    fullname: string;
    username: string;
    email?: string;
    mobile?: string;
    profilePhoto?: string;
}

export interface IAddress {
    id: number;
    receiverFullName: string;
    receiverMobile: string;
    receiverAddress: string;
    receiverZipCode: string;
}

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
    userId: number;
    subject: string;
    message: string;
    adminReply: string | null;
    creationDate: string;
    adminReplyDate: string | null;
    isAnswered: boolean;
    trackingCode: string;
}

export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: Record<string, string[]>;
}

// ─── Param types ──────────────────────────────────────────────────────────────

export interface IUpdateProfileParams {
    fullname: string;
    username: string;
    email?: string;
    profilePhoto?: File;
}

export interface ICompleteProfileParams {
    fullname: string;
    username: string;
    password: string;
    repassword: string;
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

export interface IAddressFormParams {
    receiverFullName: string;
    receiverMobile: string;
    receiverAddress: string;
    receiverZipCode: string;
}

export interface IEditAddressFormParams extends IAddressFormParams {
    shippinginfoId: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toFormData = (entries: object): FormData => {
    const form = new FormData();
    for (const [key, value] of Object.entries(entries)) {
        if (value !== undefined && value !== null) {
            form.append(key, value as string | File);
        }
    }
    return form;
};

const buildProfileForm = (
    data: IUpdateProfileParams | ICompleteProfileParams
): FormData =>
    toFormData({
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        profilePhoto: data.profilePhoto,
        ...("password" in data ? { password: data.password } : {}),
        ...("repassword" in data ? { repassword: data.repassword } : {}),
    });

// ─── User ─────────────────────────────────────────────────────────────────────

export const getUser = async (): Promise<IUserProfile> => {
    const res = await apiInstance.get<IApiResponse<IUserProfile>>(
        "/api/Account/me"
    );
    return res.data.data;
};

export const updateProfile = async (
    data: IUpdateProfileParams
): Promise<IUserProfile> => {
    const res = await apiInstance.post<IApiResponse<IUserProfile>>(
        "/api/Account/update-profile",
        buildProfileForm(data),
        { isFormDataRequest: true }
    );
    return res.data.data;
};

export const completeProfile = async (
    data: ICompleteProfileParams
): Promise<IUserProfile> => {
    const res = await apiInstance.post<IApiResponse<IUserProfile>>(
        "/api/Account/complete-profile",
        buildProfileForm(data),
        { isFormDataRequest: true }
    );
    return res.data.data;
};

export const changePassword = async (
    data: IChangePasswordParams
): Promise<void> => {
    await apiInstance.post(
        "/api/Account/change-password",
        toFormData({
            CurrentPassword: data.currentPassword,
            password: data.password,
            rePassword: data.rePassword,
        }),
        { isFormDataRequest: true }
    );
};

export const changeMobileReqOTP = async (
    data: IChangeMobileRequestParams
): Promise<void> => {
    await apiInstance.post("/api/Account/change-mobile/request", data);
};

export const changeMobileVerify = async (
    data: IChangeMobileVerifyParams
): Promise<void> => {
    await apiInstance.post("/api/Account/change-mobile/verify", data);
};

// ─── Favorites ────────────────────────────────────────────────────────────────

export const getUserFavorites = async () => {
    const res = await apiInstance.get("/api/Account/favorites");
    return res.data.data;
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const getUserOrders = async (): Promise<IOrder[]> => {
    const res = await apiInstance.get<IApiResponse<IOrder[]>>(
        "/api/Account/orders"
    );
    return res.data.data;
};

// ─── Tickets ──────────────────────────────────────────────────────────────────

export const getUserTickets = async (): Promise<ITicket[]> => {
    const res = await apiInstance.get<IApiResponse<ITicket[]>>(
        "/api/Account/tickets"
    );
    return res.data.data;
};

// ─── Addresses ────────────────────────────────────────────────────────────────

export const getAllUserAddresses = async (): Promise<IAddress[]> => {
    const res = await apiInstance.get<IApiResponse<IAddress[]>>(
        "/api/Account/ShippingInfos"
    );
    return res.data.data;
};

export const getUserAddress = async (addressId: number): Promise<IAddress> => {
    const res = await apiInstance.get<IApiResponse<IAddress>>(
        `/api/Account/ShippingInfos/${addressId}`
    );
    return res.data.data;
};

export const createUserAddress = async (
    data: IAddressFormParams
): Promise<void> => {
    await apiInstance.post("/api/Account/ShippingInfos", toFormData(data), {
        isFormDataRequest: true,
    });
};

export const editUserAddress = async (
    data: IEditAddressFormParams
): Promise<void> => {
    await apiInstance.put("/api/Account/ShippingInfos", toFormData(data), {
        isFormDataRequest: true,
    });
};

export const deleteUserAddress = async (addressId: number): Promise<void> => {
    await apiInstance.delete(`/api/Account/ShippingInfos/${addressId}`); // was: .get ← bug fixed
};
