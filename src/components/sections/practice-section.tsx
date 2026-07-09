"use client";

import * as React from "react";
import { Dumbbell, BookOpen, Trophy, RotateCcw, ArrowLeft, Shuffle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/app";
import { useLang, useT } from "@/components/meso/localized";
import { useEnsureLearner } from "@/components/meso/use-ensure-learner";
import { useLessons, useLesson } from "@/components/meso/queries";
import { UI, t as translate } from "@/lib/i18n";
import type { LangCode, ExerciseView } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExerciseRunner } from "@/components/meso/exercise-runner";
import { cn } from "@/lib/utils";

const TYPES = [
  { key: "all", label: "Të gjitha", icon: "🎲" },
  { key: "quiz", label: "Kuiz", icon: "❓" },
  { key: "flashcard", label: "Karta", icon: "🃏" },
  { key: "fill", label: "Plotësim", icon: "✏️" },
  { key: "matching", label: "Bashkim", icon: "🔗" },
] as const;

export function PracticeSection() {
  const lang = useLang() as LangCode;
  const t = useT();
  const learnerId = useEnsureLearner();
  const lessonsQ = useLessons(learnerId);
  const [selectedSlug, setSelectedSlug] = React.useState<string | null>(null);
  const [type, setType] = React.useState<string>("all");
  const [running, setRunning] = React.useState(false);
  const [results, setResults] = React.useState<boolean[]>([]);
  const [done, setDone] = React.useState(false);

  const lessonQ = useLesson(selectedSlug, learnerId);
  const exercises = React.useMemo(() => {
    const all = lessonQ.data?.exercises ?? [];
    const filtered = type === "all" ? all : all.filter((e) => e.type === type);
    return filtered;
  }, [lessonQ.data, type]);

  const start = () => {
    if (exercises.length === 0) return;
    setResults([]);
    setDone(false);
    setRunning(true);
  };

  const onAnswer = (correct: boolean) => {
    const next = [...results, correct];
    setResults(next);
    if (next.length >= exercises.length) {
      setRunning(false);
      setDone(true);
    }
  };

  const score = results.length ? Math.round((results.filter(Boolean).length / results.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-2xl bg-brand-muted text-2xl"><Dumbbell className="size-6 text-brand" /></div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{translate(UI.practice.title, lang)}</h1>
          <p className="text-muted-foreground">{translate(UI.practice.subtitle, lang)}</p>
        </div>
      </div>

      {!running && !done && (
        <>
          {/* Type selector */}
          <div>
            <div className="mb-2 text-sm font-semibold text-muted-foreground">{translate(UI.practice.chooseType, lang)}</div>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((tp) => (
                <button
                  key={tp.key}
                  onClick={() => setType(tp.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all",
                    type === tp.key ? "border-brand bg-brand-muted/50 text-brand" : "border-border bg-card hover:border-brand/40"
                  )}
                >
                  <span className="text-lg">{tp.icon}</span>
                  {tp.key === "all" ? translate(UI.common.all, lang) : translate(UI.practice[tp.key as "quiz"], lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Lesson picker */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <BookOpen className="size-4" /> Zgjidh mësimin
            </div>
            {lessonsQ.isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid max-h-96 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3 scroll-thin">
                {(lessonsQ.data ?? []).map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedSlug(l.slug)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all",
                      selectedSlug === l.slug ? "border-brand bg-brand-muted/40" : "border-border bg-card hover:border-brand/40"
                    )}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-muted text-xl">{l.coverEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold">{t(l.title)}</div>
                      <div className="text-[11px] text-muted-foreground capitalize">{l.difficulty}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Start */}
          {selectedSlug && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card p-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Ushtrime të gatshme: </span>
                <span className="font-bold text-brand">{lessonQ.data ? exercises.length : "..."}</span>
              </div>
              <Button className="ml-auto gap-2" onClick={start} disabled={exercises.length === 0}>
                <Shuffle className="size-4" /> {translate(UI.common.start, lang)}
              </Button>
              {exercises.length === 0 && lessonQ.data && (
                <span className="text-xs text-muted-foreground">{translate(UI.practice.noExercises, lang)}</span>
              )}
            </div>
          )}
        </>
      )}

      {running && selectedSlug && (
        <>
          <button onClick={() => setRunning(false)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand">
            <ArrowLeft className="size-4" /> {translate(UI.common.back, lang)}
          </button>
          <ExerciseRunner exercises={exercises} index={results.length} total={exercises.length} onAnswer={onAnswer} />
        </>
      )}

      {done && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md">
          <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-sm">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-brand text-brand-foreground text-4xl">
              <Trophy className="size-10" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold">{translate(UI.practice.finalScore, lang)}</h2>
            <div className="mt-2 text-6xl font-extrabold text-brand">{score}%</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {score >= 80 ? translate(UI.practice.greatJob, lang) : translate(UI.practice.keepGoing, lang)}
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <Button variant="outline" className="gap-2" onClick={() => { setDone(false); setResults([]); }}>
                <RotateCcw className="size-4" /> {translate(UI.lesson.retake, lang)}
              </Button>
              <Button className="gap-2" onClick={() => { setDone(false); setResults([]); setRunning(false); }}>
                <CheckCircle2 className="size-4" /> {translate(UI.common.back, lang)}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
