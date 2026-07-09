"use client";

import * as React from "react";
import { RotateCcw, Volume2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { FlashcardData } from "@/lib/types";
import { useLang } from "@/components/meso/localized";
import { pickLang } from "@/components/meso/localized";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FlashcardExercise({ data, onAnswer }: { data: FlashcardData; onAnswer: (correct: boolean) => void }) {
  const lang = useLang();
  const [flipped, setFlipped] = React.useState(false);

  const speak = () => {
    try {
      const u = new SpeechSynthesisUtterance(data.front.sq);
      u.lang = "sq-AL";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div
        className="relative mx-auto h-56 w-full max-w-md cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <motion.div
          className="relative size-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-brand/30 bg-gradient-to-br from-brand-muted/40 to-card p-6 text-center shadow-sm"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-5xl">{data.emoji ?? "💬"}</div>
            <div className="mt-3 text-3xl font-extrabold tracking-tight text-brand">{data.front.sq}</div>
            {data.pronunciation && <div className="mt-1 text-sm text-muted-foreground">/{data.pronunciation}/</div>}
            <button
              onClick={(e) => { e.stopPropagation(); speak(); }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-medium shadow-sm"
            >
              <Volume2 className="size-3.5" /> Dëgjo
            </button>
            <div className="absolute bottom-3 text-[11px] text-muted-foreground">Kliko për t'a kthyer</div>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-card p-6 text-center shadow-sm dark:from-emerald-500/10"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Përkthim</div>
            <div className="mt-2 text-2xl font-bold">{pickLang(data.back, lang)}</div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setFlipped((f) => !f)} className="gap-1.5">
          <RotateCcw className="size-3.5" /> Kthe
        </Button>
      </div>

      {flipped && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
          <p className="text-center text-sm text-muted-foreground">A e dije këtë fjalë?</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => onAnswer(false)} className="border-rose-300 text-rose-600 hover:bg-rose-50">
              Mësoj përsëri
            </Button>
            <Button onClick={() => onAnswer(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
              E dija! <ArrowRight className="size-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
