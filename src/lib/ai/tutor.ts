import { courseUnits, type Cefr, type GrammarPoint, type MediaItem, type Scenario, type Sentence, type Unit, type VocabItem } from '@/lib/curriculum';
import { alignFurigana } from '@/lib/japanese';
import { language, levelLabel } from '@/lib/languages';
import { comparisonKey, normalize } from '@/lib/text';

import { generateJson, hasLargeContext, type JsonSchema, type Priority } from './llm';
import { asArray, asNumber, asObject, asString, clamp01 } from './parse';

function levelName(level: Cefr) {
  const label = levelLabel(level);
  return label === level ? `CEFR ${level}` : `CEFR ${level} (JLPT ${label})`;
}

function tutorSystem(level: Cefr, extra = '') {
  const lang = language();
  return [
    `You are ${lang.tutor.persona}.`,
    `Learner level: ${levelName(level)}. Any ${lang.name} you write for them should use ${lang.tutor.levelGuide[level]}.`,
    ...lang.tutor.rules,
    'Any explanations or feedback for the learner are written in clear, complete English.',
    extra,
  ]
    .filter(Boolean)
    .join('\n');
}

const READING_HINT =
  'The same text written only in hiragana and katakana (katakana where the text uses it), with a space between every word and particle. No kanji, no romaji.';

/** Schema for a target-language sentence with translation (and kana reading where the language uses one). */
function sentenceSchema(description = `${language().name} sentence`): JsonSchema & { type: 'object' } {
  const readings = language().readings;
  const keys = readings ? ['text', 'reading', 'en'] : ['text', 'en'];
  return {
    type: 'object',
    properties: {
      text: { type: 'string', description },
      ...(readings ? { reading: { type: 'string', description: READING_HINT } } : {}),
      en: { type: 'string', description: 'English translation' },
    },
    required: keys,
    propertyOrder: keys,
  };
}

/** Keeps a model-written reading only if it lines up with the text; a wrong one is worse than none. */
function checkedReading(text: string, reading: unknown) {
  const r = asString(reading)?.trim();
  if (!r || !language().readings) return undefined;
  return alignFurigana(text, r) ? r : undefined;
}

const sentenceParser = (v: unknown): Sentence | null => {
  const o = asObject(v);
  const text = asString(o?.text)?.trim();
  const en = asString(o?.en)?.trim();
  return text && en ? { text, en, reading: checkedReading(text, o?.reading) } : null;
};

function wordList(words: VocabItem[]) {
  return words.map((w) => `${w.text}${w.reading ? ` [${w.reading}]` : ''} (${w.en})`).join(', ');
}

// ---------- Practice sentences ----------

export async function generatePracticeSentences(args: {
  level: Cefr;
  grammar: GrammarPoint;
  words: VocabItem[];
  count: number;
  priority?: Priority;
}): Promise<Sentence[]> {
  const lang = language();
  const result = await generateJson({
    priority: args.priority,
    system: tutorSystem(args.level),
    prompt: [
      `Write ${args.count} different ${lang.name} practice sentences that each clearly use this grammar point: "${args.grammar.title}".`,
      `Grammar notes: ${args.grammar.summary}`,
      `Prefer these words the learner knows: ${wordList(args.words)}.`,
      'Each sentence: short, natural, everyday, self-contained. Give an accurate natural English translation for each.',
    ].join('\n'),
    schema: {
      type: 'object',
      properties: {
        sentences: { type: 'array', minItems: args.count, maxItems: args.count, items: sentenceSchema() },
      },
      required: ['sentences'],
    },
    parse: (v) => {
      const list = asArray(asObject(v)?.sentences, sentenceParser);
      return list && list.length ? list : null;
    },
    temperature: 0.7,
  });
  return result.slice(0, args.count);
}

// ---------- Grading free answers ----------

export type Grade = {
  score: number;
  verdict: 'correct' | 'almost' | 'incorrect';
  corrected: string;
  explanation: string;
};

export async function gradeTranslation(args: {
  level: Cefr;
  english: string;
  reference: string;
  answer: string;
}): Promise<Grade> {
  const lang = language();
  return generateJson({
    system: tutorSystem(args.level, `You grade translations fairly. ${lang.tutor.grading}`),
    prompt: [
      `English: "${args.english}"`,
      `Reference ${lang.name}: "${args.reference}"`,
      `Learner's ${lang.name}: "${args.answer}"`,
      'Grade the learner. "corrected" is the learner\'s answer with minimal fixes (or unchanged if correct). "explanation" is 1-2 short English sentences naming the specific mistake, or brief praise.',
    ].join('\n'),
    schema: {
      type: 'object',
      properties: {
        verdict: { type: 'string', enum: ['correct', 'almost', 'incorrect'] },
        score: { type: 'number', description: '0 to 1' },
        corrected: { type: 'string' },
        explanation: { type: 'string' },
      },
      required: ['verdict', 'score', 'corrected', 'explanation'],
      propertyOrder: ['verdict', 'score', 'corrected', 'explanation'],
    },
    parse: parseGrade,
    temperature: 0.1,
  });
}

function parseGrade(v: unknown): Grade | null {
  const o = asObject(v);
  const verdict = asString(o?.verdict);
  if (verdict !== 'correct' && verdict !== 'almost' && verdict !== 'incorrect') return null;
  const fallbackScore = verdict === 'correct' ? 1 : verdict === 'almost' ? 0.7 : 0.2;
  return {
    verdict,
    score: clamp01(asNumber(o?.score) ?? fallbackScore),
    corrected: asString(o?.corrected) ?? '',
    explanation: asString(o?.explanation) ?? '',
  };
}

// ---------- Grammar Q&A ----------

/**
 * Finds course grammar notes related to a question (e.g. "estoy" pulls in the
 * ser/estar unit) so a small on-device model answers from vetted material.
 */
export function relatedGrammar(question: string, current: GrammarPoint, limit = 2): GrammarPoint[] {
  const terms = new Set(
    normalize(question)
      .split(' ')
      .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
  );
  // Japanese questions often quote a form (〜たら, 食べられる) that won't split on spaces.
  const quoted = language().spaced ? [] : (question.match(/[぀-ヿ一-鿿]+/g) ?? []);
  if (!terms.size && !quoted.length) return [];
  return courseUnits()
    .flatMap((u) => u.grammar)
    .filter((g) => g.id !== current.id)
    .map((g) => {
      const haystack = `${g.title} ${g.summary} ${g.examples.map((e) => e.text).join(' ')}`;
      const hay = new Set(normalize(haystack).split(' '));
      let score = 0;
      for (const t of terms) if (hay.has(t)) score += normalize(g.title).includes(t) ? 3 : 1;
      for (const q of quoted) if (comparisonKey(haystack).includes(comparisonKey(q))) score += g.title.includes(q) ? 3 : 1;
      return { g, score };
    })
    .filter((x) => x.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.g);
}

const STOPWORDS = new Set([
  'the', 'and', 'why', 'what', 'when', 'how', 'does', 'use', 'not', 'for', 'with', 'this', 'that', 'instead',
  'can', 'you', 'are', 'there', 'which', 'difference', 'between', 'mean', 'means', 'say', 'would', 'should',
]);

export type GrammarAnswer = { answer: string; examples: Sentence[] };

export async function explainGrammar(args: {
  level: Cefr;
  grammar: GrammarPoint;
  question: string;
}): Promise<GrammarAnswer> {
  const lang = language();
  const notes = [args.grammar, ...relatedGrammar(args.question, args.grammar)]
    .map((g) => `## ${g.title}\n${g.summary}\nExamples: ${g.examples.map((e) => `${e.text} (${e.en})`).join('; ')}`)
    .join('\n\n');
  return generateJson({
    system: [
      `You are a careful ${lang.name} teacher answering an English-speaking student's question.`,
      'Base your answer on the course notes provided; they are correct. Do not contradict them.',
      `The student is at ${levelName(args.level)}: explain in clear, complete English and keep ${lang.name} examples at that level.`,
      ...lang.tutor.rules,
    ].join('\n'),
    prompt: [
      'Course notes:',
      notes,
      '',
      `Student's question: ${args.question}`,
      '',
      '"answer": answer the question directly in 2-4 English sentences, naming the rule that applies.',
      `"examples": 2 short, correct ${lang.name} sentences that illustrate the answer, each with an English translation.`,
    ].join('\n'),
    schema: {
      type: 'object',
      properties: {
        answer: { type: 'string' },
        examples: { type: 'array', minItems: 2, maxItems: 2, items: sentenceSchema() },
      },
      required: ['answer', 'examples'],
      propertyOrder: ['answer', 'examples'],
    },
    parse: (v) => {
      const o = asObject(v);
      const answer = asString(o?.answer)?.trim();
      if (!answer) return null;
      return { answer, examples: asArray(o?.examples, sentenceParser) ?? [] };
    },
    temperature: 0.2,
  });
}

// ---------- Conversation ----------

export type ChatTurn = { role: 'ai' | 'learner'; text: string };

export type ConversationReply = {
  reply: string;
  replyReading?: string;
  replyEnglish: string;
  goalMet: boolean;
};

export async function conversationTurn(args: {
  level: Cefr;
  scenario: Scenario;
  history: ChatTurn[];
}): Promise<ConversationReply> {
  const lang = language();
  // On-device context is ~4k tokens, so keep only the tail of the chat there.
  const transcript = args.history
    .slice(hasLargeContext() ? -40 : -10)
    .map((t) => `${t.role === 'ai' ? 'You' : 'Learner'}: ${t.text}`)
    .join('\n');
  const keys = lang.readings ? ['reply', 'replyReading', 'replyEnglish', 'goalMet'] : ['reply', 'replyEnglish', 'goalMet'];
  return generateJson({
    system: tutorSystem(
      args.level,
      [
        `Role-play: you are ${args.scenario.aiRole}. Setting: ${args.scenario.setting}`,
        `The learner is trying to: ${args.scenario.learnerGoal}`,
        `Stay in character and reply ONLY in ${lang.name}, 1-3 short sentences, ending with something that invites a reply.`,
        'Never switch to English inside "reply".',
      ].join('\n')
    ),
    prompt: [
      'Conversation so far:',
      transcript,
      '',
      `"reply" = your next in-character ${lang.name} line. "replyEnglish" = its English translation.`,
      lang.readings ? `"replyReading" = ${READING_HINT}` : '',
      '"goalMet" = true ONLY if the learner has already done every part of their goal in this conversation; otherwise false.',
    ]
      .filter(Boolean)
      .join('\n'),
    schema: {
      type: 'object',
      properties: {
        reply: { type: 'string' },
        ...(lang.readings ? { replyReading: { type: 'string', description: READING_HINT } } : {}),
        replyEnglish: { type: 'string' },
        goalMet: { type: 'boolean' },
      },
      required: keys,
      propertyOrder: keys,
    },
    parse: (v) => {
      const o = asObject(v);
      const reply = asString(o?.reply)?.trim();
      if (!reply) return null;
      return {
        reply,
        replyReading: checkedReading(reply, o?.replyReading),
        replyEnglish: asString(o?.replyEnglish) ?? '',
        goalMet: o?.goalMet === true || o?.goalMet === 'true',
      };
    },
    temperature: 0.7,
  });
}

export type WritingCheck = { corrected: string; explanation: string };

/**
 * Proofreads one learner message. Asking for a rewrite and diffing it is more
 * reliable with small models than asking "is this correct?".
 * Returns null when nothing meaningful changed.
 */
export async function checkWriting(args: { level: Cefr; text: string; context?: string }): Promise<WritingCheck | null> {
  const lang = language();
  const result = await generateJson({
    system: [
      `You are a meticulous ${lang.name} proofreader for a learner (${levelName(args.level)}).`,
      "Fix grammar, conjugation, particle/agreement, and word choice errors. Keep the learner's meaning, words, and informal style.",
      `Do not rephrase correct sentences. ${lang.tutor.proofreadIgnore}`,
    ].join('\n'),
    prompt: [
      args.context ? `Context: they are replying to "${args.context}"` : '',
      `Learner wrote: "${args.text}"`,
      '"corrected": the fully corrected version (identical if already correct).',
      `"explanation": if you changed anything, one short English sentence naming the mistake (e.g. "${lang.tutor.proofreadExample}"); otherwise an empty string.`,
    ]
      .filter(Boolean)
      .join('\n'),
    schema: {
      type: 'object',
      properties: {
        corrected: { type: 'string' },
        explanation: { type: 'string' },
      },
      required: ['corrected', 'explanation'],
      propertyOrder: ['corrected', 'explanation'],
    },
    parse: (v) => {
      const o = asObject(v);
      const corrected = asString(o?.corrected)?.trim();
      return corrected ? { corrected, explanation: asString(o?.explanation)?.trim() ?? '' } : null;
    },
    temperature: 0,
  });
  return comparisonKey(result.corrected) === comparisonKey(args.text) ? null : result;
}

// ---------- Reading ----------

export type ReadingPassage = {
  title: string;
  text: string;
  reading?: string;
  questions: { question: string; options: string[]; answerIndex: number }[];
};

export async function generateReading(args: {
  level: Cefr;
  unit: Unit;
  words: VocabItem[];
  interests: string[];
  priority?: Priority;
}): Promise<ReadingPassage> {
  const lang = language();
  const sentences = { A1: '6-8', A2: '8-10', B1: '10-12', B2: '12-14', C1: '14-16', C2: '14-16' }[args.level];
  const keys = lang.readings ? ['title', 'text', 'reading', 'questions'] : ['title', 'text', 'questions'];
  return generateJson({
    priority: args.priority,
    system: tutorSystem(args.level),
    prompt: [
      `Write a short ${lang.name} story or text of ${sentences} sentences on the theme "${args.unit.theme}"${
        args.interests.length ? `, with a nod to these interests: ${args.interests.join(', ')}` : ''
      }.`,
      `Naturally use some of: ${args.words.map((w) => w.text).join(', ')}.`,
      `Showcase this grammar: ${args.unit.grammar.map((g) => g.title).join('; ')}.`,
      'Then write 3 comprehension questions about the text. Questions and options MUST be in English. Each has 4 options and the index (0-3) of the correct one; vary the correct index. Ask about details stated in the text (who, where, what happened), not about the reader.',
    ].join('\n'),
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: `${lang.name} title` },
        text: { type: 'string', description: `The ${lang.name} passage, ${sentences} sentences` },
        ...(lang.readings ? { reading: { type: 'string', description: `The whole passage: ${READING_HINT}` } } : {}),
        questions: {
          type: 'array',
          minItems: 3,
          maxItems: 3,
          items: {
            type: 'object',
            properties: {
              question: { type: 'string', description: 'Question in English' },
              options: {
                type: 'array',
                description: 'Four answer options in English',
                items: { type: 'string' },
                minItems: 4,
                maxItems: 4,
              },
              answerIndex: { type: 'integer' },
            },
            required: ['question', 'options', 'answerIndex'],
            propertyOrder: ['question', 'options', 'answerIndex'],
          },
        },
      },
      required: keys,
      propertyOrder: keys,
    },
    parse: (v) => {
      const o = asObject(v);
      const title = asString(o?.title);
      const text = asString(o?.text);
      const questions = asArray(o?.questions, (q) => {
        const qo = asObject(q);
        const question = asString(qo?.question);
        const options = asArray(qo?.options, asString);
        const answerIndex = asNumber(qo?.answerIndex);
        if (!question || !options || options.length < 2 || answerIndex === null) return null;
        if (answerIndex < 0 || answerIndex >= options.length) return null;
        return { question, options, answerIndex: Math.round(answerIndex) };
      });
      if (!title || !text || !questions?.length) return null;
      return { title, text, reading: checkedReading(text, o?.reading), questions };
    },
    temperature: 0.8,
    // A kana reading roughly doubles the output.
    maxTokens: lang.readings ? 1800 : 900,
  });
}

// ---------- Homework ----------

export type HomeworkPlan = { mediaId: string; title: string; instructions: string; minutes: number };

export async function planHomework(args: {
  level: Cefr;
  unit: Unit;
  interests: string[];
  candidates: MediaItem[];
  count: number;
}): Promise<HomeworkPlan[]> {
  const menu = args.candidates
    .map((m) => `${m.id}: ${m.title} [${m.type}, ${m.minLevel}-${m.maxLevel}] ${m.description}`)
    .join('\n');
  return generateJson({
    system: tutorSystem(
      args.level,
      'You assign out-of-class immersion homework. Tasks must be concrete, doable in the stated time, and connect to what the learner is studying.'
    ),
    prompt: [
      `This week's unit: "${args.unit.title}" (${args.unit.theme}). Grammar: ${args.unit.grammar.map((g) => g.title).join('; ')}.`,
      `Learner interests: ${args.interests.join(', ') || 'unknown'}.`,
      `Pick ${args.count} different items from this list (use the exact id) and write a specific task for each:`,
      menu,
      'Write "title" and "instructions" in ENGLISH (the learner may be a beginner).',
      '"title": short English task title, e.g. "Watch episode 1 of …". "instructions": 2-3 English sentences with a concrete goal: exactly what to watch/read/listen to and how much, plus one small output like noting 5 new words or summarizing aloud. "minutes": realistic time, 15-60.',
    ].join('\n'),
    schema: {
      type: 'object',
      properties: {
        assignments: {
          type: 'array',
          minItems: 1,
          maxItems: args.count,
          items: {
            type: 'object',
            properties: {
              mediaId: { type: 'string', enum: args.candidates.map((c) => c.id) },
              title: { type: 'string', description: 'Short task title in English' },
              instructions: { type: 'string', description: '2-3 sentences in English' },
              minutes: { type: 'integer' },
            },
            required: ['mediaId', 'title', 'instructions', 'minutes'],
            propertyOrder: ['mediaId', 'title', 'instructions', 'minutes'],
          },
        },
      },
      required: ['assignments'],
    },
    parse: (v) => {
      const list = asArray(asObject(v)?.assignments, (a) => {
        const o = asObject(a);
        const mediaId = asString(o?.mediaId);
        const title = asString(o?.title);
        const instructions = asString(o?.instructions);
        if (!mediaId || !title || !instructions) return null;
        if (!args.candidates.some((c) => c.id === mediaId)) return null;
        return { mediaId, title, instructions, minutes: Math.max(10, Math.min(90, asNumber(o?.minutes) ?? 30)) };
      });
      return list && list.length ? list : null;
    },
    temperature: 0.6,
  });
}

export type ReflectionFeedback = { feedback: string; corrected: string; score: number };

export async function reviewReflection(args: {
  level: Cefr;
  task: string;
  reflection: string;
}): Promise<ReflectionFeedback> {
  const lang = language();
  return generateJson({
    system: [
      `You are an encouraging ${lang.name} writing coach for an English speaker.`,
      `The learner is at ${levelName(args.level)}. Always write your feedback in clear, complete ENGLISH sentences.`,
    ].join('\n'),
    prompt: [
      `Homework task: ${args.task}`,
      `The learner wrote this reflection (ideally in ${lang.name}): "${args.reflection}"`,
      `"corrected": their text with ${lang.name} errors fixed (keep their meaning and style; if they wrote English, translate it into simple ${lang.name} they could have written).`,
      `"feedback": 2-3 complete ENGLISH sentences: one specific thing they did well, the single most useful correction and why (quote the ${lang.name}), and one tip.`,
      `"score": 0-1 for ${lang.name} accuracy.`,
    ].join('\n'),
    schema: {
      type: 'object',
      properties: {
        corrected: { type: 'string', description: `Corrected ${lang.name} text` },
        feedback: { type: 'string', description: '2-3 complete sentences in English' },
        score: { type: 'number' },
      },
      required: ['corrected', 'feedback', 'score'],
      propertyOrder: ['corrected', 'feedback', 'score'],
    },
    parse: (v) => {
      const o = asObject(v);
      const feedback = asString(o?.feedback);
      if (!feedback) return null;
      return { feedback, corrected: asString(o?.corrected) ?? '', score: clamp01(asNumber(o?.score) ?? 0.5) };
    },
    temperature: 0.2,
  });
}
