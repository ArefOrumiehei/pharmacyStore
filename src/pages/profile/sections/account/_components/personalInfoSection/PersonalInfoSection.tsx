import { IconUser, IconAt, IconMail, IconPhone } from "@tabler/icons-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import SectionTitle from "@/components/common/sectionTitle/SectionTitle";
import { inputClass, type ProfileFormValues } from "@/pages/profile/constants/Constants";
import { AvatarPicker } from "../avatarPicker/AvatarPicker";
import { Field } from "../field/Field";

interface PersonalInfoSectionProps {
  userFullName?: string;
  userMobile?: string;
  userProfilePhoto?: string;
  isEditing: boolean;
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  onPhotoChange: (file: File) => void;
}

export function PersonalInfoSection({
  userFullName,
  userMobile,
  userProfilePhoto,
  isEditing,
  register,
  errors,
  onPhotoChange,
}: PersonalInfoSectionProps) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-6 flex flex-col gap-5">
      <SectionTitle>اطلاعات شخصی</SectionTitle>

      <AvatarPicker
        userFullName={userFullName}
        userPhoneNumber={userMobile}
        currentUrl={userProfilePhoto}
        disabled={!isEditing}
        onChange={onPhotoChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="نام و نام خانوادگی" error={errors.fullname?.message} icon={IconUser}>
          <input
            {...register("fullname")}
            disabled={!isEditing}
            placeholder="نام کامل"
            className={inputClass(!!errors.fullname, !isEditing)}
          />
        </Field>

        <Field label="نام کاربری" error={errors.username?.message} icon={IconAt}>
          <input
            {...register("username")}
            disabled={!isEditing}
            placeholder="username"
            className={inputClass(!!errors.username, !isEditing)}
          />
        </Field>

        <Field label="ایمیل" error={errors.email?.message} icon={IconMail}>
          <input
            {...register("email")}
            type="email"
            disabled={!isEditing}
            placeholder="example@email.com"
            className={inputClass(!!errors.email, !isEditing)}
          />
        </Field>

        <Field label="شماره موبایل" error={undefined} icon={IconPhone}>
          <input value={userMobile ?? ""} disabled readOnly className={inputClass(false, true)} />
        </Field>
      </div>
    </div>
  );
}