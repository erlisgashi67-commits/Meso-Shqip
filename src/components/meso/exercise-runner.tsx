"use client";

import * as React from "react";
import { useLang } from "@/components/meso/localized";
import { UI, t as translate } from "@/lib/i18n";
import type { ExerciseView } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { QuizExercise } from "@/components/meso/exercises/quiz-exercise";
import { FlashcardExercise } from "@/components/meso/exercises/flashcard-exercise";
import { FillExercise } from "@/components/meso/exercises/fill-exercise";
import { MatchingExercise } from "@/components/meso/exercises/matching-exercise";
import { cn } from "@/lib/utils";

export function ExerciseRunner({
  exercises, index, total, onAnswer, submitting,
}: {
  exercises: ExerciseView[];
  index: number;
  total: number;
  onAnswer: (correct: boolean) => void;
  submitting?: boolean;
}) {
  const lang = useLang();
  const ex = exercises[index];
  const percent = total ? (index / total) * 100 : 0;

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold capitalize">{ex?.type} · {translate(UI.lesson.exercisesTitle, lang)}</span>
          <span>{Math.min(index + 1, total)} {translate(UI.common.of, lang)} {total}</span>
        </div>
        <Progress value={percent} className="h-2" />
      </div>

      <div className={cn("rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6")}>
        {submitting ? (
          <div className="grid place-items-center py-16">
            <div className="size-10 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
            <p className="mt-3 text-sm text-muted-foreground">Po ngarkohet...</p>
          </div>
        ) : !ex ? null : (
          <div key={ex.id} className="animate-pop-in">
            {ex.type === "quiz" ? (
              <QuizExercise data={ex.data as never} onAnswer={onAnswer} />
            ) : ex.type === "flashcard" ? (
              <FlashcardExercise data={ex.data as never} onAnswer={onAnswer} />
            ) : ex.type === "fill" ? (
              <FillExercise data={ex.data as never} onAnswer={onAnswer} />
            ) : ex.type === "matching" ? (
              <MatchingExercise data={ex.data as never} onAnswer={onAnswer} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
