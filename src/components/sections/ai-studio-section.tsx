"use client";

import * as React from "react";
import { Sparkles, Send, BookPlus, BookOpen, Bot, User, Wand2, Plus, Play, Loader2, Lightbulb } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppStore } from "@/store/app";
import { useLang, useT, pickLang } from "@/components/meso/localized";
import { useEnsureLearner } from "@/components/meso/use-ensure-learner";
import { useCategories } from "@/components/meso/queries";
import { UI, t as translate } from "@/lib/i18n";
import type { LangCode, LocalizedText, QuizData, ExerciseView } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Markdown } from "@/components/meso/markdown";
import { ExerciseRunner } from "@/components/meso/exercise-runner";
import { cn } from "@/lib/utils";

const SUGGESTIONS = ["Numrat", "Ngjyrat", "Familja", "Ushqimi", "Përshëndetjet", "Koha", "Shtëpia", "Traditat"];

export function AiStudioSection() {
  const lang = useLang() as LangCode;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-brand text-2xl text-white shadow-sm">
          <Sparkles className="size-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{translate(UI.ai.title, lang)}</h1>
          <p className="text-muted-foreground">{translate(UI.ai.subtitle, lang)}</p>
        </div>
      </div>

      <Tabs defaultValue="tutor" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="tutor" className="gap-1.5 py-2"><Bot className="size-4" /> {translate(UI.ai.aiTutor, lang)}</TabsTrigger>
          <TabsTrigger value="lesson" className="gap-1.5 py-2"><BookOpen className="size-4" /> {translate(UI.ai.generateLesson, lang)}</TabsTrigger>
          <TabsTrigger value="word" className="gap-1.5 py-2"><Plus className="size-4" /> {translate(UI.ai.generateWord, lang)}</TabsTrigger>
          <TabsTrigger value="quiz" className="gap-1.5 py-2"><Wand2 className="size-4" /> {translate(UI.ai.generateQuiz, lang)}</TabsTrigger>
        </TabsList>

        <TabsContent value="tutor"><TutorTab /></TabsContent>
        <TabsContent value="lesson"><LessonGenTab /></TabsContent>
        <TabsContent value="word"><WordGenTab /></TabsContent>
        <TabsContent value="quiz"><QuizGenTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function TopicInput({ value, onChange, onGenerate, loading, cta }: {
  value: string; onChange: (v: string) => void; onGenerate: () => void; loading: boolean; cta: string;
}) {
  const lang = useLang() as LangCode;
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={translate(UI.ai.topicPlaceholder, lang)}
          onKeyDown={(e) => e.key === "Enter" && onGenerate()}
          className="flex-1"
        />
        <Button onClick={onGenerate} disabled={loading || !value.trim()} className="gap-2">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {loading ? translate(UI.ai.generating, lang) : cta}
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground flex items-center gap-1"><Lightbulb className="size-3.5" /> {translate(UI.ai.suggestions, lang)}:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-brand-muted hover:text-brand"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- AI Tutor ---------------- */
type Msg = { role: "user" | "assistant"; content: string };
function TutorTab() {
  const lang = useLang() as LangCode;
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang, history: messages }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      toast.error(translate(UI.ai.error, lang));
      setMessages([...next, { role: "assistant", content: translate(UI.ai.error, lang) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="flex h-[60vh] min-h-[420px] flex-col rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
          <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-brand text-white"><Bot className="size-4" /></div>
          <div>
            <div className="text-sm font-bold">Tutori AI</div>
            <div className="text-[11px] text-emerald-600">● online</div>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 scroll-thin">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-brand-muted text-3xl">🦅</div>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">{translate(UI.ai.tutorIntro, lang)}</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
              <div className={cn("grid size-7 shrink-0 place-items-center rounded-full text-white", m.role === "user" ? "bg-foreground" : "bg-gradient-to-br from-violet-500 to-brand")}>
                {m.role === "user" ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
              </div>
              <div className={cn("max-w-[80%] rounded-2xl px-3.5 py-2 text-sm", m.role === "user" ? "bg-brand text-brand-foreground" : "bg-muted")}>
                <Markdown content={m.content} className="!text-sm !text-inherit" />
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-brand text-white"><Bot className="size-3.5" /></div>
              <div className="rounded-2xl bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "0ms" }} />
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "150ms" }} />
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 border-t border-border/60 p-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={translate(UI.ai.tutorPlaceholder, lang)}
            disabled={loading}
          />
          <Button onClick={send} disabled={loading || !input.trim()} size="icon" className="shrink-0">
            <Send className="size-4" />
          </Button>
        </div>
      </div>

      <aside className="hidden space-y-3 lg:block">
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="text-sm font-bold">💡 Si të përdor tutorin</div>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            <li>• Pyet për gramatikën shqipe</li>
            <li>• Kërko përkthime fjalësh</li>
            <li>• Mëso shprehje të reja</li>
            <li>• Kërko shembull fjalisë</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-brand/30 bg-brand-muted/30 p-4">
          <div className="text-sm font-bold text-brand">Provoni:</div>
          <div className="mt-2 space-y-1.5">
            {["Si them 'mirëdita'?", "Cila është ndryshimi mes 'i' dhe 'e'?", "Mëso 5 fjalë për ushqimin"].map((s) => (
              <button key={s} onClick={() => setInput(s)} className="block w-full rounded-lg bg-background/70 px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-background">
                {s}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ---------------- Generate Lesson ---------------- */
function LessonGenTab() {
  const lang = useLang() as LangCode;
  const t = useT();
  const qc = useQueryClient();
  const catsQ = useCategories();
  const [topic, setTopic] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<null | {
    title: LocalizedText; summary: LocalizedText; content: LocalizedText; emoji: string; difficulty: string; exercises: { type: string; data: unknown }[];
  }>(null);
  const [categoryId, setCategoryId] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const generate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, lang }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
      if (!categoryId && catsQ.data?.length) setCategoryId(catsQ.data[0].id);
    } catch {
      toast.error(translate(UI.ai.error, lang));
    } finally {
      setLoading(false);
    }
  };

  const addToCatalog = async () => {
    if (!result || !categoryId) return;
    setSaving(true);
    try {
      const slug = `${topic.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now().toString(36).slice(-4)}`;
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug, categoryId, difficulty: result.difficulty || "fillim",
          title: result.title, summary: result.summary, content: result.content,
          xpReward: 60, duration: 12, coverEmoji: result.emoji || "📘", published: true,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Mësimi u shtua në katalog! 🎉");
      qc.invalidateQueries({ queryKey: ["lessons"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      setResult(null);
      setTopic("");
    } catch {
      toast.error("Ruajtja dështoi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <TopicInput value={topic} onChange={setTopic} onGenerate={generate} loading={loading} cta={translate(UI.ai.generate, lang)} />
      {loading && <GenSkeleton />}
      {result && (
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-brand-muted text-2xl">{result.emoji}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{t(result.title)}</h3>
              <p className="text-sm text-muted-foreground">{t(result.summary)}</p>
              <div className="mt-1 text-xs capitalize text-brand">{result.difficulty}</div>
            </div>
          </div>
          <div className="mt-4 border-t border-border/60 pt-4">
            <Markdown content={t(result.content)} />
          </div>
          <div className="mt-4 rounded-xl bg-muted/50 p-3">
            <div className="text-xs font-semibold text-muted-foreground">{result.exercises.length} ushtrime të gjeneruara</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {result.exercises.map((e, i) => (
                <span key={i} className="rounded-full bg-background px-2 py-0.5 text-[11px] font-medium capitalize">{i + 1}. {e.type}</span>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Kategoria" /></SelectTrigger>
              <SelectContent>
                {(catsQ.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.icon} {t(c.name)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addToCatalog} disabled={saving || !categoryId} className="ml-auto gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <BookPlus className="size-4" />}
              {translate(UI.ai.addLessonToCatalog, lang)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Generate Word ---------------- */
function WordGenTab() {
  const lang = useLang() as LangCode;
  const t = useT();
  const qc = useQueryClient();
  const [topic, setTopic] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<null | {
    word: string; pronunciation: string; translations: LocalizedText; example: LocalizedText; category: string; emoji: string;
  }>(null);
  const [saving, setSaving] = React.useState(false);

  const generate = async () => {
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/ai/generate-word", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, lang }) });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch { toast.error(translate(UI.ai.error, lang)); } finally { setLoading(false); }
  };

  const addToDict = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const res = await fetch("/api/dictionary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result) });
      if (!res.ok) throw new Error();
      toast.success("Fjala u shtua në fjalor! 📚");
      qc.invalidateQueries({ queryKey: ["dictionary"] });
      setResult(null); setTopic("");
    } catch { toast.error("Ruajtja dështoi."); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <TopicInput value={topic} onChange={setTopic} onGenerate={generate} loading={loading} cta={translate(UI.ai.generate, lang)} />
      {loading && <GenSkeleton />}
      {result && (
        <div className="mx-auto max-w-lg rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm">
          <div className="text-5xl">{result.emoji}</div>
          <div className="mt-3 text-3xl font-extrabold text-brand">{result.word}</div>
          <div className="text-sm text-muted-foreground">/{result.pronunciation}/ · {result.category}</div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            {(["en", "de", "it", "fr", "es", "sq"] as const).map((lc) => (
              <div key={lc} className="rounded-lg bg-muted/50 px-2 py-1.5">
                <div className="text-[10px] uppercase text-muted-foreground">{lc}</div>
                <div className="font-medium">{pickLang(result.translations, lc)}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-brand-muted/40 p-3 text-sm italic">"{t(result.example)}"</div>
          <Button onClick={addToDict} disabled={saving} className="mt-4 gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            {translate(UI.ai.addWordToDict, lang)}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Generate Quiz ---------------- */
function QuizGenTab() {
  const lang = useLang() as LangCode;
  const [topic, setTopic] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [exercises, setExercises] = React.useState<ExerciseView[]>([]);
  const [running, setRunning] = React.useState(false);
  const [results, setResults] = React.useState<boolean[]>([]);
  const [done, setDone] = React.useState(false);

  const generate = async () => {
    setLoading(true); setExercises([]); setDone(false); setRunning(false);
    try {
      const res = await fetch("/api/ai/generate-quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, lang, count: 5 }) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const mapped: ExerciseView[] = (data.exercises ?? []).map((e: { type: string; data: QuizData }, i: number) => ({
        id: `gen-${i}`, type: "quiz", data: e.data, order: i,
      }));
      setExercises(mapped);
    } catch { toast.error(translate(UI.ai.error, lang)); } finally { setLoading(false); }
  };

  const start = () => { if (exercises.length === 0) return; setResults([]); setDone(false); setRunning(true); };
  const onAnswer = (correct: boolean) => {
    const next = [...results, correct];
    setResults(next);
    if (next.length >= exercises.length) { setRunning(false); setDone(true); }
  };
  const score = results.length ? Math.round((results.filter(Boolean).length / results.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <TopicInput value={topic} onChange={setTopic} onGenerate={generate} loading={loading} cta={translate(UI.ai.generate, lang)} />
      {loading && <GenSkeleton />}
      {exercises.length > 0 && !running && !done && (
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">{exercises.length} pyetje të gjeneruara</div>
              <div className="text-sm text-muted-foreground">Tema: {topic}</div>
            </div>
            <Button onClick={start} className="gap-2"><Play className="size-4" /> {translate(UI.common.start, lang)}</Button>
          </div>
        </div>
      )}
      {running && <ExerciseRunner exercises={exercises} index={results.length} total={exercises.length} onAnswer={onAnswer} />}
      {done && (
        <div className="mx-auto max-w-md rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-brand text-3xl text-brand-foreground">🏆</div>
          <div className="mt-3 text-5xl font-extrabold text-brand">{score}%</div>
          <p className="mt-1 text-sm text-muted-foreground">{translate(UI.practice.finalScore, lang)}</p>
          <Button variant="outline" className="mt-4 gap-2" onClick={() => { setDone(false); setResults([]); setRunning(false); }}>
            {translate(UI.common.back, lang)}
          </Button>
        </div>
      )}
    </div>
  );
}

function GenSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-24 animate-pulse rounded-2xl bg-muted" />
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
