export function LoadingLatestComments() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 py-2 bg-card text-card-foreground rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
          <div className="h-8 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
