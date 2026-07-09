import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapProgress, resolveLearner, computeStreak } from "@/lib/api-helpers";
import type { LocalizedText, LessonStatus } from "@/lib/types";

// GET /api/progress?learnerId=
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const learnerId = await resolveLearner(searchParams.get("learnerId"));
  const rows = await db.progress.findMany({
    where: { learnerId },
    include: { lesson: { select: { slug: true, title: true, categoryId: true, category: { select: { slug: true, name: true } } } } },
  });
  return NextResponse.json({
    progress: rows.map((p) => ({
      lessonSlug: p.lesson.slug,
      lessonTitle: p.lesson.title,
      categoryId: p.lesson.categoryId,
      categorySlug: p.lesson.category.slug,
      categoryName: p.lesson.category.name,
      ...mapProgress(p),
    })),
  });
}

// POST /api/progress  { learnerId, lessonId, score, status }
export async function POST(req: Request) {
  const body = await req.json();
  const { lessonId, score, status } = body as {
    lessonId?: string;
    score?: number;
    status?: LessonStatus;
  };
  if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

  const learnerId = await resolveLearner(body.learnerId ?? null);
  const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return NextResponse.json({ error: "lesson not found" }, { status: 404 });

  const finalScore = Math.max(0, Math.min(100, Number(score) || 0));
  const finalStatus: LessonStatus = status ?? (finalScore >= 60 ? "completed" : "in_progress");

  const existing = await db.progress.findUnique({
    where: { learnerId_lessonId: { learnerId, lessonId } },
  });

  const wasCompleted = existing?.status === "completed";
  const nowCompleted = finalStatus === "completed" && finalScore >= 60;

  // xp: full reward only on first completion; retakes don't add more
  const xpEarned = !wasCompleted && nowCompleted ? Math.round((finalScore / 100) * lesson.xpReward) : existing?.xpEarned ?? 0;

  const upserted = await db.progress.upsert({
    where: { learnerId_lessonId: { learnerId, lessonId } },
    create: {
      learnerId,
      lessonId,
      status: finalStatus,
      score: finalScore,
      xpEarned,
      startedAt: existing?.startedAt ?? new Date(),
      completedAt: nowCompleted ? new Date() : null,
    },
    update: {
      status: wasCompleted && !nowCompleted ? existing!.status : finalStatus,
      // keep the best score if already completed
      score: wasCompleted ? Math.max(existing!.score, finalScore) : finalScore,
      xpEarned,
      completedAt: nowCompleted ? (existing?.completedAt ?? new Date()) : existing?.completedAt ?? null,
      startedAt: existing?.startedAt ?? new Date(),
    },
  });

  // Award XP + streak + achievements on first completion
  if (!wasCompleted && nowCompleted) {
    await db.learner.update({
      where: { id: learnerId },
      data: {
        totalXp: { increment: xpEarned },
        streak: computeStreak(existing?.startedAt ?? null, (await db.learner.findUnique({ where: { id: learnerId } }))!.streak),
        lastActive: new Date(),
      },
    });

    // first_lesson achievement
    const completedCount = await db.progress.count({ where: { learnerId, status: "completed" } });
    if (completedCount === 1) {
      await db.achievement.upsert({
        where: { learnerId_type: { learnerId, type: "first_lesson" } },
        update: {},
        create: {
          learnerId,
          type: "first_lesson",
          title: {
            sq: "Mësimi i parë", en: "First lesson", de: "Erste Lektion",
            it: "Prima lezione", fr: "Première leçon", es: "Primera lección",
          } as LocalizedText,
          icon: "🎯",
        },
      });
    }
    if (completedCount >= 5) {
      await db.achievement.upsert({
        where: { learnerId_type: { learnerId, type: "streak_5" } },
        update: {},
        create: {
          learnerId, type: "streak_5",
          title: { sq: "5 mësime", en: "5 lessons", de: "5 Lektionen", it: "5 lezioni", fr: "5 leçons", es: "5 lecciones" } as LocalizedText,
          icon: "📚",
        },
      });
    }
    if (finalScore === 100) {
      await db.achievement.upsert({
        where: { learnerId_type: { learnerId, type: "quiz_master" } },
        update: {},
        create: {
          learnerId, type: "quiz_master",
          title: { sq: "Mjeshtër kuizesh", en: "Quiz master", de: "Quiz-Meister", it: "Maestro dei quiz", fr: "Maître du quiz", es: "Maestro del quiz" } as LocalizedText,
          icon: "🧠",
        },
      });
    }
  }

  return NextResponse.json({
    progress: mapProgress(upserted),
    completed: nowCompleted,
    xpEarned: !wasCompleted && nowCompleted ? xpEarned : 0,
    eligibleForCertificate: nowCompleted,
  });
}
