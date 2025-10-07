export function LoadingCommentSection() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="h-5 w-16 animate-pulse rounded bg-card" />
        <div className="h-4 w-48 animate-pulse rounded bg-card" />
      </div>

      <div className="mb-6 flex flex-col">
        <div className="mb-3">
          <div className="flex w-full space-x-2">
            <div className="mt-1">
              <div className="h-10 w-10 animate-pulse rounded-full bg-card" />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex h-12 w-60 animate-pulse items-center gap-2 rounded-md bg-card" />
            </div>
          </div>
        </div>
        <div>
          <div className="h-16 w-full animate-pulse rounded-md bg-card" />
        </div>
        <div className="mt-2 mb-5 ml-auto">
          <div className="h-9 w-24 animate-pulse rounded bg-card" />
        </div>
      </div>

      <ul className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="rounded-lg bg-card p-4 text-card-foreground">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-foreground/5" />
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="h-4 w-20 animate-pulse rounded bg-foreground/5" />
                <div className="h-4 w-full animate-pulse rounded bg-foreground/5" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-foreground/5" />
                <div className="h-3 w-32 animate-pulse rounded bg-foreground/5" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
