import { NextResponse } from "next/server";

import { aiTutor } from "@/lib/ai";
import type { LangCode } from "@/lib/types";

const VALID_LANGS: LangCode[] = ["sq", "en", "de", "it", "fr", "es"];

type HistoryEntry = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const message =
      body && typeof body.message === "string" ? body.message.trim() : "";
    const lang = body?.lang;
    const rawHistory = body?.history;

    if (!message) {
      return NextResponse.json(
        { error: "Missing or empty 'message'." },
        { status: 400 }
      );
    }
    if (!VALID_LANGS.includes(lang)) {
      return NextResponse.json(
        { error: "Invalid 'lang'. Must be one of sq, en, de, it, fr, es." },
        { status: 400 }
      );
    }

    let history: HistoryEntry[] = [];
    if (Array.isArray(rawHistory)) {
      history = rawHistory
        .filter(
          (h): h is HistoryEntry =>
            !!h &&
            (h.role === "user" || h.role === "assistant") &&
            typeof h.content === "string"
        )
        .slice(-20) // keep the last 20 turns max to stay within context limits
        .map((h) => ({ role: h.role, content: h.content }));
    }

    const reply = await aiTutor(message, lang as LangCode, history);
    return NextResponse.json({ reply });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Tutor request failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
