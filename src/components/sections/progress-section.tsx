"use client";

import * as React from "react";
import { Flame, Star, BookOpen, Library, Trophy, Lock } from "lucide-react";
import {
  Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, RadialBar, RadialBarChart, PolarAngleAxis,
} from "recharts";
import { useLang, useT, pickLang } from "@/components/meso/localized";
import { useEnsureLearner, useLearner } from "@/components/meso/use-ensure-learner";
import { UI, t as translate } from "@/lib/i18n";
import type { LangCode } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ALL_ACHIEVEMENTS = [
  { type: "first_lesson", icon: "🎯", title: { sq: "Mësimi i parë", en: "First lesson", de: "Erste Lektion", it: "Prima lezione", fr: "Première leçon", es: "Primera lección" } },
  { type: "streak_5", icon: "📚", title: { sq: "5 mësime", en: "5 lessons", de: "5 Lektionen", it: "5 lezioni", fr: "5 leçons", es: "5 lecciones" } },
  { type: "streak_7", icon: "🔥", title: { sq: "Seria 7 ditore", en: "7-day streak", de: "7-Tage-Serie", it: "Serie di 7 giorni", fr: "Série de 7 jours", es: "Racha de 7 días" } },
  { type: "words_50", icon: "💬", title: { sq: "50 fjalë", en: "50 words", de: "50 Wörter", it: "50 parole", fr: "50 mots", es: "50 palabras" } },
  { type: "quiz_master", icon: "🧠", title: { sq: "Mjeshtër kuizesh", en: "Quiz master", de: "Quiz-Meister", it: "Maestro dei quiz", fr: "Maître du quiz", es: "Maestro del quiz" } },
  { type: "polyglot", icon: "🌍", title: { sq: "Poligloti", en: "Polyglot", de: "Polyglott", it: "Poliglotta", fr: "Polyglotte", es: "Políglota" } },
];

export function ProgressSection() {
  const lang = useLang() as LangCode;
  const learnerId = useEnsureLearner();
  const { data, isLoading } = useLearner(learnerId);

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  const { learner, stats, byCategory, weeklyActivity, achievements } = data;
  const earnedTypes = new Set(achievements.map((a) => a.type));

  const statCards = [
    { icon: Star, color: "text-amber-500 bg-amber-500/10", value: stats.totalXp, label: translate(UI.progress.totalXp, lang) },
    { icon: Flame, color: "text-brand bg-brand/10", value: stats.streak, label: translate(UI.progress.streak, lang), suffix: ` ${translate(UI.progress.day, lang)}` },
    { icon: BookOpen, color: "text-emerald-500 bg-emerald-500/10", value: `${stats.completedLessons}/${stats.totalLessons}`, label: translate(UI.progress.lessonsCompleted, lang) },
    { icon: Library, color: "text-violet-500 bg-violet-500/10", value: stats.wordsLearned, label: translate(UI.progress.wordsLearned, lang) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="grid size-12 place-items-center rounded-2xl bg-brand-muted text-2xl">{learner.avatar ?? "🦅"}</div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{translate(UI.progress.title, lang)}, {learner.name}!</h1>
          <p className="text-muted-foreground">{translate(UI.progress.subtitle, lang)}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
            <div className={cn("grid size-10 place-items-center rounded-xl", s.color)}>
              <s.icon className="size-5" />
            </div>
            <div className="mt-3 text-2xl font-extrabold">{s.value}{s.suffix ?? ""}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Weekly activity */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h2 className="font-bold">{translate(UI.progress.weeklyActivity, lang)}</h2>
          <p className="text-xs text-muted-foreground">XP fituar çdo ditë</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip
                  cursor={{ fill: "var(--brand-muted)", opacity: 0.4 }}
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
                />
                <Bar dataKey="xp" radius={[6, 6, 0, 0]} maxBarSize={36}>
                  {weeklyActivity.map((d, i) => (
                    <Cell key={i} fill={d.xp > 0 ? "var(--brand)" : "var(--muted)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By category radial */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h2 className="font-bold">{translate(UI.progress.byCategory, lang)}</h2>
          <p className="text-xs text-muted-foreground">Përqindja e përfunduar</p>
          <div className="mt-4 space-y-3">
            {byCategory.map((c) => (
              <div key={c.slug} className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg text-base" style={{ backgroundColor: `${c.color}1a` }}>{c.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{pickLang(c.name, lang)}</span>
                    <span className="text-muted-foreground">{c.completed}/{c.total}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full transition-all" style={{ width: `${c.percent}%`, backgroundColor: c.color }} />
                  </div>
                </div>
                <span className="w-10 text-right text-sm font-bold" style={{ color: c.color }}>{c.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="size-5 text-amber-500" />
          <h2 className="font-bold">{translate(UI.progress.achievements, lang)}</h2>
          <span className="ml-auto text-xs text-muted-foreground">{earnedTypes.size}/{ALL_ACHIEVEMENTS.length}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ALL_ACHIEVEMENTS.map((a) => {
            const earned = earnedTypes.has(a.type);
            return (
              <div
                key={a.type}
                className={cn(
                  "relative flex flex-col items-center rounded-xl border-2 p-3 text-center transition-all",
                  earned ? "border-amber-300 bg-amber-50 dark:bg-amber-500/10" : "border-border bg-muted/40 opacity-60"
                )}
              >
                <div className={cn("text-3xl", !earned && "grayscale")}>{earned ? a.icon : "🔒"}</div>
                <div className="mt-1.5 text-[11px] font-semibold leading-tight">{pickLang(a.title as never, lang)}</div>
                {earned && (
                  <div className="mt-1 rounded-full bg-amber-500 px-1.5 text-[9px] font-bold text-white">✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
