"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";

const signupSchema = z.object({
  name: z.string().min(2, "حداقل ۲ کاراکتر"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  mobile: z
    .string()
    .min(10, "حداقل ۱۰ رقم")
    .max(15, "حداکثر ۱۵ رقم")
    .regex(/^[0-9]+$/, "فقط اعداد مجاز هستند"),
  password: z.string().min(6, "حداقل ۶ کاراکتر"),
  confirmPassword: z.string().min(6, "حداقل ۶ کاراکتر"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمز عبور و تکرار آن باید یکسان باشند",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signupSchema>;

export default function SignUp() {
  const {register: registerUser} = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
  });
  const navigate = useNavigate()


  const onSubmit = async (data: SignUpFormValues) => {
    const res = await registerUser({
      email: data.email,
      fullname: data.name,
      username: data.name,
      password: data.password,
      mobile: data.mobile,
    });

    if (res) navigate("/");
  };


  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">ثبت نام</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input placeholder="نام و نام خانوادگی" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Input placeholder="ایمیل" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Input placeholder="موبایل" {...register("mobile")} />
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
        </div>
        <div>
          <Input type="password" placeholder="رمز عبور" {...register("password")} />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <Input type="password" placeholder="تکرار رمز عبور" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" className="mt-4 w-full">ثبت نام</Button>
      </form>
      <p className="text-sm text-gray-600 mt-4 text-center">
        حساب ندارید؟{" "}
        <Link to={"/login"}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          ورود
        </Link>
      </p>
    </div>
  );
}
