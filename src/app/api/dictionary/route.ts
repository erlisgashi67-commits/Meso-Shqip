import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapDictionary } from "@/lib/api-helpers";
import type { LocalizedText } from "@/lib/types";

// GET /api/dictionary?lang=&q=&category=
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;

  const words = await db.dictionary.findMany({
    where: {
      ...(q ? { word: { contains: q } } : {}),
      ...(category && category !== "all" ? { category } : {}),
    },
    orderBy: { word: "asc" },
  });
  return NextResponse.json({ words: words.map(mapDictionary) });
}

// POST /api/dictionary  (admin create)
export async function POST(req: Request) {
  const body = await req.json();
  const { word, pronunciation, translations, example, category, emoji } = body;
  if (!word || !translations) {
    return NextResponse.json({ error: "word and translations required" }, { status: 400 });
  }
  const created = await db.dictionary.create({
    data: {
      word,
      pronunciation: pronunciation || null,
      translations: translations as LocalizedText,
      example: (example ?? { sq: "", en: "", de: "", it: "", fr: "", es: "" }) as LocalizedText,
      category: category || "të përgjithshme",
      emoji: emoji || null,
    },
  });
  return NextResponse.json({ word: mapDictionary(created) }, { status: 201 });
}
