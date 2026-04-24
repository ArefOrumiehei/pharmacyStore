"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";

const loginSchema = z.object({
  // email: z.string().email({ message: "ایمیل معتبر وارد کنید" }),
  username: z.string().min(2, "نام کاربری الزامی است"),
  password: z.string(),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const {login} = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormValues) => {
    const res = await login({
      username: data.username,
      password: data.password,
      rememberMe: data.rememberMe,
    })

    if (res) navigate("/")
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">ورود</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* <div>
          <Input placeholder="ایمیل" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div> */}
        <div>
          <Input placeholder="نام کاربری" {...register("username")} />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <Input type="password" placeholder="رمز عبور" {...register("password")} />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember-me" {...register("rememberMe")} />
          <label htmlFor="remember-me">مرا به خاطر بسپار</label>
        </div>
        <Button type="submit" className="mt-4 w-full">ورود</Button>
      </form>
      <p className="text-sm text-gray-600 mt-4 text-center">
        حساب ندارید؟{" "}
        <Link to={"/signup"}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          ثبت نام
        </Link>
      </p>
    </div>
  );
}
