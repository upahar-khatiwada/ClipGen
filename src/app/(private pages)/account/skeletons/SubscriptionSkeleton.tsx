const SubscriptionSkeleton = () => {
  return (
    <div className="flex-1 border-none rounded-2xl p-1 flex flex-col justify-between animate-pulse">
      <div>
        <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
        <div className="h-5 w-20 bg-gray-300 rounded mb-4"></div>
        <ul className="space-y-1">
          {Array.from({ length: 2 }).map((_, i) => (
            <li key={i} className="h-4 w-full bg-gray-200 rounded"></li>
          ))}
        </ul>
      </div>
      <div className="h-10 w-full bg-gray-300 rounded mt-4"></div>
    </div>
  );
};

export default SubscriptionSkeleton;
