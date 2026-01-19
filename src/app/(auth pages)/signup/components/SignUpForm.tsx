"use client";

import { trpc } from "@/src/app/_trpc/client";
import InputField from "@/src/components/InputField";
import { useState } from "react";
import { useForm } from "react-hook-form";

type SignUpFormValues = {
  username: string;
  email: string;
  password: string;
};

interface SignUpFormProps {
  onSuccess: (email: string) => void;
}

const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>();
  const [formError, setFormError] = useState<string | null>(null);

  const signup = trpc.auth.signup.useMutation({
    onSuccess: (res, input) => {
      if (res.status === "success") {
        onSuccess(input.email);
      }
    },
    onError: (err) => {
      setFormError(err.message);
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    signup.mutateAsync(data);
  };

  return (
    <div>
      {formError && (
        <div className="p-2 rounded-md bg-red-100 text-red-700 text-sm mb-2">
          {formError}
        </div>
      )}
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
          disabled={signup.isPending}
          className="mt-4 w-full rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors cursor-pointer"
        >
          {signup.isPending ? <>Creating account...</> : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
