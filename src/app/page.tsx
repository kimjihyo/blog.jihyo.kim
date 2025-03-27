import { Categories } from "@/components/categories";
import { Posts } from "@/components/posts";
import { ProfileCard } from "@/components/profile-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="w-full max-w-5xl p-8 mx-auto flex flex-col">
      <ProfileCard />
      <div className="flex mt-8">
        <Tabs defaultValue="all" className="flex-1 px-6">
          <div className="bg-white z-50 sticky top-16 pt-4">
            <TabsList>
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="trigger">개발</TabsTrigger>
              <TabsTrigger value="trigger2">디자인</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all">
            <div className="flex flex-col gap-8 py-5 mb-20">
              <Posts />
            </div>
          </TabsContent>
        </Tabs>
        <div className="w-2xs px-6 border-l hidden md:block">
          <div className="font-semibold mb-4">태그</div>
          <Categories />
        </div>
      </div>
    </div>
  );
}
