import { Shell } from "@/components/shell";
import { Tags } from "@/components/tags";
import { Posts } from "@/components/posts";
import { ProfileCard } from "@/components/profile-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { title: "전체", value: "all" },
  { title: "작성글", value: "post" },
  { title: "번역글", value: "translation" },
];

export default function Page() {
  return (
    <Shell className="flex flex-col">
      <ProfileCard />
      <div className="flex mt-8">
        <Tabs defaultValue="all" className="flex-1 pr-6">
          <div className="bg-background z-50 sticky top-16 pt-4">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="flex flex-col gap-8 py-5 mb-10">
                <Posts type={tab.value === "all" ? undefined : tab.value} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <div className="w-3xs px-6 border-l hidden md:block">
          <div className="font-semibold mb-4">태그</div>
          <Tags />
        </div>
      </div>
    </Shell>
  );
}
