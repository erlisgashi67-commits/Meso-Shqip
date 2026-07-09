"use client";

import { useQuery } from "@tanstack/react-query";
import type { CategoryView, LessonView, ExerciseView, DictionaryView } from "@/lib/types";

export function useCategories() {
  return useQuery<CategoryView[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      return data.categories;
    },
  });
}

export function useLessons(learnerId: string, category?: string, q?: string) {
  const params = new URLSearchParams();
  if (learnerId) params.set("learnerId", learnerId);
  if (category && category !== "all") params.set("category", category);
  if (q) params.set("q", q);
  return useQuery<LessonView[]>({
    queryKey: ["lessons", learnerId, category ?? "all", q ?? ""],
    queryFn: async () => {
      const res = await fetch(`/api/lessons?${params.toString()}`);
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      return data.lessons;
    },
  });
}

export function useLesson(slug: string | null, learnerId: string) {
  return useQuery<{ lesson: LessonView; exercises: ExerciseView[] }>({
    queryKey: ["lesson", slug, learnerId],
    queryFn: async () => {
      const res = await fetch(`/api/lessons/${slug}?learnerId=${encodeURIComponent(learnerId)}`);
      if (!res.ok) throw new Error("failed");
      return res.json();
    },
    enabled: !!slug,
  });
}

export function useDictionary(q?: string, category?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category && category !== "all") params.set("category", category);
  return useQuery<DictionaryView[]>({
    queryKey: ["dictionary", q ?? "", category ?? "all"],
    queryFn: async () => {
      const res = await fetch(`/api/dictionary?${params.toString()}`);
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      return data.words;
    },
  });
}
