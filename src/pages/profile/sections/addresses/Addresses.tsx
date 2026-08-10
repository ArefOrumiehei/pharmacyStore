import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useAccountStore";
import type { IAddress, IAddressFormParams, IEditAddressFormParams } from "@/services/accountServices/accountServices";
import AddressesHeader from "./_components/addressesHeader/AddressesHeader";
import AddressForm from "./_components/addressForm/AddressForm";
import AddressSkeleton from "./_components/addressSkeleton/AddressSkeleton";
import AddressesEmptyState from "./_components/addressesEmptyState/AddressesEmptyState";
import AddressCard from "./_components/addressCard/AddressCard";

type FormState =
  | { type: "hidden" }
  | { type: "create" }
  | { type: "edit"; address: IAddress };

export default function Addresses() {
  const {
    userAddresses,
    loading,
    fetchUserAddresses,
    createUserAddress,
    editUserAddress,
    deleteUserAddress,
  } = useUserStore();

  const [formState, setFormState] = useState<FormState>({ type: "hidden" });

  useEffect(() => {
    fetchUserAddresses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addresses: IAddress[] = userAddresses ?? [];

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
  };

  const formSaving = loading.createAddress || loading.editAddress;
console.log(formState.type);
  return (
    <div className="flex flex-col gap-3.5 sm:gap-5" dir="rtl">
      <AddressesHeader
        showAddButton={formState.type === "hidden"}
        onAddClick={() => setFormState({ type: "create" })}
      />

      {formState.type !== "hidden" && formState.type === "create" && (
        <AddressForm
          onSave={handleCreate}
          onCancel={() => setFormState({ type: "hidden" })}
          saving={formSaving}
        />
      )}

      {loading.addresses && <AddressSkeleton />}

      {!loading.addresses && addresses.length === 0 && formState.type === "hidden" && (
        <AddressesEmptyState onAddClick={() => setFormState({ type: "create" })} />
      )}

      {!loading.addresses && addresses.length > 0 && (
        <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
          {addresses.map((addr) =>
            formState.type === "edit" && formState.address.id === addr.id ? (
              <div key={addr.id} className="sm:col-span-2">
                <AddressForm
                  defaults={formState.address}
                  onSave={handleEdit}
                  onCancel={() => setFormState({ type: "hidden" })}
                  saving={formSaving}
                />
              </div>
            ) : (
              <AddressCard
                key={addr.id}
                address={addr}
                deleting={loading.deleteAddress}
                onEdit={() => setFormState({ type: "edit", address: addr })}
                onDelete={() => handleDelete(addr.id)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}