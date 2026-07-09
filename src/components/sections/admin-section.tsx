"use client";

import * as React from "react";
import {
  ShieldCheck, BookOpen, Library, Plus, Pencil, Trash2, X, Loader2, Search,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppStore } from "@/store/app";
import { useLang, useT, pickLang } from "@/components/meso/localized";
import { useEnsureLearner } from "@/components/meso/use-ensure-learner";
import { useLessons, useCategories, useDictionary } from "@/components/meso/queries";
import { UI, t as translate } from "@/lib/i18n";
import type { LangCode, LocalizedText, Difficulty } from "@/lib/types";
import { LANGUAGES } from "@/lib/languages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const emptyLocalized: LocalizedText = { sq: "", en: "", de: "", it: "", fr: "", es: "" };

export function AdminSection() {
  const lang = useLang() as LangCode;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-2xl bg-foreground text-2xl text-background"><ShieldCheck className="size-6" /></div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{translate(UI.admin.title, lang)}</h1>
          <p className="text-muted-foreground">{translate(UI.admin.subtitle, lang)}</p>
        </div>
      </div>

      <Tabs defaultValue="lessons">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="lessons" className="gap-1.5"><BookOpen className="size-4" /> {translate(UI.admin.manageLessons, lang)}</TabsTrigger>
          <TabsTrigger value="dictionary" className="gap-1.5"><Library className="size-4" /> {translate(UI.admin.manageDictionary, lang)}</TabsTrigger>
        </TabsList>
        <TabsContent value="lessons"><LessonsAdmin /></TabsContent>
        <TabsContent value="dictionary"><DictionaryAdmin /></TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- Localized inputs helper ---------- */
function LangFields({
  label, value, onChange, textarea,
}: { label: string; value: LocalizedText; onChange: (v: LocalizedText) => void; textarea?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="grid gap-1.5">
        {LANGUAGES.map((l) => (
          <div key={l.code} className="flex items-center gap-2">
            <span className="w-12 shrink-0 text-[11px] font-medium text-muted-foreground">{l.flag} {l.code.toUpperCase()}</span>
            {textarea ? (
              <Textarea
                value={value[l.code]}
                onChange={(e) => onChange({ ...value, [l.code]: e.target.value })}
                rows={2}
                className="flex-1 text-sm"
              />
            ) : (
              <Input
                value={value[l.code]}
                onChange={(e) => onChange({ ...value, [l.code]: e.target.value })}
                className="flex-1 text-sm"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Lessons Admin ---------- */
function LessonsAdmin() {
  const lang = useLang() as LangCode;
  const t = useT();
  const learnerId = useEnsureLearner();
  const lessonsQ = useLessons(learnerId);
  const catsQ = useCategories();
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    slug: "", categoryId: "", difficulty: "fillim" as Difficulty,
    title: { ...emptyLocalized }, summary: { ...emptyLocalized }, content: { ...emptyLocalized },
    xpReward: 60, duration: 10, coverEmoji: "📘",
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      slug: "", categoryId: catsQ.data?.[0]?.id ?? "", difficulty: "fillim",
      title: { ...emptyLocalized }, summary: { ...emptyLocalized }, content: { ...emptyLocalized },
      xpReward: 60, duration: 10, coverEmoji: "📘",
    });
    setOpen(true);
  };

  const openEdit = (l: typeof lessonsQ.data extends (infer T)[] | undefined ? T : never) => {
    setEditing(l.slug);
    setForm({
      slug: l.slug, categoryId: l.categoryId, difficulty: l.difficulty,
      title: l.title, summary: l.summary, content: l.content,
      xpReward: l.xpReward, duration: l.duration, coverEmoji: l.coverEmoji,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.categoryId || !form.title.sq || !form.slug) {
      toast.error("Plotëso titullin (sq), slug dhe kategorinë.");
      return;
    }
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `/api/lessons/${editing}` : "/api/lessons";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, xpReward: Number(form.xpReward), duration: Number(form.duration) }),
      });
      if (!res.ok) throw new Error();
      toast.success(translate(UI.admin.saved, lang));
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["lessons"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    } catch { toast.error("Ruajtja dështoi."); } finally { setSaving(false); }
  };

  const del = async (slug: string) => {
    if (!confirm(translate(UI.admin.deleteConfirm, lang))) return;
    try {
      await fetch(`/api/lessons/${slug}`, { method: "DELETE" });
      toast.success(translate(UI.admin.deleted, lang));
      qc.invalidateQueries({ queryKey: ["lessons"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    } catch { toast.error("Fshirja dështoi."); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {translate(UI.admin.totalLessons, lang)}: <span className="font-bold text-foreground">{lessonsQ.data?.length ?? 0}</span>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="size-4" /> {translate(UI.admin.addLesson, lang)}</Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        {lessonsQ.isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <div className="divide-y divide-border/60">
            {(lessonsQ.data ?? []).map((l) => (
              <div key={l.id} className="flex items-center gap-3 p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-muted text-xl">{l.coverEmoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{t(l.title)}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono">{l.slug}</span>
                    <span className="capitalize">· {l.difficulty}</span>
                    <span>· {l.exerciseCount ?? 0} {translate(UI.lessons.exercises, lang)}</span>
                    <span>· +{l.xpReward} XP</span>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => openEdit(l)}><Pencil className="size-4" /></Button>
                <Button size="icon" variant="ghost" className="text-rose-500" onClick={() => del(l.slug)}><Trash2 className="size-4" /></Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto scroll-thin">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifiko mësimin" : translate(UI.admin.addLesson, lang)}</DialogTitle>
            <DialogDescription>{translate(UI.admin.lessonTitle, lang)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Slug</label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="p.sh. numrat-1-20" disabled={!!editing} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">{translate(UI.admin.category, lang)}</label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Zgjidh" /></SelectTrigger>
                  <SelectContent>
                    {(catsQ.data ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.icon} {t(c.name)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">{translate(UI.admin.difficulty, lang)}</label>
                <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v as Difficulty })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fillim">{translate(UI.difficulty.fillim, lang)}</SelectItem>
                    <SelectItem value="mesatar">{translate(UI.difficulty.mesatar, lang)}</SelectItem>
                    <SelectItem value="avancuar">{translate(UI.difficulty.avancuar, lang)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">{translate(UI.admin.emoji, lang)}</label>
                  <Input value={form.coverEmoji} onChange={(e) => setForm({ ...form, coverEmoji: e.target.value })} className="text-center" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">XP</label>
                  <Input type="number" value={form.xpReward} onChange={(e) => setForm({ ...form, xpReward: Number(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">min</label>
                  <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
                </div>
              </div>
            </div>
            <LangFields label={translate(UI.admin.lessonTitle, lang)} value={form.title} onChange={(title) => setForm({ ...form, title })} />
            <LangFields label={translate(UI.admin.summary, lang)} value={form.summary} onChange={(summary) => setForm({ ...form, summary })} textarea />
            <LangFields label={translate(UI.admin.content, lang)} value={form.content} onChange={(content) => setForm({ ...form, content })} textarea />
          </div>
          <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>{translate(UI.common.cancel, lang)}</Button>
            <Button onClick={save} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {translate(UI.common.save, lang)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Dictionary Admin ---------- */
function DictionaryAdmin() {
  const lang = useLang() as LangCode;
  const t = useT();
  const qc = useQueryClient();
  const [q, setQ] = React.useState("");
  const dictQ = useDictionary(q);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    word: "", pronunciation: "", category: "të përgjithshme", emoji: "💬",
    translations: { ...emptyLocalized }, example: { ...emptyLocalized },
  });

  const openNew = () => {
    setForm({ word: "", pronunciation: "", category: "të përgjithshme", emoji: "💬", translations: { ...emptyLocalized }, example: { ...emptyLocalized } });
    setOpen(true);
  };

  const save = async () => {
    if (!form.word || !form.translations.sq) { toast.error("Plotëso fjalën dhe përkthimin (sq)."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/dictionary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast.success(translate(UI.admin.saved, lang));
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["dictionary"] });
    } catch { toast.error("Ruajtja dështoi."); } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm(translate(UI.admin.deleteConfirm, lang))) return;
    try {
      await fetch(`/api/dictionary/${id}`, { method: "DELETE" });
      toast.success(translate(UI.admin.deleted, lang));
      qc.invalidateQueries({ queryKey: ["dictionary"] });
    } catch { toast.error("Fshirja dështoi."); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={translate(UI.common.search, lang)} className="pl-9" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{translate(UI.admin.totalWords, lang)}: <span className="font-bold text-foreground">{dictQ.data?.length ?? 0}</span></span>
          <Button onClick={openNew} className="gap-2"><Plus className="size-4" /> {translate(UI.admin.addWord, lang)}</Button>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-sm scroll-thin">
        {dictQ.isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (dictQ.data ?? []).length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Nuk u gjetën fjalë.</div>
        ) : (
          <div className="divide-y divide-border/60">
            {(dictQ.data ?? []).map((w) => (
              <div key={w.id} className="flex items-center gap-3 p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-muted text-xl">{w.emoji ?? "💬"}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{w.word} <span className="ml-1 text-[11px] font-normal text-muted-foreground">/{w.pronunciation}/</span></div>
                  <div className="truncate text-xs text-muted-foreground">
                    {pickLang(w.translations, lang)} · <span className="capitalize">{w.category}</span>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="text-rose-500" onClick={() => del(w.id)}><Trash2 className="size-4" /></Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto scroll-thin">
          <DialogHeader>
            <DialogTitle>{translate(UI.admin.addWord, lang)}</DialogTitle>
            <DialogDescription>{translate(UI.admin.word, lang)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">{translate(UI.admin.word, lang)}</label>
                <Input value={form.word} onChange={(e) => setForm({ ...form, word: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">{translate(UI.admin.pronunciation, lang)}</label>
                <Input value={form.pronunciation} onChange={(e) => setForm({ ...form, pronunciation: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">{translate(UI.admin.emoji, lang)}</label>
                <Input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="text-center" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">{translate(UI.admin.category, lang)}</label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <LangFields label={translate(UI.admin.translations, lang)} value={form.translations} onChange={(translations) => setForm({ ...form, translations })} />
            <LangFields label={translate(UI.admin.example, lang)} value={form.example} onChange={(example) => setForm({ ...form, example })} />
          </div>
          <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>{translate(UI.common.cancel, lang)}</Button>
            <Button onClick={save} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {translate(UI.common.save, lang)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
