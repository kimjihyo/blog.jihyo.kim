import { Shell } from "@/components/shell";
import { Tags } from "@/components/tags";
import { Posts } from "@/components/posts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { title: "전체", value: "all" },
  { title: "개발일지", value: "dev-log" },
  { title: "트러블슈팅", value: "trouble-shooting" },
  { title: "일상", value: "daily" },
];

export default function Page() {
  return (
    <Shell className="flex flex-col">
      <div className="flex">
        <Tabs defaultValue="all" className="flex-1 md:pr-6">
          <div className="z-50 bg-background sticky top-16 pt-4">
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
        <div className="w-3xs px-6 pt-4 border-l hidden md:block">
          <div className="font-semibold mb-4">태그</div>
          <Tags />
        </div>
      </div>
    </Shell>
  );
}
