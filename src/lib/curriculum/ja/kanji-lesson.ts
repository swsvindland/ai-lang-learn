import type { GrammarPoint } from '../types';

/** Opens the kanji part of the reading track, once the learner has met every kana. */
export const kanjiLesson: GrammarPoint = {
  id: 'g-ja-kanji-1',
  title: 'How kanji work',
  summary:
    "Kanji are characters that carry meaning: 山 (やま, yama) is 'mountain', 日 (ひ / にち) is 'sun' or 'day'. Most kanji have two kinds of reading. Kun'yomi are native Japanese words and are usually used when the kanji stands alone or with hiragana endings, like 山 (やま) or 食べる (たべる, taberu, to eat). On'yomi come from Chinese and are usually used in compounds of two or more kanji, like 日本 (にほん, nihon, Japan). Dictionaries write on'yomi in katakana (ニチ) and kun'yomi in hiragana (ひ). The hiragana after a kanji, like べる in 食べる, is called okurigana and shows the conjugation. You'll learn each kanji with its meaning and its most common readings, then meet it in words you already know how to say. Furigana and romaji fade out for each kanji once you know it.",
  examples: [
    { text: '山', reading: 'やま', en: 'mountain' },
    { text: '日本', reading: 'にほん', en: 'Japan' },
    { text: '日曜日', reading: 'にちようび', en: 'Sunday' },
    { text: '食べる', reading: 'たべる', en: 'to eat' },
    { text: '一人', reading: 'ひとり', en: 'one person; alone' },
  ],
  drills: [
    { text: '___本', reading: '___ほん', en: 'nihon — Japan', answer: '日', distractors: ['月', '目', '白'] },
    { text: '___べる', reading: '___べる', en: 'taberu — to eat', answer: '食', distractors: ['飲', '見', '行'] },
    { text: '___人', reading: '___り', en: 'hitori — one person', answer: '一', distractors: ['二', '三', '十'] },
  ],
};
