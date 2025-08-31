export function LoadingLatestComments() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-lg bg-card p-4 py-2 text-card-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-foreground/5" />
            <div className="h-4 w-20 rounded bg-foreground/5" />
          </div>
          <div className="h-8 rounded bg-foreground/5" />
          <div className="h-3 w-32 rounded bg-foreground/5" />
        </div>
      ))}
    </div>
  );
}
