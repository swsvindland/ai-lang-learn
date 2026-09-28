/**
 * SM-2 style scheduler with short learning steps. Sessions happen only a few
 * times a week, so learning steps are minutes (within a session) and review
 * intervals are days; overdue cards are simply reviewed next session.
 */

export type CardState = 'new' | 'learning' | 'review' | 'relearning';
export type Grade = 1 | 2 | 3 | 4; // again, hard, good, easy

export type SrsCard = {
  state: CardState;
  due: number;
  interval_days: number;
  ease: number;
  step: number;
  reps: number;
  lapses: number;
  last_review: number | null;
};

const MINUTE = 60_000;
const DAY = 86_400_000;
const LEARNING_STEPS_MIN = [1, 8];
const RELEARNING_STEPS_MIN = [5];
const GRADUATING_DAYS = 2;
const EASY_DAYS = 4;
const MIN_EASE = 1.3;
const MAX_INTERVAL_DAYS = 365;

export function newCard(now = Date.now()): SrsCard {
  return { state: 'new', due: now, interval_days: 0, ease: 2.5, step: 0, reps: 0, lapses: 0, last_review: null };
}

export function schedule(card: SrsCard, grade: Grade, now = Date.now()): SrsCard {
  const next: SrsCard = { ...card, reps: card.reps + 1, last_review: now };

  if (card.state === 'new' || card.state === 'learning' || card.state === 'relearning') {
    const steps = card.state === 'relearning' ? RELEARNING_STEPS_MIN : LEARNING_STEPS_MIN;
    const baseState: CardState = card.state === 'new' ? 'learning' : card.state;
    if (grade === 1) {
      return { ...next, state: baseState, step: 0, due: now + steps[0] * MINUTE };
    }
    if (grade === 4) {
      const days = card.state === 'relearning' ? Math.max(1, card.interval_days) : EASY_DAYS;
      return { ...next, state: 'review', step: 0, interval_days: days, due: now + days * DAY };
    }
    const stepIndex = grade === 2 ? card.step : card.step + 1;
    if (stepIndex < steps.length) {
      return { ...next, state: baseState, step: stepIndex, due: now + steps[stepIndex] * MINUTE };
    }
    const days = card.state === 'relearning' ? Math.max(1, card.interval_days) : GRADUATING_DAYS;
    return { ...next, state: 'review', step: 0, interval_days: days, due: now + days * DAY };
  }

  // Review card. Credit learners for how overdue the card was when they still knew it.
  const elapsedDays = card.last_review ? Math.max(0, (now - card.last_review) / DAY) : card.interval_days;
  const effective = Math.max(card.interval_days, elapsedDays);

  if (grade === 1) {
    return {
      ...next,
      state: 'relearning',
      step: 0,
      lapses: card.lapses + 1,
      ease: Math.max(MIN_EASE, card.ease - 0.2),
      interval_days: Math.max(1, card.interval_days * 0.3),
      due: now + RELEARNING_STEPS_MIN[0] * MINUTE,
    };
  }

  let ease = card.ease;
  let interval: number;
  if (grade === 2) {
    ease = Math.max(MIN_EASE, ease - 0.15);
    interval = Math.max(card.interval_days + 1, effective * 1.2);
  } else if (grade === 3) {
    interval = Math.max(card.interval_days + 1, effective * ease);
  } else {
    ease = ease + 0.15;
    interval = Math.max(card.interval_days + 2, effective * ease * 1.3);
  }
  interval = Math.min(MAX_INTERVAL_DAYS, interval);
  return { ...next, state: 'review', ease, interval_days: interval, due: now + interval * DAY };
}

/** Rough "is this word known" signal used for unit completion and level estimates. */
export function isLearned(card: Pick<SrsCard, 'state' | 'interval_days'>) {
  return card.state === 'review' && card.interval_days >= 2;
}

/** Map a 0..1 score from an exercise onto a grade, for auto-graded vocab exposures. */
export function gradeFromScore(score: number): Grade {
  if (score >= 0.95) return 3;
  if (score >= 0.7) return 2;
  return 1;
}
