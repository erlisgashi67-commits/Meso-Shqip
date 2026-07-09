"use client";

import * as React from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { FillData } from "@/lib/types";
import { useLang } from "@/components/meso/localized";
import { pickLang } from "@/components/meso/localized";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FillExercise({ data, onAnswer }: { data: FillData; onAnswer: (correct: boolean) => void }) {
  const lang = useLang();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [revealed, setRevealed] = React.useState(false);

  const sentence = pickLang(data.sentence, lang);
  const answer = pickLang(data.answer, lang);
  const parts = sentence.split("____");

  const choose = (opt: string) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
  };

  const correct = selected === answer;
  const options = data.options ?? [data.answer];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Plotëso hapësirën:</h3>
      <div className="rounded-2xl border border-border bg-card p-5 text-center text-xl font-medium leading-relaxed">
        {parts[0]}
        <span
          className={cn(
            "mx-1 inline-block min-w-24 rounded-md border-b-2 px-2 py-0.5 font-bold",
            !selected && "border-brand/40 text-muted-foreground",
            revealed && correct && "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
            revealed && !correct && "border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-500/10",
            !revealed && selected && "border-brand text-brand bg-brand-muted/40"
          )}
        >
          {selected ?? "?"}
        </span>
        {parts[1]}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {options.map((opt, i) => {
          const optText = pickLang(opt, lang);
          const isAns = optText === answer;
          const isSel = optText === selected;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: revealed ? 1 : 0.97 }}
              onClick={() => choose(optText)}
              disabled={revealed}
              className={cn(
                "rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all",
                !revealed && "border-border bg-card hover:border-brand/50",
                revealed && isAns && "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700",
                revealed && isSel && !isAns && "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700",
                revealed && !isAns && !isSel && "border-border opacity-60"
              )}
            >
              {optText}
            </motion.button>
          );
        })}
      </div>

      {revealed && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl p-3 text-sm font-medium",
              correct ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300"
            )}
          >
            {correct ? <Check className="size-4" /> : <X className="size-4" />}
            {correct ? "Saktë!" : `Përgjigja e saktë: ${answer}`}
          </div>
          <Button onClick={() => onAnswer(correct)} className="gap-2">
            Tjetra <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
