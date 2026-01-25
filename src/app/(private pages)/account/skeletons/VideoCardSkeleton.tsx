export function VideoCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-3xl shadow-md overflow-hidden">
      <div className="bg-slate-200 rounded-t-3xl w-full h-100" />
      <div className="p-4">
        <div className="h-4 bg-slate-300 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-300 rounded w-1/2" />
      </div>
    </div>
  );
}
