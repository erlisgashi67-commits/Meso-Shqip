"use client";

import * as React from "react";
import {
  Home, BookOpen, Dumbbell, LineChart, Award, Sparkles, ShieldCheck, Flame,
} from "lucide-react";
import { useAppStore, type Section } from "@/store/app";
import { UI, t as translate } from "@/lib/i18n";
import type { LangCode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/meso/brand";
import { LanguageSwitcher } from "@/components/meso/language-switcher";
import { ThemeToggle } from "@/components/meso/theme-toggle";
import { useEnsureLearner, useLearner } from "@/components/meso/use-ensure-learner";
import { HomeSection } from "@/components/sections/home-section";
import { LessonsSection } from "@/components/sections/lessons-section";
import { LessonDetail } from "@/components/sections/lesson-detail";
import { PracticeSection } from "@/components/sections/practice-section";
import { ProgressSection } from "@/components/sections/progress-section";
import { CertificateSection } from "@/components/sections/certificate-section";
import { AiStudioSection } from "@/components/sections/ai-studio-section";
import { AdminSection } from "@/components/sections/admin-section";

const NAV: { key: Section; icon: React.ComponentType<{ className?: string }>; label: keyof typeof UI["nav"] }[] = [
  { key: "home", icon: Home, label: "home" },
  { key: "lessons", icon: BookOpen, label: "lessons" },
  { key: "practice", icon: Dumbbell, label: "practice" },
  { key: "progress", icon: LineChart, label: "progress" },
  { key: "certificate", icon: Award, label: "certificate" },
  { key: "ai", icon: Sparkles, label: "aiStudio" },
  { key: "admin", icon: ShieldCheck, label: "admin" },
];

export function AppShell() {
  const lang = useAppStore((s) => s.lang) as LangCode;
  const section = useAppStore((s) => s.section);
  const go = useAppStore((s) => s.go);
  const learnerId = useEnsureLearner();
  const learnerQuery = useLearner(learnerId);
  const learner = learnerQuery.data?.learner;

  const active = section;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <button onClick={() => go("home")} className="shrink-0" aria-label="Home">
            <Brand size="sm" />
          </button>

          {/* Desktop nav */}
          <nav className="ml-4 hidden flex-1 items-center gap-0.5 lg:flex">
            {NAV.map((item) => {
              const isActive = active === item.key || (item.key === "lessons" && active === "lesson");
              return (
                <button
                  key={item.key}
                  onClick={() => go(item.key)}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-brand" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                >
                  <item.icon className="size-4" />
                  {translate(UI.nav[item.label], lang)}
                  {isActive && (
                    <span className="absolute -bottom-[1px] left-3 right-3 h-0.5 rounded-full bg-brand" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            {learner && (
              <div className="mr-1 hidden items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 sm:flex">
                <span className="grid size-7 place-items-center rounded-full bg-brand-muted text-base">{learner.avatar ?? "🦅"}</span>
                <div className="leading-none">
                  <div className="text-xs font-semibold">{learner.name}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Flame className="size-3 text-brand" />
                    {learner.streak}
                    <span className="mx-1">·</span>
                    <span className="font-bold text-foreground">{learner.totalXp}</span> XP
                  </div>
                </div>
              </div>
            )}
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex items-center gap-1 overflow-x-auto px-3 pb-2 lg:hidden scroll-thin">
          {NAV.map((item) => {
            const isActive = active === item.key || (item.key === "lessons" && active === "lesson");
            return (
              <button
                key={item.key}
                onClick={() => go(item.key)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <item.icon className="size-3.5" />
                {translate(UI.nav[item.label], lang)}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {active === "home" && <HomeSection />}
        {active === "lessons" && <LessonsSection />}
        {active === "lesson" && <LessonDetail />}
        {active === "practice" && <PracticeSection />}
        {active === "progress" && <ProgressSection />}
        {active === "certificate" && <CertificateSection />}
        {active === "ai" && <AiStudioSection />}
        {active === "admin" && <AdminSection />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Brand size="sm" />
              <p className="text-sm text-muted-foreground max-w-xs">
                {translate(UI.footer.tagline, lang)}
              </p>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {translate(UI.footer.quickLinks, lang)}
              </div>
              <ul className="space-y-1.5 text-sm">
                {NAV.slice(0, 5).map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => go(item.key)}
                      className="text-muted-foreground transition-colors hover:text-brand"
                    >
                      {translate(UI.nav[item.label], lang)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {translate(UI.footer.languageLabel, lang)}
              </div>
              <LanguageSwitcher />
            </div>
            <div className="sm:text-right">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">🇦🇱 🦅 🔴⚫</div>
              <p className="text-sm text-muted-foreground">
                {translate(UI.footer.madeWith, lang)} ❤️ {translate(UI.footer.forDiaspora, lang)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">© {new Date().getFullYear()} Mëso Shqip — {translate(UI.footer.rights, lang)}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
