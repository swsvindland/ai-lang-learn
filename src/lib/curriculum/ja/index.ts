import type { CourseContent } from '../types';

import { mediaCatalog } from './media';
import { placementItems } from './placement';
import { unitsKana } from './units-kana';
import { unitsN2N1 } from './units-n2n1';
import { unitsN3 } from './units-n3';
import { unitsN4a } from './units-n4a';
import { unitsN4b } from './units-n4b';
import { unitsN5a } from './units-n5a';
import { unitsN5b } from './units-n5b';

export const japaneseCourse: CourseContent = {
  units: [...unitsKana, ...unitsN5a, ...unitsN5b, ...unitsN4a, ...unitsN4b, ...unitsN3, ...unitsN2N1],
  placementItems,
  mediaCatalog,
};
