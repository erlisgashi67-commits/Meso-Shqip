// Mëso Shqip🦅 — Certificate API
// POST  /api/certificate            — issue (or look up) a certificate for a completed lesson
// GET   /api/certificate?code=...   — render the certificate as a printable SVG

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { generateCertCode } from "@/lib/cert-code";
import { generateCertificateSVG } from "@/lib/certificate";
import { formatDate } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { LangCode, LocalizedText } from "@/lib/types";

const VALID_LANGS: ReadonlySet<string> = new Set([
  "sq",
  "en",
  "de",
  "it",
  "fr",
  "es",
]);

const MAX_CODE_RETRIES = 12;

function isLangCode(value: string | null): value is LangCode {
  return value !== null && VALID_LANGS.has(value);
}

interface PostBody {
  learnerId?: unknown;
  lessonSlug?: unknown;
}

export async function POST(req: Request) {
  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const learnerId =
    typeof body.learnerId === "string" && body.learnerId.trim().length > 0
      ? body.learnerId.trim()
      : null;
  const lessonSlug =
    typeof body.lessonSlug === "string" && body.lessonSlug.trim().length > 0
      ? body.lessonSlug.trim()
      : null;

  if (!learnerId || !lessonSlug) {
    return NextResponse.json(
      { error: "learnerId and lessonSlug are required" },
      { status: 400 },
    );
  }

  // 1. Resolve the lesson
  const lesson = await db.lesson.findUnique({ where: { slug: lessonSlug } });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // 2. Check the learner's progress
  const progress = await db.progress.findUnique({
    where: {
      learnerId_lessonId: { learnerId, lessonId: lesson.id },
    },
  });

  if (!progress || progress.status !== "completed") {
    return NextResponse.json({ eligible: false });
  }

  if (progress.score < 60) {
    return NextResponse.json({ eligible: false, score: progress.score });
  }

  // 3. Return an existing certificate if one has already been issued
  const existing = await db.certificate.findFirst({
    where: { learnerId, lessonSlug },
  });
  if (existing) {
    return NextResponse.json({ eligible: true, code: existing.code });
  }

  // 4. Need the learner record to snapshot their name
  const learner = await db.learner.findUnique({ where: { id: learnerId } });
  if (!learner) {
    return NextResponse.json({ error: "Learner not found" }, { status: 404 });
  }

  // 5. Generate a unique code (loop to avoid rare collisions)
  let code = generateCertCode(lessonSlug);
  for (let attempt = 0; attempt < MAX_CODE_RETRIES; attempt++) {
    const clash = await db.certificate.findUnique({ where: { code } });
    if (!clash) break;
    code = generateCertCode(lessonSlug);
  }

  // 6. Persist the certificate
  const created = await db.certificate.create({
    data: {
      code,
      learnerId,
      lessonSlug,
      lessonTitle: lesson.title as Prisma.InputJsonValue,
      learnerName: learner.name,
      score: progress.score,
    },
  });

  return NextResponse.json({ eligible: true, code: created.code });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const langParam = url.searchParams.get("lang");
  const lang: LangCode = isLangCode(langParam) ? langParam : "sq";

  if (!code || code.trim().length === 0) {
    return NextResponse.json(
      { error: "code query parameter is required" },
      { status: 400 },
    );
  }

  const cert = await db.certificate.findUnique({ where: { code } });
  if (!cert) {
    return NextResponse.json(
      { error: "Certificate not found" },
      { status: 404 },
    );
  }

  const lessonTitleObj = cert.lessonTitle as LocalizedText;
  const lessonTitle = t(lessonTitleObj, lang);

  const svg = generateCertificateSVG({
    learnerName: cert.learnerName,
    lessonTitle,
    score: cert.score,
    date: formatDate(cert.issuedAt.toISOString(), lang),
    code: cert.code,
    lang,
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
