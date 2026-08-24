import type { IAddress, IOrder, IOverview, ITicket, IUserComments, IUserProfile } from "@/types/account/account";
import type {
    IAddressFormParams, IChangeMobileRequestParams, IChangeMobileVerifyParams,
    IChangePasswordParams, ICompleteProfileParams, IEditAddressFormParams,
    IRequestReturnParams, ISetPasswordParams, IUpdateProfileParams,
} from "@/types/account/requests";

export interface ILoadingState {
    user: boolean; favorites: boolean; orders: boolean; order: boolean;
    tickets: boolean; ticket: boolean; addresses: boolean; updateProfile: boolean;
    completeProfile: boolean; changePassword: boolean; setPassword: boolean;
    changeMobile: boolean; createAddress: boolean; editAddress: boolean;
    deleteAddress: boolean; overview: boolean; requestReturn: boolean; comments: boolean;
}

export const DEFAULT_LOADING: ILoadingState = {
    user: false, favorites: false, orders: false, order: false, tickets: false,
    ticket: false, addresses: false, updateProfile: false, completeProfile: false,
    changePassword: false, setPassword: false, changeMobile: false, createAddress: false,
    editAddress: false, deleteAddress: false, overview: false, requestReturn: false, comments: false,
};

export interface IProfileSlice {
    user: IUserProfile | null;
    fetchUser: () => Promise<void>;
    updateProfile: (data: IUpdateProfileParams) => Promise<void>;
    completeProfile: (data: ICompleteProfileParams) => Promise<void>;
    changePassword: (data: IChangePasswordParams) => Promise<void>;
    setPassword: (data: ISetPasswordParams) => Promise<void>;
    changeMobileReqOTP: (data: IChangeMobileRequestParams) => Promise<void>;
    changeMobileVerify: (data: IChangeMobileVerifyParams) => Promise<void>;
}

export interface IFavoritesSlice {
    userFavorites: unknown | null;
    fetchUserFavorites: () => Promise<void>;
}

export interface IOrdersSlice {
    userOrders: IOrder[] | null;
    selectedOrder: IOrder | null;
    fetchUserOrders: () => Promise<void>;
    fetchUserOrder: (orderId: number) => Promise<void>;
    clearSelectedOrder: () => void;
}

export interface ITicketsSlice {
    userTickets: ITicket[] | null;
    selectedTicket: ITicket | null;
    fetchUserTickets: () => Promise<void>;
    fetchTicketDetails: (ticketId: string) => Promise<void>;
    clearSelectedTicket: () => void;
}

export interface IAddressSlice {
    userAddresses: IAddress[] | null;
    fetchUserAddresses: () => Promise<void>;
    fetchUserAddress: (id: number) => Promise<IAddress>;
    createUserAddress: (data: IAddressFormParams) => Promise<void>;
    editUserAddress: (data: IEditAddressFormParams) => Promise<void>;
    deleteUserAddress: (id: number) => Promise<void>;
}

export interface IOverviewSlice {
    overview: IOverview | null;
    fetchOverview: () => Promise<void>;
}

export interface IReturnSlice {
    requestReturn: (data: IRequestReturnParams) => Promise<void>;
}

export interface ICommentsSlice {
    userComments: IUserComments[] | null;
    fetchUserComments: () => Promise<void>;
}

export interface IUserStore
    extends IProfileSlice, IFavoritesSlice, IOrdersSlice, ITicketsSlice,
        IAddressSlice, IOverviewSlice, IReturnSlice, ICommentsSlice {
    loading: ILoadingState;
    clearUser: () => void;
}