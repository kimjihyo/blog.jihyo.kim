import { allTranslations } from "content-collections";
import { TranslationCard } from "./translation-card";

export function Translations() {
  return (
    <>
      {allTranslations.map((translation) => (
        <TranslationCard
          key={translation._meta.path}
          translation={translation}
        />
      ))}
    </>
  );
}
