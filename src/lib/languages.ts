import type { LangCode } from "./types";

export const LANGUAGES: { code: LangCode; label: string; flag: string; native: string }[] = [
  { code: "sq", label: "Albanian", native: "Shqip", flag: "🇦🇱" },
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "de", label: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italian", native: "Italiano", flag: "🇮🇹" },
  { code: "fr", label: "French", native: "Français", flag: "🇫🇷" },
  { code: "es", label: "Spanish", native: "Español", flag: "🇪🇸" },
];

export const LANGUAGE_MAP: Record<LangCode, { label: string; native: string; flag: string }> =
  Object.fromEntries(LANGUAGES.map((l) => [l.code, l])) as never;

export const DEFAULT_LANG: LangCode = "sq";
