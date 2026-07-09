"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/app";
import type { LearnerView } from "@/lib/types";

// Ensures a learnerId is present in the store (defaults to the seeded demo learner)
export function useEnsureLearner() {
  const learnerId = useAppStore((s) => s.learnerId);
  const setLearnerId = useAppStore((s) => s.setLearnerId);

  React.useEffect(() => {
    if (!learnerId) setLearnerId("demo-arlind");
  }, [learnerId, setLearnerId]);

  return learnerId ?? "demo-arlind";
}

export function useLearner(learnerId: string) {
  return useQuery<{
    learner: LearnerView;
    stats: { completedLessons: number; wordsLearned: number; totalLessons: number; streak: number; totalXp: number };
    byCategory: { slug: string; name: import("@/lib/types").LocalizedText; color: string; icon: string; total: number; completed: number; percent: number }[];
    weeklyActivity: { label: string; xp: number }[];
    achievements: import("@/lib/types").AchievementView[];
  }>({
    queryKey: ["learner", learnerId],
    queryFn: async () => {
      const res = await fetch(`/api/learner?learnerId=${encodeURIComponent(learnerId)}`);
      if (!res.ok) throw new Error("failed");
      return res.json();
    },
    enabled: !!learnerId,
  });
}
