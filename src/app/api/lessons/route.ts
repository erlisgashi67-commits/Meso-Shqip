import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapLesson, mapProgress, resolveLearner } from "@/lib/api-helpers";
import type { LocalizedText, Difficulty } from "@/lib/types";

// GET /api/lessons?category=&q=&learnerId=
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const q = searchParams.get("q") || undefined;
  const learnerId = await resolveLearner(searchParams.get("learnerId"));

  const lessons = await db.lesson.findMany({
    where: {
      published: true,
      ...(category && category !== "all" ? { category: { slug: category } } : {}),
    },
    include: { category: true, _count: { select: { exercises: true } } },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const progress = await db.progress.findMany({ where: { learnerId } });
  const pMap = new Map(progress.map((p) => [p.lessonId, p]));

  let result = lessons.map((l) =>
    mapLesson(
      {
        id: l.id,
        slug: l.slug,
        categoryId: l.categoryId,
        difficulty: l.difficulty,
        title: l.title,
        summary: l.summary,
        content: l.content,
        xpReward: l.xpReward,
        duration: l.duration,
        coverEmoji: l.coverEmoji,
        order: l.order,
      },
      {
        exerciseCount: l._count.exercises,
        progress: mapProgress(pMap.get(l.id)),
      }
    )
  );

  if (q) {
    const needle = q.toLowerCase();
    result = result.filter(
      (l) =>
        Object.values(l.title).some((v) => v.toLowerCase().includes(needle)) ||
        Object.values(l.summary).some((v) => v.toLowerCase().includes(needle))
    );
  }

  return NextResponse.json({ lessons: result });
}

// POST /api/lessons  (admin create)
export async function POST(req: Request) {
  const body = await req.json();
  const { slug, categoryId, difficulty, title, summary, content, xpReward, duration, coverEmoji, published } =
    body;
  if (!slug || !categoryId || !title || !summary || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const created = await db.lesson.create({
    data: {
      slug,
      categoryId,
      difficulty: (difficulty as Difficulty) ?? "fillim",
      title: title as LocalizedText,
      summary: summary as LocalizedText,
      content: content as LocalizedText,
      xpReward: Number(xpReward) || 50,
      duration: Number(duration) || 10,
      coverEmoji: coverEmoji || "📘",
      published: published ?? true,
    },
  });
  return NextResponse.json({ lesson: mapLesson(created) }, { status: 201 });
}
