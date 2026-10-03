import type { Cefr } from '@/lib/curriculum/types';

export const LANGUAGE_CODES = ['es', 'ja'] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === 'string' && (LANGUAGE_CODES as readonly string[]).includes(value);
}

/** Everything that differs between the languages the app teaches, apart from the course content itself. */
export type LanguageInfo = {
  code: LanguageCode;
  /** English name, e.g. "Spanish". */
  name: string;
  nativeName: string;
  flag: string;
  /** One line for the language picker. */
  blurb: string;
  speech: {
    /** Voice locales in order of preference. */
    voiceLocales: string[];
    /** Any installed voice whose language starts with this works as a fallback. */
    voicePrefix: string;
    recognitionLocale: string;
    rate: { normal: number; slow: number };
  };
  /** Words are separated by spaces. Japanese isn't, so answers are compared character by character. */
  spaced: boolean;
  /** Content carries kana readings, shown as furigana and (optionally) romaji. */
  readings: boolean;
  /** How levels are shown to learners. Internally everything stays on the CEFR scale. */
  levelLabels: Record<Cefr, string>;
  levelDescriptions: Record<Cefr, string>;
  /**
   * Rough cumulative guided-study hours (lessons + immersion) to reach each
   * level for an English speaker.
   */
  hoursToReach: Record<Cefr, number>;
  phrases: {
    tagline: string;
    greeting: (hour: number) => string;
    nameQuestion: string;
    writeHere: string;
    writeInLanguage: string;
    listening: string;
    perfect: string;
    excellent: string;
    correct: string;
    veryGood: string;
    goalReached: string;
    greatPronunciation: string;
    studyTime: string;
    reflectionPrompt: string;
    wellDone: string;
  };
  /** Title shown when an answer was right apart from a spelling detail (accents, kana instead of kanji). */
  slipTitle: string;
  tutor: {
    /** Who the AI tutor is, completing "You are …". */
    persona: string;
    /** House style for anything the AI writes in the target language. */
    rules: string[];
    levelGuide: Record<Cefr, string>;
    /** Extra leniency when grading a translation. */
    grading: string;
    /** What the proofreader should leave alone. */
    proofreadIgnore: string;
    /** A sample one-line correction, to show the proofreader the expected style. */
    proofreadExample: string;
  };
};

const spanish: LanguageInfo = {
  code: 'es',
  name: 'Spanish',
  nativeName: 'Español',
  flag: '🇲🇽',
  blurb: 'Latin American Spanish, from greetings to fluent conversation',
  speech: {
    voiceLocales: ['es-MX', 'es-US', 'es-419', 'es-CO', 'es-AR', 'es-ES'],
    voicePrefix: 'es',
    recognitionLocale: 'es-MX',
    rate: { normal: 0.95, slow: 0.7 },
  },
  spaced: true,
  readings: false,
  levelLabels: { A1: 'A1', A2: 'A2', B1: 'B1', B2: 'B2', C1: 'C1', C2: 'C2' },
  levelDescriptions: {
    A1: 'Beginner: introduce yourself, order food, handle simple, slow exchanges.',
    A2: 'Elementary: talk about your past, routines, shopping, travel basics.',
    B1: 'Intermediate: tell stories, give opinions, handle most travel situations.',
    B2: 'Upper-intermediate: follow native TV, debate, work in Spanish with effort.',
    C1: 'Advanced (fluent): express yourself spontaneously and precisely on almost anything.',
    C2: 'Mastery: near-native nuance, humor, and register.',
  },
  // FSI puts Spanish at ~600-750 class hours for professional working proficiency.
  hoursToReach: { A1: 0, A2: 80, B1: 200, B2: 400, C1: 650, C2: 1000 },
  phrases: {
    tagline: 'De cero a fluido.',
    greeting: (h) => (h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'),
    nameQuestion: '¿Cómo te llamas?',
    writeHere: 'Escribe aquí…',
    writeInLanguage: 'Escribe en español…',
    listening: 'Escuchando…',
    perfect: '¡Perfecto!',
    excellent: '¡Excelente!',
    correct: '¡Correcto!',
    veryGood: '¡Muy bien!',
    goalReached: '¡Lo lograste!',
    greatPronunciation: '¡Excelente pronunciación!',
    studyTime: '¡Hora de estudiar!',
    reflectionPrompt: '¿Qué viste o leíste? ¿Qué palabras nuevas aprendiste?',
    wellDone: '¡Buen trabajo!',
  },
  slipTitle: 'Right — watch the accents',
  tutor: {
    persona: 'a warm, precise Spanish tutor for an English speaker learning Latin American Spanish',
    rules: ['Always use Latin American usage: "ustedes", never "vosotros". Use correct accents and ¿¡ punctuation.'],
    levelGuide: {
      A1: 'very short, simple sentences in the present tense with the most common words',
      A2: 'short sentences; present, simple past, and near future; everyday vocabulary',
      B1: 'natural sentences using past tenses, future, conditional, and some subjunctive',
      B2: 'natural, varied sentences including subjunctive and complex clauses',
      C1: 'rich, idiomatic, native-like Spanish with nuance',
      C2: 'fully native Spanish with idioms and register shifts',
    },
    grading:
      'Accept any natural, grammatical Spanish with the same meaning, even if it differs from the reference. Ignore capitalization and final punctuation. Missing accents make it "almost", not wrong.',
    proofreadIgnore: 'Ignore missing accents, capitalization, and punctuation.',
    proofreadExample: 'Use soy with yo: yo soy, not yo es.',
  },
};

const japanese: LanguageInfo = {
  code: 'ja',
  name: 'Japanese',
  nativeName: '日本語',
  flag: '🇯🇵',
  blurb: 'Hiragana and katakana first, then JLPT N5 to N1',
  speech: {
    voiceLocales: ['ja-JP'],
    voicePrefix: 'ja',
    recognitionLocale: 'ja-JP',
    rate: { normal: 0.9, slow: 0.65 },
  },
  spaced: false,
  readings: true,
  // JLPT levels line up roughly with CEFR bands.
  levelLabels: { A1: 'N5', A2: 'N4', B1: 'N3', B2: 'N2', C1: 'N1', C2: 'N1+' },
  levelDescriptions: {
    A1: 'Beginner (N5): read kana, introduce yourself, order food, ask simple questions.',
    A2: 'Elementary (N4): casual and polite speech, daily life, plans, and past experiences.',
    B1: 'Intermediate (N3): follow everyday conversations and simple articles; handle most travel and work basics.',
    B2: 'Upper-intermediate (N2): follow news and dramas, work in Japanese with effort.',
    C1: 'Advanced (N1): read newspapers and literature, speak precisely across registers.',
    C2: 'Mastery: near-native nuance, humor, and keigo.',
  },
  // FSI rates Japanese a Category IV language (~2,200 class hours for professional
  // proficiency); JLPT surveys of learners without a kanji background land in the same range.
  hoursToReach: { A1: 0, A2: 300, B1: 650, B2: 1150, C1: 2000, C2: 3200 },
  phrases: {
    tagline: 'ゼロからペラペラへ。',
    greeting: (h) => (h < 11 ? 'おはようございます' : h < 18 ? 'こんにちは' : 'こんばんは'),
    nameQuestion: 'お名前は？',
    writeHere: 'ここに書いてください（かな・romaji OK）',
    writeInLanguage: '日本語で書いてください…',
    listening: '聞いています…',
    perfect: '完璧！',
    excellent: 'すばらしい！',
    correct: '正解！',
    veryGood: 'よくできました！',
    goalReached: 'やった！',
    greatPronunciation: '発音ばっちり！',
    studyTime: '勉強の時間です！',
    reflectionPrompt: '何を見ましたか？新しい言葉はありましたか？',
    wellDone: 'おつかれさま！',
  },
  slipTitle: 'Right — check how it’s written',
  tutor: {
    persona: 'a warm, precise Japanese tutor for an English speaker learning standard (Tokyo) Japanese',
    rules: [
      'Write natural standard Japanese with Japanese punctuation (。、？！). Use polite です/ます style unless the situation is casual between friends.',
      'Only use kanji the learner should know at their level; write harder words in hiragana. Never write romaji inside Japanese text.',
    ],
    levelGuide: {
      A1: 'very short, simple sentences in polite です/ます form with JLPT N5 words, mostly hiragana with only the most basic kanji',
      A2: 'short sentences in polite or plain form with て-form, past tense, and JLPT N4 words and kanji',
      B1: 'natural sentences using conditionals, passive, causative, and other JLPT N3 grammar',
      B2: 'natural, varied Japanese including written style and JLPT N2 grammar',
      C1: 'rich, idiomatic, native-like Japanese with nuance and appropriate keigo',
      C2: 'fully native Japanese with idioms and register shifts',
    },
    grading:
      'Accept any natural, grammatical Japanese with the same meaning, even if it differs from the reference: polite or plain style, dropped pronouns, and kana instead of kanji are all fine. The learner may type in romaji; judge the Japanese it spells. Wrong particles or conjugations make it "almost" or "incorrect" depending on how much they change the meaning.',
    proofreadIgnore: 'Ignore kana vs kanji spelling choices, romaji input, spacing, and punctuation.',
    proofreadExample: 'Mark the object with を: すしを食べます, not すしが食べます.',
  },
};

export const LANGUAGES: Record<LanguageCode, LanguageInfo> = { es: spanish, ja: japanese };

// The course being studied. Set by the database layer when it opens that course's data.
let activeCode: LanguageCode | null = null;

export function setActiveLanguageCode(code: LanguageCode | null) {
  activeCode = code;
}

export function activeLanguageCode(): LanguageCode | null {
  return activeCode;
}

/** The language being studied. Falls back to Spanish before a course is chosen. */
export function language(): LanguageInfo {
  return LANGUAGES[activeCode ?? 'es'];
}

export function levelLabel(level: Cefr) {
  return language().levelLabels[level];
}
