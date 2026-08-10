import { useState } from "react";
import { IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";
import { Field } from "../field/Field";
import { inputClass } from "@/pages/profile/constants/Constants";

interface PasswordFieldProps {
  label: string;
  error?: string;
  registration: object;
  placeholder: string;
}

export function PasswordField({ label, error, registration, placeholder }: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} error={error} icon={IconLock}>
      <input
        {...registration}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={`${inputClass(!!error)} pl-10`}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <IconEyeOff size={15} /> : <IconEye size={15} />}
      </button>
    </Field>
  );
}