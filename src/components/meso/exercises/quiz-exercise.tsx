"use client";

import * as React from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { QuizData } from "@/lib/types";
import { useLang } from "@/components/meso/localized";
import { pickLang } from "@/components/meso/localized";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuizExercise({ data, onAnswer }: { data: QuizData; onAnswer: (correct: boolean) => void }) {
  const lang = useLang();
  const [selected, setSelected] = React.useState<number | null>(null);
  const [revealed, setRevealed] = React.useState(false);

  const choose = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
  };

  const correct = selected === data.correctIndex;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold leading-snug">{pickLang(data.question, lang)}</h3>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {data.options.map((opt, i) => {
          const isCorrect = i === data.correctIndex;
          const isSel = i === selected;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: revealed ? 1 : 0.98 }}
              onClick={() => choose(i)}
              disabled={revealed}
              className={cn(
                "flex items-center justify-between gap-2 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all",
                !revealed && "border-border bg-card hover:border-brand/50 hover:bg-accent/40",
                revealed && isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
                revealed && isSel && !isCorrect && "border-rose-500 bg-rose-50 dark:bg-rose-500/10",
                revealed && !isCorrect && !isSel && "border-border opacity-60"
              )}
            >
              <span>{pickLang(opt, lang)}</span>
              {revealed && isCorrect && <Check className="size-4 text-emerald-600" />}
              {revealed && isSel && !isCorrect && <X className="size-4 text-rose-600" />}
            </motion.button>
          );
        })}
      </div>

      {revealed && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div
            className={cn(
              "rounded-xl p-3 text-sm",
              correct ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300"
            )}
          >
            <span className="font-bold">{correct ? "✅ " : "❌ "}</span>
            {data.explanation ? pickLang(data.explanation, lang) : correct ? "Saktë!" : `Përgjigja: ${pickLang(data.options[data.correctIndex], lang)}`}
          </div>
          <Button onClick={() => onAnswer(correct)} className="gap-2">
            {correct ? "Vazhdo" : "Tjetra"} <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
