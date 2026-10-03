import type { CourseContent } from '../types';

import { mediaCatalog } from './media';
import { placementItems } from './placement';
import { unitsA } from './units-a';
import { unitsB } from './units-b';
import { unitsC } from './units-c';

export const spanishCourse: CourseContent = {
  units: [...unitsA, ...unitsB, ...unitsC],
  placementItems,
  mediaCatalog,
};
