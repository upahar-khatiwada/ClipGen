import Link from "next/link";

const FailurePage = () => {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold text-red-600">❌ Payment Failed</h1>

        <p className="text-slate-600">
          Your payment was not completed. You were not charged.
        </p>

        <Link
          href="/upgrade"
          className="inline-block mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default FailurePage;
