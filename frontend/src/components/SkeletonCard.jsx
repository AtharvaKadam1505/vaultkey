export default function SkeletonCard() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/2" />
          <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-9 bg-[var(--bg-secondary)] rounded-lg" />
        <div className="h-9 bg-[var(--bg-secondary)] rounded-lg" />
      </div>
    </div>
  )
}
