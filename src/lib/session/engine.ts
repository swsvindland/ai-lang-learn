import { generatePracticeSentences, generateReading, type ReadingPassage } from '@/lib/ai/tutor';
import { isAiReady } from '@/lib/ai/llm';
import {
  dueCards,
  dueCount,
  introduceVocab,
  isIntroduced,
  knownVocab,
  markKnownVocab,
  resolveVocab,
  reviewCard,
  type CardRow,
} from '@/lib/cards';
import {
  ratingToCefr,
  unitDifficulty,
  units,
  type Cefr,
  type ClozeDrill,
  type GrammarPoint,
  type Sentence,
  type Unit,
} from '@/lib/curriculum';
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
import type { Grade } from '@/lib/srs';
import { pick, sample, shuffle, words } from '@/lib/text';

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

  constructor(readonly mode: 'full' | 'review' = 'full') {
    const profile = getProfile();
    this.unit = currentUnit();
    this.level = ratingToCefr(overallRating());
    this.aiReady = isAiReady();
    this.interests = profile?.interests ?? [];
    this.targetMinutes = profile?.sessionMinutes ?? 25;
    // Fewer new words at higher levels where each word is harder to place.
    this.newWordLimit = Math.max(6, Math.round((this.targetMinutes / 25) * (this.level === 'A1' ? 10 : 8)));
    this.blocks = this.planBlocks();
    run(
      `INSERT INTO sessions (id, started_at, target_minutes, unit_id, status) VALUES (?, ?, ?, ?, 'active')`,
      [this.id, Date.now(), this.mode === 'review' ? 10 : this.targetMinutes, this.unit.id]
    );
  }

  /** Divide the session into timed blocks; skip what can't run and give its time to practice. */
  private planBlocks(): Block[] {
    if (this.mode === 'review') {
      return [{ kind: 'review', title: 'Review', budgetSeconds: 10 * 60 }];
    }
    const total = this.targetMinutes * 60;
    const due = dueCount();
    const shares: Record<BlockKind, number> = { review: 0.2, refresh: 0, learn: 0.25, practice: 0.33, converse: 0.22 };
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
    const titles: Record<BlockKind, string> = {
      review: 'Warm-up review',
      refresh: 'Refresh what you know',
      learn: `New: ${this.unit.title}`,
      practice: 'Practice',
      converse: 'Conversation',
    };
    return (['review', 'refresh', 'learn', 'practice', 'converse'] as const)
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
    const learning = this.learningCardFor(this.newWords);
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

  /** A due learning-step card for one of `vocabIds`, if any. */
  private learningCardFor(vocabIds: string[]): Activity | null {
    if (!vocabIds.length) return null;
    const [card] = dueCards(30, Date.now(), this.recentCardIds.slice(-3)).filter(
      (c) => (c.state === 'learning' || c.state === 'relearning') && vocabIds.includes(c.vocab_id)
    );
    return card ? this.flashcardFor(card) : null;
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
    const drills = grammar.drills.filter((d) => !this.usedDrills.has(d.es));
    if (!drills.length) return null;
    const drill = pick(drills);
    this.usedDrills.add(drill.es);
    return clozeActivity(drill, grammar.id);
  }

  private sentencePool(): Sentence[] {
    const pool: Sentence[] = [...this.aiSentences];
    for (const g of this.unit.grammar) pool.push(...g.examples);
    for (const v of this.unit.vocab) if (isIntroduced(v.id)) pool.push(v.example);
    for (const v of knownVocab(30)) pool.push(v.example);
    return pool.filter((s) => s.es && s.en);
  }

  private freshSentence(filter: (s: Sentence) => boolean = () => true): Sentence | null {
    const pool = this.sentencePool().filter(filter);
    const unused = pool.filter((s) => !this.usedSentences.has(s.es));
    const choice = unused.length ? pick(unused) : pool.length ? pick(pool) : null;
    if (choice) this.usedSentences.add(choice.es);
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
        const earlier = units.filter(
          (u) => u.order < this.unit.order && (statuses[u.id] === 'done' || statuses[u.id] === 'skipped')
        );
        const source = earlier.length && Math.random() < 0.3 ? pick(earlier) : this.unit;
        const grammar = pick(source.grammar);
        return grammar ? this.unusedDrill(grammar) : null;
      }
      case 'listen-choice': {
        const sentence = this.freshSentence((s) => words(s.es).length <= 14);
        if (!sentence) return null;
        const others = shuffle(this.sentencePool().filter((s) => s.en !== sentence.en)).slice(0, 3);
        if (others.length < 2) return null;
        const options = shuffle([sentence.en, ...others.map((o) => o.en)]);
        return { kind: 'listen-choice', sentence, options, answerIndex: options.indexOf(sentence.en) };
      }
      case 'dictation': {
        const sentence = this.freshSentence((s) => words(s.es).length <= 8);
        return sentence ? { kind: 'dictation', sentence } : null;
      }
      case 'speak': {
        const sentence = this.freshSentence((s) => words(s.es).length <= 12);
        if (!sentence) return null;
        const produce = this.level !== 'A1' && Math.random() < 0.4;
        return { kind: 'speak', sentence, mode: produce ? 'produce' : 'repeat' };
      }
      case 'translate': {
        const sentence = this.freshSentence((s) => words(s.es).length <= 12);
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
    if (activity.kind === 'introduce') {
      introduceVocab(activity.vocab.id);
      this.newWords.push(activity.vocab.id);
    }
    if (activity.kind === 'quick-check') {
      const known = result.score >= 0.5;
      markRefreshed(activity.vocab.id, known);
      if (known) {
        markKnownVocab(activity.vocab.id);
      } else {
        introduceVocab(activity.vocab.id);
        this.newWords.push(activity.vocab.id);
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

function clozeActivity(drill: ClozeDrill, grammarId: string): Activity {
  const options = shuffle([drill.answer, ...drill.distractors.slice(0, 3)]);
  return { kind: 'cloze', drill, grammarId, options };
}

function activityDifficulty(activity: Activity, unit: Unit) {
  if (activity.kind === 'flashcard' || activity.kind === 'introduce' || activity.kind === 'quick-check') {
    return activity.difficulty;
  }
  if (activity.kind === 'cloze') {
    const owner = units.find((u) => u.grammar.some((g) => g.id === activity.grammarId));
    return unitDifficulty(owner ?? unit);
  }
  const base = unitDifficulty(unit);
  // Producing Spanish is harder than recognizing it.
  if (activity.kind === 'speak' && activity.mode === 'produce') return base + 15;
  if (activity.kind === 'translate' || activity.kind === 'conversation') return base + 10;
  return base;
}
