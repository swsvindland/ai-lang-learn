import type { CourseContent, KanjiEntry } from '../types';

import kanji from './kanji.json';
import { mediaCatalog } from './media';
import { placementItems } from './placement';
import { kanaGroups } from './script-kana';
import { unitsIntro } from './units-intro';
import { unitsN2N1 } from './units-n2n1';
import { unitsN3 } from './units-n3';
import { unitsN4a } from './units-n4a';
import { unitsN4b } from './units-n4b';
import { unitsN5a } from './units-n5a';
import { unitsN5b } from './units-n5b';

export const japaneseCourse: CourseContent = {
  units: [...unitsIntro, ...unitsN5a, ...unitsN5b, ...unitsN4a, ...unitsN4b, ...unitsN3, ...unitsN2N1],
  placementItems,
  mediaCatalog,
  script: { kana: kanaGroups, kanji: kanji as KanjiEntry[] },
};
