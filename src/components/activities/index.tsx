import type { Cefr } from '@/lib/curriculum';
import type { Grade } from '@/lib/srs';
import type { Activity, ActivityResult } from '@/lib/session/types';

import { ClozeActivity, ListenChoiceActivity } from './choice';
import { ConversationActivity } from './conversation';
import { FlashcardActivity, IntroduceActivity } from './flashcard';
import { GrammarActivity } from './grammar';
import { QuickCheckActivity } from './quick-check';
import { ReadingActivity } from './reading';
import { SpeakActivity } from './speak';
import { DictationActivity, TranslateActivity } from './typing';

export function ActivityView(props: {
  activity: Activity;
  level: Cefr;
  aiReady: boolean;
  onDone: (result: ActivityResult, grade?: Grade) => void;
}) {
  const { activity, ...rest } = props;
  switch (activity.kind) {
    case 'flashcard':
      return <FlashcardActivity activity={activity} {...rest} />;
    case 'introduce':
      return <IntroduceActivity activity={activity} {...rest} />;
    case 'quick-check':
      return <QuickCheckActivity activity={activity} {...rest} />;
    case 'grammar':
      return <GrammarActivity activity={activity} {...rest} />;
    case 'cloze':
      return <ClozeActivity activity={activity} {...rest} />;
    case 'listen-choice':
      return <ListenChoiceActivity activity={activity} {...rest} />;
    case 'dictation':
      return <DictationActivity activity={activity} {...rest} />;
    case 'speak':
      return <SpeakActivity activity={activity} {...rest} />;
    case 'translate':
      return <TranslateActivity activity={activity} {...rest} />;
    case 'reading':
      return <ReadingActivity activity={activity} {...rest} />;
    case 'conversation':
      return <ConversationActivity activity={activity} {...rest} />;
    default:
      // Compile-time check that every activity kind has a view.
      return ((unhandled: never) => unhandled)(activity);
  }
}
