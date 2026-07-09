import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapLesson, mapExercise, mapProgress, resolveLearner } from "@/lib/api-helpers";
import type { LocalizedText, Difficulty } from "@/lib/types";

// GET /api/lessons/[slug]?learnerId=
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const learnerId = await resolveLearner(searchParams.get("learnerId"));

  const lesson = await db.lesson.findUnique({
    where: { slug },
    include: { category: true, exercises: { orderBy: { order: "asc" } } },
  });
  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const progress = await db.progress.findUnique({
    where: { learnerId_lessonId: { learnerId, lessonId: lesson.id } },
  });

  return NextResponse.json({
    lesson: mapLesson(
      {
        id: lesson.id, slug: lesson.slug, categoryId: lesson.categoryId, difficulty: lesson.difficulty,
        title: lesson.title, summary: lesson.summary, content: lesson.content,
        xpReward: lesson.xpReward, duration: lesson.duration, coverEmoji: lesson.coverEmoji, order: lesson.order,
      },
      { progress: mapProgress(progress) }
    ),
    exercises: lesson.exercises.map(mapExercise),
  });
}

// PUT /api/lessons/[slug]  (admin update)
export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json();
  const existing = await db.lesson.findUnique({ where: { slug } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.categoryId) data.categoryId = body.categoryId;
  if (body.difficulty) data.difficulty = body.difficulty as Difficulty;
  if (body.title) data.title = body.title as LocalizedText;
  if (body.summary) data.summary = body.summary as LocalizedText;
  if (body.content) data.content = body.content as LocalizedText;
  if (body.xpReward !== undefined) data.xpReward = Number(body.xpReward);
  if (body.duration !== undefined) data.duration = Number(body.duration);
  if (body.coverEmoji !== undefined) data.coverEmoji = body.coverEmoji;
  if (body.published !== undefined) data.published = Boolean(body.published);
  if (body.slug && body.slug !== slug) data.slug = body.slug;

  const updated = await db.lesson.update({ where: { id: existing.id }, data });
  return NextResponse.json({ lesson: mapLesson(updated) });
}

// DELETE /api/lessons/[slug]  (admin delete)
export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await db.lesson.deleteMany({ where: { slug } });
  return NextResponse.json({ ok: true });
}
