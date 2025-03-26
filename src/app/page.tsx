import { Categories } from "@/components/categories";
import { Posts } from "@/components/posts";
import { Translations } from "@/components/translations";
import { ProfileCard } from "@/components/profile-card";

export default function Page() {
  return (
    <div className="w-full max-w-4xl p-8 mx-auto flex flex-col">
      <ProfileCard />
      <div className="flex flex-col gap-4 mt-8">
        <h1 className="text-2xl font-bold">최근에 작성한 글</h1>
        <Categories />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <Posts />
      </div>
      <div className="mt-14">
        <h1 className="text-2xl font-bold">최근에 번역한 글</h1>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Translations />
      </div>
    </div>
  );
}
