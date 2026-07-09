"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useAppStore } from "@/store/app";
import { useT, useLang } from "@/components/meso/localized";
import { useEnsureLearner } from "@/components/meso/use-ensure-learner";
import { useLessons, useCategories } from "@/components/meso/queries";
import { UI, t as translate } from "@/lib/i18n";
import type { LangCode } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonCard } from "@/components/meso/lesson-card";
import { cn } from "@/lib/utils";

const DIFFS = ["all", "fillim", "mesatar", "avancuar"] as const;

export function LessonsSection() {
  const lang = useLang() as LangCode;
  const t = useT();
  const learnerId = useEnsureLearner();
  const catsQ = useCategories();
  const [category, setCategory] = React.useState("all");
  const [diff, setDiff] = React.useState<string>("all");
  const [q, setQ] = React.useState("");
  const lessonsQ = useLessons(learnerId, category, q);

  const filtered = (lessonsQ.data ?? []).filter((l) => diff === "all" || l.difficulty === diff);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{translate(UI.lessons.title, lang)}</h1>
        <p className="mt-1 text-muted-foreground">{translate(UI.lessons.subtitle, lang)}</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={translate(UI.common.search, lang)}
          className="pl-9"
        />
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setCategory("all")}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            category === "all" ? "border-brand bg-brand text-brand-foreground" : "border-border bg-card hover:border-brand/40"
          )}
        >
          📚 {translate(UI.lessons.allCategories, lang)}
        </button>
        {(catsQ.data ?? []).map((c) => (
          <button
            key={c.slug}
            onClick={() => setCategory(c.slug)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              category === c.slug ? "border-brand bg-brand text-brand-foreground" : "border-border bg-card hover:border-brand/40"
            )}
          >
            <span>{c.icon}</span> {t(c.name)}
            <span className={cn("ml-1 rounded-full px-1.5 text-[10px]", category === c.slug ? "bg-white/20" : "bg-muted")}>
              {c.lessonCount ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-muted-foreground" />
        {DIFFS.map((d) => (
          <button
            key={d}
            onClick={() => setDiff(d)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              diff === d ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {d === "all" ? translate(UI.common.all, lang) : translate(UI.difficulty[d as keyof typeof UI.difficulty], lang)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {lessonsQ.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          <div className="text-4xl">🔍</div>
          <p className="mt-2">{translate(UI.lessons.noResults, lang)}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => <LessonCard key={l.id} lesson={l} />)}
        </div>
      )}
    </div>
  );
}
