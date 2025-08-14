export function LoadingCommentSection() {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>

      {/* Comment Form Skeleton */}
      <div className="flex flex-col mb-6">
        <div className="mb-3">
          <div className="flex w-full space-x-2">
            <div className="mt-1">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex gap-2 items-center w-60 h-12 bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        </div>
        <div>
          <div className="w-full h-16 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="ml-auto mt-2 mb-5">
          <div className="h-9 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Comments Skeleton */}
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="rounded-lg bg-card text-card-foreground p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
