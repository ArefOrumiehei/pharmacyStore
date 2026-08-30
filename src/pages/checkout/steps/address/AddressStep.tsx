import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

// Stores
import { useUserStore } from "@/store/account/useAccountStore";
import { useCartStore } from "@/store/useCartStore";

// Types
import type { AddressData } from "../../interfaces/checkout";
import type { IAddressFormParams, IEditAddressFormParams } from "@/types/account/requests";


// Components
import {
    AddressPanel,
    type FormState,
} from "./_components/addressPanel/AddressPanel";
import { SyncingOverlay } from "./_components/syncingOverlay/SyncingOverlay";
import { CheckoutSidePanel } from "./_components/checkoutSidePanel/CheckoutSidePanel";

export default function AddressStep() {
    const navigate = useNavigate();
    const {
        userAddresses,
        loading,
        fetchUserAddresses,
        createUserAddress,
        editUserAddress,
        deleteUserAddress,
    } = useUserStore();
    const { syncGuestCart, syncing } = useCartStore();

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [formState, setFormState] = useState<FormState>({ type: "hidden" });

    // ── On mount: sync guest cart first, then fetch addresses ─────────────────
    // syncGuestCart is safe to call always:
    //   - if guestCart is empty → just fetches server cart
    //   - if guestCart has items → POSTs to /api/Cart/sync then clears localStorage
    useEffect(() => {
        const init = async () => {
            await syncGuestCart();
            await fetchUserAddresses();
        };
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const addresses = userAddresses ?? [];
    const hasAddresses = addresses.length > 0;

    // Auto-select first address once loaded
    useEffect(() => {
        if (!loading.addresses && hasAddresses && selectedId === null) {
            setSelectedId(addresses[0].id);
        }
    }, [loading.addresses, hasAddresses]); // eslint-disable-line react-hooks/exhaustive-deps

    // Show create form automatically when no addresses exist
    useEffect(() => {
        if (!loading.addresses && !hasAddresses) {
            setFormState({ type: "create" });
        }
    }, [loading.addresses, hasAddresses]);

    const selectedAddress = addresses.find((a) => a.id === selectedId) ?? null;
    const canProceed =
        selectedAddress !== null && formState.type === "hidden" && !syncing;

    // ── Handlers ───────────────────────────────────────────────────────────────

    const handleCreate = async (data: IAddressFormParams) => {
        await createUserAddress(data);
        setFormState({ type: "hidden" });
    };

    const handleEdit = async (data: IAddressFormParams) => {
        if (formState.type !== "edit") return;
        const payload: IEditAddressFormParams = {
            ...data,
            id: String(formState.address.id),
        };
        await editUserAddress(payload);
        setFormState({ type: "hidden" });
    };

    const handleDelete = async (id: number) => {
        await deleteUserAddress(id);
        if (selectedId === id) setSelectedId(null);
    };

    const handleProceed = () => {
        if (!selectedAddress) return;
        const addressData: AddressData = {
            receiverFullName: selectedAddress.receiverFullName,
            receiverMobile: selectedAddress.receiverMobile,
            receiverAddress: selectedAddress.receiverAddress,
            receiverZipCode: selectedAddress.receiverZipCode,
            shippingId: selectedAddress.id,
        };
        navigate("/checkout/payment", { state: { addressData } });
    };

    // ── Show syncing overlay while merging guest cart ─────────────────────────
    if (syncing) {
        return (
            <div
                className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-start"
                dir="rtl"
            >
                <div className="flex-1">
                    <SyncingOverlay />
                </div>
                <div className="w-full lg:w-72 bg-white rounded-2xl border border-blue-100 p-4 sm:p-5">
                    <div className="h-4 w-24 bg-blue-50 animate-pulse rounded mb-3" />
                    <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-start"
            dir="rtl"
        >
            <AddressPanel
                loadingAddresses={loading.addresses}
                addresses={addresses}
                selectedId={selectedId}
                deleting={loading.deleteAddress}
                formState={formState}
                formLoading={loading.createAddress || loading.editAddress}
                onSelect={(id) => {
                    setSelectedId(id);
                    setFormState({ type: "hidden" });
                }}
                onEdit={(address) => setFormState({ type: "edit", address })}
                onDelete={handleDelete}
                onCreate={handleCreate}
                onEditSave={handleEdit}
                onCancelForm={() => setFormState({ type: "hidden" })}
                onStartCreate={() => setFormState({ type: "create" })}
            />

            <CheckoutSidePanel
                stepLabel="مرحله ۲ از ۳"
                description="آدرس تحویل سفارش خود را انتخاب یا وارد کنید."
                primaryLabel="ادامه — پرداخت"
                primaryIcon={ArrowLeft}
                onPrimaryClick={handleProceed}
                primaryDisabled={!canProceed}
                secondaryLabel="بازگشت به سبد خرید"
                secondaryIcon={ArrowRight}
                onSecondaryClick={() => navigate("/checkout/cart")}
            />
        </div>
    );
}
