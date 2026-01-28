"use client";

import Image from "next/image";
import LoginForm from "./components/LoginForm";
import { trpc } from "../../_trpc/client";

const LoginPage = () => {
  const loginWithGoogleMutation = trpc.auth.loginWithGoogle.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });
  return (
    <div className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden">
      <div className="px-8 pt-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Sign in to ClipGen, AI Short Generator
        </h1>
        <p className="mt-2 text-sm text-gray-500">Please sign in to continue</p>
      </div>

      <div className="px-8 pt-6 pb-8">
        <button
          onClick={() => {
            loginWithGoogleMutation.mutate();
          }}
          disabled={loginWithGoogleMutation.isPending}
          className="cursor-pointer flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
            width={10}
            height={10}
          />
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <LoginForm />
      </div>

      <div className="border-t px-8 py-4 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="font-medium text-gray-900 hover:underline">
          Sign up
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
