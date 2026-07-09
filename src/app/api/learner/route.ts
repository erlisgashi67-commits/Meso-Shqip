import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapLearner, mapAchievement, resolveLearner, asLocalized } from "@/lib/api-helpers";

// GET /api/learner?learnerId=
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const learnerId = await resolveLearner(searchParams.get("learnerId"));

  const learner = await db.learner.findUnique({ where: { id: learnerId } });
  if (!learner) return NextResponse.json({ error: "not found" }, { status: 404 });

  const [progress, achievements, allLessons] = await Promise.all([
    db.progress.findMany({ where: { learnerId }, include: { lesson: { include: { category: true } } } }),
    db.achievement.findMany({ where: { learnerId }, orderBy: { createdAt: "desc" } }),
    db.lesson.findMany({ where: { published: true }, include: { category: true } }),
  ]);

  const completedLessons = progress.filter((p) => p.status === "completed").length;
  const wordsLearned = completedLessons * 8;

  // Per-category progress
  const catMap = new Map<string, { total: number; completed: number; name: unknown; color: string; icon: string }>();
  for (const l of allLessons) {
    const c = l.category;
    const entry = catMap.get(c.slug) ?? { total: 0, completed: 0, name: c.name, color: c.color, icon: c.icon };
    entry.total += 1;
    catMap.set(c.slug, entry);
  }
  for (const p of progress) {
    if (p.status === "completed") {
      const slug = p.lesson.category.slug;
      const entry = catMap.get(slug);
      if (entry) entry.completed += 1;
    }
  }
  const byCategory = Array.from(catMap.entries()).map(([slug, e]) => ({
    slug,
    name: asLocalized(e.name),
    color: e.color,
    icon: e.icon,
    total: e.total,
    completed: e.completed,
    percent: e.total ? Math.round((e.completed / e.total) * 100) : 0,
  }));

  // Weekly activity (last 7 days)
  const days: { label: string; date: string; xp: number }[] = [];
  const dayLabels: Record<string, string[]> = {
    sq: ["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"],
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    it: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    fr: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    es: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  };
  const labels = dayLabels.en;
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    days.push({ label: labels[d.getDay() === 0 ? 6 : d.getDay() - 1], date: key, xp: 0 });
    // store index for matching below
    (days[days.length - 1] as never as { idx: number }).idx = i;
  }
  for (const p of progress) {
    if (p.status !== "completed" || !p.completedAt) continue;
    const d = p.completedAt;
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const day = days.find((x) => x.date === key);
    if (day) day.xp += p.xpEarned;
  }

  return NextResponse.json({
    learner: mapLearner(learner),
    stats: {
      completedLessons,
      wordsLearned,
      totalLessons: allLessons.length,
      streak: learner.streak,
      totalXp: learner.totalXp,
    },
    byCategory,
    weeklyActivity: days.map(({ label, xp }) => ({ label, xp })),
    achievements: achievements.map(mapAchievement),
  });
}

// POST /api/learner  { name?, id? }  — create new learner or rename
export async function POST(req: Request) {
  const body = await req.json();
  if (body.id) {
    const updated = await db.learner.update({
      where: { id: body.id },
      data: { name: body.name },
    });
    return NextResponse.json({ learner: mapLearner(updated) });
  }
  const created = await db.learner.create({
    data: { name: body.name || "Nxënës", avatar: "🦅" },
  });
  return NextResponse.json({ learner: mapLearner(created) }, { status: 201 });
}
