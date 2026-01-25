import { Suspense } from "react";
import VerifyEmailClient from "./components/VerifyEmailClient";

const VerifyEmailFallback = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-20 bg-white shadow-2xl rounded-xl p-8 text-center animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-6" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-6" />
      <div className="h-10 bg-gray-200 rounded w-32 mx-auto" />
    </div>
  );
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailClient />
    </Suspense>
  );
}
