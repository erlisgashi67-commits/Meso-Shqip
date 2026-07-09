// Mëso Shqip🦅 — Date formatting helpers
import type { LangCode } from "./types";

const LOCALE_MAP: Record<LangCode, string> = {
  sq: "sq-AL",
  en: "en-GB",
  de: "de-DE",
  it: "it-IT",
  fr: "fr-FR",
  es: "es-ES",
};

/**
 * Format an ISO date string using a locale appropriate for the given language.
 * Example output for sq: "12 janar 2025".
 * Returns an empty string if the input cannot be parsed as a date.
 */
export function formatDate(iso: string, lang: LangCode): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const locale = LOCALE_MAP[lang] ?? "sq-AL";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
