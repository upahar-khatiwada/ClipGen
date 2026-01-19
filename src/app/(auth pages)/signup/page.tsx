"use client";

import { useState } from "react";
import { trpc } from "@/src/app/_trpc/client";
import SignUpForm from "./components/SignUpForm";

const SignUpPage = () => {
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const resendVerification = trpc.auth.resendVerificationEmail.useMutation({
    onSuccess: (res) => {
      setResendMessage(res.message);
    },
  });

  return (
    <div className="w-full max-w-md rounded-xl overflow-hidden">
      {!isSignedUp ? (
        <div className="bg-white shadow-2xl">
          <div className="px-8 pt-8 text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Join <strong>ClipGen</strong>, An AI Short Generator and start
              creating shorts in seconds
            </p>
          </div>

          <div className="px-8 pt-6 pb-8">
            <SignUpForm
              onSuccess={(userEmail) => {
                setIsSignedUp(true);
                setEmail(userEmail);
              }}
            />
          </div>

          <div className="border-t px-8 py-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-gray-900 hover:underline"
            >
              Login Now
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-2xl rounded-xl p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Verify Your Email
          </h2>
          <p className="text-gray-700 mb-2">
            Check your email to verify your account.
          </p>
          <p className="text-gray-700 mb-6">
            If you don&apos;t see it, check your{" "}
            <span className="font-semibold text-red-600">spam/junk folder</span>
            .
          </p>

          <button
            type="button"
            onClick={() => {
              if (!email) return;
              resendVerification.mutate({ email });
            }}
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
          >
            {resendVerification.isPending
              ? "Resending..."
              : "Resend Verification Email"}
          </button>

          {resendMessage && (
            <p className="mt-2 text-sm text-gray-700">{resendMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
