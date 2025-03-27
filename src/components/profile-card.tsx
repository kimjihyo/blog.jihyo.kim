import { Card, CardContent, CardTitle } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
export function ProfileCard() {
  return (
    <Card>
      <CardContent className="flex items-center gap-6">
        <Avatar className="w-16 h-16 hidden sm:block">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="mb-2 flex items-center gap-2">
            <Avatar className="w-8 h-8 sm:hidden">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span>김지효</span>
          </CardTitle>
          <div className="font-medium text-gray-700">
            TypeScript로 말하는 낮에는 개발자, 밤에는 헬창. 영어와 한국어로
            포스트를 작성합니다. 보통은 한국어로 쓰지만, 영어가 그리울 때는
            영어로 써서 나의 영어 실력에 작은 도전장을 던집니다.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
