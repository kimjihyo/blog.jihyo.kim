import { Card, CardContent, CardTitle } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { siteConfig } from "@/config/site";

export function ProfileCard() {
  return (
    <Card>
      <CardContent className="flex items-center gap-6">
        <Avatar className="w-16 h-16 hidden sm:block">
          <AvatarImage src={siteConfig.avatarImage} />
          <AvatarFallback>JK</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="mb-2 flex items-center gap-2 text-base sm:text-lg">
            <Avatar className="w-8 h-8 sm:hidden">
              <AvatarImage src={siteConfig.avatarImage} />
              <AvatarFallback>JK</AvatarFallback>
            </Avatar>
            <span>김지효</span>
          </CardTitle>
          <div className="text-sm sm:text-base">
            작은 것 하나하나 원하는대로 커스터마이즈할 수 있는 블로그를 갖고
            싶어 직접 만들었습니다. 제가 개발하고 문제를 해결하는 과정을
            기록합니다.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
