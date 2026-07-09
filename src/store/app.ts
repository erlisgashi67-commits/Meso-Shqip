"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LangCode } from "@/lib/types";
import { DEFAULT_LANG } from "@/lib/languages";

export type Section =
  | "home"
  | "lessons"
  | "lesson"
  | "practice"
  | "progress"
  | "certificate"
  | "ai"
  | "admin";

interface AppState {
  lang: LangCode;
  setLang: (lang: LangCode) => void;

  learnerId: string | null;
  setLearnerId: (id: string) => void;

  activeLessonSlug: string | null;
  openLesson: (slug: string) => void;
  closeLesson: () => void;

  section: Section;
  setSection: (s: Section) => void;
  go: (s: Section) => void;

  lastCertCode: string | null;
  setLastCertCode: (code: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: DEFAULT_LANG,
      setLang: (lang) => set({ lang }),

      learnerId: null,
      setLearnerId: (learnerId) => set({ learnerId }),

      activeLessonSlug: null,
      openLesson: (slug) => set({ activeLessonSlug: slug, section: "lesson" }),
      closeLesson: () => set({ activeLessonSlug: null, section: "lessons" }),

      section: "home",
      setSection: (section) => set({ section }),
      go: (section) =>
        set(
          section === "lesson"
            ? { section }
            : { section, activeLessonSlug: null }
        ),

      lastCertCode: null,
      setLastCertCode: (lastCertCode) => set({ lastCertCode }),
    }),
    {
      name: "meso-shqip",
      partialize: (s) => ({ lang: s.lang, learnerId: s.learnerId }),
    }
  )
);
