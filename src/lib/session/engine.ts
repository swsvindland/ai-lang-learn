import { generatePracticeSentences, generateReading, type ReadingPassage } from '@/lib/ai/tutor';
import { isAiReady } from '@/lib/ai/llm';
import {
  dueCards,
  dueCount,
  dueLearningCards,
  introduceVocab,
  isIntroduced,
  knownVocab,
  markKnownVocab,
  resolveVocab,
  reviewCard,
  type CardRow,
} from '@/lib/cards';
import {
  course,
  courseUnits,
  getScriptEntry,
  ratingToCefr,
  unitDifficulty,
  type Cefr,
  type ClozeDrill,
  type GrammarPoint,
  type Sentence,
  type Unit,
  type VocabItem,
} from '@/lib/curriculum';
import { hasKanji, romajiFor, stripPunctuation } from '@/lib/japanese';
import { run, uid } from '@/lib/db';
import {
  currentUnit,
  getProfile,
  grammarMastery,
  markGrammarIntroduced,
  markRefreshed,
  maybeAdvanceUnit,
  nextRefreshWords,
  overallRating,
  refreshProgress,
  recordAttempt,
  recordConversation,
  unitStatuses,
  weakestSkills,
  type Skill,
} from '@/lib/learner';
import { isScriptItem, lessonBefore, nextScriptItems, scriptKnowledge, seenLessons, type ScriptKnowledge } from '@/lib/script';
import type { Grade } from '@/lib/srs';
import { pick, sample, sentenceLength, shuffle } from '@/lib/text';

import type { Activity, ActivityResult, Block, BlockKind, SessionSummary } from './types';

type PracticeKind = 'cloze' | 'listen-choice' | 'dictation' | 'speak' | 'translate' | 'reading';

const PRACTICE_SKILL: Record<PracticeKind, Skill> = {
  cloze: 'grammar',
  'listen-choice': 'listening',
  dictation: 'listening',
  speak: 'speaking',
  translate: 'writing',
  reading: 'reading',
};

export class SessionEngine {
  readonly id = uid('s-');
  readonly unit: Unit;
  readonly level: Cefr;
  readonly blocks: Block[];
  readonly aiReady: boolean;
  readonly targetMinutes: number;

  blockIndex = 0;
  blockElapsed = 0;
  activeSeconds = 0;

  private interests: string[];
  private newWordLimit: number;
  private backlog = 0;
  private newWords: string[] = [];
  private reviewed = 0;
  private results: ActivityResult[] = [];
  private recentCardIds: string[] = [];
  private learnQueue: Activity[] = [];
  private learnPrepared = false;
  private usedDrills = new Set<string>();
  private usedSentences = new Set<string>();
  private aiSentences: Sentence[] = [];
  private reading: ReadingPassage | null = null;
  private readingUsed = false;
  private conversationDone = false;
  private lastPracticeKind: PracticeKind | null = null;
  // Reading track
  private readQueue: Activity[] = [];
  private readPrepared = false;
  private readNew: string[] = [];
  private readSincePractice = 0;
  private usedReadWords = new Set<string>();

  constructor(readonly mode: 'full' | 'review' = 'full') {
    const profile = getProfile();
    this.unit = currentUnit();
    this.level = ratingToCefr(overallRating());
    this.aiReady = isAiReady();
    this.interests = profile?.interests ?? [];
    this.targetMinutes = profile?.sessionMinutes ?? 25;
    // Fewer new words at higher levels where each word is harder to place; single
    // kana characters are quick, so writing-system units introduce more at once.
    const perSession = this.unit.vocab.every((v) => v.pos === 'character' || v.pos === 'phrase')
      ? 15
      : this.level === 'A1'
        ? 10
        : 8;
    this.backlog = dueCount();
    this.newWordLimit = Math.max(2, Math.round((this.targetMinutes / 25) * perSession * this.intake()));
    this.blocks = this.planBlocks();
    run(
      `INSERT INTO sessions (id, started_at, target_minutes, unit_id, status) VALUES (?, ?, ?, ?, 'active')`,
      [this.id, Date.now(), this.mode === 'review' ? 10 : this.targetMinutes, this.unit.id]
    );
  }

  /**
   * How much new material to take on: a growing review backlog means new cards
   * are arriving faster than they're being learned, so slow down until it clears.
   */
  private intake() {
    return this.backlog > 150 ? 0.25 : this.backlog > 80 ? 0.5 : 1;
  }

  /** Divide the session into timed blocks; skip what can't run and give its time to practice. */
  private planBlocks(): Block[] {
    if (this.mode === 'review') {
      return [{ kind: 'review', title: 'Review', budgetSeconds: 10 * 60 }];
    }
    const total = this.targetMinutes * 60;
    const due = dueCount();
    const shares: Record<BlockKind, number> = {
      review: 0.2,
      refresh: 0,
      read: 0,
      learn: 0.25,
      practice: 0.33,
      converse: 0.22,
    };
    if (course().scriptTrack.length) {
      // Learning to read runs alongside speaking: a slice of every session goes to kana, then kanji.
      shares.read = 0.15;
      shares.learn -= 0.05;
      shares.practice -= 0.1;
    }
    const refresh = refreshProgress();
    if (refresh.pending > 0) {
      // Returning learners: win back faded vocabulary fast before new material.
      shares.refresh = refresh.pending > 150 ? 0.22 : 0.15;
      shares.practice -= shares.refresh * 0.6;
      shares.learn -= shares.refresh * 0.4;
    }
    if (due === 0) {
      shares.practice += shares.review;
      shares.review = 0;
    } else if (due > 80) {
      // Catch up on reviews before they pile up further.
      shares.review += 0.1;
      shares.practice -= 0.1;
    } else if (due < 15) {
      const spare = shares.review / 2;
      shares.review -= spare;
      shares.practice += spare;
    }
    if (!this.aiReady) {
      // No AI partner: fold conversation time into speaking-heavy practice.
      shares.practice += shares.converse;
      shares.converse = 0;
    }
    const nextScript = shares.read ? nextScriptItems(1, this.unit.order, scriptKnowledge().introducedIds)[0] : undefined;
    const titles: Record<BlockKind, string> = {
      review: 'Warm-up review',
      refresh: 'Refresh what you know',
      read: nextScript ? `Reading: ${nextScript.group.script}` : 'Reading practice',
      learn: `New: ${this.unit.title}`,
      practice: 'Practice',
      converse: 'Conversation',
    };
    return (['review', 'refresh', 'read', 'learn', 'practice', 'converse'] as const)
      .filter((k) => shares[k] > 0)
      .map((kind) => ({ kind, title: titles[kind], budgetSeconds: Math.round(total * shares[kind]) }));
  }

  get currentBlock(): Block | null {
    return this.blocks[this.blockIndex] ?? null;
  }

  get totalBudget() {
    return this.blocks.reduce((sum, b) => sum + b.budgetSeconds, 0);
  }

  tick(seconds: number) {
    this.activeSeconds += seconds;
    this.blockElapsed += seconds;
  }

  /** Kicks off slow AI generation early so it's ready by the practice block. */
  prefetch() {
    if (!this.aiReady || this.mode === 'review') return;
    const grammar = this.focusGrammar();
    const known = knownVocab(40);
    const pool = known.length ? known : this.unit.vocab;
    if (grammar) {
      generatePracticeSentences({ level: this.level, grammar, words: sample(pool, 12), count: 6, priority: 'background' })
        .then((s) => {
          this.aiSentences.push(...s);
        })
        .catch(() => undefined);
    }
    generateReading({
      level: this.level,
      unit: this.unit,
      words: sample(pool, 8),
      interests: this.interests,
      priority: 'background',
    })
      .then((r) => {
        this.reading = r;
      })
      .catch(() => undefined);
  }

  private focusGrammar(): GrammarPoint | undefined {
    const unseen = this.unit.grammar.find((g) => !grammarMastery(g.id)?.introduced_at);
    if (unseen) return unseen;
    return [...this.unit.grammar].sort(
      (a, b) => (grammarMastery(a.id)?.mastery ?? 0) - (grammarMastery(b.id)?.mastery ?? 0)
    )[0];
  }

  private advanceBlock() {
    const block = this.currentBlock;
    const next = this.blocks[this.blockIndex + 1];
    // A block that runs out of material early hands its spare time to the next one,
    // so the session still adds up to the planned length.
    if (block && next && next.kind !== 'converse') {
      const spare = Math.max(0, block.budgetSeconds - this.blockElapsed);
      block.budgetSeconds -= spare;
      next.budgetSeconds += spare;
    }
    this.blockIndex++;
    this.blockElapsed = 0;
  }

  /** Returns the next activity, or null when the session is over. */
  async next(): Promise<Activity | null> {
    this.maybeAddBonusPractice();
    while (this.currentBlock) {
      const block = this.currentBlock;
      if (this.blockElapsed >= block.budgetSeconds && block.kind !== 'learn') {
        this.advanceBlock();
        continue;
      }
      const activity = await this.nextInBlock(block.kind);
      if (activity) return activity;
      this.advanceBlock();
      this.maybeAddBonusPractice();
    }
    return null;
  }

  private bonusAdded = false;

  /** If everything finished early (e.g. a short conversation), top up with practice. */
  private maybeAddBonusPractice() {
    if (this.mode !== 'full' || this.bonusAdded || this.currentBlock) return;
    const remaining = this.targetMinutes * 60 - this.activeSeconds;
    if (remaining < 120) return;
    this.bonusAdded = true;
    this.blocks.push({ kind: 'practice', title: 'Extra practice', budgetSeconds: Math.round(remaining) });
  }

  endBlockEarly() {
    this.advanceBlock();
  }

  private async nextInBlock(kind: BlockKind): Promise<Activity | null> {
    switch (kind) {
      case 'review':
        return this.nextFlashcard();
      case 'refresh':
        return this.nextRefresh();
      case 'read':
        return this.nextRead();
      case 'learn':
        return this.nextLearn();
      case 'practice':
        return this.nextPractice();
      case 'converse':
        if (this.conversationDone) return null;
        return { kind: 'conversation', scenario: this.unit.scenario, unit: this.unit };
    }
  }

  private nextFlashcard(): Activity | null {
    // Don't show the same card twice in a row even if it's due again in a minute.
    const [card] = dueCards(1, Date.now(), this.recentCardIds.slice(-3));
    if (!card) return null;
    return this.flashcardFor(card);
  }

  private flashcardFor(card: CardRow): Activity | null {
    const resolved = resolveVocab(card.vocab_id);
    if (!resolved) {
      // Orphaned card (content removed); push it far out so it stops surfacing.
      reviewCard(card, 4);
      return this.nextFlashcard();
    }
    return { kind: 'flashcard', card, vocab: resolved.vocab, difficulty: resolved.difficulty };
  }

  private refreshSeen: string[] = [];

  private nextRefresh(): Activity | null {
    // Words marked "don't know" become learning cards; drill them between checks.
    const learning = this.learningCardFor([...this.newWords, ...this.readNew]);
    if (learning && this.results.length % 3 === 0) return learning;
    const [vocabId] = nextRefreshWords(1, this.refreshSeen);
    if (!vocabId) return learning;
    this.refreshSeen.push(vocabId);
    const resolved = resolveVocab(vocabId);
    if (!resolved) {
      markRefreshed(vocabId, true);
      return this.nextRefresh();
    }
    return { kind: 'quick-check', vocab: resolved.vocab, difficulty: resolved.difficulty };
  }

  /** A due card still in its learning steps for one of `vocabIds`, if any. */
  private learningCardFor(vocabIds: string[]): Activity | null {
    if (!vocabIds.length) return null;
    // Just-introduced cards are still 'new'; they need their first drill now, not after the review backlog.
    const [card] = dueLearningCards(vocabIds, Date.now(), this.recentCardIds.slice(-3));
    return card ? this.flashcardFor(card) : null;
  }

  // ---------- Reading track ----------

  private prepareRead() {
    this.readPrepared = true;
    const { introducedIds } = scriptKnowledge();
    const upcoming = nextScriptItems(1, this.unit.order, introducedIds)[0];
    // Kana are quick to pick up; kanji need more attention each.
    const base = (this.targetMinutes / 25) * (upcoming?.group.script === 'kanji' ? 5 : 8);
    const perSession = Math.max(2, Math.round(base * this.intake()));
    const seen = new Set(introducedIds);
    const shown = new Set<string>();
    for (const entry of nextScriptItems(perSession, this.unit.order, introducedIds)) {
      const lesson = lessonBefore(entry, seen, shown);
      if (lesson) {
        shown.add(lesson.id);
        this.readQueue.push({ kind: 'grammar', grammar: lesson, refresher: false, reading: true });
      }
      this.readQueue.push({ kind: 'introduce', vocab: entry.vocab, difficulty: resolveVocab(entry.vocab.id)?.difficulty ?? 10 });
      seen.add(entry.vocab.id);
    }
  }

  private nextRead(): Activity | null {
    if (!this.readPrepared) this.prepareRead();
    const block = this.currentBlock;
    const budget = block?.budgetSeconds ?? 0;
    const learning = this.learningCardFor(this.readNew);
    if (learning && this.results.length % 2 === 0) return learning;
    // Read real words after every few new characters, so each one is used right away.
    if (this.readSincePractice >= 3) {
      this.readSincePractice = 0;
      const practice = this.readPractice();
      if (practice) return practice;
    }
    if (this.readQueue.length && this.blockElapsed < budget + 60) {
      const next = this.readQueue.shift()!;
      if (next.kind === 'introduce') this.readSincePractice++;
      return next;
    }
    if (learning) return learning;
    return this.blockElapsed < budget ? this.readPractice() : null;
  }

  private readPractice(): Activity | null {
    const knowledge = scriptKnowledge();
    // Prefer real words; the fill-in-the-kana drills cover the early days when few words are readable.
    const wordFirst = Math.random() < 0.65;
    const first = wordFirst ? this.readWordActivity(knowledge) : this.readingDrill(knowledge);
    return first ?? (wordFirst ? this.readingDrill(knowledge) : this.readWordActivity(knowledge));
  }

  /** A word from the spoken course the learner can now read: everything in it is a character they've met. */
  private readWordActivity(knowledge: ScriptKnowledge): Activity | null {
    const words = courseUnits()
      .filter((u) => u.order <= this.unit.order + 1)
      .flatMap((u) => u.vocab)
      .filter((v) => v.pos !== 'character');
    const readable = words.filter(
      (v) => !this.usedReadWords.has(v.id) && [...stripPunctuation(v.text)].every((c) => knowledge.readable.has(c))
    );
    if (!readable.length) return null;
    const fresh = new Set(this.readNew.map((id) => getScriptEntry(id)?.vocab.text ?? ''));
    const featuring = readable.filter((v) => [...v.text].some((c) => fresh.has(c)));
    const vocab = pick(featuring.length ? featuring : readable);
    this.usedReadWords.add(vocab.id);
    const askMeaning = hasKanji(vocab.text) ? Math.random() < 0.5 : Math.random() < 0.3;
    const ask = askMeaning ? 'meaning' : 'sound';
    const answerOf = (v: VocabItem) => (ask === 'meaning' ? v.en : romajiFor(v.reading ?? v.text));
    const answer = answerOf(vocab);
    const others = [...new Set(words.filter((v) => v.id !== vocab.id).map(answerOf))].filter((o) => o !== answer);
    // Sounds of similar length make the choice about reading, not guessing by size.
    const distractors =
      ask === 'sound'
        ? sample(others.sort((a, b) => Math.abs(a.length - answer.length) - Math.abs(b.length - answer.length)).slice(0, 8), 3)
        : sample(others, 3);
    if (distractors.length < 2) return null;
    const options = shuffle([answer, ...distractors]);
    return { kind: 'read-word', vocab, ask, options, answerIndex: options.indexOf(answer) };
  }

  /** A fill-in drill from a writing-system lesson the learner has seen, whose answer they've met. */
  private readingDrill(knowledge: ScriptKnowledge): Activity | null {
    const candidates = seenLessons().flatMap((lesson) =>
      lesson.drills
        .filter((d) => !this.usedDrills.has(d.text) && [...d.answer].every((c) => knowledge.readable.has(c)))
        .map((drill) => ({ drill, lesson }))
    );
    if (!candidates.length) return null;
    const { drill, lesson } = pick(candidates);
    this.usedDrills.add(drill.text);
    return clozeActivity(drill, lesson.id, 'reading');
  }

  private prepareLearnQueue() {
    this.learnPrepared = true;
    const grammar = this.focusGrammar();
    const queue: Activity[] = [];
    if (grammar) {
      const refresher = !!grammarMastery(grammar.id)?.introduced_at;
      queue.push({ kind: 'grammar', grammar, refresher });
    }
    const fresh = this.unit.vocab.filter((v) => !isIntroduced(v.id)).slice(0, this.newWordLimit);
    const difficulty = unitDifficulty(this.unit);
    // Introduce words in small batches, then drill them, so each batch sticks before the next.
    for (let i = 0; i < fresh.length; i += 3) {
      for (const vocab of fresh.slice(i, i + 3)) queue.push({ kind: 'introduce', vocab, difficulty });
      if (grammar) {
        const drill = this.unusedDrill(grammar);
        if (drill) queue.push(drill);
      }
    }
    this.learnQueue = queue;
  }

  private nextLearn(): Activity | null {
    if (!this.learnPrepared) this.prepareLearnQueue();
    const block = this.currentBlock;
    const overBudget = block ? this.blockElapsed >= block.budgetSeconds + 120 : true;
    // Interleave learning-step flashcards for words just introduced.
    const learning = this.learningCardFor(this.newWords);
    if (learning && (this.results.length % 2 === 0 || !this.learnQueue.length)) {
      return learning;
    }
    if (overBudget) return null;
    return this.learnQueue.shift() ?? null;
  }

  private unusedDrill(grammar: GrammarPoint): Activity | null {
    const drills = grammar.drills.filter((d) => !this.usedDrills.has(d.text));
    if (!drills.length) return null;
    const drill = pick(drills);
    this.usedDrills.add(drill.text);
    return clozeActivity(drill, grammar.id);
  }

  private sentencePool(): Sentence[] {
    const pool: Sentence[] = [...this.aiSentences];
    for (const g of this.unit.grammar) pool.push(...g.examples);
    for (const v of this.unit.vocab) if (isIntroduced(v.id)) pool.push(v.example);
    for (const v of knownVocab(30)) pool.push(v.example);
    return pool.filter((s) => s.text && s.en);
  }

  private freshSentence(filter: (s: Sentence) => boolean = () => true): Sentence | null {
    const pool = this.sentencePool().filter(filter);
    const unused = pool.filter((s) => !this.usedSentences.has(s.text));
    const choice = unused.length ? pick(unused) : pool.length ? pick(pool) : null;
    if (choice) this.usedSentences.add(choice.text);
    return choice;
  }

  private practiceWeights(): Record<PracticeKind, number> {
    const weights: Record<PracticeKind, number> = {
      cloze: 3,
      'listen-choice': 2,
      dictation: 2,
      speak: this.aiReady ? 3 : 5,
      translate: 3,
      reading: this.reading && !this.readingUsed ? 4 : 0,
    };
    for (const skill of weakestSkills(2)) {
      for (const k of Object.keys(weights) as PracticeKind[]) {
        if (PRACTICE_SKILL[k] === skill && weights[k] > 0) weights[k] *= 1.8;
      }
    }
    if (this.lastPracticeKind) weights[this.lastPracticeKind] *= 0.3;
    return weights;
  }

  private nextPractice(): Activity | null {
    // A few due cards sprinkled in keeps the review queue from piling up between sessions.
    if (this.results.length % 5 === 4) {
      const card = this.nextFlashcard();
      if (card) return card;
    }
    const weights = this.practiceWeights();
    const entries = Object.entries(weights) as [PracticeKind, number][];
    for (let attempt = 0; attempt < 6; attempt++) {
      const total = entries.reduce((s, [, w]) => s + w, 0);
      let r = Math.random() * total;
      let kind: PracticeKind = 'cloze';
      for (const [k, w] of entries) {
        r -= w;
        if (r <= 0) {
          kind = k;
          break;
        }
      }
      const activity = this.buildPractice(kind);
      if (activity) {
        this.lastPracticeKind = kind;
        return activity;
      }
    }
    return null;
  }

  private buildPractice(kind: PracticeKind): Activity | null {
    switch (kind) {
      case 'cloze': {
        // 70% current unit, 30% spaced review of earlier grammar.
        const statuses = unitStatuses();
        const earlier = courseUnits().filter(
          (u) => u.order < this.unit.order && (statuses[u.id] === 'done' || statuses[u.id] === 'skipped')
        );
        const source = earlier.length && Math.random() < 0.3 ? pick(earlier) : this.unit;
        const grammar = pick(source.grammar);
        return grammar ? this.unusedDrill(grammar) : null;
      }
      case 'listen-choice': {
        const sentence = this.freshSentence((s) => sentenceLength(s) <= 14);
        if (!sentence) return null;
        const others = shuffle(this.sentencePool().filter((s) => s.en !== sentence.en)).slice(0, 3);
        if (others.length < 2) return null;
        const options = shuffle([sentence.en, ...others.map((o) => o.en)]);
        return { kind: 'listen-choice', sentence, options, answerIndex: options.indexOf(sentence.en) };
      }
      case 'dictation': {
        const sentence = this.freshSentence((s) => sentenceLength(s) <= 8);
        return sentence ? { kind: 'dictation', sentence } : null;
      }
      case 'speak': {
        const sentence = this.freshSentence((s) => sentenceLength(s) <= 12);
        if (!sentence) return null;
        const produce = this.level !== 'A1' && Math.random() < 0.4;
        return { kind: 'speak', sentence, mode: produce ? 'produce' : 'repeat' };
      }
      case 'translate': {
        const sentence = this.freshSentence((s) => sentenceLength(s) <= 12);
        return sentence ? { kind: 'translate', sentence } : null;
      }
      case 'reading': {
        if (!this.reading || this.readingUsed) return null;
        this.readingUsed = true;
        return { kind: 'reading', passage: this.reading };
      }
    }
  }

  /** Persist the outcome of an activity and update the learner model. */
  complete(activity: Activity, result: ActivityResult, grade?: Grade) {
    this.results.push(result);
    const difficulty = activityDifficulty(activity, this.unit);

    if (activity.kind === 'flashcard') {
      this.recentCardIds.push(activity.card.id);
      reviewCard(activity.card, grade ?? (result.score >= 0.7 ? 3 : 1));
      this.reviewed++;
    }
    // Reading-track characters are tracked apart from words (summary, learning-card pools).
    const learned = (id: string) => (isScriptItem(id) ? this.readNew : this.newWords).push(id);
    if (activity.kind === 'introduce') {
      introduceVocab(activity.vocab.id);
      learned(activity.vocab.id);
    }
    if (activity.kind === 'quick-check') {
      const known = result.score >= 0.5;
      markRefreshed(activity.vocab.id, known);
      if (known) {
        markKnownVocab(activity.vocab.id);
      } else {
        introduceVocab(activity.vocab.id);
        learned(activity.vocab.id);
      }
    }
    if (activity.kind === 'grammar') {
      markGrammarIntroduced(activity.grammar.id);
    }
    if (activity.kind === 'conversation') {
      this.conversationDone = true;
      recordConversation(this.unit.id);
    }

    if (!result.noAttempt) {
      recordAttempt({
        sessionId: this.id,
        kind: activity.kind,
        skill: result.skill,
        ref: result.ref,
        score: result.score,
        difficulty,
        prompt: result.prompt,
        expected: result.expected,
        response: result.response,
        feedback: result.feedback,
      });
    }
  }

  finish(homeworkIds: string[] = []): SessionSummary {
    const advanced = this.mode === 'full' ? maybeAdvanceUnit(this.unit, this.aiReady) : null;
    const scored = this.results.filter((r) => !r.noAttempt);
    const skills: SessionSummary['skills'] = {};
    for (const r of scored) {
      const s = (skills[r.skill] ??= { count: 0, avg: 0 });
      s.avg = (s.avg * s.count + r.score) / (s.count + 1);
      s.count++;
    }
    const summary: SessionSummary = {
      activeSeconds: Math.round(this.activeSeconds),
      activities: scored.length,
      averageScore: scored.length ? scored.reduce((s, r) => s + r.score, 0) / scored.length : 0,
      newWords: this.newWords,
      newCharacters: this.readNew.map((id) => getScriptEntry(id)?.vocab.text ?? '').filter(Boolean),
      reviewed: this.reviewed,
      skills,
      unitAdvancedTo: advanced?.id ?? null,
      homeworkIds,
    };
    run(
      `UPDATE sessions SET ended_at = ?, active_seconds = ?, status = 'done', summary = ? WHERE id = ?`,
      [Date.now(), summary.activeSeconds, JSON.stringify(summary), this.id]
    );
    return summary;
  }

  /** Leaving mid-session still counts the time and progress already made. */
  abandon() {
    if (this.activeSeconds < 60) {
      run(`DELETE FROM sessions WHERE id = ?`, [this.id]);
      return;
    }
    this.finish();
  }
}

function clozeActivity(drill: ClozeDrill, grammarId: string, skill?: Skill): Activity {
  const options = shuffle([drill.answer, ...drill.distractors.slice(0, 3)]);
  return { kind: 'cloze', drill, grammarId, options, skill };
}

function activityDifficulty(activity: Activity, unit: Unit) {
  if (activity.kind === 'flashcard' || activity.kind === 'introduce' || activity.kind === 'quick-check') {
    return activity.difficulty;
  }
  if (activity.kind === 'read-word') return resolveVocab(activity.vocab.id)?.difficulty ?? unitDifficulty(unit);
  if (activity.kind === 'cloze') {
    const owner = courseUnits().find((u) => u.grammar.some((g) => g.id === activity.grammarId));
    return unitDifficulty(owner ?? unit);
  }
  const base = unitDifficulty(unit);
  // Producing the language is harder than recognizing it.
  if (activity.kind === 'speak' && activity.mode === 'produce') return base + 15;
  if (activity.kind === 'translate' || activity.kind === 'conversation') return base + 10;
  return base;
}
