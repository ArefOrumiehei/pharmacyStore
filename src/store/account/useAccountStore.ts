import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LOADING, type IUserStore } from "./accountStore/types";
import { createProfileSlice } from "./accountStore/slices/profileSlice";
import { createFavoritesSlice } from "./accountStore/slices/favoritesSlice";
import { createOrdersSlice } from "./accountStore/slices/ordersSlice";
import { createTicketsSlice } from "./accountStore/slices/ticketsSlice";
import { createAddressSlice } from "./accountStore/slices/addressSlice";
import { createOverviewSlice } from "./accountStore/slices/overviewSlice";
import { createReturnSlice } from "./accountStore/slices/returnSlice";
import { createCommentsSlice } from "./accountStore/slices/commentsSlice";
import { useAuthStore } from "../useAuthStore";

export const useUserStore = create<IUserStore>()(
    persist(
        (...a) => ({
            loading: DEFAULT_LOADING,
            ...createProfileSlice(...a),
            ...createFavoritesSlice(...a),
            ...createOrdersSlice(...a),
            ...createTicketsSlice(...a),
            ...createAddressSlice(...a),
            ...createOverviewSlice(...a),
            ...createReturnSlice(...a),
            ...createCommentsSlice(...a),
            clearUser: () =>
                a[0]({
                    user: null, userFavorites: null, userOrders: null, selectedOrder: null,
                    userTickets: null, selectedTicket: null, userAddresses: null,
                    overview: null, userComments: null, loading: DEFAULT_LOADING,
                }),
        }),
        {
            name: "user_data",
            partialize: (state) => ({
                user: state.user,
                userFavorites: state.userFavorites,
                userAddresses: state.userAddresses,
            }),
            onRehydrateStorage: () => (state, error) => {
                if (error) return;
                setTimeout(async () => {
                    try {
                        const auth = useAuthStore.getState();
                        if (!state?.user && auth?.accessToken) {
                            await useUserStore.getState().fetchUser();
                        }
                    } catch (e) {
                        console.warn("Error auto-fetching user on rehydrate:", e);
                    }
                }, 0);
            },
        }
    )
);