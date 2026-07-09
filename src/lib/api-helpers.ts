import { db } from "@/lib/db";
import type {
  CategoryView,
  LessonView,
  ExerciseView,
  ProgressView,
  DictionaryView,
  CertificateView,
  AchievementView,
  LearnerView,
  LocalizedText,
} from "@/lib/types";
import type { JsonValue } from "@prisma/client/runtime/library";

export function asLocalized(v: unknown): LocalizedText {
  const obj = (v ?? {}) as Record<string, string>;
  return {
    sq: obj.sq ?? "",
    en: obj.en ?? "",
    de: obj.de ?? "",
    it: obj.it ?? "",
    fr: obj.fr ?? "",
    es: obj.es ?? "",
  };
}

export function mapCategory(c: {
  id: string; slug: string; name: JsonValue; icon: string; color: string; order: number;
}, lessonCount?: number): CategoryView {
  return {
    id: c.id, slug: c.slug, name: asLocalized(c.name), icon: c.icon, color: c.color, order: c.order,
    lessonCount,
  };
}

export function mapProgress(p?: {
  status: string; score: number; xpEarned: number; startedAt: Date | null; completedAt: Date | null;
} | null): ProgressView | undefined {
  if (!p) return undefined;
  return {
    status: p.status as ProgressView["status"],
    score: p.score,
    xpEarned: p.xpEarned,
    startedAt: p.startedAt?.toISOString() ?? null,
    completedAt: p.completedAt?.toISOString() ?? null,
  };
}

export function mapLesson(
  l: {
    id: string; slug: string; categoryId: string; difficulty: string;
    title: JsonValue; summary: JsonValue; content: JsonValue;
    xpReward: number; duration: number; coverEmoji: string; order: number;
  },
  opts?: { category?: CategoryView; exerciseCount?: number; progress?: ProgressView }
): LessonView {
  return {
    id: l.id, slug: l.slug, categoryId: l.categoryId,
    category: opts?.category,
    difficulty: l.difficulty as LessonView["difficulty"],
    title: asLocalized(l.title),
    summary: asLocalized(l.summary),
    content: asLocalized(l.content),
    xpReward: l.xpReward, duration: l.duration, coverEmoji: l.coverEmoji, order: l.order,
    exerciseCount: opts?.exerciseCount,
    progress: opts?.progress,
  };
}

export function mapExercise(e: {
  id: string; type: string; data: JsonValue; order: number;
}): ExerciseView {
  return {
    id: e.id,
    type: e.type as ExerciseView["type"],
    data: e.data as never,
    order: e.order,
  };
}

export function mapDictionary(d: {
  id: string; word: string; pronunciation: string | null;
  translations: JsonValue; example: JsonValue; category: string; emoji: string | null;
}): DictionaryView {
  return {
    id: d.id, word: d.word, pronunciation: d.pronunciation,
    translations: asLocalized(d.translations),
    example: asLocalized(d.example),
    category: d.category, emoji: d.emoji,
  };
}

export function mapCertificate(c: {
  id: string; code: string; lessonSlug: string; lessonTitle: JsonValue;
  learnerName: string; score: number; issuedAt: Date;
}): CertificateView {
  return {
    id: c.id, code: c.code, lessonSlug: c.lessonSlug,
    lessonTitle: asLocalized(c.lessonTitle),
    learnerName: c.learnerName, score: c.score,
    issuedAt: c.issuedAt.toISOString(),
  };
}

export function mapAchievement(a: {
  id: string; type: string; title: JsonValue; icon: string; createdAt: Date;
}): AchievementView {
  return {
    id: a.id, type: a.type, title: asLocalized(a.title),
    icon: a.icon, createdAt: a.createdAt.toISOString(),
  };
}

export function mapLearner(l: {
  id: string; name: string; avatar: string | null; streak: number; totalXp: number;
}): LearnerView {
  return { id: l.id, name: l.name, avatar: l.avatar, streak: l.streak, totalXp: l.totalXp };
}

// Resolve the active learner id; falls back to the seeded demo learner.
export async function resolveLearner(learnerId: string | null): Promise<string> {
  if (learnerId) {
    const exists = await db.learner.findUnique({ where: { id: learnerId } });
    if (exists) return exists.id;
  }
  const demo = await db.learner.findUnique({ where: { id: "demo-arlind" } });
  return demo?.id ?? (await db.learner.create({ data: { id: "demo-arlind", name: "Arlind", avatar: "🦅" } })).id;
}

// Update streak based on lastActive
export function computeStreak(lastActive: Date | null, currentStreak: number): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!lastActive) return 1;
  const last = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
  const diffDays = Math.round((today.getTime() - last.getTime()) / 86400000);
  if (diffDays === 0) return Math.max(currentStreak, 1);
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}
