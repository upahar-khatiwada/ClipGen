const SubscriptionCardSkeleton = () => {
  return (
    <div className="flex-1 border rounded-2xl p-6 flex flex-col justify-between animate-pulse">
      <div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-1"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
      <div className="mt-4">
        <div className="h-10 bg-gray-300 rounded-xl w-full"></div>
      </div>
    </div>
  );
};

export default SubscriptionCardSkeleton;
