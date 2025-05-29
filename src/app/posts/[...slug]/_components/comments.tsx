import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { commentsTable } from "@/db/schema";

interface CommentsProps {
  comments: (typeof commentsTable.$inferSelect)[];
}

export function Comments({ comments }: CommentsProps) {
  return (
    <ul className="flex flex-col gap-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}

function Comment({ comment }: { comment: typeof commentsTable.$inferSelect }) {
  return (
    <li className="rounded-lg bg-card text-card-foreground p-4">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={comment.avatar} />
          <AvatarFallback>{comment.nickname[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1.5">
          <p className="text-xs sm:text-sm font-medium leading-none">
            {comment.nickname}
          </p>
          <p className="text-sm sm:text-base text-foreground/90">
            {comment.content}
          </p>
          <p className="text-xs text-muted-foreground">
            {comment.createdAt.toLocaleString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </li>
  );
}
