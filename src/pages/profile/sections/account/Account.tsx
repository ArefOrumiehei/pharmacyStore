import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/store/account/useAccountStore";
import { changePasswordSchema, mobileSchema, profileSchema, setPasswordSchema, type ChangePasswordFormValues, type MobileFormValues, type ProfileFormValues, type SetPasswordFormValues } from "../../constants/Constants";
import { AccountHeader } from "./_components/accountHeader/AccountHeader";
import { PersonalInfoSection } from "./_components/personalInfoSection/PersonalInfoSection";
import { ChangeMobileSection } from "./_components/changeMobileSection/ChangeMobileSection";
import { ChangePasswordSection } from "./_components/changePasswordSection/ChangePasswordSection";
import { SetPasswordSection } from "./_components/setPasswordSection/SetPasswordSection";


export default function Account() {
  const {
    user,
    loading,
    updateProfile,
    changePassword,
    setPassword,
    changeMobileReqOTP,
    changeMobileVerify,
  } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);
  const [otpSent, setOtpSent] = useState(false);

  // Whether user has a password — drives which password section to show
  const hasPassword = user?.hasPassword ?? false;

  // ── Profile form ────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullname: user?.fullname ?? "", username: user?.username ?? "", email: user?.email ?? "" },
  });

  useEffect(() => {
    if (user) reset({ fullname: user.fullname ?? "", username: user.username ?? "", email: user.email ?? "" });
  }, [user, reset]);

  const onSaveProfile = async (data: ProfileFormValues) => {
    try {
      await updateProfile({
        fullname: data.fullname,
        username: data.username,
        email: data.email || undefined,
        profilePhoto: photoFile,
      });
      setIsEditing(false);
      setPhotoFile(undefined);
    } catch {
      /* toast shown by store */
    }
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setPhotoFile(undefined);
    reset();
  };

  // ── Change password form (has password) ────────────────────────────────────
  const {
    register: registerCp,
    handleSubmit: handleSubmitCp,
    reset: resetCp,
    formState: { errors: cpErrors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  const onChangePassword = async (data: ChangePasswordFormValues) => {
    try {
      await changePassword(data);
      resetCp({ currentPassword: "", password: "", rePassword: "" });
    } catch {
      /* toast shown by store */
    }
  };

  // ── Set password form (no password yet) ────────────────────────────────────
  const {
    register: registerSp,
    handleSubmit: handleSubmitSp,
    reset: resetSp,
    formState: { errors: spErrors },
  } = useForm<SetPasswordFormValues>({ resolver: zodResolver(setPasswordSchema) });

  const onSetPassword = async (data: SetPasswordFormValues) => {
    try {
      await setPassword(data);
      resetSp({ password: "", rePassword: "" });
    } catch {
      /* toast shown by store */
    }
  };

  // ── Mobile form ─────────────────────────────────────────────────────────────
  const {
    register: registerMobile,
    handleSubmit: handleSubmitMobile,
    getValues: getMobileValues,
    formState: { errors: mobileErrors },
  } = useForm<MobileFormValues>({ resolver: zodResolver(mobileSchema) });

  const onRequestOtp = async () => {
    const mobile = getMobileValues("mobile");
    if (!mobile) return;
    try {
      await changeMobileReqOTP({ mobile });
      setOtpSent(true);
    } catch {
      /* toast shown by store */
    }
  };

  const onVerifyMobile = async (data: MobileFormValues) => {
    if (!data.code) return;
    try {
      await changeMobileVerify({ mobile: data.mobile, code: data.code });
      setOtpSent(false);
    } catch {
      /* toast shown by store */
    }
  };

  return (
    <div className="flex flex-col gap-5" dir="rtl">
      <AccountHeader
        isEditing={isEditing}
        saving={loading.updateProfile}
        onEdit={() => setIsEditing(true)}
        onCancel={onCancelEdit}
        onSave={handleSubmit(onSaveProfile)}
      />

      <PersonalInfoSection
        userFullName={user?.fullname}
        userMobile={user?.mobile}
        userProfilePhoto={user?.profilePhoto}
        isEditing={isEditing}
        register={register}
        errors={errors}
        onPhotoChange={setPhotoFile}
      />

      <ChangeMobileSection
        registerMobile={registerMobile}
        handleSubmitMobile={handleSubmitMobile}
        mobileErrors={mobileErrors}
        otpSent={otpSent}
        sentToMobile={getMobileValues("mobile")}
        loading={loading.changeMobile}
        onRequestOtp={onRequestOtp}
        onVerifyMobile={onVerifyMobile}
        onChangeNumber={() => setOtpSent(false)}
      />

      {hasPassword ? (
        <ChangePasswordSection
          register={registerCp}
          handleSubmit={handleSubmitCp}
          errors={cpErrors}
          loading={loading.changePassword}
          onSubmit={onChangePassword}
        />
      ) : (
        <SetPasswordSection
          register={registerSp}
          handleSubmit={handleSubmitSp}
          errors={spErrors}
          loading={loading.setPassword}
          onSubmit={onSetPassword}
        />
      )}
    </div>
  );
}