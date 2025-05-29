import { CommentForm } from "./comment-form";

export function CommentSection() {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-full bg-card/80 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-1">댓글 기능 개발 중</p>
          <p className="text-sm text-muted-foreground">
            곧 만나보실 수 있습니다!
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="font-medium">댓글 0</div>
        <div className="text-sm text-muted-foreground">
          댓글 관련 문의: kimjihyo0325@gmail.com
        </div>
      </div>
      <CommentForm />
    </div>
  );
}
