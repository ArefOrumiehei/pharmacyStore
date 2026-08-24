import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    getUser,
    updateProfile,
    completeProfile,
    changePassword,
    setPassword,
    changeMobileReqOTP,
    changeMobileVerify,
    getUserFavorites,
    getUserOrders,
    getUserOrder,
    getUserTickets,
    getTicketDetails,
    getAllUserAddresses,
    getUserAddress,
    createUserAddress,
    editUserAddress,
    deleteUserAddress,
    getUserOverview,
    requestReturn,
    getUserComments,
} from "@/services/accountServices";
import type { IApiResponse } from "@/types/api";
import type { IAddress, IOrder, IOverview, ITicket, IUserComments, IUserProfile } from "@/types/account/account";
import type { IAddressFormParams, IChangeMobileRequestParams, IChangeMobileVerifyParams, IChangePasswordParams, ICompleteProfileParams, IEditAddressFormParams, IRequestReturnParams, ISetPasswordParams, IUpdateProfileParams } from "@/types/account/requests";

// ─── Config ─────────────────────────────────────────────────────────────────
// Account data changes with user actions (not on a timer), so a shorter
// staleTime than site-settings makes sense — refetch fairly readily, but
// still avoid an immediate duplicate fetch if two components mount at once.
const STALE_TIME = 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

const extractMessage = (err: unknown, fallback: string): string => {
    if (err && typeof err === "object" && "response" in err) {
        const r = (err as { response?: { data?: { message?: string } } })
            .response;
        return r?.data?.message ?? fallback;
    }
    return fallback;
};

// ─── Query keys ─────────────────────────────────────────────────────────────
export const accountKeys = {
    all: ["account"] as const,
    user: () => [...accountKeys.all, "user"] as const,
    favorites: () => [...accountKeys.all, "favorites"] as const,
    orders: () => [...accountKeys.all, "orders"] as const,
    order: (orderId: number) => [...accountKeys.orders(), orderId] as const,
    tickets: () => [...accountKeys.all, "tickets"] as const,
    ticket: (ticketId: string) => [...accountKeys.tickets(), ticketId] as const,
    addresses: () => [...accountKeys.all, "addresses"] as const,
    address: (addressId: number) =>
        [...accountKeys.addresses(), addressId] as const,
    overview: () => [...accountKeys.all, "overview"] as const,
    comments: () => [...accountKeys.all, "comments"] as const,
};

type QueryOpts<T> = Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;
type MutationOpts<TData, TVariables> = Omit<
    UseMutationOptions<TData, unknown, TVariables>,
    "mutationFn"
>;

// A loosely-typed callable used only to forward whatever extra arguments
// react-query's mutation callbacks pass (this has changed across minor
// versions — 3 args in some, 4 in others). Rest-param forwarding sidesteps
// having to match that arity exactly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCallback = (...args: any[]) => unknown;

// Lists that should read as empty rather than error when the server 404s
// on "no rows yet" (e.g. a brand-new account with no orders/tickets/comments).
async function fetchListOrEmpty<T>(
    fetcher: () => Promise<IApiResponse<T[]>>
): Promise<T[]> {
    try {
        const res = await fetcher();
        return res.data ?? [];
    } catch (err) {
        if (err && typeof err === "object" && "response" in err) {
            const status = (err as { response?: { status?: number } }).response
                ?.status;
            if (status === 404) return [];
        }
        throw err;
    }
}

// ─── Queries ────────────────────────────────────────────────────────────────

export const useUserQuery = (options?: QueryOpts<IUserProfile>) =>
    useQuery({
        queryKey: accountKeys.user(),
        queryFn: async () => (await getUser()).data,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        ...options,
    });

// NOTE: typed unknown[] until the real favorite item shape is known — see accountServices.ts
export const useUserFavoritesQuery = (options?: QueryOpts<unknown[]>) =>
    useQuery({
        queryKey: accountKeys.favorites(),
        queryFn: () => fetchListOrEmpty(getUserFavorites),
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        ...options,
    });

export const useUserOrdersQuery = (options?: QueryOpts<IOrder[]>) =>
    useQuery({
        queryKey: accountKeys.orders(),
        queryFn: () => fetchListOrEmpty(getUserOrders),
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        ...options,
    });

export const useUserOrderQuery = (
    orderId: number | undefined,
    options?: QueryOpts<IOrder>
) =>
    useQuery({
        queryKey: accountKeys.order(orderId ?? -1),
        queryFn: async () => (await getUserOrder(orderId as number)).data,
        enabled: !!orderId && options?.enabled !== false,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        ...options,
    });

export const useUserTicketsQuery = (options?: QueryOpts<ITicket[]>) =>
    useQuery({
        queryKey: accountKeys.tickets(),
        queryFn: () => fetchListOrEmpty(getUserTickets),
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        ...options,
    });

export const useTicketDetailsQuery = (
    ticketId: string | undefined,
    options?: QueryOpts<ITicket>
) =>
    useQuery({
        queryKey: accountKeys.ticket(ticketId ?? ""),
        queryFn: async () => (await getTicketDetails(ticketId as string)).data,
        enabled: !!ticketId && options?.enabled !== false,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        ...options,
    });

export const useUserAddressesQuery = (options?: QueryOpts<IAddress[]>) =>
    useQuery({
        queryKey: accountKeys.addresses(),
        queryFn: () => fetchListOrEmpty(getAllUserAddresses),
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        ...options,
    });

export const useUserAddressQuery = (
    addressId: number | undefined,
    options?: QueryOpts<IAddress>
) =>
    useQuery({
        queryKey: accountKeys.address(addressId ?? -1),
        queryFn: async () => (await getUserAddress(addressId as number)).data,
        enabled: !!addressId && options?.enabled !== false,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        ...options,
    });

export const useUserOverviewQuery = (options?: QueryOpts<IOverview>) =>
    useQuery({
        queryKey: accountKeys.overview(),
        queryFn: async () => (await getUserOverview()).data,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        ...options,
    });

export const useUserCommentsQuery = (options?: QueryOpts<IUserComments[]>) =>
    useQuery({
        queryKey: accountKeys.comments(),
        queryFn: () => fetchListOrEmpty(getUserComments),
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        ...options,
    });

// ─── Mutations ──────────────────────────────────────────────────────────────
// Every mutation toasts the server's message on both success and failure,
// invalidates whatever query data it just changed, then forwards to any
// onSuccess/onError the caller passed in (via rest-args, so this compiles
// no matter how many extra arguments react-query's callback types carry).

export const useUpdateProfileMutation = (
    options?: MutationOpts<IApiResponse<IUserProfile>, IUpdateProfileParams>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        ...options,
        mutationFn: updateProfile,
        onSuccess: (res, variables, ...rest) => {
            toast.success(res.message || "اطلاعات با موفقیت به‌روزرسانی شد");
            queryClient.invalidateQueries({ queryKey: accountKeys.user() });
            (options?.onSuccess as AnyCallback | undefined)?.(
                res,
                variables,
                ...rest
            );
        },
        onError: (err, variables, ...rest) => {
            toast.error(extractMessage(err, "خطا در به‌روزرسانی اطلاعات"));
            (options?.onError as AnyCallback | undefined)?.(
                err,
                variables,
                ...rest
            );
        },
    });
};

export const useCompleteProfileMutation = (
    options?: MutationOpts<IApiResponse<IUserProfile>, ICompleteProfileParams>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        ...options,
        mutationFn: completeProfile,
        onSuccess: (res, variables, ...rest) => {
            toast.success(res.message || "پروفایل با موفقیت تکمیل شد");
            queryClient.invalidateQueries({ queryKey: accountKeys.user() });
            (options?.onSuccess as AnyCallback | undefined)?.(
                res,
                variables,
                ...rest
            );
        },
        onError: (err, variables, ...rest) => {
            toast.error(extractMessage(err, "خطا در تکمیل پروفایل"));
            (options?.onError as AnyCallback | undefined)?.(
                err,
                variables,
                ...rest
            );
        },
    });
};

export const useChangePasswordMutation = (
    options?: MutationOpts<IApiResponse, IChangePasswordParams>
) => {
    return useMutation({
        ...options,
        mutationFn: changePassword,
        onSuccess: (res, variables, ...rest) => {
            toast.success(res.message || "رمز عبور با موفقیت تغییر کرد");
            (options?.onSuccess as AnyCallback | undefined)?.(
                res,
                variables,
                ...rest
            );
        },
        onError: (err, variables, ...rest) => {
            toast.error(extractMessage(err, "خطا در تغییر رمز عبور"));
            (options?.onError as AnyCallback | undefined)?.(
                err,
                variables,
                ...rest
            );
        },
    });
};

export const useSetPasswordMutation = (
    options?: MutationOpts<IApiResponse, ISetPasswordParams>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        ...options,
        mutationFn: setPassword,
        onSuccess: (res, variables, ...rest) => {
            toast.success(res.message || "رمز عبور با موفقیت تنظیم شد");
            // hasPassword flips true on the user object after this succeeds
            queryClient.invalidateQueries({ queryKey: accountKeys.user() });
            (options?.onSuccess as AnyCallback | undefined)?.(
                res,
                variables,
                ...rest
            );
        },
        onError: (err, variables, ...rest) => {
            toast.error(extractMessage(err, "خطا در تنظیم رمز عبور"));
            (options?.onError as AnyCallback | undefined)?.(
                err,
                variables,
                ...rest
            );
        },
    });
};

export const useChangeMobileRequestOtpMutation = (
    options?: MutationOpts<IApiResponse, IChangeMobileRequestParams>
) => {
    return useMutation({
        ...options,
        mutationFn: changeMobileReqOTP,
        onError: (err, variables, ...rest) => {
            toast.error(extractMessage(err, "خطا در ارسال کد تأیید"));
            (options?.onError as AnyCallback | undefined)?.(
                err,
                variables,
                ...rest
            );
        },
    });
};

export const useChangeMobileVerifyMutation = (
    options?: MutationOpts<IApiResponse, IChangeMobileVerifyParams>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        ...options,
        mutationFn: changeMobileVerify,
        onSuccess: (res, variables, ...rest) => {
            toast.success(res.message || "شماره موبایل با موفقیت تغییر کرد");
            queryClient.invalidateQueries({ queryKey: accountKeys.user() });
            (options?.onSuccess as AnyCallback | undefined)?.(
                res,
                variables,
                ...rest
            );
        },
        onError: (err, variables, ...rest) => {
            toast.error(extractMessage(err, "کد تأیید نامعتبر است"));
            (options?.onError as AnyCallback | undefined)?.(
                err,
                variables,
                ...rest
            );
        },
    });
};

export const useCreateUserAddressMutation = (
    options?: MutationOpts<IApiResponse, IAddressFormParams>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        ...options,
        mutationFn: createUserAddress,
        onSuccess: (res, variables, ...rest) => {
            toast.success(res.message || "آدرس با موفقیت ثبت شد");
            queryClient.invalidateQueries({
                queryKey: accountKeys.addresses(),
            });
            (options?.onSuccess as AnyCallback | undefined)?.(
                res,
                variables,
                ...rest
            );
        },
        onError: (err, variables, ...rest) => {
            toast.error(extractMessage(err, "خطا در ثبت آدرس"));
            (options?.onError as AnyCallback | undefined)?.(
                err,
                variables,
                ...rest
            );
        },
    });
};

export const useEditUserAddressMutation = (
    options?: MutationOpts<IApiResponse, IEditAddressFormParams>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        ...options,
        mutationFn: editUserAddress,
        onSuccess: (res, variables, ...rest) => {
            toast.success(res.message || "آدرس با موفقیت ویرایش شد");
            queryClient.invalidateQueries({
                queryKey: accountKeys.addresses(),
            });
            queryClient.invalidateQueries({
                queryKey: accountKeys.address(Number(variables.id)),
            });
            (options?.onSuccess as AnyCallback | undefined)?.(
                res,
                variables,
                ...rest
            );
        },
        onError: (err, variables, ...rest) => {
            toast.error(extractMessage(err, "خطا در ویرایش آدرس"));
            (options?.onError as AnyCallback | undefined)?.(
                err,
                variables,
                ...rest
            );
        },
    });
};

export const useDeleteUserAddressMutation = (
    options?: MutationOpts<IApiResponse, number>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        ...options,
        mutationFn: (addressId: number) => deleteUserAddress(addressId),
        onSuccess: (res, variables, ...rest) => {
            toast.success(res.message || "آدرس با موفقیت حذف شد");
            queryClient.invalidateQueries({
                queryKey: accountKeys.addresses(),
            });
            (options?.onSuccess as AnyCallback | undefined)?.(
                res,
                variables,
                ...rest
            );
        },
        onError: (err, variables, ...rest) => {
            toast.error(extractMessage(err, "خطا در حذف آدرس"));
            (options?.onError as AnyCallback | undefined)?.(
                err,
                variables,
                ...rest
            );
        },
    });
};

export const useRequestReturnMutation = (
    options?: MutationOpts<IApiResponse, IRequestReturnParams>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        ...options,
        mutationFn: requestReturn,
        onSuccess: (res, variables, ...rest) => {
            toast.success(res.message || "درخواست مرجوعی با موفقیت ثبت شد");
            queryClient.invalidateQueries({ queryKey: accountKeys.orders() });
            queryClient.invalidateQueries({
                queryKey: accountKeys.order(variables.orderId),
            });
            queryClient.invalidateQueries({ queryKey: accountKeys.overview() });
            (options?.onSuccess as AnyCallback | undefined)?.(
                res,
                variables,
                ...rest
            );
        },
        onError: (err, variables, ...rest) => {
            toast.error(extractMessage(err, "خطا در ثبت درخواست مرجوعی"));
            (options?.onError as AnyCallback | undefined)?.(
                err,
                variables,
                ...rest
            );
        },
    });
};
