// Mëso Shqip🦅 — Certificate SVG generator
// Produces a self-contained, printable A4-landscape SVG (1123x794) for a
// learner's certificate of completion. All text is rendered as <text>
// elements using generic font families so no external assets are required.

import type { LangCode } from "./types";
import { UI } from "./i18n";

export interface CertificateSvgOptions {
  learnerName: string;
  lessonTitle: string;
  score: number;
  date: string;
  code: string;
  lang: LangCode;
}

const RED = "#E41E20"; // Albanian flag red — primary accent
const NAVY = "#0d1b2a"; // dark navy — secondary border / headings
const CREAM = "#FFFCF5"; // background
const INK = "#222"; // body text
const MUTED = "#666"; // small labels

/** Escape the five XML-significant characters for safe embedding as text. */
function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Resolve a localized object to a string for the requested language. */
function pick(obj: Record<LangCode, string>, lang: LangCode): string {
  return obj[lang] ?? obj.sq ?? "";
}

export function generateCertificateSVG(opts: CertificateSvgOptions): string {
  const { learnerName, lessonTitle, score, date, code, lang } = opts;

  const titleText = pick(UI.certificate.certificateOf, lang);
  const presentedText = pick(UI.certificate.presented, lang);
  const completedText = pick(UI.certificate.completedLesson, lang);
  const scoreLabel = pick(UI.certificate.score, lang);
  const dateLabel = pick(UI.certificate.date, lang);
  const codeLabel = pick(UI.certificate.code, lang);
  const brand = "Mëso Shqip";

  const eLearner = escapeXml(learnerName);
  const eLesson = escapeXml(lessonTitle);
  const eDate = escapeXml(date);
  const eCode = escapeXml(code);
  const eBrand = escapeXml(brand);
  const eTitle = escapeXml(titleText);
  const ePresented = escapeXml(presentedText);
  const eCompleted = escapeXml(completedText);
  const eScoreLabel = escapeXml(scoreLabel);
  const eDateLabel = escapeXml(dateLabel);
  const eCodeLabel = escapeXml(codeLabel);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1123" height="794" viewBox="0 0 1123 794" role="img" aria-label="${eTitle}">
  <!-- ===== Background ===== -->
  <rect x="0" y="0" width="1123" height="794" fill="${CREAM}"/>

  <!-- Subtle decorative corner flourishes -->
  <g fill="${RED}" fill-opacity="0.08">
    <path d="M0,0 L160,0 L0,160 Z"/>
    <path d="M1123,0 L963,0 L1123,160 Z"/>
    <path d="M0,794 L160,794 L0,634 Z"/>
    <path d="M1123,794 L963,794 L1123,634 Z"/>
  </g>

  <!-- ===== Frame: thin outer navy + thicker inner red ===== -->
  <rect x="22" y="22" width="1079" height="750" fill="none" stroke="${NAVY}" stroke-width="1.4"/>
  <rect x="34" y="34" width="1055" height="726" fill="none" stroke="${RED}" stroke-width="3"/>
  <rect x="46" y="46" width="1031" height="702" fill="none" stroke="${RED}" stroke-width="0.6" stroke-opacity="0.55"/>

  <!-- Corner diamond ornaments -->
  <g fill="${RED}">
    <rect x="29" y="29" width="10" height="10" transform="rotate(45 34 34)"/>
    <rect x="1084" y="29" width="10" height="10" transform="rotate(45 1089 34)"/>
    <rect x="29" y="755" width="10" height="10" transform="rotate(45 34 760)"/>
    <rect x="1084" y="755" width="10" height="10" transform="rotate(45 1089 760)"/>
  </g>

  <!-- ===== Top emblem + wordmark ===== -->
  <text x="561.5" y="120" font-family="Arial, sans-serif" font-size="68" text-anchor="middle" dominant-baseline="central">🦅</text>
  <text x="561.5" y="180" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-style="italic" fill="${NAVY}" text-anchor="middle">${eBrand}</text>

  <!-- Decorative divider with center diamond -->
  <line x1="451.5" y1="210" x2="551.5" y2="210" stroke="${RED}" stroke-width="1.4"/>
  <line x1="571.5" y1="210" x2="671.5" y2="210" stroke="${RED}" stroke-width="1.4"/>
  <rect x="555.5" y="206" width="12" height="8" transform="rotate(45 561.5 210)" fill="${RED}"/>

  <!-- ===== Title ===== -->
  <text x="561.5" y="266" font-family="Georgia, 'Times New Roman', serif" font-size="44" font-weight="bold" fill="${NAVY}" text-anchor="middle" letter-spacing="0.5">${eTitle}</text>

  <!-- Presented to -->
  <text x="561.5" y="308" font-family="Arial, sans-serif" font-size="17" font-style="italic" fill="${MUTED}" text-anchor="middle">${ePresented}</text>

  <!-- ===== Learner name ===== -->
  <text x="561.5" y="378" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="bold" fill="${RED}" text-anchor="middle">${eLearner}</text>

  <!-- Decorative underline beneath the name -->
  <line x1="361.5" y1="404" x2="551.5" y2="404" stroke="${NAVY}" stroke-width="0.8"/>
  <line x1="571.5" y1="404" x2="761.5" y2="404" stroke="${NAVY}" stroke-width="0.8"/>
  <circle cx="561.5" cy="404" r="3" fill="${RED}"/>

  <!-- ===== Lesson line ===== -->
  <text x="561.5" y="450" font-family="Arial, sans-serif" font-size="19" fill="${INK}" text-anchor="middle">${eCompleted}</text>
  <text x="561.5" y="486" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-style="italic" fill="${NAVY}" text-anchor="middle">“${eLesson}”</text>

  <!-- ===== Score badge ===== -->
  <g>
    <rect x="441.5" y="524" width="240" height="46" rx="23" fill="${RED}"/>
    <rect x="441.5" y="524" width="240" height="46" rx="23" fill="none" stroke="${NAVY}" stroke-width="0.8"/>
    <text x="561.5" y="547" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${CREAM}" text-anchor="middle" dominant-baseline="central">${eScoreLabel}: ${score}%</text>
  </g>

  <!-- ===== Bottom row: date | signature | seal + code ===== -->

  <!-- Date (bottom-left) -->
  <text x="120" y="690" font-family="Arial, sans-serif" font-size="13" fill="${MUTED}" text-anchor="start" letter-spacing="2">${eDateLabel.toUpperCase()}</text>
  <text x="120" y="712" font-family="Georgia, 'Times New Roman', serif" font-size="18" fill="${NAVY}" text-anchor="start" font-weight="bold">${eDate}</text>

  <!-- Signature (bottom-center) -->
  <line x1="441.5" y1="686" x2="681.5" y2="686" stroke="${NAVY}" stroke-width="1"/>
  <text x="561.5" y="708" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-style="italic" fill="${NAVY}" text-anchor="middle">${eBrand} 🦅</text>
  <text x="561.5" y="726" font-family="Arial, sans-serif" font-size="10" fill="${MUTED}" text-anchor="middle" letter-spacing="3">AUTORIZUAR</text>

  <!-- Seal + code (bottom-right) -->
  <g>
    <!-- Outer seal ring -->
    <circle cx="975" cy="668" r="40" fill="none" stroke="${RED}" stroke-width="2.2"/>
    <circle cx="975" cy="668" r="33" fill="none" stroke="${RED}" stroke-width="0.7"/>
    <!-- Inner cream disc -->
    <circle cx="975" cy="668" r="29" fill="${CREAM}"/>
    <text x="975" y="662" font-family="Arial, sans-serif" font-size="22" text-anchor="middle" dominant-baseline="central">🦅</text>
    <text x="975" y="684" font-family="Arial, sans-serif" font-size="7" fill="${RED}" text-anchor="middle" letter-spacing="1.2">MSQ OFFICIAL</text>
  </g>

  <!-- Code reference (below seal) -->
  <text x="975" y="726" font-family="Arial, sans-serif" font-size="13" fill="${MUTED}" text-anchor="middle" letter-spacing="2">${eCodeLabel.toUpperCase()}</text>
  <text x="975" y="746" font-family="Consolas, 'Courier New', monospace" font-size="15" fill="${NAVY}" text-anchor="middle" font-weight="bold">${eCode}</text>
</svg>`;
}
