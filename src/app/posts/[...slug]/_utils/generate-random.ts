export function generateRandomAvatar() {
  const randomId = Math.floor(Math.random() * 10);
  return `https://i.pravatar.cc/150?img=${randomId}`;
}

export function generateRandomNickname() {
  const adjectives = [
    "행복한",
    "즐거운",
    "따뜻한",
    "귀여운",
    "용감한",
    "현명한",
    "친절한",
    "신비한",
    "상냥한",
    "활기찬",
  ];

  const nouns = [
    "피카츄",
    "이상해씨",
    "파이리",
    "꼬부기",
    "잠만보",
    "뮤츠",
    "푸린",
    "라이츄",
    "야도란",
    "메타몽",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNickname = `${randomAdjective}${randomNoun}`;
  return randomNickname;
}
