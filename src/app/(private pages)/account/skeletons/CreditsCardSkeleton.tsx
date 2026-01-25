const CreditsCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />{" "}
        <div className="h-5 w-24 bg-gray-300 rounded" />{" "}
      </div>
      <div className="h-10 w-16 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
      <div className="h-10 w-full bg-gray-300 rounded"></div>
    </div>
  );
};

export default CreditsCardSkeleton;
