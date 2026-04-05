export default function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-lg border border-gray-200 bg-gray-100 p-3"
      aria-busy="true"
      aria-label="正在生成..."
    >
      <div className="mb-2 h-4 w-1/3 rounded bg-gray-300" />
      <div className="mb-1 h-3 w-full rounded bg-gray-200" />
      <div className="h-3 w-4/5 rounded bg-gray-200" />
    </div>
  );
}
