"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/src/app/_trpc/client";

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showResend, setShowResend] = useState<boolean>(false);

  const verifyEmailMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: (res) => {
      if (res.status === "success") {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage("Verification failed");
        setShowResend(true);
      }
    },
    onError: (err) => {
      setStatus("error");

      switch (err.data?.code) {
        case "NOT_FOUND":
          setErrorMessage("User not found");
          setShowResend(true);
          break;
        case "CONFLICT":
          setErrorMessage("User already verified");
          setShowResend(false);
          break;
        default:
          setErrorMessage("Verification failed, Try Again!");
          setShowResend(true);
          break;
      }
    },
  });

  useEffect(() => {
    if (!token) return;
    verifyEmailMutation.mutate({ token });
  }, [token]);

  const renderMessage = () => {
    if (status === "loading") {
      return <p className="text-gray-700">Verifying your email...</p>;
    }

    if (status === "success") {
      return (
        <>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Email Verified!
          </h2>
          <p className="text-gray-700 mb-6">
            Your email has been successfully verified.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
          >
            Login Now
          </button>
        </>
      );
    }

    if (status === "error") {
      return (
        <>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Verification Failed
          </h2>
          <p className="text-gray-700 mb-6">{errorMessage}</p>
          {showResend && (
            <button
              onClick={() => router.push("/signup")}
              className="rounded-md bg-red-600 px-6 py-2 text-white hover:bg-red-700 transition-colors duration-200 cursor-pointer"
            >
              Resend Verification Link
            </button>
          )}
        </>
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 bg-white shadow-2xl rounded-xl p-8 text-center">
      {renderMessage()}
    </div>
  );
};

export default VerifyEmailPage;
