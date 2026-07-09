// Mëso Shqip🦅 — Certificates list API
// GET /api/certificates?learnerId=...  — list all certificates for a learner

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { CertificateView, LocalizedText } from "@/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const learnerId = url.searchParams.get("learnerId");

  if (!learnerId || learnerId.trim().length === 0) {
    return NextResponse.json(
      { error: "learnerId query parameter is required" },
      { status: 400 },
    );
  }

  const certs = await db.certificate.findMany({
    where: { learnerId },
    orderBy: { issuedAt: "desc" },
  });

  const certificates: CertificateView[] = certs.map((c) => ({
    id: c.id,
    code: c.code,
    lessonSlug: c.lessonSlug,
    lessonTitle: c.lessonTitle as unknown as LocalizedText,
    learnerName: c.learnerName,
    score: c.score,
    issuedAt: c.issuedAt.toISOString(),
  }));

  return NextResponse.json({ certificates });
}
