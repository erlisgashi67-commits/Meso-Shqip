"use client";

import * as React from "react";
import {
  ArrowRight, Sparkles, BookOpen, Languages, Brain, Award, LineChart, Library,
} from "lucide-react";
import { useAppStore } from "@/store/app";
import { useT } from "@/components/meso/localized";
import { useEnsureLearner, useLearner } from "@/components/meso/use-ensure-learner";
import { useLessons, useCategories } from "@/components/meso/queries";
import { UI, t as translate } from "@/lib/i18n";
import type { LangCode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LessonCard } from "@/components/meso/lesson-card";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeSection() {
  const lang = useAppStore((s) => s.lang) as LangCode;
  const go = useAppStore((s) => s.go);
  const t = useT();
  const learnerId = useEnsureLearner();
  const lessonsQ = useLessons(learnerId);
  const learnerQ = useLearner(learnerId);

  const featured = (lessonsQ.data ?? []).slice(0, 6);

  const features = [
    { icon: BookOpen, title: UI.home.feat1Title, desc: UI.home.feat1Desc, color: "text-emerald-500 bg-emerald-500/10" },
    { icon: Languages, title: UI.home.feat2Title, desc: UI.home.feat2Desc, color: "text-brand bg-brand/10" },
    { icon: Brain, title: UI.home.feat3Title, desc: UI.home.feat3Desc, color: "text-violet-500 bg-violet-500/10" },
    { icon: Award, title: UI.home.feat4Title, desc: UI.home.feat4Desc, color: "text-amber-500 bg-amber-500/10" },
    { icon: LineChart, title: UI.home.feat5Title, desc: UI.home.feat5Desc, color: "text-sky-500 bg-sky-500/10" },
    { icon: Library, title: UI.home.feat6Title, desc: UI.home.feat6Desc, color: "text-rose-500 bg-rose-500/10" },
  ];

  const stats = learnerQ.data?.stats;
  const statCards = [
    { value: stats?.totalLessons ?? lessonsQ.data?.length ?? 0, label: translate(UI.home.statLessons, lang), icon: "📖" },
    { value: "2.4k+", label: translate(UI.home.statLearners, lang), icon: "👨‍👩‍👧" },
    { value: "30+", label: translate(UI.home.statWords, lang), icon: "💬" },
    { value: "6", label: translate(UI.home.statLanguages, lang), icon: "🌍" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-brand-muted/50 via-card to-card p-6 sm:p-10 lg:p-14">
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 size-72 rounded-full bg-brand/5 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              <Sparkles className="size-3.5" />
              {translate(UI.home.heroBadge, lang)}
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {translate(UI.home.heroTitle, lang).split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-brand">{translate(UI.home.heroTitle, lang).split(" ").slice(-2).join(" ")}</span>
              <span className="ml-2">🦅</span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              {translate(UI.home.heroSubtitle, lang)}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button size="lg" className="h-12 gap-2 rounded-full px-7 text-base" onClick={() => go("lessons")}>
                {translate(UI.home.heroCta, lang)} <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 gap-2 rounded-full px-7 text-base" onClick={() => go("ai")}>
                <Sparkles className="size-4 text-brand" /> {translate(UI.home.heroCta2, lang)}
              </Button>
            </div>

            {/* stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
              {statCards.map((s, i) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-background/70 p-3 text-center backdrop-blur">
                  <div className="text-xl">{s.icon}</div>
                  <div className="mt-0.5 text-xl font-extrabold text-foreground">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero illustration card */}
          <div className="relative hidden lg:block">
            <div className="animate-float mx-auto max-w-sm rounded-3xl border border-border/60 bg-background p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-muted text-xl">🔤</span>
                  <div>
                    <div className="text-sm font-bold">Alfabeti shqip</div>
                    <div className="text-[11px] text-muted-foreground">36 shkronja · Fillim</div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">+60 XP</span>
              </div>
              <div className="mt-4 space-y-2">
                {[["A", "a"], ["B", "b"], ["Ç", "ç"], ["D", "d"], ["E", "e"], ["Ë", "ë"]].map(([u, l]) => (
                  <div key={u} className="flex items-center gap-2">
                    <span className="grid size-9 place-items-center rounded-lg bg-brand/10 font-bold text-brand">{u}{l}</span>
                    <div className="h-1.5 flex-1 rounded-full bg-muted">
                      <div className="h-full w-3/4 rounded-full bg-brand/60" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-muted/60 p-2.5 text-xs">
                <span className="text-base">🔥</span>
                <span className="font-semibold text-brand">4 ditë seri!</span>
                <span className="text-muted-foreground">Vazhdo kështu 🎉</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured lessons */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{translate(UI.home.featured, lang)}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{translate(UI.home.featuredSub, lang)}</p>
          </div>
          <Button variant="ghost" className="gap-1 text-brand" onClick={() => go("lessons")}>
            {translate(UI.common.viewAll, lang)} <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessonsQ.isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)
            : featured.map((l) => <LessonCard key={l.id} lesson={l} />)}
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{translate(UI.home.featuresTitle, lang)}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{translate(UI.home.featuresSub, lang)}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Card key={i} className="border-border/60 p-5 transition-colors hover:border-brand/40">
              <div className={`grid size-11 place-items-center rounded-xl ${f.color}`}>
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-3 font-bold">{translate(f.title, lang)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{translate(f.desc, lang)}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden rounded-3xl bg-brand p-8 text-center text-brand-foreground sm:p-12">
        <div className="hero-grid absolute inset-0 opacity-20" />
        <div className="relative">
          <div className="text-5xl">🦅</div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">{translate(UI.home.ctaTitle, lang)}</h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-foreground/85">{translate(UI.home.ctaSubtitle, lang)}</p>
          <Button size="lg" variant="secondary" className="mt-5 h-12 gap-2 rounded-full px-8 text-base" onClick={() => go("lessons")}>
            {translate(UI.home.heroCta, lang)} <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
