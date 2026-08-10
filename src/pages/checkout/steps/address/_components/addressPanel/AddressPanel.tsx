import { Plus } from "lucide-react";
import { IconMapPin } from "@tabler/icons-react";
import type { IAddress, IAddressFormParams } from "@/services/accountServices/accountServices";
import { AddressSkeleton } from "./_components/addressSkeleton/AddressSkeleton";
import { AddressCard } from "./_components/addressCard/AddressCard";
import { AddressForm } from "./_components/addressForm/AddressForm";

export type FormState = { type: "hidden" } | { type: "create" } | { type: "edit"; address: IAddress };

interface AddressPanelProps {
  loadingAddresses: boolean;
  addresses: IAddress[];
  selectedId: number | null;
  deleting: boolean;
  formState: FormState;
  formLoading: boolean;
  onSelect: (id: number) => void;
  onEdit: (address: IAddress) => void;
  onDelete: (id: number) => void;
  onCreate: (data: IAddressFormParams) => Promise<void>;
  onEditSave: (data: IAddressFormParams) => Promise<void>;
  onCancelForm: () => void;
  onStartCreate: () => void;
}

export function AddressPanel({
  loadingAddresses,
  addresses,
  selectedId,
  deleting,
  formState,
  formLoading,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
  onEditSave,
  onCancelForm,
  onStartCreate,
}: AddressPanelProps) {
  const hasAddresses = addresses.length > 0;

  return (
    <div className="flex-1 bg-white rounded-2xl border border-blue-100 overflow-hidden w-full">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-blue-50">
        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <IconMapPin size={16} className="text-blue-800" />
        </div>
        <h3 className="text-base font-bold text-blue-800">آدرس تحویل</h3>
      </div>

      <div className="px-4 sm:px-6 py-5 sm:py-6 flex flex-col gap-4">
        {loadingAddresses && <AddressSkeleton />}

        {!loadingAddresses && hasAddresses && (
          <div className="flex flex-col gap-3">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                selected={selectedId === addr.id}
                deleting={deleting}
                onSelect={() => onSelect(addr.id)}
                onEdit={() => onEdit(addr)}
                onDelete={() => onDelete(addr.id)}
              />
            ))}
          </div>
        )}

        {!loadingAddresses && formState.type !== "hidden" && (
          <div className="border border-blue-100 rounded-xl p-3 sm:p-4 bg-blue-50/30">
            <p className="text-xs font-semibold text-blue-800 mb-4">
              {formState.type === "edit" ? "ویرایش آدرس" : hasAddresses ? "افزودن آدرس جدید" : "ثبت آدرس"}
            </p>
            <AddressForm
              config={
                formState.type === "edit"
                  ? { mode: "edit", onSave: onEditSave, defaults: formState.address }
                  : { mode: "create", onSave: onCreate }
              }
              onCancel={hasAddresses ? onCancelForm : undefined}
              loading={formLoading}
            />
          </div>
        )}

        {!loadingAddresses && formState.type === "hidden" && (
          <button
            type="button"
            onClick={onStartCreate}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50 text-sm font-medium transition-all duration-200"
          >
            <Plus size={15} />
            <span>افزودن آدرس جدید</span>
          </button>
        )}
      </div>
    </div>
  );
}