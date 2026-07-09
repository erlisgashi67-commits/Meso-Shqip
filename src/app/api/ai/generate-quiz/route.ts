import { NextResponse } from "next/server";

import { generateQuiz } from "@/lib/ai";
import type { LangCode } from "@/lib/types";

const VALID_LANGS: LangCode[] = ["sq", "en", "de", "it", "fr", "es"];

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const topic =
      body && typeof body.topic === "string" ? body.topic.trim() : "";
    const lang = body?.lang;
    const count =
      body && typeof body.count === "number" && Number.isFinite(body.count)
        ? body.count
        : undefined;

    if (!topic) {
      return NextResponse.json(
        { error: "Missing or empty 'topic'." },
        { status: 400 }
      );
    }
    if (!VALID_LANGS.includes(lang)) {
      return NextResponse.json(
        { error: "Invalid 'lang'. Must be one of sq, en, de, it, fr, es." },
        { status: 400 }
      );
    }

    const exercises = await generateQuiz(topic, lang as LangCode, count);
    return NextResponse.json({ exercises });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to generate quiz.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
