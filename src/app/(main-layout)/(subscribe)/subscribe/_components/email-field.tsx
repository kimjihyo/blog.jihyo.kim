import * as React from "react";
import { Autocomplete } from "@/components/ui/autocomplete";

const EMAIL_DOMAINS = [
  "gmail.com",
  "naver.com",
  "daum.net",
  "hanmail.net",
  "yahoo.com",
  "outlook.com",
];

export default function EmailField(
  props: Omit<React.ComponentProps<typeof Autocomplete>, "suggestions">,
) {
  const { defaultValue, ...rest } = props;
  const [inputValue, setInputValue] = React.useState(
    defaultValue ? String(defaultValue) : "",
  );

  // Only show suggestions for the domain part after '@'
  const atIndex = inputValue.indexOf("@");
  const local = atIndex === -1 ? inputValue : inputValue.slice(0, atIndex);
  const domain = atIndex === -1 ? "" : inputValue.slice(atIndex + 1);
  const showSuggestions = atIndex !== -1;

  const suggestions = React.useMemo(() => {
    if (!showSuggestions) return [];
    return EMAIL_DOMAINS.filter((d) => d.startsWith(domain)).map(
      (d) => `${local}@${d}`,
    );
  }, [showSuggestions, domain, local]);

  return (
    <Autocomplete
      {...rest}
      suggestions={suggestions}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="이메일을 입력해주세요"
      inputMode="email"
      autoComplete="off"
    />
  );
}
