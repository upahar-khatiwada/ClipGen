"use client";

import { useForm } from "react-hook-form";
import InputField from "@/src/components/InputField";
import { trpc } from "@/src/app/_trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const router = useRouter();

  const login = trpc.auth.login.useMutation({
    onSuccess: (res) => {
      if (res.status === "success") {
        router.push("/dashboard");
      } else if (res.status === "error") {
        alert(res.message);
      }
    },
    onError: (err) => {
      if (err.data?.code === "TOO_MANY_REQUESTS") {
        toast.error("You're hitting the rate limit. Please wait a bit!");
      }
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);

    login.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Email address"
        type="email"
        placeholder="Enter your email"
        register={register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        })}
        error={errors.email?.message}
      />

      <InputField
        label="Password"
        type="password"
        placeholder="Enter your password"
        register={register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
        error={errors.password?.message}
      />

      <button
        type="submit"
        disabled={login.isPending}
        className="mt-4 w-full rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 cursor-pointer"
      >
        {login.isPending ? <>Signing in...</> : "Sign In"}
      </button>
    </form>
  );
}
