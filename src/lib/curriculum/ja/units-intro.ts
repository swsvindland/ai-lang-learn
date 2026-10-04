import type { Unit } from '../types';

/**
 * Japanese unit 1: spoken Japanese from the first session. Learners hear, say
 * and type (romaji is fine) these phrases while the reading track teaches kana
 * alongside, so they never have to finish an alphabet before speaking.
 */
export const unitsIntro: Unit[] = [
  {
    id: 'ja-n5-00',
    cefr: 'A1',
    order: 1,
    title: 'こんにちは: Greetings and first words',
    theme: 'Greeting people, thanking, apologizing, and everyday set phrases',
    canDo: [
      'I can greet people at different times of day, politely and casually.',
      'I can say thank you, sorry, and excuse me.',
      'I can use the set phrases for meeting someone, meals, leaving home, and coming back.',
    ],
    grammar: [
      {
        id: 'g-ja-n5-00-1',
        title: 'Greetings by time of day, polite and casual',
        summary:
          "Japanese greetings change with the time of day and with who you're talking to. In the morning say おはようございます (ohayou gozaimasu); with friends and family the short おはよう (ohayou) is fine. From late morning to early evening say こんにちは (konnichiwa), and after dark こんばんは (konbanwa). The final は in こんにちは and こんばんは is read wa, because it was originally the particle は. Adding ございます (gozaimasu) makes a phrase polite: use the polite form with strangers, shop staff, teachers, and anyone older or senior. Pitfall: people don't say こんにちは to their own family or to coworkers they see every day; it sounds oddly formal.",
        examples: [
          { text: 'おはようございます。', reading: 'おはよう ございます。', en: 'Good morning. (polite)' },
          { text: 'おはよう、ゆきちゃん。', reading: 'おはよう、 ゆき ちゃん。', en: 'Morning, Yuki.' },
          { text: 'こんにちは、たなかさん。', reading: 'こんにちは、 たなか さん。', en: 'Hello, Mr. Tanaka.' },
          { text: 'こんばんは。さむいですね。', reading: 'こんばんは。 さむい です ね。', en: "Good evening. It's cold, isn't it?" },
          { text: 'さようなら、せんせい。', reading: 'さようなら、 せんせい。', en: 'Goodbye, teacher.' },
        ],
        drills: [
          { text: '___ございます。', reading: '___ ございます。', en: 'Good morning. (polite, at 8 a.m.)', answer: 'おはよう', distractors: ['こんばんは', 'こんにちは'] },
          { text: 'みなさん、___。', reading: 'みなさん、 ___。', en: 'Good evening, everyone. (at 7 p.m.)', answer: 'こんばんは', distractors: ['おはよう', 'いただきます'] },
          { text: '___、やまださん。', reading: '___、 やまだ さん。', en: 'Hello, Ms. Yamada. (at 2 p.m.)', answer: 'こんにちは', distractors: ['おはよう', 'こんばんは'] },
          { text: 'おやすみ___。', reading: 'おやすみ___。', en: 'Good night. (polite, going to bed)', answer: 'なさい', distractors: ['ございます', 'です'] },
          { text: 'みなさん、___。またあした。', reading: 'みなさん、 ___。 また あした。', en: 'Goodbye, everyone. See you tomorrow.', answer: 'さようなら', distractors: ['こんばんは', 'いただきます'] },
        ],
      },
      {
        id: 'g-ja-n5-00-2',
        title: 'Thank you, sorry, and everyday set phrases',
        summary:
          "Some phrases are used so often that it's easiest to learn them as whole chunks. ありがとうございます (arigatou gozaimasu) is a polite 'thank you'; ありがとう (arigatou) is casual. すみません (sumimasen) means 'excuse me' when you want someone's attention and 'sorry' for small things; it can also be a humble 'thank you' when someone goes out of their way for you. はじめまして (hajimemashite) opens a first meeting and よろしくおねがいします (yoroshiku onegaishimasu) closes it, roughly 'I look forward to getting to know you.' Before eating say いただきます (itadakimasu), and after the meal ごちそうさまでした (gochisousama deshita). Leaving home is いってきます (ittekimasu), and coming back is ただいま (tadaima).",
        examples: [
          { text: 'ありがとうございます。', reading: 'ありがとう ございます。', en: 'Thank you very much.' },
          { text: 'すみません、トイレはどこですか。', reading: 'すみません、 トイレ は どこ です か。', en: 'Excuse me, where is the restroom?' },
          { text: 'はじめまして。ケンです。よろしくおねがいします。', reading: 'はじめまして。 ケン です。 よろしく おねがいします。', en: "Nice to meet you. I'm Ken. Pleased to meet you." },
          { text: 'いただきます！', reading: 'いただきます！', en: "Let's eat! (said before a meal)" },
          { text: '「ただいま。」「おかえりなさい。」', reading: '「ただいま。」 「おかえりなさい。」', en: '"I\'m home." "Welcome back."' },
        ],
        drills: [
          { text: 'ありがとう___。', reading: 'ありがとう ___。', en: 'Thank you very much. (polite)', answer: 'ございます', distractors: ['です', 'なさい'] },
          { text: '___、えきはどこですか。', reading: '___、 えき は どこ です か。', en: 'Excuse me, where is the station?', answer: 'すみません', distractors: ['ありがとう', 'いただきます'] },
          { text: 'リサです。よろしく___。', reading: 'リサ です。 よろしく ___。', en: "I'm Lisa. Pleased to meet you.", answer: 'おねがいします', distractors: ['ございます', 'ごちそうさま'] },
          { text: '___でした。', reading: '___ でした。', en: 'Thank you for the meal. (after eating)', answer: 'ごちそうさま', distractors: ['いただきます', 'おはよう'] },
          { text: '「___！」「おかえりなさい。」', reading: '「___！」 「おかえりなさい。」', en: '"I\'m home!" "Welcome back."', answer: 'ただいま', distractors: ['いってきます', 'いただきます'] },
        ],
      },
    ],
    vocab: [
      { id: 'v-ja-n5-00-01', text: 'おはようございます', reading: 'おはよう ございます', en: 'good morning (polite)', pos: 'phrase', example: { text: 'せんせい、おはようございます。', reading: 'せんせい、 おはよう ございます。', en: 'Good morning, teacher.' } },
      { id: 'v-ja-n5-00-02', text: 'おはよう', en: 'good morning (casual)', pos: 'phrase', example: { text: 'おはよう！げんき？', reading: 'おはよう！ げんき？', en: 'Morning! How are you?' } },
      { id: 'v-ja-n5-00-03', text: 'こんにちは', en: 'hello; good afternoon', pos: 'phrase', example: { text: 'こんにちは、たなかさん。', reading: 'こんにちは、 たなか さん。', en: 'Hello, Mr. Tanaka.' } },
      { id: 'v-ja-n5-00-04', text: 'こんばんは', en: 'good evening', pos: 'phrase', example: { text: 'こんばんは。いいよるですね。', reading: 'こんばんは。 いい よる です ね。', en: "Good evening. Nice night, isn't it?" } },
      { id: 'v-ja-n5-00-05', text: 'さようなら', en: 'goodbye', pos: 'phrase', example: { text: 'せんせい、さようなら。', reading: 'せんせい、 さようなら。', en: 'Goodbye, teacher.' } },
      { id: 'v-ja-n5-00-06', text: 'おやすみなさい', reading: 'おやすみなさい', en: 'good night (going to bed)', pos: 'phrase', example: { text: 'おやすみなさい。またあした。', reading: 'おやすみなさい。 また あした。', en: 'Good night. See you tomorrow.' } },
      { id: 'v-ja-n5-00-07', text: 'ありがとうございます', reading: 'ありがとう ございます', en: 'thank you (polite)', pos: 'phrase', example: { text: 'どうもありがとうございます。', reading: 'どうも ありがとう ございます。', en: 'Thank you very much.' } },
      { id: 'v-ja-n5-00-08', text: 'ありがとう', en: 'thanks (casual)', pos: 'phrase', example: { text: 'ありがとう、ケンさん。', reading: 'ありがとう、 ケン さん。', en: 'Thanks, Ken.' } },
      { id: 'v-ja-n5-00-09', text: 'すみません', en: 'excuse me; sorry', pos: 'phrase', example: { text: 'すみません、ここ、いいですか。', reading: 'すみません、 ここ、 いい です か。', en: 'Excuse me, is this seat free?' } },
      { id: 'v-ja-n5-00-10', text: 'はじめまして', reading: 'はじめまして', en: 'nice to meet you (first meeting)', pos: 'phrase', example: { text: 'はじめまして、すずきです。', reading: 'はじめまして、 すずき です。', en: "Nice to meet you. I'm Suzuki." } },
      { id: 'v-ja-n5-00-11', text: 'よろしくおねがいします', reading: 'よろしく おねがいします', en: 'pleased to meet you; I look forward to working with you', pos: 'phrase', example: { text: 'リサです。よろしくおねがいします。', reading: 'リサ です。 よろしく おねがいします。', en: "I'm Lisa. Pleased to meet you." } },
      { id: 'v-ja-n5-00-12', text: 'はい', en: 'yes', pos: 'interjection', example: { text: 'はい、そうです。', reading: 'はい、 そう です。', en: "Yes, that's right." } },
      { id: 'v-ja-n5-00-13', text: 'いいえ', en: 'no', pos: 'interjection', example: { text: 'いいえ、ちがいます。', reading: 'いいえ、 ちがいます。', en: "No, that's not right." } },
      { id: 'v-ja-n5-00-14', text: 'どうぞ', en: 'please, go ahead; here you are', pos: 'phrase', example: { text: 'どうぞ、こちらへ。', reading: 'どうぞ、 こちら へ。', en: 'This way, please.' } },
      { id: 'v-ja-n5-00-15', text: 'いただきます', reading: 'いただきます', en: "let's eat (said before a meal)", pos: 'phrase', example: { text: 'いただきます！', reading: 'いただきます！', en: "Let's eat!" } },
      { id: 'v-ja-n5-00-16', text: 'ごちそうさまでした', reading: 'ごちそうさま でした', en: 'thank you for the meal (said after eating)', pos: 'phrase', example: { text: 'ごちそうさまでした。おいしかったです。', reading: 'ごちそうさま でした。 おいしかった です。', en: 'Thank you for the meal. It was delicious.' } },
      { id: 'v-ja-n5-00-17', text: 'いってきます', reading: 'いってきます', en: "I'm off (said when leaving home)", pos: 'phrase', example: { text: 'じゃあ、いってきます！', reading: 'じゃあ、 いってきます！', en: "Okay, I'm off!" } },
      { id: 'v-ja-n5-00-18', text: 'いってらっしゃい', reading: 'いってらっしゃい', en: 'see you later (to someone leaving)', pos: 'phrase', example: { text: 'いってらっしゃい。きをつけてね。', reading: 'いってらっしゃい。 き を つけて ね。', en: 'See you later. Take care.' } },
      { id: 'v-ja-n5-00-19', text: 'ただいま', en: "I'm home", pos: 'phrase', example: { text: 'ただいま！', en: "I'm home!" } },
      { id: 'v-ja-n5-00-20', text: 'おかえりなさい', reading: 'おかえりなさい', en: 'welcome home', pos: 'phrase', example: { text: '「ただいま。」「おかえりなさい。」', reading: '「ただいま。」 「おかえりなさい。」', en: '"I\'m home." "Welcome back."' } },
    ],
    scenario: {
      title: 'Good morning, neighbor!',
      setting:
        "It's 8 a.m. on a quiet residential street in Tokyo. You step out of your apartment and meet the older woman who lives next door.",
      aiRole: 'Mrs. Sato (さとうさん), a cheerful retired neighbor who loves her little garden',
      learnerGoal:
        'Return her おはようございます, agree about the weather with そうですね, thank her with ありがとうございます when she offers you a persimmon from her garden, and say いってきます as you leave.',
      opener: 'おはようございます。いいてんきですね。',
      openerReading: 'おはよう ございます。 いい てんき です ね。',
    },
  },
];
