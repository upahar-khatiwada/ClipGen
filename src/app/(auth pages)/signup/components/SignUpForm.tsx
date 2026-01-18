"use client";

import { trpc } from "@/src/app/_trpc/client";
import InputField from "@/src/components/InputField";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type SignUpFormValues = {
  username: string;
  email: string;
  password: string;
};

const SignUpForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const signup = trpc.auth.signup.useMutation({
    onSuccess: (res) => {
      if (res.status === "success") {
        router.push("/login");
      }
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log("Signup Data:", data);

    signup.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
      <InputField
        label="Username"
        type="text"
        placeholder="Choose a username"
        register={register("username", {
          required: "Username is required",
          minLength: {
            value: 3,
            message: "Username must be at least 3 characters",
          },
        })}
        error={errors.username?.message}
      />

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
        placeholder="Create a password"
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
        className="mt-4 w-full rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors cursor-pointer"
      >
        Create Account
      </button>
    </form>
  );
};

export default SignUpForm;
