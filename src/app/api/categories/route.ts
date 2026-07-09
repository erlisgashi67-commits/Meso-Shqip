import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapCategory } from "@/lib/api-helpers";

export async function GET() {
  const cats = await db.category.findMany({ orderBy: { order: "asc" } });
  const counts = await db.lesson.groupBy({
    by: ["categoryId"],
    where: { published: true },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.categoryId, c._count._all]));
  const result = cats.map((c) => mapCategory(c, countMap.get(c.id) ?? 0));
  return NextResponse.json({ categories: result });
}
