"use client";

import * as React from "react";
import { useAppStore } from "@/store/app";
import type { LangCode, LocalizedText } from "@/lib/types";
import { DEFAULT_LANG } from "@/lib/languages";

// Returns the current UI language
export function useLang(): LangCode {
  return useAppStore((s) => s.lang);
}

// Resolve a localized object to a string for the current language
export function useT() {
  const lang = useLang();
  return React.useCallback(
    (obj: LocalizedText | undefined | null): string => {
      if (!obj) return "";
      return obj[lang] ?? obj[DEFAULT_LANG] ?? obj.sq ?? "";
    },
    [lang]
  );
}

// Resolve a localized object to a string for an explicit language
export function pickLang(obj: LocalizedText | undefined | null, lang: LangCode): string {
  if (!obj) return "";
  return obj[lang] ?? obj[DEFAULT_LANG] ?? obj.sq ?? "";
}

// Inline localized text component
export function LText({
  obj,
  className,
}: {
  obj: LocalizedText | undefined | null;
  className?: string;
}) {
  const t = useT();
  return <span className={className}>{t(obj)}</span>;
}
