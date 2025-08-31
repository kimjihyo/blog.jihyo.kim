export function LoadingComments() {
  return (
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
  );
}
