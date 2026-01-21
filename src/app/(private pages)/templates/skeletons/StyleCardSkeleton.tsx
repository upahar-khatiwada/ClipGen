const StyleCardSkeleton = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="w-full h-75 bg-slate-200" />
      <div className="absolute bottom-0 w-full h-10 bg-slate-400 py-2"></div>
    </div>
  );
};

export default StyleCardSkeleton;
