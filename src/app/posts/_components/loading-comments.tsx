export function LoadingComments() {
  return (
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
  );
}
