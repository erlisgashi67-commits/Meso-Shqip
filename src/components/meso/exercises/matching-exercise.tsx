"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { MatchingData } from "@/lib/types";
import { useLang } from "@/components/meso/localized";
import { pickLang } from "@/components/meso/localized";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MatchingExercise({ data, onAnswer }: { data: MatchingData; onAnswer: (correct: boolean) => void }) {
  const lang = useLang();
  const pairs = data.pairs;

  const leftItems = React.useMemo(() => pairs.map((p, i) => ({ id: i, text: p.left.sq })), [pairs]);
  const rightItems = React.useMemo(
    () => shuffle(pairs.map((p, i) => ({ id: i, text: pickLang(p.right, lang) }))),
    [pairs, lang]
  );

  const [matched, setMatched] = React.useState<Set<number>>(new Set());
  const [selLeft, setSelLeft] = React.useState<number | null>(null);
  const [wrongRight, setWrongRight] = React.useState<number | null>(null);
  const [mistakes, setMistakes] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const onLeftClick = (id: number) => {
    if (matched.has(id) || done) return;
    setSelLeft(id);
    setWrongRight(null);
  };

  const onRightClick = (id: number) => {
    if (matched.has(id) || done || selLeft === null) return;
    if (selLeft === id) {
      const next = new Set(matched);
      next.add(id);
      setMatched(next);
      setSelLeft(null);
      if (next.size === pairs.length) {
        setDone(true);
      }
    } else {
      setWrongRight(id);
      setMistakes((m) => m + 1);
      setTimeout(() => {
        setWrongRight(null);
        setSelLeft(null);
      }, 500);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Bashko çiftet:</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {/* Left column (Albanian) */}
        <div className="space-y-2.5">
          {leftItems.map((item) => {
            const isMatched = matched.has(item.id);
            const isSel = selLeft === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={!isMatched ? { scale: 0.97 } : {}}
                onClick={() => onLeftClick(item.id)}
                disabled={isMatched}
                className={cn(
                  "w-full rounded-xl border-2 px-3 py-3 text-left text-sm font-bold transition-all",
                  isMatched && "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 opacity-70",
                  !isMatched && isSel && "border-brand bg-brand-muted/50 text-brand scale-[1.02]",
                  !isMatched && !isSel && "border-border bg-card hover:border-brand/50"
                )}
              >
                <span className="flex items-center justify-between">
                  {item.text}
                  {isMatched && <Check className="size-4" />}
                </span>
              </motion.button>
            );
          })}
        </div>
        {/* Right column (translations) */}
        <div className="space-y-2.5">
          {rightItems.map((item) => {
            const isMatched = matched.has(item.id);
            const isWrong = wrongRight === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={!isMatched ? { scale: 0.97 } : {}}
                animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                onClick={() => onRightClick(item.id)}
                disabled={isMatched}
                className={cn(
                  "w-full rounded-xl border-2 px-3 py-3 text-left text-sm font-medium transition-all",
                  isMatched && "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 opacity-70",
                  !isMatched && isWrong && "border-rose-500 bg-rose-50 dark:bg-rose-500/10",
                  !isMatched && !isWrong && "border-border bg-card hover:border-brand/50"
                )}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>
      </div>

      {done && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
            ✅ I bashkove të gjitha çiftet!{mistakes > 0 && ` (${mistakes} gabime)`}
          </div>
          <Button onClick={() => onAnswer(mistakes === 0)} className="gap-2">
            Tjetra <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
