import { useForm } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";
import { IconUser, IconPhone, IconMapPin, IconMail } from "@tabler/icons-react";
import type { IAddress } from "@/types/account/account";
import type { IAddressFormParams } from "@/types/account/requests";
import { AddressField } from "../addressField/AddressField";

export type AddressFormMode =
    | { mode: "create"; onSave: (data: IAddressFormParams) => Promise<void> }
    | {
          mode: "edit";
          onSave: (data: IAddressFormParams) => Promise<void>;
          defaults: IAddress;
      };

interface AddressFormProps {
    config: AddressFormMode;
    onCancel?: () => void;
    loading: boolean;
}

const addressInputClass = (hasError: boolean) =>
    `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
        hasError
            ? "border-rose-200 bg-rose-50/30"
            : "border-blue-100 bg-blue-50/30"
    }`;

export function AddressForm({ config, onCancel, loading }: AddressFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IAddressFormParams>({
        defaultValues:
            config.mode === "edit"
                ? {
                      receiverFullName: config.defaults.receiverFullName,
                      receiverMobile: config.defaults.receiverMobile,
                      receiverAddress: config.defaults.receiverAddress,
                      receiverZipCode: config.defaults.receiverZipCode,
                  }
                : {},
    });

    return (
        <form
            onSubmit={handleSubmit(config.onSave)}
            className="flex flex-col gap-4"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AddressField
                    label="نام و نام خانوادگی"
                    error={errors.receiverFullName?.message}
                    icon={IconUser}
                >
                    <input
                        {...register("receiverFullName", {
                            required: "نام الزامی است",
                        })}
                        placeholder="نام کامل گیرنده"
                        disabled={loading}
                        className={addressInputClass(!!errors.receiverFullName)}
                    />
                </AddressField>
                <AddressField
                    label="شماره موبایل"
                    error={errors.receiverMobile?.message}
                    icon={IconPhone}
                >
                    <input
                        {...register("receiverMobile", {
                            required: "موبایل الزامی است",
                        })}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        disabled={loading}
                        className={addressInputClass(!!errors.receiverMobile)}
                    />
                </AddressField>
            </div>

            <AddressField
                label="آدرس کامل"
                error={errors.receiverAddress?.message}
                icon={IconMapPin}
            >
                <input
                    {...register("receiverAddress", {
                        required: "آدرس الزامی است",
                    })}
                    placeholder="استان، شهر، خیابان، پلاک و واحد"
                    disabled={loading}
                    className={addressInputClass(!!errors.receiverAddress)}
                />
            </AddressField>

            <AddressField
                label="کد پستی"
                error={errors.receiverZipCode?.message}
                icon={IconMail}
            >
                <input
                    {...register("receiverZipCode", {
                        required: "کد پستی الزامی است",
                    })}
                    placeholder="۱۲۳۴۵۶۷۸۹۰"
                    disabled={loading}
                    className={`${addressInputClass(
                        !!errors.receiverZipCode
                    )} sm:w-1/2`}
                />
            </AddressField>

            <div className="flex gap-2 flex-row-reverse pt-1">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 text-sm font-semibold transition-all duration-150"
                >
                    {loading ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>در حال ذخیره...</span>
                        </>
                    ) : (
                        <>
                            <Check size={14} />
                            <span>
                                {config.mode === "edit"
                                    ? "ذخیره تغییرات"
                                    : "ذخیره آدرس"}
                            </span>
                        </>
                    )}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-3 sm:px-4 rounded-xl border border-blue-200 text-blue-800 hover:bg-blue-50 disabled:opacity-50 text-sm font-medium transition-all duration-150 flex-shrink-0"
                    >
                        انصراف
                    </button>
                )}
            </div>
        </form>
    );
}
