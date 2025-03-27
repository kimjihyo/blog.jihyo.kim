import { Categories } from "@/components/categories";
import { Posts } from "@/components/posts";

export default function Page() {
  return (
    <div className="w-full max-w-5xl p-8 mx-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">태그</h1>
        <Categories />
      </div>
      <div className="grid gap-4 grid-cols-1 pt-8">
        <Posts />
      </div>
    </div>
  );
}
