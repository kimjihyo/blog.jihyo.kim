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
    "고양이",
    "강아지",
    "토끼",
    "판다",
    "여우",
    "코끼리",
    "기린",
    "돌고래",
    "펭귄",
    "햄스터",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNickname = `${randomAdjective}${randomNoun}`;
  return randomNickname;
}
