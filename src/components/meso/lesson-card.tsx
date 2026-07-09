"use client";

import { BookOpen, Clock, Star, CheckCircle2, PlayCircle } from "lucide-react";
import type { LessonView } from "@/lib/types";
import { useAppStore } from "@/store/app";
import { useT } from "@/components/meso/localized";
import { UI, t as translate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const diffStyles: Record<string, string> = {
  fillim: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  mesatar: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  avancuar: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

export function LessonCard({ lesson }: { lesson: LessonView }) {
  const t = useT();
  const openLesson = useAppStore((s) => s.openLesson);
  const lang = useAppStore((s) => s.lang);
  const progress = lesson.progress?.status;
  const completed = progress === "completed";
  const started = progress === "in_progress";

  return (
    <button
      onClick={() => openLesson(lesson.slug)}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="grid size-12 place-items-center rounded-xl bg-brand-muted text-2xl">{lesson.coverEmoji}</div>
        {completed && (
          <span className="grid size-7 place-items-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 className="size-4" />
          </span>
        )}
      </div>

      <div className="mt-4 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <Badge variant="secondary" className={cn("border-0 px-2 py-0 text-[10px] font-semibold", diffStyles[lesson.difficulty])}>
            {translate(UI.difficulty[lesson.difficulty as keyof typeof UI.difficulty], lang)}
          </Badge>
          {lesson.exerciseCount !== undefined && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <BookOpen className="size-3" /> {lesson.exerciseCount} {translate(UI.lessons.exercises, lang)}
            </span>
          )}
        </div>
        <h3 className="font-bold leading-snug tracking-tight group-hover:text-brand">{t(lesson.title)}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t(lesson.summary)}</p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="size-3.5" /> {lesson.duration} {translate(UI.common.minutes, lang)}</span>
          <span className="flex items-center gap-1 text-brand"><Star className="size-3.5 fill-brand" /> +{lesson.xpReward} {translate(UI.common.xp, lang)}</span>
        </div>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            completed ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
              : started ? "bg-brand text-brand-foreground"
              : "bg-muted text-foreground"
          )}
        >
          <PlayCircle className="size-3.5" />
          {completed ? translate(UI.common.completed, lang) : started ? translate(UI.common.continue, lang) : translate(UI.common.start, lang)}
        </span>
      </div>
    </button>
  );
}
