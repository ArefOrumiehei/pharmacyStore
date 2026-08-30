import { useForm } from "react-hook-form";
import { IconCheck, IconX, IconLoader2 } from "@tabler/icons-react";
import type { IAddress } from "@/types/account/account";
import type { IAddressFormParams } from "@/types/account/requests";
import SectionTitle from "@/components/common/sectionTitle/SectionTitle";

const inputClass = (hasError?: boolean) =>
    `w-full min-w-0 border rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
        hasError
            ? "border-rose-200 bg-rose-50/30"
            : "border-blue-100 bg-blue-50/30"
    }`;

export default function AddressForm({
    defaults,
    onSave,
    onCancel,
    saving,
}: {
    defaults?: IAddress;
    onSave: (v: IAddressFormParams) => Promise<void>;
    onCancel: () => void;
    saving: boolean;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IAddressFormParams>({
        defaultValues: defaults
            ? {
                  receiverFullName: defaults.receiverFullName,
                  receiverMobile: defaults.receiverMobile,
                  receiverAddress: defaults.receiverAddress,
                  receiverZipCode: defaults.receiverZipCode,
              }
            : {},
    });

    return (
        <div className="w-full max-w-full bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col gap-3 sm:gap-4 overflow-hidden">
            <SectionTitle>
                {defaults ? "ویرایش آدرس" : "آدرس جدید"}
            </SectionTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
                    <label className="text-[10px] sm:text-xs font-medium text-gray-600">
                        نام گیرنده
                    </label>
                    <input
                        {...register("receiverFullName", {
                            required: "نام الزامی است",
                        })}
                        placeholder="نام کامل گیرنده"
                        className={inputClass(!!errors.receiverFullName)}
                    />
                    {errors.receiverFullName && (
                        <p className="text-rose-500 text-[10px] sm:text-xs">
                            {errors.receiverFullName.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
                    <label className="text-[10px] sm:text-xs font-medium text-gray-600">
                        شماره موبایل
                    </label>
                    <input
                        {...register("receiverMobile", {
                            required: "موبایل الزامی است",
                        })}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className={inputClass(!!errors.receiverMobile)}
                    />
                    {errors.receiverMobile && (
                        <p className="text-rose-500 text-[10px] sm:text-xs">
                            {errors.receiverMobile.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5 sm:col-span-2 min-w-0">
                    <label className="text-[10px] sm:text-xs font-medium text-gray-600">
                        آدرس کامل
                    </label>
                    <input
                        {...register("receiverAddress", {
                            required: "آدرس الزامی است",
                        })}
                        placeholder="استان، شهر، خیابان، پلاک و واحد"
                        className={inputClass(!!errors.receiverAddress)}
                    />
                    {errors.receiverAddress && (
                        <p className="text-rose-500 text-[10px] sm:text-xs">
                            {errors.receiverAddress.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
                    <label className="text-[10px] sm:text-xs font-medium text-gray-600">
                        کد پستی
                    </label>
                    <input
                        {...register("receiverZipCode", {
                            required: "کد پستی الزامی است",
                        })}
                        placeholder="۱۲۳۴۵۶۷۸۹۰"
                        className={inputClass(!!errors.receiverZipCode)}
                    />
                    {errors.receiverZipCode && (
                        <p className="text-rose-500 text-[10px] sm:text-xs">
                            {errors.receiverZipCode.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 px-3.5 sm:px-4 py-2 rounded-lg sm:rounded-xl transition-all duration-200 whitespace-nowrap"
                >
                    <IconX size={13} className="sm:w-[15px] sm:h-[15px]" />{" "}
                    انصراف
                </button>
                <button
                    type="button"
                    onClick={handleSubmit(onSave)}
                    disabled={saving}
                    className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-3.5 sm:px-4 py-2 rounded-lg sm:rounded-xl transition-all duration-200 whitespace-nowrap"
                >
                    {saving ? (
                        <IconLoader2
                            size={13}
                            className="animate-spin sm:w-[15px] sm:h-[15px]"
                        />
                    ) : (
                        <IconCheck
                            size={13}
                            className="sm:w-[15px] sm:h-[15px]"
                        />
                    )}
                    ذخیره آدرس
                </button>
            </div>
        </div>
    );
}
