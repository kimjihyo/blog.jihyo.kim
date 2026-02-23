import { commentsTable } from "@/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CommentListItem({
  comment,
}: {
  comment: typeof commentsTable.$inferSelect;
}) {
  return (
    <li className="rounded-lg bg-card p-4 text-card-foreground">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={comment.avatar} className="bg-muted" />
          <AvatarFallback>{comment.nickname[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1.5">
          <p className="text-xs leading-none font-medium sm:text-sm">
            {comment.nickname}
          </p>
          <p className="text-sm text-foreground/90 sm:text-base">
            {comment.content}
          </p>
          <p className="text-xs text-muted-foreground">
            {comment.createdAt.toLocaleString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Seoul",
            })}
          </p>
        </div>
      </div>
    </li>
  );
}
