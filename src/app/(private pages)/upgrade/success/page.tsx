import Link from "next/link";

const SuccessPage = () => {
  return (
    <div className="bg-slate-50 flex justify-center items-center text-slate-900 font-sans w-full min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold text-green-600">
          🎉 Payment Successful
        </h1>

        <p className="text-slate-600">
          Your purchase was completed successfully.
        </p>

        <Link
          href="/dashboard"
          className="inline-block mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
