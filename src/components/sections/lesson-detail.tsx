"use client";

import * as React from "react";
import {
  ArrowLeft, Clock, Star, CheckCircle2, Trophy, RotateCcw, Award, Sparkles, BookOpen, X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppStore } from "@/store/app";
import { useLang, useT } from "@/components/meso/localized";
import { useEnsureLearner } from "@/components/meso/use-ensure-learner";
import { useLesson } from "@/components/meso/queries";
import { UI, t as translate } from "@/lib/i18n";
import type { LangCode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/meso/markdown";
import { ExerciseRunner } from "@/components/meso/exercise-runner";
import { cn } from "@/lib/utils";

export function LessonDetail() {
  const lang = useLang() as LangCode;
  const t = useT();
  const slug = useAppStore((s) => s.activeLessonSlug);
  const closeLesson = useAppStore((s) => s.closeLesson);
  const go = useAppStore((s) => s.go);
  const setLastCertCode = useAppStore((s) => s.setLastCertCode);
  const learnerId = useEnsureLearner();
  const lessonQ = useLesson(slug, learnerId);
  const qc = useQueryClient();

  const [mode, setMode] = React.useState<"reading" | "exercises" | "result">("reading");
  const [results, setResults] = React.useState<boolean[]>([]);
  const [certCode, setCertCode] = React.useState<string | null>(null);
  const [xpEarned, setXpEarned] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setMode("reading");
    setResults([]);
    setCertCode(null);
    setXpEarned(0);
  }, [slug]);

  if (!slug) return null;

  if (lessonQ.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }
  if (lessonQ.isError || !lessonQ.data) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Mësimi nuk u gjet.</p>
        <Button onClick={closeLesson} className="mt-4">{translate(UI.common.back, lang)}</Button>
      </div>
    );
  }

  const { lesson, exercises } = lessonQ.data;

  const startExercises = () => {
    if (exercises.length === 0) {
      toast.error("Ky mësim nuk ka ushtrime ende.");
      return;
    }
    setResults([]);
    setMode("exercises");
  };

  const handleAnswer = async (correct: boolean) => {
    const next = [...results, correct];
    setResults(next);
    if (next.length < exercises.length) return;
    // finished
    setSubmitting(true);
    const score = Math.round((next.filter(Boolean).length / exercises.length) * 100);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learnerId, lessonId: lesson.id, score, status: score >= 60 ? "completed" : "in_progress" }),
      });
      const data = await res.json();
      setXpEarned(data.xpEarned ?? 0);

      if (data.eligibleForCertificate) {
        const certRes = await fetch("/api/certificate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ learnerId, lessonSlug: lesson.slug }),
        });
        const certData = await certRes.json();
        if (certData.eligible && certData.code) {
          setCertCode(certData.code);
          setLastCertCode(certData.code);
        }
      }
      qc.invalidateQueries({ queryKey: ["learner", learnerId] });
      qc.invalidateQueries({ queryKey: ["lessons", learnerId] });
      qc.invalidateQueries({ queryKey: ["lesson", slug, learnerId] });
      qc.invalidateQueries({ queryKey: ["progress"] });
      setMode("result");
    } catch {
      toast.error("Diçka shkoi keq.");
    } finally {
      setSubmitting(false);
    }
  };

  const retake = () => {
    setResults([]);
    setCertCode(null);
    setXpEarned(0);
    setMode("exercises");
  };

  const score = results.length ? Math.round((results.filter(Boolean).length / results.length) * 100) : 0;
  const passed = score >= 60;

  return (
    <div className="space-y-6">
      <button onClick={closeLesson} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand">
        <ArrowLeft className="size-4" /> {translate(UI.common.back, lang)}
      </button>

      {/* Lesson header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-brand-muted/40 to-card p-6 sm:p-8">
        <div className="hero-grid absolute inset-0 opacity-50" />
        <div className="relative flex flex-wrap items-start gap-4">
          <div className="grid size-16 place-items-center rounded-2xl bg-brand text-brand-foreground text-3xl shadow-sm">{lesson.coverEmoji}</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="border-0 bg-brand/10 text-brand">
                {translate(UI.difficulty[lesson.difficulty as keyof typeof UI.difficulty], lang)}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3.5" /> {lesson.duration} {translate(UI.common.minutes, lang)}</span>
              <span className="flex items-center gap-1 text-xs text-brand"><Star className="size-3.5 fill-brand" /> {lesson.xpReward} {translate(UI.common.xp, lang)}</span>
              {lesson.progress?.status === "completed" && (
                <Badge className="border-0 bg-emerald-500/15 text-emerald-600"><CheckCircle2 className="size-3 mr-1" /> {translate(UI.lesson.completed, lang)}</Badge>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{t(lesson.title)}</h1>
            <p className="mt-1 text-muted-foreground">{t(lesson.summary)}</p>
          </div>
        </div>
      </div>

      {mode === "reading" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <BookOpen className="size-4" /> {translate(UI.lesson.objectives, lang)}
              </div>
              <Markdown content={t(lesson.content)} />
            </Card>
          </div>
          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-brand" /> {translate(UI.lesson.exercisesTitle, lang)}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {exercises.length} {translate(UI.lessons.exercises, lang)} · {translate(UI.lesson.completeToEarn, lang)} {lesson.xpReward} XP
              </p>
              <div className="mt-2 rounded-lg bg-brand-muted/50 p-2.5 text-xs text-foreground/80">
                {translate(UI.lesson.needPass, lang)}
              </div>
              <Button className="mt-4 w-full gap-2" size="lg" onClick={startExercises}>
                <BookOpen className="size-4" /> {translate(UI.lessons.startLesson, lang)}
              </Button>
              {exercises.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {exercises.map((ex, i) => (
                    <div key={ex.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="grid size-5 place-items-center rounded bg-muted font-semibold text-foreground">{i + 1}</span>
                      <span className="capitalize">{ex.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </aside>
        </div>
      )}

      {mode === "exercises" && (
        <ExerciseRunner
          exercises={exercises}
          index={results.length}
          total={exercises.length}
          onAnswer={handleAnswer}
          submitting={submitting}
        />
      )}

      {mode === "result" && (
        <ResultScreen
          score={score}
          passed={passed}
          xpEarned={xpEarned}
          certCode={certCode}
          onRetake={retake}
          onBack={closeLesson}
          onViewCert={() => go("certificate")}
          lang={lang}
        />
      )}
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border/60 bg-card p-5 shadow-sm", className)}>{children}</div>;
}

function ResultScreen({
  score, passed, xpEarned, certCode, onRetake, onBack, onViewCert, lang,
}: {
  score: number; passed: boolean; xpEarned: number; certCode: string | null;
  onRetake: () => void; onBack: () => void; onViewCert: () => void; lang: LangCode;
}) {
  return (
    <div className="mx-auto max-w-lg">
      <Card className="overflow-hidden p-0 text-center">
        <div className={cn("relative p-8", passed ? "bg-gradient-to-br from-emerald-500/15 to-card" : "bg-gradient-to-br from-amber-500/15 to-card")}>
          <div className="hero-grid absolute inset-0 opacity-40" />
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
            <div className={cn("mx-auto grid size-20 place-items-center rounded-full text-4xl", passed ? "bg-emerald-500 text-white" : "bg-amber-500 text-white")}>
              {passed ? <Trophy className="size-10" /> : <X className="size-10" />}
            </div>
          </motion.div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">
            {passed ? translate(UI.lesson.passed, lang) : translate(UI.lesson.failed, lang)}
          </h2>
          <div className="mt-3 inline-flex items-baseline gap-1">
            <span className="text-5xl font-extrabold text-brand">{score}%</span>
          </div>
          {xpEarned > 0 && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-sm font-bold text-brand-foreground">
              <Star className="size-4 fill-brand-foreground" /> +{xpEarned} XP
            </div>
          )}
        </div>

        <div className="space-y-3 p-6">
          {certCode && passed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 border-brand/30 bg-brand-muted/40 p-4 text-left">
              <div className="flex items-center gap-2 font-bold text-brand">
                <Award className="size-5" /> {translate(UI.lesson.certificateReady, lang)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Kodi: <span className="font-mono font-bold text-foreground">{certCode}</span></p>
            </motion.div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            {certCode && (
              <Button className="flex-1 gap-2" onClick={onViewCert}>
                <Award className="size-4" /> {translate(UI.lesson.viewCertificate, lang)}
              </Button>
            )}
            <Button variant="outline" className="flex-1 gap-2" onClick={onRetake}>
              <RotateCcw className="size-4" /> {translate(UI.lesson.retake, lang)}
            </Button>
            <Button variant="ghost" className="flex-1" onClick={onBack}>
              {translate(UI.common.back, lang)}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
