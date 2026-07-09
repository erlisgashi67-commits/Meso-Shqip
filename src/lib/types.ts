// Shared types for Mëso Shqip🦅

export type LangCode = "sq" | "en" | "de" | "it" | "fr" | "es";

export type LocalizedText = Record<LangCode, string>;

export type Difficulty = "fillim" | "mesatar" | "avancuar";

export type LessonStatus = "not_started" | "in_progress" | "completed";

// ---- Exercise payload shapes (stored as JSON in Exercise.data) ----

export interface QuizData {
  question: LocalizedText;
  options: LocalizedText[]; // each option localized
  correctIndex: number;
  explanation?: LocalizedText;
}

export interface FlashcardData {
  front: LocalizedText; // Albanian word/phrase
  back: LocalizedText; // translation
  emoji?: string;
  pronunciation?: string;
}

export interface FillData {
  sentence: LocalizedText; // contains "____" placeholder
  answer: LocalizedText;
  options?: LocalizedText[];
}

export interface MatchingData {
  pairs: { left: LocalizedText; right: LocalizedText }[];
}

export type ExerciseData = QuizData | FlashcardData | FillData | MatchingData;

export interface ExerciseView {
  id: string;
  type: "quiz" | "flashcard" | "fill" | "matching";
  data: ExerciseData;
  order: number;
}

export interface CategoryView {
  id: string;
  slug: string;
  name: LocalizedText;
  icon: string;
  color: string;
  order: number;
  lessonCount?: number;
}

export interface LessonView {
  id: string;
  slug: string;
  categoryId: string;
  category?: CategoryView;
  difficulty: Difficulty;
  title: LocalizedText;
  summary: LocalizedText;
  content: LocalizedText;
  xpReward: number;
  duration: number;
  coverEmoji: string;
  order: number;
  exerciseCount?: number;
  progress?: ProgressView;
}

export interface ProgressView {
  status: LessonStatus;
  score: number;
  xpEarned: number;
  startedAt: string | null;
  completedAt: string | null;
}

export interface DictionaryView {
  id: string;
  word: string;
  pronunciation: string | null;
  translations: LocalizedText;
  example: LocalizedText;
  category: string;
  emoji: string | null;
}

export interface CertificateView {
  id: string;
  code: string;
  lessonSlug: string;
  lessonTitle: LocalizedText;
  learnerName: string;
  score: number;
  issuedAt: string;
}

export interface AchievementView {
  id: string;
  type: string;
  title: LocalizedText;
  icon: string;
  createdAt: string;
}

export interface LearnerView {
  id: string;
  name: string;
  avatar: string | null;
  streak: number;
  totalXp: number;
}
