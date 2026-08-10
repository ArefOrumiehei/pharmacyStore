import type { RefObject } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { IconUser, IconMail } from "@tabler/icons-react";
import type { ICards } from "@/services/siteServices/siteServices";
import type { PaymentFormValues } from "../../types/payment";
import { PaymentCardsList } from "./_components/paymentCardsList/PaymentCardsList";
import { PaymentField } from "./_components/paymentField/PaymentField";
import { ReceiptUpload } from "./_components/receiptUpload/ReceiptUpload";

interface CardToCardExtrasProps {
  register: UseFormRegister<PaymentFormValues>;
  errors: FieldErrors<PaymentFormValues>;
  cards: ICards[];
  cardsLoading: boolean;
  image: { url: string | null; name: string | null };
  receiptError: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const paymentInputClass = (hasError: boolean) =>
  `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
    hasError ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
  }`;

export function CardToCardExtras({
  register,
  errors,
  cards,
  cardsLoading,
  image,
  receiptError,
  fileInputRef,
  onUploadClick,
  onFileChange,
}: CardToCardExtrasProps) {
  return (
    <div className="flex flex-col gap-4 pt-2 border-t border-blue-50">
      <PaymentCardsList cards={cards} loading={cardsLoading} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PaymentField label="نام صاحب کارت" error={errors.cardOwnerName?.message} icon={IconUser}>
          <input
            {...register("cardOwnerName", { required: "نام صاحب کارت الزامی است" })}
            placeholder="نام روی کارت"
            className={paymentInputClass(!!errors.cardOwnerName)}
          />
        </PaymentField>
        <PaymentField label="کد ملی" error={errors.nationalCode?.message} icon={IconMail}>
          <input
            {...register("nationalCode", { required: "کد ملی الزامی است" })}
            placeholder="۰۰۱۲۳۴۵۶۷۸"
            className={paymentInputClass(!!errors.nationalCode)}
          />
        </PaymentField>
      </div>

      <ReceiptUpload
        imageUrl={image.url}
        imageName={image.name}
        error={receiptError}
        fileInputRef={fileInputRef}
        onUploadClick={onUploadClick}
        onFileChange={onFileChange}
      />
    </div>
  );
}