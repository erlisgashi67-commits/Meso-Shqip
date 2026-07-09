// AI integration for Mëso Shqip🦅
// Server-only module. Uses z-ai-web-dev-sdk to generate localized
// Albanian-language learning content. All localized outputs guarantee
// the 6 language keys: sq, en, de, it, fr, es.

import ZAI from "z-ai-web-dev-sdk";
import type {
  Difficulty,
  FillData,
  FlashcardData,
  LangCode,
  LocalizedText,
  QuizData,
} from "./types";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type GeneratedLesson = {
  title: LocalizedText;
  summary: LocalizedText;
  content: LocalizedText;
  emoji: string;
  difficulty: Difficulty;
  exercises: {
    type: "quiz" | "flashcard" | "fill";
    data: QuizData | FlashcardData | FillData;
  }[];
};

export type GeneratedQuizExercise = { type: "quiz"; data: QuizData };

export type GeneratedDictionaryWord = {
  word: string;
  pronunciation: string;
  translations: LocalizedText;
  example: LocalizedText;
  category: string;
  emoji: string;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const LANG_KEYS: LangCode[] = ["sq", "en", "de", "it", "fr", "es"];

const VALID_DIFFICULTIES: Difficulty[] = ["fillim", "mesatar", "avancuar"];

/**
 * Guarantees that an object has all 6 language keys.
 * Fallback chain per missing key: provided value → en → sq → "".
 */
function ensureLocalized(obj: any): LocalizedText {
  const out = {} as LocalizedText;

  // If the model returned a plain string, use it for every language.
  if (typeof obj === "string") {
    for (const k of LANG_KEYS) out[k] = obj;
    return out;
  }

  if (!obj || typeof obj !== "object") {
    for (const k of LANG_KEYS) out[k] = "";
    return out;
  }

  const enVal = typeof obj.en === "string" ? obj.en : "";
  const sqVal = typeof obj.sq === "string" ? obj.sq : "";

  for (const k of LANG_KEYS) {
    const v = obj[k];
    if (typeof v === "string" && v.length > 0) {
      out[k] = v;
    } else if (enVal.length > 0) {
      out[k] = enVal;
    } else if (sqVal.length > 0) {
      out[k] = sqVal;
    } else {
      // Last resort: take any non-empty string value present on the object.
      const anyVal = LANG_KEYS
        .map((kk) => obj[kk])
        .find((x) => typeof x === "string" && (x as string).length > 0);
      out[k] = (anyVal as string) ?? "";
    }
  }

  return out;
}

/**
 * Parses JSON from an LLM response, tolerating ```json fences and
 * surrounding prose. Throws an Error when no valid JSON can be recovered.
 */
function parseJsonLoose<T = any>(text: string): T {
  let t = (text ?? "").trim();
  if (!t) throw new Error("Empty AI response");

  // Strip a single wrapping ```json ... ``` fence if present.
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    t = fence[1].trim();
  }

  // Fast path: direct parse.
  try {
    return JSON.parse(t) as T;
  } catch {
    // Fall through to extraction.
  }

  // Slow path: extract the outermost { ... } or [ ... ].
  const firstObj = t.indexOf("{");
  const firstArr = t.indexOf("[");
  let start = -1;
  let openCh = "{";
  let closeCh = "}";

  if (firstObj === -1 || (firstArr !== -1 && firstArr < firstObj)) {
    start = firstArr;
    openCh = "[";
    closeCh = "]";
  } else {
    start = firstObj;
    openCh = "{";
    closeCh = "}";
  }

  if (start === -1) throw new Error("No JSON object/array found in AI response");

  let depth = 0;
  let inStr = false;
  let esc = false;
  let end = -1;

  for (let i = start; i < t.length; i++) {
    const c = t[i];
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (c === "\\") {
        esc = true;
        continue;
      }
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      continue;
    }
    if (c === openCh) {
      depth++;
    } else if (c === closeCh) {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) throw new Error("Incomplete JSON in AI response");

  const slice = t.slice(start, end + 1);

  try {
    return JSON.parse(slice) as T;
  } catch (e) {
    throw new Error(
      `Failed to parse AI JSON: ${e instanceof Error ? e.message : String(e)}`
    );
  }
}

/**
 * Calls the LLM with a list of messages and returns the raw text response.
 * `any` is used here (internal helper) to absorb SDK type friction.
 */
async function callLLMMessages(messages: any): Promise<string> {
  const zai = await ZAI.create();
  const completion = await zai.chat.completions.create({
    messages,
    thinking: { type: "disabled" },
  });
  return completion.choices[0]?.message?.content ?? "";
}

/** Convenience wrapper for a single system + user turn. */
async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  return callLLMMessages([
    { role: "assistant", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);
}

function asDifficulty(v: any): Difficulty {
  return VALID_DIFFICULTIES.includes(v) ? (v as Difficulty) : "fillim";
}

// ---------------------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------------------

/**
 * Generates a full localized lesson about a topic, including 3 exercises
 * (a mix of quiz, flashcard, and fill).
 */
export async function generateLessonContent(
  topic: string,
  learnerLang: LangCode
): Promise<GeneratedLesson> {
  const systemPrompt =
    "You are an expert Albanian-language teacher for children of the Albanian diaspora. You create engaging, accurate beginner lessons. Always respond with strict JSON only, no markdown.";

  const userPrompt = `Create a short beginner Albanian lesson about: "${topic}".
The learner's native language code is "${learnerLang}" (one of sq, en, de, it, fr, es).

Respond with strict JSON of this exact shape:
{
  "title": { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
  "summary": { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
  "content": { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
  "emoji": "🦅",
  "difficulty": "fillim" | "mesatar" | "avancuar",
  "exercises": [
    {
      "type": "quiz",
      "data": {
        "question": { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
        "options": [
          { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
          { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
          { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
          { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." }
        ],
        "correctIndex": 0,
        "explanation": { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." }
      }
    },
    {
      "type": "flashcard",
      "data": {
        "front": { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
        "back":  { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
        "emoji": "...",
        "pronunciation": "..."
      }
    },
    {
      "type": "fill",
      "data": {
        "sentence": { "sq": "... ____ ...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
        "answer":   { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
        "options":  [
          { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." }
        ]
      }
    }
  ]
}

Rules:
- Every localized field MUST contain ALL 6 language keys: sq, en, de, it, fr, es.
- "content" is concise markdown per language (max ~150 words). Always include Albanian examples and a brief explanation in the learner's language (${learnerLang}).
- "difficulty" must be one of: "fillim", "mesatar", "avancuar".
- Provide exactly 3 exercises: at least one quiz, one flashcard, and one fill.
- For the quiz, "options" MUST have exactly 4 entries.
- For the fill exercise, include the placeholder "____" inside the sentence.
- All Albanian text must be accurate, natural, and appropriate for beginners.
- Respond with JSON only. No markdown fences. No commentary.`;

  const raw = await callLLM(systemPrompt, userPrompt);
  const parsed = parseJsonLoose<any>(raw);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI returned invalid lesson JSON");
  }

  // --- Exercises ---------------------------------------------------------
  const exercisesRaw = Array.isArray(parsed.exercises) ? parsed.exercises : [];
  const exercises: GeneratedLesson["exercises"] = [];

  for (const ex of exercisesRaw) {
    if (!ex || typeof ex !== "object") continue;
    const type = ex.type;
    const data = ex.data ?? {};

    if (type === "quiz") {
      const optionsArr = Array.isArray(data.options) ? data.options : [];
      const options = optionsArr.slice(0, 4).map((o: any) => ensureLocalized(o));
      while (options.length < 4) options.push(ensureLocalized(""));
      const correctIndex =
        typeof data.correctIndex === "number" &&
        data.correctIndex >= 0 &&
        data.correctIndex < options.length
          ? data.correctIndex
          : 0;
      const quizData: QuizData = {
        question: ensureLocalized(data.question),
        options,
        correctIndex,
      };
      if (data.explanation) quizData.explanation = ensureLocalized(data.explanation);
      exercises.push({ type: "quiz", data: quizData });
    } else if (type === "flashcard") {
      const flash: FlashcardData = {
        front: ensureLocalized(data.front),
        back: ensureLocalized(data.back),
      };
      if (typeof data.emoji === "string") flash.emoji = data.emoji;
      if (typeof data.pronunciation === "string") flash.pronunciation = data.pronunciation;
      exercises.push({ type: "flashcard", data: flash });
    } else if (type === "fill") {
      const fill: FillData = {
        sentence: ensureLocalized(data.sentence),
        answer: ensureLocalized(data.answer),
      };
      if (Array.isArray(data.options)) {
        fill.options = data.options.map((o: any) => ensureLocalized(o));
      }
      exercises.push({ type: "fill", data: fill });
    }
    // Unknown exercise types are silently skipped.
  }

  const result: GeneratedLesson = {
    title: ensureLocalized(parsed.title),
    summary: ensureLocalized(parsed.summary),
    content: ensureLocalized(parsed.content),
    emoji:
      typeof parsed.emoji === "string" && parsed.emoji.length > 0
        ? parsed.emoji
        : "📘",
    difficulty: asDifficulty(parsed.difficulty),
    exercises,
  };

  return result;
}

/**
 * Generates `count` multiple-choice quiz exercises about a topic.
 */
export async function generateQuiz(
  topic: string,
  learnerLang: LangCode,
  count = 5
): Promise<GeneratedQuizExercise[]> {
  const n = Math.max(1, Math.min(20, Math.floor(count)));

  const systemPrompt =
    "You are an expert Albanian-language teacher for children of the Albanian diaspora. You create accurate multiple-choice quizzes. Always respond with strict JSON only, no markdown.";

  const userPrompt = `Create ${n} multiple-choice quiz questions about: "${topic}".
The learner's native language code is "${learnerLang}".

Respond with strict JSON of this shape:
{
  "questions": [
    {
      "question": { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
      "options": [
        { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
        { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
        { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." },
        { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." }
      ],
      "correctIndex": 0,
      "explanation": { "sq": "...", "en": "...", "de": "...", "it": "...", "fr": "...", "es": "..." }
    }
  ]
}

Rules:
- Provide exactly ${n} questions.
- Each question MUST have exactly 4 options.
- Every localized field MUST contain ALL 6 language keys: sq, en, de, it, fr, es.
- "correctIndex" is a 0-based integer in the range [0, 3].
- Questions should be appropriate for beginner Albanian learners.
- Respond with JSON only. No markdown fences. No commentary.`;

  const raw = await callLLM(systemPrompt, userPrompt);
  const parsed = parseJsonLoose<any>(raw);

  const questionsRaw: any[] = Array.isArray(parsed?.questions)
    ? parsed.questions
    : Array.isArray(parsed)
      ? parsed
      : [];

  const out: GeneratedQuizExercise[] = [];

  for (const q of questionsRaw) {
    if (!q || typeof q !== "object") continue;
    const optionsArr = Array.isArray(q.options) ? q.options : [];
    const options = optionsArr.slice(0, 4).map((o: any) => ensureLocalized(o));
    while (options.length < 4) options.push(ensureLocalized(""));
    const correctIndex =
      typeof q.correctIndex === "number" &&
      q.correctIndex >= 0 &&
      q.correctIndex < options.length
        ? q.correctIndex
        : 0;
    const data: QuizData = {
      question: ensureLocalized(q.question),
      options,
      correctIndex,
    };
    if (q.explanation) data.explanation = ensureLocalized(q.explanation);
    out.push({ type: "quiz", data });
  }

  if (out.length === 0) {
    throw new Error("AI returned no quiz questions");
  }

  return out.slice(0, n);
}

/**
 * Generates a single Albanian dictionary word related to a topic.
 */
export async function generateDictionaryWord(
  topic: string,
  learnerLang: LangCode
): Promise<GeneratedDictionaryWord> {
  const systemPrompt =
    "You are an expert Albanian-language teacher for children of the Albanian diaspora. You provide accurate vocabulary. Always respond with strict JSON only, no markdown.";

  const userPrompt = `Generate a single Albanian word related to the topic: "${topic}".
The learner's native language code is "${learnerLang}".

Respond with strict JSON of this shape:
{
  "word": "Albanian word",
  "pronunciation": "IPA or simple phonetic pronunciation",
  "translations": {
    "sq": "Albanian word itself",
    "en": "...",
    "de": "...",
    "it": "...",
    "fr": "...",
    "es": "..."
  },
  "example": {
    "sq": "Short Albanian example sentence using the word",
    "en": "...",
    "de": "...",
    "it": "...",
    "fr": "...",
    "es": "..."
  },
  "category": "noun",
  "emoji": "📘"
}

Rules:
- Every localized field MUST contain ALL 6 language keys: sq, en, de, it, fr, es.
- The "sq" value of "translations" MUST be the Albanian word itself.
- Example sentences should be short and use the word naturally in context.
- "category" should be a part-of-speech label (e.g. noun, verb, adjective, adverb, phrase).
- Respond with JSON only. No markdown fences. No commentary.`;

  const raw = await callLLM(systemPrompt, userPrompt);
  const parsed = parseJsonLoose<any>(raw);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI returned invalid word JSON");
  }

  return {
    word:
      typeof parsed.word === "string" && parsed.word.length > 0 ? parsed.word : "",
    pronunciation:
      typeof parsed.pronunciation === "string" ? parsed.pronunciation : "",
    translations: ensureLocalized(parsed.translations),
    example: ensureLocalized(parsed.example),
    category:
      typeof parsed.category === "string" && parsed.category.length > 0
        ? parsed.category
        : "fjalë",
    emoji:
      typeof parsed.emoji === "string" && parsed.emoji.length > 0
        ? parsed.emoji
        : "📘",
  };
}

/**
 * Conversational Albanian-language tutor. Returns a single reply string.
 * The system prompt is prepended as an `assistant` message, then the prior
 * conversation history, then the new user message.
 */
export async function aiTutor(
  message: string,
  learnerLang: LangCode,
  history: ChatMessage[]
): Promise<string> {
  const systemPrompt = `You are a friendly Albanian-language tutor for children of the Albanian diaspora. You help them learn Albanian vocabulary, grammar, and culture.
- You answer primarily in the learner's native language (code: ${learnerLang}).
- You always include Albanian words or phrases with translations when teaching.
- Keep your answers concise (under 120 words).
- Be warm, encouraging, and use simple language suitable for children.
- Do not use markdown headings or code fences; plain text only.`;

  const messages: ChatMessage[] = [
    { role: "assistant", content: systemPrompt },
    ...(Array.isArray(history) ? history : []),
    { role: "user", content: message },
  ];

  return callLLMMessages(messages);
}
