import apiInstance from "@/apis/apiInstance";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface IUserProfile {
    id: string;
    fullname: string;
    username: string;
    email?: string;
    mobile?: string;
    profilePhoto?: string;
    hasPassword: boolean;
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

export interface ILatestOrder {
    id: number;
    userId: number;
    creationDate: string;
    creationDateDisplay: string;
    status: number;
    statusTitle: string;
    payAmount: number;
    payAmountDisplay: string;
    itemsCount: number;
}

export interface ITicket {
    userId: number;
    ticketId: number;
    subject: string;
    message: string;
    adminReply: string | null;
    creationDate: string;
    adminReplyDate: string | null;
    isAnswered: boolean;
    trackingCode: string;
}

export interface IOverview {
    totalOrders: number;
    totalRefundedOrders: number;
    totalDeliveredOrders: number;
    totalFaves: number;
    totalAddresses: number;
    latestOrders: ILatestOrder[];
}

export interface IUserComments {
    message: string;
    creationDate: string;
    rate: number;
    likeCount: number;
    dislikeCount: number;
    reply: string;
    replyDate: string;
    productSlug: string;
    categorySlug: string;
}

export interface IApiResponse<T = null> {
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

export interface ISetPasswordParams {
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
    id: string;
}


export interface IRequestReturnParams {
    orderId: number;
    reason: string;
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
        fullname:     data.fullname,
        username:     data.username,
        email:        data.email,
        profilePhoto: data.profilePhoto,
        ...("password"   in data ? { password:   data.password   } : {}),
        ...("repassword" in data ? { repassword: data.repassword } : {}),
    });

// ─── User ─────────────────────────────────────────────────────────────────────

export const getUser = async (): Promise<IApiResponse<IUserProfile>> => {
    const res = await apiInstance.get<IApiResponse<IUserProfile>>("/api/Account/me");
    return res.data;
};

export const updateProfile = async (
    data: IUpdateProfileParams
): Promise<IApiResponse<IUserProfile>> => {
    const res = await apiInstance.post<IApiResponse<IUserProfile>>(
        "/api/Account/update-profile",
        buildProfileForm(data),
        { isFormDataRequest: true }
    );
    return res.data;
};

export const completeProfile = async (
    data: ICompleteProfileParams
): Promise<IApiResponse<IUserProfile>> => {
    const res = await apiInstance.post<IApiResponse<IUserProfile>>(
        "/api/Account/complete-profile",
        buildProfileForm(data),
        { isFormDataRequest: true }
    );
    return res.data;
};

export const changePassword = async (
    data: IChangePasswordParams
): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>(
        "/api/Account/change-password",
        toFormData({
            CurrentPassword: data.currentPassword,
            password:        data.password,
            rePassword:      data.rePassword,
        }),
        { isFormDataRequest: true }
    );
    return res.data;
};

export const setPassword = async (
    data: ISetPasswordParams
): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>(
        "/api/Account/set-password",
        toFormData({ password: data.password, rePassword: data.rePassword }),
        { isFormDataRequest: true }
    );
    return res.data;
};

export const changeMobileReqOTP = async (
    data: IChangeMobileRequestParams
): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>("/api/Account/change-mobile/request", data);
    return res.data;
};

export const changeMobileVerify = async (
    data: IChangeMobileVerifyParams
): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>("/api/Account/change-mobile/verify", data);
    return res.data;
};

// ─── Favorites ────────────────────────────────────────────────────────────────

// NOTE: replace `unknown` with the actual favorite item type once known.
export const getUserFavorites = async (): Promise<IApiResponse<unknown[]>> => {
    const res = await apiInstance.get<IApiResponse<unknown[]>>("/api/Account/favorites");
    return res.data;
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const getUserOrders = async (): Promise<IApiResponse<IOrder[]>> => {
    const res = await apiInstance.get<IApiResponse<IOrder[]>>("/api/Account/orders");
    return res.data;
};

export const getUserOrder = async (orderId: number): Promise<IApiResponse<IOrder>> => {
    const res = await apiInstance.get<IApiResponse<IOrder>>(`/api/Account/orders/${orderId}`);
    return res.data;
};

// ─── Tickets ──────────────────────────────────────────────────────────────────

export const getUserTickets = async (): Promise<IApiResponse<ITicket[]>> => {
    const res = await apiInstance.get<IApiResponse<ITicket[]>>("/api/Account/tickets");
    return res.data;
};

export const getTicketDetails = async (
    ticketId: string
): Promise<IApiResponse<ITicket>> => {
    const res = await apiInstance.get<IApiResponse<ITicket>>(`/api/Account/tickets/${ticketId}`);
    return res.data;
};

// ─── Addresses ────────────────────────────────────────────────────────────────

export const getAllUserAddresses = async (): Promise<IApiResponse<IAddress[]>> => {
    const res = await apiInstance.get<IApiResponse<IAddress[]>>("/api/Account/ShippingInfos");
    return res.data;
};

export const getUserAddress = async (addressId: number): Promise<IApiResponse<IAddress>> => {
    const res = await apiInstance.get<IApiResponse<IAddress>>(`/api/Account/ShippingInfos/${addressId}`);
    return res.data;
};

export const createUserAddress = async (
    data: IAddressFormParams
): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>("/api/Account/ShippingInfos", data);
    return res.data;
};

export const editUserAddress = async (
    data: IEditAddressFormParams
): Promise<IApiResponse> => {
    const res = await apiInstance.put<IApiResponse>("/api/Account/ShippingInfos", data);
    return res.data;
};

export const deleteUserAddress = async (addressId: number): Promise<IApiResponse> => {
    const res = await apiInstance.delete<IApiResponse>(`/api/Account/ShippingInfos/${addressId}`);
    return res.data;
};

// --- Overview ---------------
export const getUserOverview = async (): Promise<IApiResponse<IOverview>> => {
    const res = await apiInstance.get<IApiResponse<IOverview>>("/api/Account/overview");
    return res.data;
}

// ---- Request Return --------------
export const requestReturn = async (data: IRequestReturnParams): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>("api/Account/request-return", data);
    return res.data;
}

// ---- Comments ----------------
export const getUserComments = async (): Promise<IApiResponse<IUserComments[]>> => {
    const res = await apiInstance.get<IApiResponse<IUserComments[]>>("/api/Account/comments");
    return res.data;
}